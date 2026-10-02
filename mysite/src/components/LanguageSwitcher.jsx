import React from "react";
import { useTranslation } from "react-i18next";

// Přepínač jazyka – stejný vzhled jako přepínač světlého / tmavého režimu
const LANGUAGES = [
  { code: "en", label: "EN", ariaLabel: "Switch to English" },
  { code: "cs", label: "CS", ariaLabel: "Přepnout do češtiny" },
];

export const LanguageSwitcher = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("cs") ? "cs" : "en";

  return (
    <div
      className={`relative inline-flex items-center p-1 rounded-full bg-slate-800 border border-slate-700 dark:bg-white/5 dark:border-white/10 select-none ${className}`}
    >
      {LANGUAGES.map(({ code, label, ariaLabel }) => (
        <button
          key={code}
          type="button"
          onClick={() => i18n.changeLanguage(code)}
          aria-pressed={currentLang === code}
          aria-label={ariaLabel}
          className={`flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
            currentLang === code ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};
