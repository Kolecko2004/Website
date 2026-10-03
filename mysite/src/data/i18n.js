import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Výchozí texty jsou v ./locales, změny z administrace se přeloží přes ně (viz content.js)
import { DEFAULT_TEXTS, LANGUAGES, applyOverrides } from "./content";

// Výchozí jazyk je angličtina; čeština jen po přepnutí (volba se pamatuje v localStorage).
// Jazyk prohlížeče se záměrně nepoužívá. Klíč „language“ (ne i18nextLng), aby se staré
// automaticky uložené volby ignorovaly.
const STORAGE_KEY = "language";

function savedLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

const saved = savedLanguage();

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: DEFAULT_TEXTS.en },
    cs: { translation: DEFAULT_TEXTS.cs },
  },
  lng: LANGUAGES.includes(saved) ? saved : "en",
  fallbackLng: "en",
  supportedLngs: LANGUAGES,
  interpolation: {
    escapeValue: false,
  },
  // Po změně textů (administrace) se komponenty samy překreslí
  react: {
    bindI18nStore: "added",
  },
});

// Jazyk stránky pro prohlížeč / čtečky obrazovky; přepnutí se zapamatuje
document.documentElement.lang = i18n.language;
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    // bez localStorage platí volba jen do zavření stránky
  }
});

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
