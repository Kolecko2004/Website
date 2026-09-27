// Spuštění: node --test netlify/lib/returns.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { twr, computeReturns, periodStarts } from "./returns.mjs";

const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} ≠ ${b}`);

test("bez vkladů = obyčejná změna hodnoty", () => {
  const s = [
    { date: "2026-01-01", value: 1000, netDeposits: 1000 },
    { date: "2026-01-02", value: 1100, netDeposits: 1000 },
  ];
  close(twr(s, 0, 1), 0.1);
});

test("vklad výnos nezkreslí", () => {
  const s = [
    { date: "2026-01-01", value: 1000, netDeposits: 1000 },
    { date: "2026-01-02", value: 1100, netDeposits: 1000 }, // +10 %
    { date: "2026-01-03", value: 2100, netDeposits: 2000 }, // vklad 1000, 0 %
    { date: "2026-01-04", value: 2310, netDeposits: 2000 }, // +10 %
  ];
  close(twr(s, 0, 3), 1.1 * 1.1 - 1);
});

test("výběr výnos nezkreslí", () => {
  const s = [
    { date: "2026-01-01", value: 2000, netDeposits: 2000 },
    { date: "2026-01-02", value: 1000, netDeposits: 1000 }, // výběr 1000, 0 %
  ];
  close(twr(s, 0, 1), 0);
});

test("začátky období", () => {
  assert.deepEqual(periodStarts("2026-09-27"), {
    threeMonths: "2026-06-27",
    ytd: "2025-12-31",
    oneYear: "2025-09-27",
  });
});

test("krátká historie → complete: false a výnos od začátku sledování", () => {
  const r = computeReturns([
    { date: "2026-09-01", value: 1000, netDeposits: 1000 },
    { date: "2026-09-27", value: 1050, netDeposits: 1000 },
  ]);
  assert.equal(r.returns.oneYear.complete, false);
  assert.equal(r.returns.oneYear.from, "2026-09-01");
  close(r.returns.oneYear.value, 0.05);
  assert.equal(r.trackingSince, "2026-09-01");
});

test("dost dlouhá historie → období začíná správným snapshotem", () => {
  const r = computeReturns([
    { date: "2025-06-01", value: 500, netDeposits: 500 },
    { date: "2025-12-31", value: 1000, netDeposits: 1000 },
    { date: "2026-09-27", value: 1200, netDeposits: 1000 },
  ]);
  assert.equal(r.returns.ytd.complete, true);
  assert.equal(r.returns.ytd.from, "2025-12-31");
  close(r.returns.ytd.value, 0.2);
});

test("méně než 2 snapshoty → null", () => {
  assert.equal(computeReturns([{ date: "2026-09-27", value: 1, netDeposits: 1 }]), null);
});
