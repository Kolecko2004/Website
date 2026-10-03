import { useTranslation } from "react-i18next";
import { Moon, Sun } from "lucide-react";
import useTheme from "./useTheme";

const LANGUAGES = [
  { value: "en", content: "EN", label: "Switch to English" },
  { value: "cs", content: "CS", label: "Přepnout do češtiny" },
];

// Přepínač ve tvaru „pilulky“ – stejný vzhled pro jazyk i světlý / tmavý režim.
// activeColor: barva vybrané volby (ikona přebírá barvu textu)
function Toggle({ label, options, value, onChange }) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center p-1 rounded-full bg-slate-800 border border-slate-700 dark:bg-white/5 dark:border-white/10 select-none"
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={active}
            aria-label={option.label}
            title={option.label}
            className={`flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
              active
                ? `bg-slate-700 shadow-sm ${option.activeColor || "text-white"}`
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {option.content}
          </button>
        );
      })}
    </div>
  );
}

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  return (
    <Toggle
      label={t("nav.language")}
      options={LANGUAGES}
      value={i18n.resolvedLanguage}
      onChange={(lng) => i18n.changeLanguage(lng)}
    />
  );
}

export function ThemeSwitcher() {
  const { t } = useTranslation();
  const [theme, setTheme] = useTheme();
  const options = [
    { value: "light", content: <Sun size={16} />, label: t("nav.lightMode"), activeColor: "text-amber-300" },
    { value: "dark", content: <Moon size={16} />, label: t("nav.darkMode"), activeColor: "text-cyan-400" },
  ];
  return <Toggle label={t("nav.theme")} options={options} value={theme} onChange={setTheme} />;
}
