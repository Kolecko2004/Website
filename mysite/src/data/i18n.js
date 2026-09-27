import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Texty jsou rozdělené podle jazyka v ./locales
import en from "./locales/en";
import cs from "./locales/cs";

const resources = {
  en: { translation: en },
  cs: { translation: cs },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: ["en", "cs"],
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
  });

// Jazyk stránky pro prohlížeč / čtečky obrazovky
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng.startsWith("cs") ? "cs" : "en";
});

export default i18n;
