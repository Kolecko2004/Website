// Aktualizace výnosnosti portfolia: stáhne historii z Trading 212 (postupně, kvůli
// limitům API), dohledá historické ceny a uloží výsledek. Nezávislé na Netlify,
// aby šlo spustit i lokálně (npm run portfolio:check).

import { buildEvents, computeReturns, DAY } from "./portfolio-history.mjs";
import { pointAt } from "./prices.mjs";

const API = "https://live.trading212.com";
// Historie se drží o něco delší než rok (začátek nejdelšího období + rezerva)
const HISTORY_DAYS = 400;

export const STATE_KEY = "history-v3";

// Spustí `fn` pro všechny položky, nejvýš `limit` najednou (šetrné k Yahoo)
async function mapLimit(items, limit, fn) {
  const queue = [...items];
  const workers = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length) await fn(queue.shift());
  });
  await Promise.all(workers);
}
export const RESULT_KEY = "result-v3";
export const STATUS_KEY = "status-v3";

export function createT212Client({ key, secret, fetch: fetchImpl = fetch }) {
  const missing = [!key && "TRADING212_API_KEY", !secret && "TRADING212_SECRET_KEY"].filter(Boolean);
  if (missing.length) {
    throw new Error(`Chybí ${missing.join(" a ")} v Netlify (po změně proměnných je potřeba nový deploy)`);
  }
  const auth = "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");

  return async function t212(path) {
    const res = await fetchImpl(API + path, { headers: { Authorization: auth } });
    if (!res.ok) {
      const hint = {
        401: "špatný API klíč nebo secret",
        403: "klíč nemá oprávnění – potřeba: Account data, Portfolio, History – Orders, Transactions, Dividends",
        429: "limit dotazů, pokračuje se při dalším běhu",
      }[res.status];
      const error = new Error(`Trading 212 ${path.split("?")[0]} → HTTP ${res.status}${hint ? ` (${hint})` : ""}`);
      error.status = res.status;
      throw error;
    }
    return res.json();
  };
}

// Historie z API zkrácená jen na potřebné údaje (menší úložiště)
const ENDPOINTS = {
  transactions: {
    path: "/api/v0/equity/history/transactions?limit=50",
    key: (item) => item.reference,
    date: (item) => item.dateTime,
    storedDate: (item) => item.dateTime,
    slim: ({ type, amount, currency, dateTime, reference }) => ({ type, amount, currency, dateTime, reference }),
  },
  orders: {
    path: "/api/v0/equity/history/orders?limit=50",
    key: (item) => `${item.order?.id}-${item.fill?.id ?? ""}`,
    date: (item) => item.fill?.filledAt,
    storedDate: (item) => item.filledAt,
    // Jen vyplněné obchody
    keep: (item) => item.fill?.filledAt,
    slim: ({ order, fill }) => ({
      side: order.side,
      isin: order.instrument?.isin,
      ticker: order.ticker || order.instrument?.ticker,
      instrumentCurrency: order.instrument?.currency,
      filledAt: fill.filledAt,
      quantity: fill.quantity ?? order.filledQuantity,
      price: fill.price,
      fillType: fill.type || "TRADE",
      netValue: fill.walletImpact?.netValue,
      walletCurrency: fill.walletImpact?.currency,
    }),
  },
  dividends: {
    path: "/api/v0/equity/history/dividends?limit=50",
    key: (item) => item.reference,
    date: (item) => item.paidOn,
    storedDate: (item) => item.paidOn,
    slim: ({ amount, currency, paidOn, reference, ticker }) => ({ amount, currency, paidOn, reference, ticker }),
  },
};

/**
 * Doplní historii jednoho endpointu. API vrací položky od nejnovějších.
 * Při prvním běhu stahuje až k hranici `cutoff` (při limitu pokračuje příště),
 * potom jen nové položky, dokud nenarazí na již známé.
 */
async function syncEndpoint(name, cache, { t212, cutoff, deadline }) {
  const config = ENDPOINTS[name];
  let path = cache.complete ? config.path : cache.resumePath || config.path;
  let pages = 0;

  while (path && Date.now() < deadline) {
    const data = await t212(path);
    pages++;
    let reachedEnd = false;

    for (const item of data.items || []) {
      if (config.keep && !config.keep(item)) continue;
      const date = config.date(item);
      if (!date) continue;
      if (Date.parse(date) < cutoff) reachedEnd = true;
      else cache.items[config.key(item)] = config.slim(item);
      if (cache.complete && cache.newest && date <= cache.newest) reachedEnd = true;
    }

    path = data.nextPagePath || null;
    if (!path || reachedEnd) {
      cache.complete = true;
      cache.resumePath = null;
      break;
    }
    if (!cache.complete) cache.resumePath = path;
  }

  // Nejnovější známé datum a vyřazení položek starších než hranice
  for (const [key, item] of Object.entries(cache.items)) {
    const date = config.storedDate(item);
    if (Date.parse(date) < cutoff) delete cache.items[key];
    else if (!cache.newest || date > cache.newest) cache.newest = date;
  }
  return pages;
}

/**
 * Hlavní funkce: synchronizace + výpočet.
 * @param {object} deps
 * @param {Function} deps.t212 – klient Trading 212 (createT212Client)
 * @param {object} deps.prices – createPriceService()
 * @param {{get: Function, setJSON: Function}} deps.store
 * @param {number} [deps.budgetMs] – kolik času smí běh strávit stahováním historie
 */
export async function updatePortfolio(deps) {
  const now = deps.now ?? Date.now();
  const status = { lastAttemptAt: new Date(now).toISOString(), lastError: null, syncing: false };
  let outcome;
  try {
    outcome = await runUpdate({ ...deps, now, status });
  } catch (error) {
    status.lastError = error.message;
    outcome = { status };
  }
  await deps.store.setJSON(STATUS_KEY, status);
  return outcome;
}

async function runUpdate({ t212, prices, store, now, status, budgetMs = 20_000 }) {
  const state = (await store.get(STATE_KEY, { type: "json" })) || { caches: {}, symbols: {} };
  const cutoff = now - HISTORY_DAYS * DAY;
  const deadline = Date.now() + budgetMs;

  // 1) Historie – každý endpoint má vlastní limit, chyba 429 zastaví jen ten jeden
  for (const name of Object.keys(ENDPOINTS)) {
    state.caches[name] ||= { items: {}, complete: false, resumePath: null, newest: null };
    try {
      await syncEndpoint(name, state.caches[name], { t212, cutoff, deadline });
    } catch (error) {
      if (error.status !== 429) {
        status.lastError = error.message;
        await store.setJSON(STATE_KEY, state);
        return { status };
      }
    }
  }
  await store.setJSON(STATE_KEY, state);

  const incomplete = Object.keys(ENDPOINTS).filter((name) => !state.caches[name].complete);
  if (incomplete.length) {
    status.syncing = true;
    return { status };
  }

  // 2) Aktuální stav účtu (přesně z API)
  const summary = await t212("/api/v0/equity/account/summary");
  const positions = await t212("/api/v0/equity/positions");
  const accountCurrency = summary.currency;
  const cashNow =
    (summary.cash?.availableToTrade || 0) + (summary.cash?.inPies || 0) + (summary.cash?.reservedForOrders || 0);
  const endValue = (summary.investments?.currentValue || 0) + cashNow;

  const history = {
    transactions: Object.values(state.caches.transactions.items),
    orders: Object.values(state.caches.orders.items),
    dividends: Object.values(state.caches.dividends.items),
  };

  // 3) Historické ceny všech titulů, které byly během roku v portfoliu
  const instruments = new Map(); // isin → ticker (pro diagnostiku)
  for (const p of positions) if (p.instrument?.isin) instruments.set(p.instrument.isin, p.instrument.ticker);
  for (const o of history.orders) if (o.isin) instruments.set(o.isin, o.ticker);

  const priceSeries = new Map();
  const symbols = new Map(); // isin → symbol na Yahoo (diagnostika)
  await mapLimit([...instruments.keys()], 4, async (isin) => {
    try {
      const symbol = await prices.symbolFor(isin, state.symbols, instruments.get(isin));
      if (!symbol) return;
      symbols.set(isin, symbol);
      const series = await prices.series(symbol, cutoff);
      if (series?.points.length) priceSeries.set(isin, series);
      else delete state.symbols[isin]; // symbol bez dat → příště hledat znovu
    } catch {
      delete state.symbols[isin];
    }
  });

  // Kurzy všech potřebných měn na měnu účtu
  const currencies = new Set([...priceSeries.values()].filter(Boolean).map((s) => s.currency));
  for (const item of [...history.transactions, ...history.dividends]) if (item.currency) currencies.add(item.currency);
  for (const o of history.orders) if (o.walletCurrency) currencies.add(o.walletCurrency);
  currencies.delete(accountCurrency);
  const fx = new Map();
  await mapLimit([...currencies], 4, async (currency) => {
    try {
      fx.set(currency, await prices.fxSeries(currency, accountCurrency, cutoff));
    } catch {
      // bez kurzu se položka počítá kurzem 1 a ukáže se v diagnostice
    }
  });
  const missingFx = new Set();
  const toAccount = (currency, time) => {
    if (!currency || currency === accountCurrency) return 1;
    const rate = fx.get(currency) && pointAt(fx.get(currency).points, time);
    if (rate == null) {
      missingFx.add(currency);
      return 1;
    }
    return rate;
  };
  const marketPriceInAccount = (isin, time) => {
    const s = priceSeries.get(isin);
    const price = s && pointAt(s.points, time);
    return price == null ? null : price * toAccount(s.currency, time);
  };

  // Kalibrace kurzu: Trading 212 přepočítává měny vlastním kurzem (s přirážkou),
  // takže pro každou měnu se dnešní hodnoty z Yahoo srovnají s hodnotami z Trading 212
  // a stejný poměr se použije i pro historii.
  const sums = new Map(); // měna → { ours, api }
  for (const p of positions) {
    const s = priceSeries.get(p.instrument?.isin);
    const price = marketPriceInAccount(p.instrument?.isin, now);
    const api = p.walletImpact?.currentValue;
    if (!s || price == null || !api) continue;
    const sum = sums.get(s.currency) || { ours: 0, api: 0 };
    sum.ours += p.quantity * price;
    sum.api += api;
    sums.set(s.currency, sum);
  }
  const fxCalibration = new Map();
  for (const [currency, { ours, api }] of sums) {
    const factor = api / ours;
    // jen rozumná odchylka kurzu (do 5 %), větší rozdíl by znamenal chybu jinde
    if (currency !== accountCurrency && Math.abs(factor - 1) < 0.05) fxCalibration.set(currency, factor);
  }
  const priceInAccount = (isin, time) => {
    const price = marketPriceInAccount(isin, time);
    return price == null ? null : price * (fxCalibration.get(priceSeries.get(isin).currency) || 1);
  };

  // 4) Výpočet
  const holdingsNow = new Map(positions.filter((p) => p.instrument?.isin).map((p) => [p.instrument.isin, p.quantity]));
  const account = { holdingsNow, cashNow, events: buildEvents(history, toAccount) };
  const { returns, missingPrices } = computeReturns({ now, endValue, account, priceInAccount });

  // Kontrola: dnešní hodnota spočítaná z cen Yahoo vs. hodnota z Trading 212 (celkem i po titulech)
  let ourValue = cashNow;
  const positionChecks = [];
  for (const p of positions) {
    const isin = p.instrument?.isin;
    const price = isin && priceInAccount(isin, now);
    const ours = price == null ? null : p.quantity * price;
    if (ours != null) ourValue += ours;
    const api = p.walletImpact?.currentValue;
    positionChecks.push({
      ticker: p.instrument?.ticker || isin,
      symbol: symbols.get(isin) || null,
      diffPct: ours != null && api ? ours / api - 1 : null,
      share: api && endValue ? api / endValue : null, // podíl na portfoliu
    });
  }

  const result = {
    returns,
    updatedAt: new Date(now).toISOString(),
    method: "modified-dietz",
    check: {
      valueDiffPct: endValue ? (ourValue - endValue) / endValue : null,
      missingPrices: missingPrices.length,
      missingFx: missingFx.size,
    },
  };
  await store.setJSON(RESULT_KEY, result);
  await store.setJSON(STATE_KEY, state);

  return {
    status,
    result,
    // jen pro lokální kontrolu (nezveřejňuje se)
    details: {
      accountCurrency,
      instruments: Object.fromEntries(instruments),
      missingPrices: missingPrices.map((isin) => instruments.get(isin) || isin),
      missingFx: [...missingFx],
      positions: positionChecks,
      fxCalibration: Object.fromEntries(fxCalibration),
      historyCounts: Object.fromEntries(Object.entries(history).map(([k, v]) => [k, v.length])),
    },
  };
}
