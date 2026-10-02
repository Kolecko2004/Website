import { useEffect, useState } from "react";

// Světlý / tmavý režim. Počáteční stav nastavuje public/theme-init.js (před vykreslením),
// tady se jen čte a přepíná. Volba se ukládá do localStorage.
const STORAGE_KEY = "theme";

const systemPrefersDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

function savedTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}

export default function useTheme() {
  const [theme, setThemeState] = useState(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  // Bez vlastní volby se režim mění spolu se systémem
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (savedTheme()) return;
      const next = systemPrefersDark() ? "dark" : "light";
      applyTheme(next);
      setThemeState(next);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setTheme = (next) => {
    applyTheme(next);
    setThemeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // bez localStorage platí volba jen do zavření stránky
    }
  };

  return [theme, setTheme];
}
