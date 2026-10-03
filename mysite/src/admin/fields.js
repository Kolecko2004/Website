// Seznam upravitelných textů pro administraci – rozdělení do sekcí a čitelné popisky.
// Když přibude nový upravitelný text (viz EDITABLE_PATTERNS v content.js), objeví se tu
// automaticky (v sekci podle klíče, jinak v „Ostatní“). Popisky níž jsou jen pro přehlednost.

import { DEFAULT_TEXTS, editableEntries, getPath } from "../data/content";

// Sekce = samostatné stránky administrace (/admin/<slug>), texty podle prvního klíče v cestě
export const SECTIONS = [
  {
    id: "home",
    slug: "domu",
    label: "Domovská stránka",
    keys: ["heroTitle", "heroBadge", "heroDescription", "heroChips", "projects", "experience", "hobbies"],
  },
  { id: "projects", slug: "projekty", label: "Projekty – přehled", keys: ["projectsPage"] },
  { id: "projectDetails", slug: "projekty-detail", label: "Projekty – detail", keys: ["projectDetails"] },
  { id: "experience", slug: "zkusenosti", label: "Zkušenosti", keys: ["experiencePage"] },
  { id: "hobbies", slug: "zajmy", label: "Zájmy", keys: ["hobbiesPage"] },
  { id: "other", slug: "ostatni", label: "Ostatní", keys: [] },
];

// Klíče, které jen obalují celou stránku – v popisku se vynechají (sekce už to říká)
const PAGE_KEYS = new Set(["experiencePage", "projectsPage", "hobbiesPage", "projectDetails"]);

// Popisky podle celé cesty (mají přednost)
const PATH_LABELS = {
  heroBadge: "Štítek nad nadpisem",
  heroDescription: "Úvodní text",
  heroChips: "Kruh s monogramem",
  "heroChips.role": "Text pod monogramem",
  "heroChips.study": "Štítek – škola",
  "heroChips.city": "Štítek – město",
  projects: "Karta „Projekty“",
  experience: "Karta „Zkušenosti“",
  hobbies: "Karta „Zájmy“",
};

// Popisky podle názvu klíče
const KEY_LABELS = {
  title: "Nadpis",
  description: "Popis",
  content: "Text",
  subtitle: "Podtitul",
  year: "Období",
  heroTitle: "Hlavní nadpis",
  badge: "Štítek nad nadpisem",
  heroDescription: "Úvodní text",
  education: "Vzdělání",
  jobs: "Práce",
  categories: "Karty projektů",
  items: "Karty zájmů",
  sections: null, // vynechat – položky už mají „1. sekce …“
};

const sectionFor = (topKey) =>
  SECTIONS.find((section) => section.keys.includes(topKey)) || SECTIONS[SECTIONS.length - 1];

// Popisek jednoho článku cesty (cs = české výchozí texty, aby názvy položek byly česky)
function segmentLabel(keys, index) {
  const pathSoFar = keys.slice(0, index + 1).join(".");
  if (PATH_LABELS[pathSoFar]) return PATH_LABELS[pathSoFar];

  const key = keys[index];
  const parent = keys.slice(0, index).reduce((node, k) => node?.[k], DEFAULT_TEXTS.cs);

  // Položka seznamu → podle jejího názvu
  if (Array.isArray(parent)) {
    const item = parent[key];
    const name = item?.title || item?.id || "";
    return keys[index - 1] === "sections"
      ? `${Number(key) + 1}. sekce${name ? ` – ${name}` : ""}`
      : name || `Položka ${Number(key) + 1}`;
  }

  // Projekt v detailu → podle jeho názvu
  if (keys[index - 1] === "projectDetails") return parent?.[key]?.title || key;

  return key in KEY_LABELS ? KEY_LABELS[key] : key;
}

function hintFor(text) {
  const hints = [];
  if (text.includes("<br />")) hints.push("„<br />“ = zalomení řádku");
  if (text.includes("\n")) hints.push("Prázdný řádek = nový odstavec");
  return hints.join(" · ");
}

// Všechna pole: { path, section, group, label, hint, defaults: { cs, en } }
export const FIELDS = editableEntries(DEFAULT_TEXTS.cs).map(({ path, value }) => {
  const keys = path.split(".");
  const groupStart = PAGE_KEYS.has(keys[0]) ? 1 : 0;
  const labels = keys.map((_, index) => segmentLabel(keys, index));
  const groupLabels = labels.slice(groupStart, -1).filter(Boolean);
  const enDefault = getPath(DEFAULT_TEXTS.en, path) ?? "";

  return {
    path,
    section: sectionFor(keys[0]).id,
    group: groupLabels.join(" › ") || "Hlavní texty",
    label: labels[labels.length - 1],
    hint: hintFor(value + enDefault),
    defaults: { cs: value, en: enDefault },
  };
});
