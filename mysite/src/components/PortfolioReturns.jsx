import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Pořadí a klíče období (texty jsou v locales → portfolio.periods)
const PERIODS = ["threeMonths", "ytd", "oneYear"];

const formatDate = (iso, lang) =>
  new Date(iso).toLocaleDateString(lang === "cs" ? "cs-CZ" : "en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

const formatPercent = (value, lang) =>
  new Intl.NumberFormat(lang === "cs" ? "cs-CZ" : "en-GB", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  }).format(value);

// Živá výnosnost portfolia z /api/portfolio (Netlify funkce, data z Trading 212)
export default function PortfolioReturns() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("cs") ? "cs" : "en";
  // status: "loading" | "ready" | "unavailable"
  const [state, setState] = useState({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/portfolio")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data) => {
        if (cancelled) return;
        setState(data.available ? { status: "ready", data } : { status: "unavailable" });
      })
      .catch(() => !cancelled && setState({ status: "unavailable" }));
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "unavailable") {
    return <p className="text-slate-400 text-sm">{t("portfolio.unavailable")}</p>;
  }

  const data = state.data;

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PERIODS.map((period) => {
          const item = data?.returns[period];
          const positive = item && item.value >= 0;
          return (
            <div
              key={period}
              className="rounded-xl bg-slate-800/80 border border-slate-700 px-4 py-5"
            >
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {t(`portfolio.periods.${period}`)}
              </div>
              {item ? (
                <div
                  className={`mt-2 text-3xl font-black tabular-nums ${
                    positive ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {formatPercent(item.value, lang)}
                </div>
              ) : (
                // Načítání – šedý zástupný pruh
                <div className="mt-3 h-8 w-28 mx-auto rounded-md bg-slate-700 animate-pulse" />
              )}
              {item && !item.complete && (
                <div className="mt-1 text-xs text-slate-400">
                  {t("portfolio.since", { date: formatDate(item.from, lang) })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {data && (
        <p className="text-xs text-slate-500">
          {t("portfolio.updated", { date: formatDate(data.updatedAt, lang) })} ·{" "}
          {t("portfolio.note")}
        </p>
      )}
    </div>
  );
}
