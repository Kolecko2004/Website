// Naplánovaná funkce (každou hodinu): přepočítá výnosnost portfolia z historie
// obchodů Trading 212 (logika v ../lib/portfolio-update.mjs).
//
// Proměnné prostředí v Netlify: TRADING212_API_KEY, TRADING212_SECRET_KEY
// Oprávnění API klíče: Account data, Portfolio, History – Orders, Transactions, Dividends

import { getStore } from "@netlify/blobs";
import { createT212Client, updatePortfolio } from "../lib/portfolio-update.mjs";
import * as prices from "../lib/prices.mjs";

export default async () => {
  const { status } = await updatePortfolio({
    t212: createT212Client({ key: process.env.TRADING212_API_KEY, secret: process.env.TRADING212_SECRET_KEY }),
    prices,
    store: getStore({ name: "portfolio", consistency: "strong" }),
  });
  if (status.lastError) console.error(status.lastError);
  else console.log(status.syncing ? "Stahuje se historie…" : "Výnosnost přepočítána");
};

export const config = {
  schedule: "@hourly",
};
