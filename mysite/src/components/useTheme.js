import { useSyncExternalStore } from "react";

// Světlý / tmavý režim. Počáteční stav nastavuje public/theme-init.js (před vykreslením),
// tady se jen čte a přepíná. Zdrojem pravdy je třída „dark“ na <html>, takže všechny
// přepínače (lišta i mobilní menu) ukazují vždy totéž. Volba se ukládá do localStorage.
const STORAGE_KEY = "theme";
const media = window.matchMedia("(prefers-color-scheme: dark)");
const listeners = new Set();

export function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
  listeners.forEach((listener) => listener());
}

// Bez vlastní volby se režim mění spolu se systémem
function followSystem() {
  try {
    if (localStorage.getItem(STORAGE_KEY)) return;
  } catch {
    // bez localStorage se režim řídí systémem
  }
  applyTheme(media.matches ? "dark" : "light");
}

// Systém se sleduje, jen dokud je na stránce nějaký přepínač (administrace je vždy světlá)
function subscribe(listener) {
  listeners.add(listener);
  media.addEventListener("change", followSystem); // stejná funkce se přidá jen jednou
  return () => {
    listeners.delete(listener);
    if (!listeners.size) media.removeEventListener("change", followSystem);
  };
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
