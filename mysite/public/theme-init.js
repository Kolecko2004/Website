// Nastaví světlý / tmavý režim ještě před vykreslením stránky (bez probliknutí).
// Výchozí je světlý režim; tmavý jen po přepnutí (volba se pamatuje v localStorage).
(function () {
  try {
    var dark = localStorage.getItem("theme") === "dark";
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch {
    // bez localStorage zůstane světlý režim
  }
})();
