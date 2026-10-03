import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock, RefreshCw } from "lucide-react";

// Pořadí a klíče období (texty jsou v locales → portfolio.periods)
const PERIODS = ["threeMonths", "ytd", "oneYear"];
const HOUR = 60 * 60 * 1000;
const DATE = { day: "numeric", month: "numeric", year: "numeric" };

// Odpočet do další aktualizace ve tvaru 23:05. Data se přepočítávají každou celou
// hodinu UTC (Netlify funkce portfolio-update, @hourly); každou sekundu se
// překresluje jen tento text, ne celé okno.
function Countdown() {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const seconds = Math.floor((HOUR - (now % HOUR)) / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// Živá výnosnost portfolia z /api/portfolio (Netlify funkce, data z Trading 212)
export default function PortfolioReturns() {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage === "cs" ? "cs-CZ" : "en-GB";
  // status: "loading" | "ready" | "syncing" | "unavailable"
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/portfolio")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (cancelled) return;
        if (data.available) setState({ status: "ready", data });
        // První stahování historie obchodů (trvá pár hodin kvůli limitům API)
        else setState({ status: data.status?.syncing ? "syncing" : "unavailable" });
      })
      .catch(() => !cancelled && setState({ status: "unavailable" }));
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "unavailable" || state.status === "syncing") {
    return <p className="text-slate-400 text-sm">{t(`portfolio.${state.status}`)}</p>;
  }

  const data = state.data;
  const percent = new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  });

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PERIODS.map((period) => {
          const item = data?.returns[period];
          return (
            <div
              key={period}
              className="rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-5 dark:bg-white/5 dark:border-white/10"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {t(`portfolio.periods.${period}`)}
              </div>
              {item ? (
                <div
                  className={`mt-2 text-3xl font-black tabular-nums ${
                    item.value >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {percent.format(item.value)}
                </div>
              ) : !data ? (
                // Načítání – šedý zástupný pruh
                <div className="mt-3 h-8 w-28 mx-auto rounded-md bg-slate-700 animate-pulse" />
              ) : (
                // Za toto období nejsou data (účet ještě neexistoval)
                <div className="mt-2 text-3xl font-black text-slate-500">—</div>
              )}
              {/* Od kdy se výnos počítá (u každého období) */}
              {item?.from && (
                <div className="mt-1 text-xs text-slate-400">
                  {t("portfolio.since", { date: new Date(item.from).toLocaleDateString(locale, DATE) })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {data && (
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <Clock size={14} className="text-slate-500" />
            {t("portfolio.updated")}{" "}
            <span className="font-semibold text-slate-300">
              {new Date(data.updatedAt).toLocaleString(locale, { ...DATE, hour: "2-digit", minute: "2-digit" })}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <RefreshCw size={14} className="text-slate-500" />
            {t("portfolio.nextUpdate")}{" "}
            <span className="font-semibold tabular-nums text-slate-300">
              <Countdown />
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
