// Spuštění: node --test netlify/lib/portfolio-update.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { createMemoryStore as memoryStore } from "./memory-store.mjs";
import { DAY } from "./portfolio-history.mjs";
import { createT212Client, updatePortfolio, RESULT_KEY, STATUS_KEY, STATE_KEY } from "./portfolio-update.mjs";

const NOW = Date.UTC(2026, 9, 2, 12);
const at = (daysAgo) => new Date(NOW - daysAgo * DAY).toISOString();

// Falešné Trading 212 API: transakce po stránkách (od nejnovějších), volitelný limit 429
function fakeT212({ transactions, orders = [], dividends = [], positions, summary, txLimitPerRun = Infinity }) {
  let txCalls = 0;
  const pages = (items, base) => (path) => {
    const page = Number(new URL("http://x" + path).searchParams.get("cursor") || 0);
    const slice = items.slice(page * 2, page * 2 + 2);
    const next = (page + 1) * 2 < items.length ? `${base}&cursor=${page + 1}` : null;
    return { items: slice, nextPagePath: next };
  };
  const tx = pages(transactions, "/api/v0/equity/history/transactions?limit=50");
  const ord = pages(orders, "/api/v0/equity/history/orders?limit=50");
  const div = pages(dividends, "/api/v0/equity/history/dividends?limit=50");

  const client = async (path) => {
    if (path.startsWith("/api/v0/equity/history/transactions")) {
      if (++txCalls > txLimitPerRun) {
        const e = new Error("429");
        e.status = 429;
        throw e;
      }
      return tx(path);
    }
    if (path.startsWith("/api/v0/equity/history/orders")) return ord(path);
    if (path.startsWith("/api/v0/equity/history/dividends")) return div(path);
    if (path.startsWith("/api/v0/equity/account/summary")) return summary;
    if (path.startsWith("/api/v0/equity/positions")) return positions;
    throw new Error("unexpected " + path);
  };
  client.resetRun = () => (txCalls = 0);
  return client;
}

// Ceny: titul A stál před rokem 100 USD, dnes 120 USD; kurz USD→EUR 0.9 stále
const fakePrices = {
  symbolFor: async (isin) => ({ A: "AAA" })[isin] || null,
  series: async () => ({ currency: "USD", points: [[NOW - 500 * DAY, 100], [NOW - 1 * DAY, 120]] }),
  fxSeries: async () => ({ currency: "EUR", points: [[NOW - 500 * DAY, 0.9]] }),
};

const scenario = {
  // od nejnovějších
  transactions: [
    { type: "INTEREST_ON_FREE_CASH", amount: 1, currency: "EUR", dateTime: at(3), reference: "i3" },
    { type: "INTEREST_ON_FREE_CASH", amount: 1, currency: "EUR", dateTime: at(2.5), reference: "i2" },
    { type: "INTEREST_ON_FREE_CASH", amount: 1, currency: "EUR", dateTime: at(2), reference: "i1" },
    { type: "DEPOSIT", amount: 900, currency: "EUR", dateTime: at(450), reference: "d1" },
  ].sort((a, b) => b.dateTime.localeCompare(a.dateTime)),
  orders: [
    {
      order: { id: 1, side: "BUY", ticker: "A_US_EQ", instrument: { isin: "A", currency: "USD" } },
      fill: { id: 1, filledAt: at(449), quantity: 10, price: 100, type: "TRADE", walletImpact: { netValue: 900, currency: "EUR" } },
    },
  ],
  positions: [{ instrument: { isin: "A", ticker: "A_US_EQ" }, quantity: 10 }],
  // dnes: 10 ks × 120 USD × 0.9 = 1080 + hotovost 3 (úroky)
  summary: { currency: "EUR", cash: { availableToTrade: 3 }, investments: { currentValue: 1080 } },
};

test("celý běh: výsledek bez částek a s kontrolou hodnoty", async () => {
  const store = memoryStore();
  const t212 = fakeT212(scenario);
  const { result, details } = await updatePortfolio({ t212, prices: fakePrices, store, now: NOW });

  assert.ok(result, "výsledek spočítán");
  // před rokem: 10 ks × 100 USD × 0.9 = 900, dnes 1083, bez vkladů → (1083 − 900) / 900
  for (const period of ["oneYear", "ytd", "threeMonths"]) {
    assert.ok(Math.abs(result.returns[period].value - 183 / 900) < 1e-9, period);
    assert.equal(result.returns[period].complete, true);
  }
  assert.ok(Math.abs(result.check.valueDiffPct) < 1e-9, "hodnota z cen sedí s Trading 212");
  assert.equal(details.historyCounts.transactions, 3); // vklad před 450 dny je starší než stažená historie (400 dní) – pro výpočet není potřeba

  const publicJson = JSON.stringify(await store.get(RESULT_KEY));
  assert.ok(!publicJson.includes("1083") && !publicJson.includes("A_US_EQ"), "žádné částky ani tituly");
  assert.equal((await store.get(STATUS_KEY)).lastError, null);
});

test("limit API (429): historie se dotáhne v dalších bězích", async () => {
  const store = memoryStore();
  const t212 = fakeT212({ ...scenario, txLimitPerRun: 1 }); // 1 stránka transakcí za běh

  const first = await updatePortfolio({ t212, prices: fakePrices, store, now: NOW });
  assert.equal(first.status.syncing, true);
  assert.equal(await store.get(RESULT_KEY), null);
  assert.equal((await store.get(STATUS_KEY)).syncing, true);

  t212.resetRun();
  const second = await updatePortfolio({ t212, prices: fakePrices, store, now: NOW });
  assert.equal(second.status.syncing, false);
  assert.ok(second.result, "po dotažení historie je výsledek");
  assert.equal(Object.keys((await store.get(STATE_KEY)).caches.transactions.items).length, 3);
});

test("chybějící oprávnění (403) → srozumitelná chyba ve stavu", async () => {
  const store = memoryStore();
  const t212 = async () => {
    const e = new Error("Trading 212 /api/v0/equity/history/transactions → HTTP 403 (klíč nemá oprávnění)");
    e.status = 403;
    throw e;
  };
  const { status } = await updatePortfolio({ t212, prices: fakePrices, store, now: NOW });
  assert.match(status.lastError, /403/);
  assert.match((await store.get(STATUS_KEY)).lastError, /403/);
});

test("chybějící klíče v Netlify → srozumitelná chyba ve stavu (bez dotazu na API)", async () => {
  const store = memoryStore();
  const t212 = createT212Client({ key: "", secret: undefined });
  const { status } = await updatePortfolio({ t212, prices: fakePrices, store, now: NOW });
  assert.match(status.lastError, /Chybí TRADING212_API_KEY a TRADING212_SECRET_KEY/);
  assert.equal((await store.get(STATUS_KEY)).lastError, status.lastError);
});

test("další běh stáhne jen nové položky", async () => {
  const store = memoryStore();
  const t212 = fakeT212(scenario);
  await updatePortfolio({ t212, prices: fakePrices, store, now: NOW });

  // přibyl nový vklad 100 (nejnovější) → výnos se nezmění, jen hodnota
  const withDeposit = {
    ...scenario,
    transactions: [{ type: "DEPOSIT", amount: 100, currency: "EUR", dateTime: at(1), reference: "d2" }, ...scenario.transactions],
    summary: { ...scenario.summary, cash: { availableToTrade: 103 } },
  };
  const { result } = await updatePortfolio({ t212: fakeT212(withDeposit), prices: fakePrices, store, now: NOW });
  assert.equal(Object.keys((await store.get(STATE_KEY)).caches.transactions.items).length, 4);
  // Dietz: (1183 − 900 − 100) / (900 + 100 × ~0) ≈ 183 / 900
  assert.ok(Math.abs(result.returns.oneYear.value - 183 / 900) < 0.001, String(result.returns.oneYear.value));
});
