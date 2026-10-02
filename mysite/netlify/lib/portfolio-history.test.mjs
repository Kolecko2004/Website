// Spuštění: node --test netlify/lib/portfolio-history.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { buildEvents, computeReturns, modifiedDietz, periodStarts, stateAt, DAY } from "./portfolio-history.mjs";

const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≠ ${b}`);
const NOW = Date.UTC(2026, 9, 2, 12); // 2. 10. 2026
const at = (daysAgo) => new Date(NOW - daysAgo * DAY).toISOString();
const sameCurrency = () => 1;

test("začátky období", () => {
  const s = periodStarts(NOW);
  assert.equal(new Date(s.threeMonths).toISOString().slice(0, 10), "2026-07-02");
  assert.equal(new Date(s.ytd).toISOString().slice(0, 10), "2026-01-01");
  assert.equal(new Date(s.oneYear).toISOString().slice(0, 10), "2025-10-02");
});

test("Modified Dietz: bez pohybů = obyčejná změna", () => {
  close(modifiedDietz({ start: 0, end: 100, startValue: 1000, endValue: 1100, flows: [] }), 0.1);
});

test("Modified Dietz: vklad uprostřed období se váží polovinou", () => {
  // start 1000, v polovině vklad 1000, konec 2200 → zisk 200 / (1000 + 500)
  const r = modifiedDietz({ start: 0, end: 100, startValue: 1000, endValue: 2200, flows: [{ time: 50, flow: 1000 }] });
  close(r, 200 / 1500);
});

test("události: vklad, nákup, prodej, dividenda, poplatek, úrok", () => {
  const events = buildEvents(
    {
      transactions: [
        { type: "DEPOSIT", amount: 1000, currency: "EUR", dateTime: at(10) },
        { type: "WITHDRAW", amount: -100, currency: "EUR", dateTime: at(9) },
        { type: "FEE", amount: -2, currency: "EUR", dateTime: at(8) },
        { type: "INTEREST_ON_FREE_CASH", amount: 1, currency: "EUR", dateTime: at(7) },
      ],
      orders: [
        { side: "BUY", isin: "A", filledAt: at(6), quantity: 5, fillType: "TRADE", netValue: 500, walletCurrency: "EUR" },
        { side: "SELL", isin: "A", filledAt: at(5), quantity: 2, fillType: "TRADE", netValue: 220, walletCurrency: "EUR" },
        { side: "BUY", isin: "A", filledAt: at(4), quantity: 3, fillType: "STOCK_SPLIT", netValue: 0, walletCurrency: "EUR" },
      ],
      dividends: [{ amount: 3, currency: "EUR", paidOn: at(3) }],
    },
    sameCurrency,
  );
  assert.deepEqual(
    events.map((e) => [e.cash + 0, e.flow + 0, e.qty ?? null]), // + 0 → bez „-0“
    [
      [1000, 1000, null],
      [-100, -100, null],
      [-2, 0, null],
      [1, 0, null],
      [-500, 0, 5],
      [220, 0, -2],
      [0, 0, 0], // split nemění počet kusů (ceny jsou upravené o splity)
      [3, 0, null],
    ],
  );
});

test("převod měny u vkladu", () => {
  const [e] = buildEvents({ transactions: [{ type: "DEPOSIT", amount: 100, currency: "USD", dateTime: at(1) }] }, (c) =>
    c === "USD" ? 0.9 : 1,
  );
  close(e.cash, 90);
  close(e.flow, 90);
});

test("stav zpětně: kusy a hotovost před nákupem", () => {
  const events = buildEvents(
    {
      orders: [{ side: "BUY", isin: "A", filledAt: at(5), quantity: 10, fillType: "TRADE", netValue: 1000, walletCurrency: "EUR" }],
    },
    sameCurrency,
  );
  const account = { holdingsNow: new Map([["A", 10]]), cashNow: 0, events };
  const before = stateAt(NOW - 6 * DAY, account);
  assert.equal(before.holdings.size, 0);
  assert.equal(before.cash, 1000);
  const after = stateAt(NOW - 4 * DAY, account);
  assert.equal(after.holdings.get("A"), 10);
});

test("celý výpočet: nákup před obdobím, růst ceny o 10 %", () => {
  // před rokem a půl vklad 1000 a nákup 10 ks po 100; dnes cena 110
  const events = buildEvents(
    {
      transactions: [{ type: "DEPOSIT", amount: 1000, currency: "EUR", dateTime: at(500) }],
      orders: [{ side: "BUY", isin: "A", filledAt: at(499), quantity: 10, fillType: "TRADE", netValue: 1000, walletCurrency: "EUR" }],
    },
    sameCurrency,
  );
  const account = { holdingsNow: new Map([["A", 10]]), cashNow: 0, events };
  const price = (isin, time) => (time < NOW - 400 * DAY ? 100 : 100 + (10 * (time - (NOW - 400 * DAY))) / (400 * DAY));
  const { returns } = computeReturns({ now: NOW, endValue: 1100, account, priceInAccount: price });
  for (const period of ["threeMonths", "ytd", "oneYear"]) {
    const start = periodStarts(NOW)[period];
    const startValue = 10 * price("A", start);
    close(returns[period].value, 1100 / startValue - 1, 1e-9);
    assert.equal(returns[period].complete, true);
  }
});

test("vklad během období nezvýší výnos", () => {
  // před rokem 1000 v hotovosti (bez akcií), před 30 dny vklad 1000 → dnes 2000 = výnos 0
  const events = buildEvents(
    {
      transactions: [
        { type: "DEPOSIT", amount: 1000, currency: "EUR", dateTime: at(500) },
        { type: "DEPOSIT", amount: 1000, currency: "EUR", dateTime: at(30) },
      ],
    },
    sameCurrency,
  );
  const account = { holdingsNow: new Map(), cashNow: 2000, events };
  const { returns } = computeReturns({ now: NOW, endValue: 2000, account, priceInAccount: () => null });
  close(returns.oneYear.value, 0);
  close(returns.threeMonths.value, 0);
});

test("účet založený během období → výnos od prvního vkladu (complete: false)", () => {
  const events = buildEvents(
    {
      transactions: [{ type: "DEPOSIT", amount: 1000, currency: "EUR", dateTime: at(60) }],
      orders: [{ side: "BUY", isin: "A", filledAt: at(59), quantity: 10, fillType: "TRADE", netValue: 1000, walletCurrency: "EUR" }],
    },
    sameCurrency,
  );
  const account = { holdingsNow: new Map([["A", 10]]), cashNow: 0, events };
  const { returns } = computeReturns({ now: NOW, endValue: 1050, account, priceInAccount: () => 105 });
  assert.equal(returns.oneYear.complete, false);
  assert.equal(returns.oneYear.from, at(60).slice(0, 10));
  close(returns.oneYear.value, 0.05);
  assert.equal(returns.threeMonths.complete, false); // 3 měsíce = 92 dní > 60
});

test("chybějící cena se nahlásí", () => {
  const account = { holdingsNow: new Map([["X", 1]]), cashNow: 100, events: [] };
  const { missingPrices } = computeReturns({ now: NOW, endValue: 200, account, priceInAccount: () => null });
  assert.deepEqual(missingPrices, ["X"]);
});

test("ticker Trading 212 → symbol Yahoo", async () => {
  const { tickerToYahoo } = await import("./prices.mjs");
  assert.equal(tickerToYahoo("GOOGL_US_EQ"), "GOOGL");
  assert.equal(tickerToYahoo("BRK_B_US_EQ"), "BRK-B");
  assert.equal(tickerToYahoo("VUAGl_EQ"), "VUAG.L");
  assert.equal(tickerToYahoo("SAPd_EQ"), "SAP.DE");
  assert.equal(tickerToYahoo("CNX1_EQ"), "CNX1.L");
  assert.equal(tickerToYahoo(undefined), null);
});
