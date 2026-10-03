import { useSyncExternalStore } from "react";

// Světlý / tmavý režim. Počáteční stav nastavuje public/theme-init.js (před vykreslením),
// tady se jen čte a přepíná. Zdrojem pravdy je třída „dark“ na <html>, takže všechny
// přepínače (lišta i mobilní menu) ukazují vždy totéž. Volba se ukládá do localStorage.
// Nastavení systému se záměrně ignoruje – výchozí je vždy světlý režim.
const STORAGE_KEY = "theme";
const listeners = new Set();

export function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const currentTheme = () => (document.documentElement.classList.contains("dark") ? "dark" : "light");

export default function useTheme() {
  const theme = useSyncExternalStore(subscribe, currentTheme);

  const setTheme = (next) => {
    applyTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // bez localStorage platí volba jen do zavření stránky
    }
  };

  return [theme, setTheme];
}
