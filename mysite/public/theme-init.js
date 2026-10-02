// Nastaví světlý / tmavý režim ještě před vykreslením stránky (bez probliknutí).
// Uložená volba z přepínače má přednost, jinak se řídí nastavením systému.
(function () {
  try {
    var saved = localStorage.getItem("theme");
    var dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch {
    // bez localStorage zůstane světlý režim
  }
})();
