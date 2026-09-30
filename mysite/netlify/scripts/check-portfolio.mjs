// Kontrola napojení na Trading 212 (spouští se lokálně: npm run portfolio:check).
// Klíče čte ze souboru .env.local (není v gitu):
//   TRADING212_API_KEY=...
//   TRADING212_SECRET_KEY=...
// Nic neukládá – jen vypíše, co by naplánovaná funkce uložila.

const API = "https://live.trading212.com";
const { TRADING212_API_KEY: key, TRADING212_SECRET_KEY: secret } = process.env;

if (!key || !secret) {
  console.error("Chybí TRADING212_API_KEY nebo TRADING212_SECRET_KEY v .env.local");
  process.exit(1);
}

const headers = {
  Authorization: "Basic " + Buffer.from(`${key}:${secret}`).toString("base64"),
};

async function t212(path) {
  const res = await fetch(API + path, { headers });
  if (!res.ok) {
    const hint = {
      401: "špatný klíč nebo secret",
      403: "klíč nemá potřebné oprávnění (Account data / History)",
      429: "rate limit – zkus to za minutu",
    }[res.status];
    throw new Error(`${path} → HTTP ${res.status}${hint ? ` (${hint})` : ""}`);
  }
  return res.json();
}

try {
  const summary = await t212("/api/v0/equity/account/summary");
  const cash = summary.cash || {};
  const value =
    (summary.investments?.currentValue || 0) +
    (cash.availableToTrade || 0) +
    (cash.inPies || 0) +
    (cash.reservedForOrders || 0);

  console.log("✔ Připojení k Trading 212 funguje");
  console.log(`  Měna účtu:        ${summary.currency}`);
  console.log(`  Hodnota účtu:     ${value.toFixed(2)} ${summary.currency}`);
  console.log(`  (API totalValue: ${summary.totalValue})`);

  const page = await t212("/api/v0/equity/history/transactions?limit=50");
  const items = page.items || [];
  const byType = {};
  for (const tx of items) byType[tx.type] = (byType[tx.type] || 0) + 1;

  console.log(`✔ Historie transakcí funguje (první stránka: ${items.length} položek)`);
  for (const [type, count] of Object.entries(byType)) console.log(`  ${type}: ${count}`);

  const otherCurrency = items.filter((tx) => tx.currency && tx.currency !== summary.currency);
  if (otherCurrency.length) {
    console.warn(`⚠ ${otherCurrency.length} transakcí je v jiné měně než účet – výpočet vkladů může nesedět`);
  }
  if (page.nextPagePath) console.log("  (další stránky existují – funkce je projde všechny)");
} catch (error) {
  console.error("✖", error.message);
  process.exit(1);
}
