// Historické ceny a kurzy z Yahoo Finance (Trading 212 API je neposkytuje).
// Titul se dohledá podle ISIN; cena se bere v měně, ve které Yahoo titul vede,
// a přepočte se na měnu účtu kurzem ze stejného dne.

const UA = "Mozilla/5.0 (compatible; vojtechdrozd.com portfolio)";

// Yahoo uvádí některé ceny v setinách měny (GBp = pence)
const MINOR_UNITS = { GBp: ["GBP", 0.01], GBX: ["GBP", 0.01], ZAc: ["ZAR", 0.01], ILA: ["ILS", 0.01] };

const normalizeCurrency = (currency) => MINOR_UNITS[currency] || [currency, 1];

// Poslední hodnota v den `time` nebo před ním (body seřazené podle času)
export function pointAt(points, time) {
  let lo = 0;
  let hi = points.length - 1;
  let found = null;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (points[mid][0] <= time) {
      found = points[mid][1];
      lo = mid + 1;
    } else hi = mid - 1;
  }
  return found;
}

// Ticker z Trading 212 → symbol na Yahoo (záloha, když hledání podle ISIN nic nenajde)
//   AAPL_US_EQ → AAPL, BRK_B_US_EQ → BRK-B, VUAGl_EQ → VUAG.L, SAPd_EQ → SAP.DE, CNX1_EQ → CNX1.L
const EXCHANGE_SUFFIX = { l: ".L", d: ".DE", p: ".PA", a: ".AS", m: ".MI", e: ".MC", s: ".SW" };

export function tickerToYahoo(ticker = "") {
  const us = ticker.match(/^(.+)_US_EQ$/);
  if (us) return us[1].replace(/_/g, "-");
  const withExchange = ticker.match(/^([A-Z0-9.]+?)([a-z])_EQ$/);
  if (withExchange && EXCHANGE_SUFFIX[withExchange[2]]) return withExchange[1] + EXCHANGE_SUFFIX[withExchange[2]];
  const plain = ticker.match(/^([A-Z0-9]+)_EQ$/);
  if (plain) return `${plain[1]}.L`;
  return null;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function createPriceService({ fetch: fetchImpl = fetch, symbolCache = {}, retryDelayMs = 1000 } = {}) {
  // Při limitu (429) nebo výpadku Yahoo se dotaz 2× zopakuje
  const get = async (url) => {
    for (let attempt = 0; ; attempt++) {
      const res = await fetchImpl(url, { headers: { "User-Agent": UA } });
      if (res.ok) return res.json();
      if (attempt >= 2 || (res.status !== 429 && res.status < 500)) {
        const error = new Error(`Yahoo ${new URL(url).pathname} → HTTP ${res.status}`);
        error.status = res.status;
        throw error;
      }
      await sleep(retryDelayMs * (attempt + 1));
    }
  };

  // ISIN (+ ticker z Trading 212) → symbol na Yahoo; výsledek se pamatuje v `cache`
  async function symbolFor(isin, cache = symbolCache, t212Ticker) {
    if (cache[isin]) return cache[isin];
    const fromTicker = tickerToYahoo(t212Ticker);
    const data = await get(
      `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(isin)}&quotesCount=10&newsCount=0`,
    );
    const quotes = (data.quotes || []).filter((q) => q.symbol);
    const symbol =
      // výpis, který odpovídá tickeru z Trading 212 (stejná burza)
      quotes.find((q) => q.symbol === fromTicker)?.symbol ||
      quotes.find((q) => ["EQUITY", "ETF"].includes(q.quoteType))?.symbol ||
      quotes[0]?.symbol ||
      fromTicker;
    if (!symbol) return null;
    cache[isin] = symbol;
    return symbol;
  }

  // Denní uzavírací ceny od `from` do dneška: { currency, points: [[čas, cena], …] }
  async function series(symbol, from) {
    const period1 = Math.floor(from / 1000);
    const period2 = Math.floor(Date.now() / 1000) + 86400;
    const data = await get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?period1=${period1}&period2=${period2}&interval=1d`,
    );
    const result = data.chart?.result?.[0];
    if (!result?.timestamp) return null;
    const [currency, factor] = normalizeCurrency(result.meta?.currency);
    const closes = result.indicators?.quote?.[0]?.close || [];
    const points = result.timestamp
      .map((t, i) => [t * 1000, closes[i] == null ? null : closes[i] * factor])
      .filter(([, close]) => close != null);
    return { currency, points };
  }

  const fxSeries = (from, to, since) => series(`${from}${to}=X`, since);

  return { symbolFor, series, fxSeries };
}
