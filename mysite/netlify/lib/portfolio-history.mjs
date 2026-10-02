// Výpočet výnosnosti portfolia z historie obchodů (čisté funkce, bez síťových volání).
//
// Princip:
//  1. Z historie Trading 212 se udělají „události“ (vklad, nákup, prodej, dividenda…),
//     každá s dopadem na hotovost a případně na počet kusů.
//  2. Stav k datu D = dnešní stav MINUS všechny události po datu D
//     (dnešní pozice a hotovost jsou přesné z API, chyby se nehromadí).
//  3. Hodnota k datu D = kusy × cena k datu D (× kurz) + hotovost.
//  4. Výnos za období metodou Modified Dietz – vklady a výběry výnos nezkreslí.

export const DAY = 24 * 60 * 60 * 1000;

// Pohyby peněz do / z účtu (nejsou výnosem)
const FLOW_TYPES = new Set(["DEPOSIT", "WITHDRAW", "TRANSFER"]);

/**
 * Převede historii na události.
 * @param {object} history { transactions, orders, dividends } – zkrácené položky z API
 * @param {(currency: string, time: number) => number} toAccount – kurz měny na měnu účtu
 * @returns {{ time: number, cash: number, flow: number, isin?: string, qty?: number }[]}
 */
export function buildEvents({ transactions = [], orders = [], dividends = [] }, toAccount) {
  const events = [];

  for (const tx of transactions) {
    const time = Date.parse(tx.dateTime);
    const rate = toAccount(tx.currency, time);
    const amount = Math.abs(tx.amount) * rate;
    let cash;
    if (tx.type === "DEPOSIT") cash = amount;
    else if (tx.type === "WITHDRAW") cash = -amount;
    else if (tx.type === "FEE") cash = -amount;
    else if (tx.type === "TRANSFER") cash = tx.amount * rate; // znaménko určuje API
    else cash = amount; // úroky z hotovosti, z půjčování akcií
    events.push({ time, cash, flow: FLOW_TYPES.has(tx.type) ? cash : 0 });
  }

  for (const o of orders) {
    const time = Date.parse(o.filledAt);
    const sign = o.side === "SELL" ? 1 : -1; // nákup hotovost ubírá, prodej přidává
    const cash = sign * Math.abs(o.netValue || 0) * toAccount(o.walletCurrency, time);
    // Kusy jen u běžných obchodů. Splity apod. se vynechají – ceny z Yahoo jsou
    // upravené o splity, takže počty kusů musí zůstat „po splitu“.
    const qty = o.fillType === "TRADE" ? -sign * Math.abs(o.quantity || 0) : 0;
    events.push({ time, cash, flow: 0, isin: o.isin, qty });
  }

  for (const d of dividends) {
    const time = Date.parse(d.paidOn);
    events.push({ time, cash: Math.abs(d.amount) * toAccount(d.currency, time), flow: 0 });
  }

  return events.filter((e) => Number.isFinite(e.time)).sort((a, b) => a.time - b.time);
}

/**
 * Stav účtu k času `time` (zpětně od dneška).
 * @param {Map<string, number>} holdingsNow – ISIN → počet kusů dnes
 */
export function stateAt(time, { holdingsNow, cashNow, events }) {
  const holdings = new Map(holdingsNow);
  let cash = cashNow;
  for (const e of events) {
    if (e.time <= time) continue;
    cash -= e.cash;
    if (e.isin && e.qty) holdings.set(e.isin, (holdings.get(e.isin) || 0) - e.qty);
  }
  // Drobné zbytky po zaokrouhlení frakčních akcií
  for (const [isin, qty] of holdings) if (Math.abs(qty) < 1e-6) holdings.delete(isin);
  return { holdings, cash };
}

/**
 * Hodnota účtu k času `time`.
 * @param {(isin: string, time: number) => number | null} priceInAccount – cena kusu v měně účtu
 * @returns {{ value: number, missing: string[] }}
 */
export function valueAt(time, account, priceInAccount) {
  const { holdings, cash } = stateAt(time, account);
  let value = cash;
  const missing = [];
  for (const [isin, qty] of holdings) {
    const price = priceInAccount(isin, time);
    if (price == null) missing.push(isin);
    else value += qty * price;
  }
  return { value, missing };
}

/**
 * Modified Dietz výnos za období (start, end].
 * @returns {number | null}
 */
export function modifiedDietz({ start, end, startValue, endValue, flows }) {
  const length = end - start;
  if (length <= 0) return null;
  let total = 0;
  let weighted = 0;
  for (const f of flows) {
    if (f.time <= start || f.time > end) continue;
    total += f.flow;
    weighted += f.flow * ((end - f.time) / length);
  }
  const denominator = startValue + weighted;
  if (denominator <= 0) return null;
  return (endValue - startValue - total) / denominator;
}

// Začátky období vzhledem k `now` (UTC)
export function periodStarts(now) {
  const d = new Date(now);
  const threeMonths = Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - 3, d.getUTCDate());
  const oneYear = Date.UTC(d.getUTCFullYear() - 1, d.getUTCMonth(), d.getUTCDate());
  const ytd = Date.UTC(d.getUTCFullYear(), 0, 1); // od 1. ledna
  return { threeMonths, ytd, oneYear };
}

const iso = (time) => new Date(time).toISOString().slice(0, 10);

/**
 * Výnosy za 3 měsíce, od začátku roku a za rok.
 * Když účet na začátku období ještě neexistoval, počítá se od prvního vkladu
 * (complete: false, from = datum prvního vkladu).
 */
export function computeReturns({ now, endValue, account, priceInAccount }) {
  const flows = account.events.filter((e) => e.flow !== 0);
  const returns = {};
  const missing = new Set();

  for (const [period, periodStart] of Object.entries(periodStarts(now))) {
    let start = periodStart;
    let { value: startValue, missing: miss } = valueAt(start, account, priceInAccount);
    miss.forEach((m) => missing.add(m));
    let complete = true;

    // Účet byl na začátku období prázdný → začít těsně před prvním vkladem
    if (startValue < 1) {
      const first = flows.find((f) => f.time > periodStart && f.flow > 0);
      if (!first) {
        returns[period] = null;
        continue;
      }
      start = first.time - 1;
      startValue = 0;
      complete = false;
    }

    const value = modifiedDietz({ start, end: now, startValue, endValue, flows });
    returns[period] = value == null ? null : { value, from: iso(start + 1), complete };
  }

  return { returns, missingPrices: [...missing] };
}
