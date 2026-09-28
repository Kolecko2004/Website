import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { pageMeta } from "../data/seo";

// Titulek záložky a meta popis podle aktuální stránky a jazyka
export default function usePageMeta() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || "en";

  useEffect(() => {
    const texts = i18n.getResourceBundle(lang, "translation");
    if (!texts) return;

    const path = pathname.replace(/\/+$/, "") || "/";
    const { title, description } = pageMeta(path, texts);

    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [pathname, lang, i18n]);
}
