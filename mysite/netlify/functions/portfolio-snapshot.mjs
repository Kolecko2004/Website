// Naplánovaná funkce (každou hodinu): uloží aktuální hodnotu účtu Trading 212
// a součet vkladů/výběrů do Netlify Blobs. Z těchto záznamů pak funkce
// `portfolio` počítá výnosnost.
//
// Potřebné proměnné prostředí (Netlify → Site configuration → Environment variables):
//   TRADING212_API_KEY, TRADING212_SECRET_KEY
//
// Historie vkladů PŘED začátkem sledování se nestahuje – pro výnos jsou důležité
// jen vklady/výběry mezi jednotlivými snapshoty, ne jejich celkový součet.

import { getStore } from "@netlify/blobs";

const API = "https://live.trading212.com";

// Typy transakcí, které jsou pohybem peněz do/z účtu (ne výnosem)
const FLOW_TYPES = new Set(["DEPOSIT", "WITHDRAW", "TRANSFER"]);

// Kolik stránek transakcí se nejvýš stáhne za jeden běh (limit API: 6 dotazů/min)
const MAX_PAGES = 5;

// Kolik posledních referencí transakcí si pamatovat kvůli duplicitám
const MAX_SEEN_REFS = 500;

function authHeader() {
  const key = process.env.TRADING212_API_KEY;
  const secret = process.env.TRADING212_SECRET_KEY;
  if (!key || !secret) throw new Error("Chybí TRADING212_API_KEY / TRADING212_SECRET_KEY v Netlify");
  return "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");
}

async function t212(path) {
  const res = await fetch(API + path, { headers: { Authorization: authHeader() } });
  if (!res.ok) {
    const hint = {
      401: "špatný API klíč nebo secret",
      403: "klíč nemá oprávnění (Account data / History)",
      429: "rate limit",
    }[res.status];
    const error = new Error(`Trading 212 ${path.split("?")[0]} → HTTP ${res.status}${hint ? ` (${hint})` : ""}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

// Kladná částka = peníze do účtu, záporná = z účtu
function flowAmount(tx) {
  if (tx.type === "DEPOSIT") return Math.abs(tx.amount);
  if (tx.type === "WITHDRAW") return -Math.abs(tx.amount);
  return tx.amount; // TRANSFER – znaménko určuje API
}

// Dnešní datum v pražském čase (YYYY-MM-DD)
const todayInPrague = () =>
  new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Prague" });

// Nový stav – sledování začíná teď
const freshState = (now) => ({
  version: 2,
  trackingStartedAt: now,
  lastSyncedAt: now,
  netDeposits: 0,
  seenRefs: [],
  snapshots: [],
});

// Vklady/výběry od poslední synchronizace (s hodinovou rezervou, duplicity hlídá seenRefs)
async function syncFlows(state) {
  const since = new Date(new Date(state.lastSyncedAt).getTime() - 60 * 60 * 1000).toISOString();
  const seen = new Set(state.seenRefs);
  let path = `/api/v0/equity/history/transactions?limit=50&time=${encodeURIComponent(since)}`;
  let flow = 0;

  for (let page = 0; path && page < MAX_PAGES; page++) {
    const data = await t212(path);
    for (const tx of data.items || []) {
      if (!FLOW_TYPES.has(tx.type) || seen.has(tx.reference)) continue;
      // Pohyby před začátkem sledování se nepočítají
      if (tx.dateTime && tx.dateTime < state.trackingStartedAt) continue;
      seen.add(tx.reference);
      flow += flowAmount(tx);
    }
    path = data.nextPagePath || null;
  }

  return { flow, seenRefs: [...seen].slice(-MAX_SEEN_REFS) };
}

export default async () => {
  const store = getStore("portfolio");
  const now = new Date().toISOString();

  let state = await store.get("state", { type: "json" });
  // Starý formát (verze 1 stahovala celou historii a mohla se zaseknout) → začít znovu
  if (!state || state.version !== 2) state = freshState(now);

  try {
    const summary = await t212("/api/v0/equity/account/summary");
    const { flow, seenRefs } = await syncFlows(state);

    state.netDeposits += flow;
    state.seenRefs = seenRefs;
    state.lastSyncedAt = now;

    // Hodnota celého účtu = investice + veškerá hotovost
    const cash = summary.cash || {};
    const value =
      (summary.investments?.currentValue || 0) +
      (cash.availableToTrade || 0) +
      (cash.inPies || 0) +
      (cash.reservedForOrders || 0);

    // Jeden snapshot na den – během dne se přepisuje nejnovější hodnotou
    const date = todayInPrague();
    const snapshot = { date, value, netDeposits: state.netDeposits, updatedAt: now };
    const last = state.snapshots[state.snapshots.length - 1];
    if (last?.date === date) state.snapshots[state.snapshots.length - 1] = snapshot;
    else state.snapshots.push(snapshot);

    state.lastError = null;
    state.lastAttemptAt = now;
    await store.setJSON("state", state);
    console.log(`Snapshot ${date} uložen (${state.snapshots.length} dní historie)`);
  } catch (error) {
    // Chybu uložit, aby byla vidět na /api/portfolio (bez citlivých údajů)
    state.lastError = error.message;
    state.lastAttemptAt = now;
    await store.setJSON("state", state);
    console.error(error.message);
  }
};

export const config = {
  schedule: "@hourly",
};
