// Lokální kontrola výnosnosti (npm run portfolio:check) – stejný výpočet jako na Netlify.
// Klíče čte ze souboru .env.local (není v gitu):
//   TRADING212_API_KEY=...
//   TRADING212_SECRET_KEY=...
// Nic neukládá na web – jen vypíše výsledek a kontroly.

import { createT212Client, updatePortfolio } from "../lib/portfolio-update.mjs";
import { createPriceService } from "../lib/prices.mjs";

const memoryStore = () => {
  const data = new Map();
  return {
    get: async (key) => (data.has(key) ? structuredClone(data.get(key)) : null),
    setJSON: async (key, value) => void data.set(key, structuredClone(value)),
  };
};

const percent = (value) => (value == null ? "—" : `${(value * 100).toFixed(2)} %`);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

try {
  const t212 = createT212Client({ key: process.env.TRADING212_API_KEY, secret: process.env.TRADING212_SECRET_KEY });
  const store = memoryStore();
  const prices = createPriceService();

  // Historie se stahuje po částech kvůli limitům API – při limitu chvíli počkat
  let outcome;
  for (let round = 1; round <= 15; round++) {
    outcome = await updatePortfolio({ t212, prices, store, budgetMs: 60_000 });
    if (outcome.status.lastError) throw new Error(outcome.status.lastError);
    if (!outcome.status.syncing) break;
    console.log(`… stahuji historii (limit Trading 212), čekám minutu (${round}. kolo)`);
    await sleep(61_000);
  }

  const { result, details } = outcome;
  if (!result) throw new Error("Historii se nepodařilo stáhnout celou, zkus to znovu.");

  console.log(`\n✔ Výnosnost (měna účtu ${details.accountCurrency})`);
  for (const [period, label] of [["threeMonths", "3 měsíce"], ["ytd", "od začátku roku"], ["oneYear", "1 rok"]]) {
    const r = result.returns[period];
    console.log(`  ${label.padEnd(16)} ${percent(r?.value).padStart(10)}${r && !r.complete ? `   (od ${r.from})` : ""}`);
  }

  console.log("\nKontroly:");
  console.log(`  Položky historie: ${JSON.stringify(details.historyCounts)}`);
  console.log(`  Tituly: ${Object.values(details.instruments).join(", ") || "žádné"}`);
  const diff = result.check.valueDiffPct;
  console.log(
    `  Dnešní hodnota z cen Yahoo vs. Trading 212: ${percent(diff)} ${Math.abs(diff ?? 0) < 0.02 ? "✔" : "⚠ velký rozdíl – zkontroluj tituly níže"}`,
  );
  for (const [currency, factor] of Object.entries(details.fxCalibration || {})) {
    console.log(`  Kurz ${currency}→${details.accountCurrency} u Trading 212 vs. trh: ${percent(factor - 1)} (zohledněno)`);
  }
  if (details.missingPrices.length) console.log(`  ⚠ Chybí ceny pro: ${details.missingPrices.join(", ")}`);

  console.log("\nPozice (cena z Yahoo vs. Trading 212):");
  for (const p of details.positions.sort((a, b) => (b.share ?? 0) - (a.share ?? 0))) {
    const ok = p.diffPct != null && Math.abs(p.diffPct) < 0.03;
    console.log(
      `  ${ok ? "✔" : "⚠"} ${p.ticker.padEnd(14)} → ${(p.symbol || "nenalezeno").padEnd(10)} rozdíl ${percent(p.diffPct).padStart(9)}   podíl ${percent(p.share).padStart(8)}`,
    );
  }
  if (details.missingFx.length) console.log(`  ⚠ Chybí kurzy pro: ${details.missingFx.join(", ")}`);
} catch (error) {
  console.error("✖", error.message);
  process.exit(1);
}
