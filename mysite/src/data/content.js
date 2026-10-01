// Upravitelné texty webu – společná logika pro web, administraci i server.
//
// Výchozí texty jsou v locales/en.js a cs.js. Změny z administrace se ukládají
// jako „přepisy“ ve tvaru { en: { "cesta.k.textu": "nový text" }, cs: { … } }
// a za běhu se přes výchozí texty přeloží.

import en from "./locales/en.js";
import cs from "./locales/cs.js";

export const LANGUAGES = ["cs", "en"];
export const DEFAULT_TEXTS = { en, cs };

// Které texty jde v administraci měnit – jen obsah (nadpisy, popisy, projekty,
// zkušenosti, zájmy). Tlačítka, navigace, patička, popisky a chybové stránky
// zůstávají jen v kódu. „*“ = libovolná položka (index v seznamu, slug projektu).
// Nový text přidaný do locales se v administraci objeví, jen když odpovídá vzoru.
const EDITABLE_PATTERNS = [
  // Domovská stránka
  "heroBadge",
  "heroDescription",
  "projects.description",
  "experience.description",
  "hobbies.description",

  // Projekty – přehled
  "projectsPage.heroTitle",
  "projectsPage.heroDescription",
  "projectsPage.categories.*.title",
  "projectsPage.categories.*.description",

  // Projekty – detail (bez textů tlačítek)
  "projectDetails.*.title",
  "projectDetails.*.description",
  "projectDetails.*.sections.*.title",
  "projectDetails.*.sections.*.content",
  "projectDetails.*.sections.*.description",

  // Zkušenosti
  "experiencePage.heroTitle",
  "experiencePage.heroDescription",
  "experiencePage.education.*.year",
  "experiencePage.education.*.title",
  "experiencePage.education.*.subtitle",
  "experiencePage.education.*.description",
  "experiencePage.jobs.*.year",
  "experiencePage.jobs.*.title",
  "experiencePage.jobs.*.subtitle",
  "experiencePage.jobs.*.description",

  // Zájmy
  "hobbiesPage.heroTitle",
  "hobbiesPage.heroDescription",
  "hobbiesPage.items.*.title",
  "hobbiesPage.items.*.description",
];

const PATTERN_REGEXES = EDITABLE_PATTERNS.map(
  (pattern) => new RegExp(`^${pattern.replace(/\./g, "\\.").replace(/\*/g, "[^.]+")}$`),
);
const isEditablePath = (path) => PATTERN_REGEXES.some((regex) => regex.test(path));

// Všechny texty: [{ path: "experiencePage.jobs.0.title", value: "…" }]
function allTextEntries(node, path = []) {
  if (typeof node === "string") return [{ path: path.join("."), value: node }];
  if (!node || typeof node !== "object") return [];
  return Object.entries(node).flatMap(([key, value]) => allTextEntries(value, [...path, key]));
}

// Upravitelné texty (podle EDITABLE_PATTERNS)
export const editableEntries = (node) => allTextEntries(node).filter((entry) => isEditablePath(entry.path));

// Seznam povolených cest (stejný pro oba jazyky)
export const EDITABLE_PATHS = new Set(editableEntries(en).map((entry) => entry.path));

// Jen přepisy povolených textů (např. když se seznam povolených zúží)
export function onlyEditable(overrides = {}) {
  return Object.fromEntries(
    LANGUAGES.map((lang) => [
      lang,
      Object.fromEntries(Object.entries(overrides[lang] || {}).filter(([path]) => EDITABLE_PATHS.has(path))),
    ]),
  );
}

export function getPath(node, path) {
  return path.split(".").reduce((value, key) => value?.[key], node);
}

// Výchozí texty + přepisy (vrací novou kopii, výchozí texty zůstanou beze změny)
export function applyOverrides(defaults, overrides = {}) {
  const result = structuredClone(defaults);
  for (const [path, value] of Object.entries(overrides)) {
    if (!EDITABLE_PATHS.has(path) || typeof value !== "string") continue;
    const keys = path.split(".");
    const last = keys.pop();
    const parent = keys.reduce((node, key) => node?.[key], result);
    if (parent && typeof parent[last] === "string") parent[last] = value;
  }
  return result;
}

// Kontrola přepisů před uložením (server). Vrací vyčištěné přepisy nebo vyhodí chybu.
export const MAX_TEXT_LENGTH = 5000;

export function sanitizeOverrides(input) {
  if (!input || typeof input !== "object") throw new Error("Neplatná data");
  const clean = {};

  for (const lang of LANGUAGES) {
    const entries = input[lang] || {};
    if (typeof entries !== "object") throw new Error(`Neplatná data pro jazyk ${lang}`);
    clean[lang] = {};

    for (const [path, value] of Object.entries(entries)) {
      if (!EDITABLE_PATHS.has(path)) throw new Error(`Neznámý text: ${path}`);
      if (typeof value !== "string") throw new Error(`Text ${path} musí být řetězec`);
      if (value.length > MAX_TEXT_LENGTH) throw new Error(`Text ${path} je příliš dlouhý`);
      // Ukládají se jen skutečné změny oproti výchozímu textu
      if (value !== getPath(DEFAULT_TEXTS[lang], path)) clean[lang][path] = value;
    }
  }

  return clean;
}
