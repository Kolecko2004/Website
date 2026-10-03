import { useTranslation } from "react-i18next";
import { Moon, Sun } from "lucide-react";
import useTheme from "./useTheme";

const LANGUAGES = [
  { value: "en", label: "Switch to English" },
  { value: "cs", label: "Přepnout do češtiny" },
];

// Jazyk: zamáčknutá drážka, vybraný jazyk vystupuje
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  return (
    <div role="group" aria-label={t("nav.language")} className="flex gap-1 p-1 rounded-full shadow-neu-in select-none">
      {LANGUAGES.map(({ value, label }) => {
        const active = i18n.resolvedLanguage === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => i18n.changeLanguage(value)}
            aria-pressed={active}
            aria-label={label}
            title={label}
            className={`min-h-10 px-3.5 rounded-full text-[13px] font-bold uppercase cursor-pointer transition-shadow duration-200 ${
              active ? "bg-surface shadow-neu-sm" : "text-muted hover:text-ink"
            }`}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}

// Světlý / tmavý režim: vypínač s posuvným „knoflíkem“
export function ThemeSwitcher() {
  const { t } = useTranslation();
  const [theme, setTheme] = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-pressed={dark}
      aria-label={t("nav.darkMode")}
      title={dark ? t("nav.lightMode") : t("nav.darkMode")}
      className="relative w-20 h-[46px] shrink-0 rounded-full shadow-neu-in cursor-pointer"
    >
      <span
        className={`absolute top-1.5 left-1.5 flex items-center justify-center size-[34px] rounded-full bg-surface shadow-neu-sm text-accent-ink transition-transform duration-300 ${
          dark ? "translate-x-[34px]" : ""
        }`}
      >
        {dark ? <Moon size={16} aria-hidden="true" /> : <Sun size={16} aria-hidden="true" />}
      </span>
    </button>
  );
}
