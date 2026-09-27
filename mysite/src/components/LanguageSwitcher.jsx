// src/components/LanguageSwitcher.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import { CzFlag, EnFlag } from "./Flags";

export const LanguageSwitcher = ({ className = "" }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.startsWith("cs") ? "cs" : "en";

  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div 
      className={`relative inline-flex items-center p-1 rounded-full bg-slate-800 border border-slate-700 select-none ${className}`}
    >
      {/* English Option */}
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`relative z-10 flex items-center justify-center px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
          currentLang === "en" 
            ? "bg-slate-700 text-white shadow-sm" 
            : "text-slate-400 hover:text-slate-200"
        }`}
        aria-label="Switch to English"
      >
        <EnFlag className="w-5 h-3.5 mr-1.5" />
        <span className="text-xs font-semibold">EN</span>
      </button>

      {/* Czech Option */}
      <button
        type="button"
        onClick={() => setLanguage("cs")}
        className={`relative z-10 flex items-center justify-center px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
          currentLang === "cs" 
            ? "bg-slate-700 text-white shadow-sm" 
            : "text-slate-400 hover:text-slate-200"
        }`}
        aria-label="Přepnout do češtiny"
      >
        <CzFlag className="w-5 h-3.5 mr-1.5" />
        <span className="text-xs font-semibold">CS</span>
      </button>
    </div>
  );
};