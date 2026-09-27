// Naplánovaná funkce (každou hodinu): uloží aktuální hodnotu účtu Trading 212
// a součet vkladů/výběrů do Netlify Blobs. Z těchto záznamů pak funkce
// `portfolio` počítá výnosnost.
//
// Potřebné proměnné prostředí (Netlify → Site configuration → Environment variables):
//   T212_API_KEY, T212_API_SECRET

import { getStore } from "@netlify/blobs";

const API = "https://live.trading212.com";

// Typy transakcí, které jsou pohybem peněz do/z účtu (ne výnosem)
const FLOW_TYPES = new Set(["DEPOSIT", "WITHDRAW", "TRANSFER"]);

function authHeader() {
  const key = process.env.T212_API_KEY;
  const secret = process.env.T212_API_SECRET;
  if (!key || !secret) throw new Error("Chybí T212_API_KEY / T212_API_SECRET");
  return "Basic " + Buffer.from(`${key}:${secret}`).toString("base64");
}

async function t212(path) {
  const res = await fetch(API + path, { headers: { Authorization: authHeader() } });
  if (!res.ok) {
    const error = new Error(`Trading 212 ${path} → ${res.status}`);
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

export default async () => {
  const store = getStore("portfolio");
  const state = (await store.get("state", { type: "json" })) || {
    snapshots: [],
    netDeposits: 0,
    seenRefs: [],
    lastSyncedAt: null,
  };
  const seen = new Set(state.seenRefs);

  // 1) Nové vklady/výběry. Při prvním běhu celá historie, potom od poslední
  //    synchronizace (s jednodenní rezervou – duplicity hlídá `seenRefs`).
  const since = state.lastSyncedAt
    ? new Date(new Date(state.lastSyncedAt).getTime() - 24 * 60 * 60 * 1000).toISOString()
    : null;
  let path =
    "/api/v0/equity/history/transactions?limit=50" +
    (since ? `&time=${encodeURIComponent(since)}` : "");

  const summary = await t212("/api/v0/equity/account/summary");
  const syncStartedAt = new Date().toISOString();

  try {
    while (path) {
      const page = await t212(path);
      for (const tx of page.items || []) {
        if (!FLOW_TYPES.has(tx.type) || seen.has(tx.reference)) continue;
        if (tx.currency && tx.currency !== summary.currency) {
          console.warn(`Transakce ${tx.reference} je v ${tx.currency}, účet v ${summary.currency}`);
        }
        seen.add(tx.reference);
        state.netDeposits += flowAmount(tx);
      }
      path = page.nextPagePath || null;
    }
  } catch (error) {
    // Rate limit (429) při dlouhé historii: uložit průběh a dokončit příští hodinu.
    // Snapshot se nezapíše, dokud nejsou vklady kompletní – jinak by výnos neseděl.
    if (error.status !== 429) throw error;
    state.seenRefs = [...seen];
    await store.setJSON("state", state);
    console.log("Rate limit – synchronizace transakcí pokračuje příště");
    return;
  }

  state.seenRefs = [...seen];
  state.lastSyncedAt = syncStartedAt;

  // 2) Hodnota celého účtu = investice + veškerá hotovost
  const cash = summary.cash || {};
  const value =
    (summary.investments?.currentValue || 0) +
    (cash.availableToTrade || 0) +
    (cash.inPies || 0) +
    (cash.reservedForOrders || 0);

  // 3) Jeden snapshot na den – během dne se přepisuje nejnovější hodnotou
  const date = todayInPrague();
  const snapshot = { date, value, netDeposits: state.netDeposits, updatedAt: syncStartedAt };
  const last = state.snapshots[state.snapshots.length - 1];
  if (last?.date === date) state.snapshots[state.snapshots.length - 1] = snapshot;
  else state.snapshots.push(snapshot);

  await store.setJSON("state", state);
  console.log(`Snapshot ${date} uložen (${state.snapshots.length} dní historie)`);
};

export const config = {
  schedule: "@hourly",
};
