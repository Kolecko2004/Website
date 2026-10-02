import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Výchozí texty jsou v ./locales, změny z administrace se přeloží přes ně (viz content.js)
import { DEFAULT_TEXTS, LANGUAGES, applyOverrides } from "./content";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: DEFAULT_TEXTS.en },
      cs: { translation: DEFAULT_TEXTS.cs },
    },
    // Výchozí jazyk je angličtina; čeština jen po přepnutí (volba se pamatuje).
    // Jazyk prohlížeče se záměrně nepoužívá. Nový klíč „language“ = staré
    // automaticky uložené volby (i18nextLng) se ignorují.
    fallbackLng: "en",
    detection: {
      order: ["localStorage"],
      lookupLocalStorage: "language",
      caches: ["localStorage"],
    },
    supportedLngs: ["en", "cs"],
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    // Po změně textů (administrace) se komponenty samy překreslí
    react: {
      bindI18nStore: "added",
    },
  });

// Jazyk stránky pro prohlížeč / čtečky obrazovky (při načtení i při přepnutí)
const setHtmlLang = (lng = "en") => {
  document.documentElement.lang = lng.startsWith("cs") ? "cs" : "en";
};
setHtmlLang(i18n.resolvedLanguage);
i18n.on("languageChanged", setHtmlLang);

// Použije přepisy textů: { en: { "cesta": "text" }, cs: { … } }
export function applyContent(overrides = {}) {
  for (const lang of LANGUAGES) {
    const texts = applyOverrides(DEFAULT_TEXTS[lang], overrides[lang]);
    i18n.addResourceBundle(lang, "translation", texts, false, true);
  }
}

// Stáhne upravené texty z /api/content. Když API neodpoví včas, web
// se zobrazí s výchozími texty (např. při `npm run dev` bez API).
export async function loadContent(timeoutMs = 2000) {
  try {
    const res = await fetch("/api/content", { signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return;
    applyContent(await res.json());
  } catch {
    // výchozí texty zůstanou
  }
}

export default i18n;
