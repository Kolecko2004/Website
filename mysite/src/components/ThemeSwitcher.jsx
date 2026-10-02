import React from "react";
import { useTranslation } from "react-i18next";
import { Moon, Sun } from "lucide-react";
import useTheme from "./useTheme";

// Přepínač světlý / tmavý režim – stejný vzhled jako přepínač jazyka
export const ThemeSwitcher = ({ className = "" }) => {
  const { t } = useTranslation();
  const [theme, setTheme] = useTheme();

  const options = [
    { value: "light", icon: Sun, label: t("nav.lightMode") },
    { value: "dark", icon: Moon, label: t("nav.darkMode") },
  ];

  return (
    <div
      role="group"
      aria-label={t("nav.theme")}
      className={`relative inline-flex items-center p-1 rounded-full bg-slate-800 border border-slate-700 dark:bg-white/5 dark:border-white/10 select-none ${className}`}
    >
      {options.map(({ value, icon, label }) => {
        const Icon = icon;
        const active = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={active}
            aria-label={label}
            title={label}
            className={`flex items-center justify-center px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
              active ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon size={16} className={active ? (value === "dark" ? "text-cyan-400" : "text-amber-300") : ""} />
          </button>
        );
      })}
    </div>
  );
};
