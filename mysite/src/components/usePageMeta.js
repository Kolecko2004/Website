import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { pageMeta } from "../data/seo";

const descriptionTag = () => document.querySelector('meta[name="description"]');

// Texty domovské stránky z index.html (uložené při načtení, než je cokoli přepíše)
const HOME_META = {
  title: document.title,
  description: descriptionTag()?.getAttribute("content") || "",
};

// Titulek záložky a meta popis podle aktuální stránky a jazyka
export default function usePageMeta() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage;

  useEffect(() => {
    const texts = i18n.getResourceBundle(lang, "translation");
    if (!texts) return;

    const path = pathname.replace(/\/+$/, "") || "/";
    if (path.startsWith("/admin")) return; // administrace si titulek nastavuje sama
    const { title, description } = pageMeta(path, texts) || HOME_META;

    document.title = title;
    descriptionTag()?.setAttribute("content", description);
  }, [pathname, lang, i18n]);
}
