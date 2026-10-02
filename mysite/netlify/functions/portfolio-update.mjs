// Naplánovaná funkce (každou hodinu): přepočítá výnosnost portfolia z historie
// obchodů Trading 212 (logika v ../lib/portfolio-update.mjs).
//
// Proměnné prostředí v Netlify: TRADING212_API_KEY, TRADING212_SECRET_KEY
// Oprávnění API klíče: Account data, Portfolio, History – Orders, Transactions, Dividends

import { getStore } from "@netlify/blobs";
import { createT212Client, updatePortfolio } from "../lib/portfolio-update.mjs";
import { createPriceService } from "../lib/prices.mjs";

export default async () => {
  const store = getStore({ name: "portfolio", consistency: "strong" });
  let t212;
  try {
    t212 = createT212Client({ key: process.env.TRADING212_API_KEY, secret: process.env.TRADING212_SECRET_KEY });
  } catch (error) {
    await store.setJSON("status-v3", { lastAttemptAt: new Date().toISOString(), lastError: error.message });
    console.error(error.message);
    return;
  }

  const { status } = await updatePortfolio({ t212, prices: createPriceService(), store });
  if (status.lastError) console.error(status.lastError);
  else console.log(status.syncing ? "Stahuje se historie…" : "Výnosnost přepočítána");
};

export const config = {
  schedule: "@hourly",
};
