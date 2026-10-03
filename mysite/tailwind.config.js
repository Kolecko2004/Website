/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  // Tmavý režim přes třídu „dark“ na <html> (přepínač v navigaci)
  darkMode: "class",
  theme: {
    extend: {
      // Hodnoty jsou CSS proměnné v src/index.css (světlý / tmavý režim)
      colors: {
        surface: "var(--bg)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        accent: "var(--accent)",
        "accent-ink": "var(--accent-ink)",
      },
      boxShadow: {
        neu: "10px 10px 24px var(--lo), -10px -10px 24px var(--hi)",
        "neu-sm": "6px 6px 12px var(--lo), -6px -6px 12px var(--hi)",
        "neu-in": "inset 5px 5px 10px var(--lo), inset -5px -5px 10px var(--hi)",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans Variable"', "system-ui", "sans-serif"],
      },
    },
  },
};
