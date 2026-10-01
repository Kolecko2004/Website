// Seznam upravitelných textů pro administraci – rozdělení do sekcí a čitelné popisky.
// Když přibude nový text v locales, objeví se tu automaticky (v sekci podle klíče,
// jinak v „Ostatní“). Popisky níž jsou jen pro přehlednost.

import { DEFAULT_TEXTS, editableEntries } from "../data/content";

// Sekce = samostatné stránky administrace (/admin/<slug>), texty podle prvního klíče v cestě
export const SECTIONS = [
  { id: "common", slug: "navigace", label: "Navigace a patička", keys: ["nav", "footer"] },
  {
    id: "home",
    slug: "domu",
    label: "Domovská stránka",
    keys: ["heroTitle", "heroBadge", "heroDescription", "explore", "projects", "experience", "hobbies"],
  },
  { id: "projects", slug: "projekty", label: "Projekty – přehled", keys: ["projectsPage"] },
  { id: "projectDetails", slug: "projekty-detail", label: "Projekty – detail", keys: ["projectDetailUI", "projectDetails", "portfolio"] },
  { id: "experience", slug: "zkusenosti", label: "Zkušenosti", keys: ["experiencePage"] },
  { id: "hobbies", slug: "zajmy", label: "Zájmy", keys: ["hobbiesPage"] },
  { id: "notFound", slug: "stranka-404", label: "Stránka 404", keys: ["notFoundPage"] },
  { id: "other", slug: "ostatni", label: "Ostatní", keys: [] },
];

// Klíče, které jen obalují celou stránku – v popisku se vynechají (sekce už to říká)
const PAGE_KEYS = new Set(["experiencePage", "projectsPage", "hobbiesPage", "notFoundPage", "projectDetails"]);

// Popisky podle celé cesty (mají přednost)
const PATH_LABELS = {
  "nav.home": "Odkaz „Domů“",
  "nav.projects": "Odkaz „Projekty“",
  "nav.experience": "Odkaz „Zkušenosti“",
  "nav.hobbies": "Odkaz „Zájmy“",
  "nav.email": "Popisek tlačítka e-mailu",
  "nav.openMenu": "Popisek tlačítka menu (mobil) – otevřít",
  "nav.closeMenu": "Popisek tlačítka menu (mobil) – zavřít",
  nav: "Navigace",
  footer: "Patička",
  "footer.socials": "Nadpis „Sítě“",
  "footer.contact": "Nadpis „Kontakt“",
  "footer.emailMe": "Odkaz na e-mail",
  "footer.instagram": "Odkaz Instagram",
  "footer.github": "Odkaz GitHub",
  "footer.linkedin": "Odkaz LinkedIn",
  "footer.copyright": "Jméno za ©",
  "footer.builtWith": "Řádek „Vytvořeno pomocí…“",
  "footer.lastUpdated": "Text „Naposledy aktualizováno“",
  heroTitle: "Hlavní nadpis (jméno)",
  heroBadge: "Štítek nad nadpisem",
  heroDescription: "Úvodní text",
  explore: "Tlačítko na kartách („Prozkoumat …“)",
  projects: "Karta „Projekty“",
  experience: "Karta „Zkušenosti“",
  hobbies: "Karta „Zájmy“",
  projectDetailUI: "Společné texty detailu",
  portfolio: "Okno s výnosností portfolia",
};

// Popisky podle názvu klíče
const KEY_LABELS = {
  title: "Nadpis",
  description: "Popis",
  content: "Text",
  subtitle: "Podtitul",
  year: "Období",
  badge: "Štítek nad nadpisem",
  heroTitle: "Hlavní nadpis",
  heroDescription: "Úvodní text",
  workTitle: "Nadpis „Pracovní zkušenosti“",
  educationTitle: "Nadpis „Vzdělání“",
  viewProject: "Tlačítko na kartách",
  buttonText: "Text tlačítka",
  education: "Vzdělání",
  jobs: "Práce",
  categories: "Karty projektů",
  items: "Karty zájmů",
  sections: null, // vynechat – položky už mají „1. sekce …“
  notFound: "Text „Projekt nenalezen“",
  backButton: "Tlačítko zpět",
  contactFallback: "Záložní text tlačítka kontaktu",
  homeButton: "Tlačítko na úvod",
  projectsButton: "Tlačítko na projekty",
  periods: "Názvy období",
  threeMonths: "Poslední 3 měsíce",
  ytd: "Od začátku roku",
  oneYear: "Poslední rok",
  since: "Text „od {datum}“",
  updated: "Text „Aktualizováno {datum}“",
  note: "Poznámka pod čísly",
  unavailable: "Text, když data nejsou k dispozici",
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
  if (text.includes("{{")) hints.push("Ponech v textu {{…}} – doplní se automaticky");
  if (text.includes("\n")) hints.push("Prázdný řádek = nový odstavec");
  return hints.join(" · ");
}

// Všechna pole: { path, section, group, label, hint, defaults: { cs, en } }
export const FIELDS = editableEntries(DEFAULT_TEXTS.cs).map(({ path, value }) => {
  const keys = path.split(".");
  const groupStart = PAGE_KEYS.has(keys[0]) ? 1 : 0;
  const labels = keys.map((_, index) => segmentLabel(keys, index));
  const groupLabels = labels.slice(groupStart, -1).filter(Boolean);
  const enDefault = editableEntries(DEFAULT_TEXTS.en).find((entry) => entry.path === path)?.value ?? "";

  return {
    path,
    section: sectionFor(keys[0]).id,
    group: groupLabels.join(" › ") || "Hlavní texty",
    label: labels[labels.length - 1],
    hint: hintFor(value + enDefault),
    defaults: { cs: value, en: enDefault },
  };
});
