import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDownRight, ArrowUpRight, Clock } from "lucide-react";

// Pořadí a klíče období (texty jsou v locales → portfolio.periods)
const PERIODS = ["threeMonths", "ytd", "oneYear"];
const HOUR = 60 * 60 * 1000;
const DATE = { day: "numeric", month: "numeric", year: "numeric" };

// Odpočet do další aktualizace – data se přepočítávají každou celou hodinu UTC
// (Netlify funkce portfolio-update, @hourly). Vrací text „23:05“ a uplynulou část hodiny v %.
function useCountdown() {
  const [now, setNow] = useState(Date.now);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  const left = HOUR - (now % HOUR);
  const seconds = Math.floor(left / 1000);
  return {
    label: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`,
    elapsed: 100 - (left / HOUR) * 100,
  };
}

// Barevný oblouk prstence o tloušťce `thickness` px
const arcStyle = (elapsed, thickness) => {
  const mask = `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness - 1}px))`;
  return {
    background: `conic-gradient(var(--accent) 0 ${elapsed}%, transparent ${elapsed}% 100%)`,
    WebkitMask: mask,
    mask,
  };
};

// Velký prstenec s odpočtem (upoutávka na domovské stránce).
// Každou sekundu se překresluje jen tento prstenec, ne celá stránka.
export function CountdownRing({ size = 200 }) {
  const { t } = useTranslation();
  const { label, elapsed } = useCountdown();

  return (
    <div className="relative max-w-full aspect-square" style={{ width: size }}>
      <div className="absolute inset-0 rounded-full shadow-neu-in" />
      <div className="absolute inset-[10px] rounded-full" style={arcStyle(elapsed, 10)} />
      <div className="absolute inset-[18%] rounded-full bg-surface shadow-neu flex flex-col items-center justify-center gap-1 text-center">
        <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted">{t("portfolio.nextUpdate")}</span>
        <span className="text-3xl font-extrabold tabular-nums tracking-[-0.02em]">{label}</span>
      </div>
    </div>
  );
}

// Kompaktní stavový řádek pod výnosy: malý prstenec + odpočet a čas poslední aktualizace
function UpdateStatus({ updatedAt, locale }) {
  const { t } = useTranslation();
  const { label, elapsed } = useCountdown();

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 rounded-3xl shadow-neu-in px-5 py-4">
      <span className="inline-flex items-center gap-3.5">
        <span className="relative size-11 shrink-0 rounded-full bg-surface shadow-neu-sm">
          <span className="absolute inset-[5px] rounded-full" style={arcStyle(elapsed, 4)} />
        </span>
        <span className="flex flex-col">
          <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-muted">{t("portfolio.nextUpdate")}</span>
          <span className="text-lg font-extrabold leading-tight tabular-nums">{label}</span>
        </span>
      </span>
      <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-muted">
        <span className="inline-flex items-center gap-2.5 whitespace-nowrap">
          <Clock size={16} aria-hidden="true" className="shrink-0 text-accent-ink" />
          {t("portfolio.updated")}
        </span>
        <strong className="text-ink tabular-nums whitespace-nowrap">
          {new Date(updatedAt).toLocaleString(locale, { ...DATE, hour: "2-digit", minute: "2-digit" })}
        </strong>
      </span>
    </div>
  );
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
    return <p className="text-muted text-sm">{t(`portfolio.${state.status}`)}</p>;
  }

  const data = state.data;
  const percent = new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  });

  return (
    <div className="w-full flex flex-col gap-8 text-left">
      <div className="flex flex-wrap gap-6">
        {PERIODS.map((period) => {
          const item = data?.returns[period];
          const Arrow = item?.value < 0 ? ArrowDownRight : ArrowUpRight;
          return (
            <div key={period} className="flex-[1_1_200px] min-w-0 flex flex-col gap-2.5 rounded-[28px] shadow-neu-in p-5 sm:p-6">
              <span className="text-xs font-bold tracking-[0.12em] uppercase text-muted">
                {t(`portfolio.periods.${period}`)}
              </span>
              {item ? (
                <span className="flex items-center gap-2 text-3xl sm:text-4xl font-extrabold tabular-nums tracking-[-0.03em]">
                  <Arrow
                    size={26}
                    strokeWidth={2.4}
                    aria-hidden="true"
                    className={item.value < 0 ? "text-muted" : "text-accent-ink"}
                  />
                  {percent.format(item.value)}
                </span>
              ) : !data ? (
                // Načítání – zástupný pruh
                <span className="h-10 w-32 rounded-xl shadow-neu-sm animate-pulse" />
              ) : (
                // Za toto období nejsou data (účet ještě neexistoval)
                <span className="text-4xl font-extrabold text-muted">—</span>
              )}
              {item?.from && (
                <span className="text-sm text-muted">
                  {t("portfolio.since", { date: new Date(item.from).toLocaleDateString(locale, DATE) })}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {data && <UpdateStatus updatedAt={data.updatedAt} locale={locale} />}
    </div>
  );
}
