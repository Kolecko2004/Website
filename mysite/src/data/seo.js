// SEO – titulky a popisy stránek pro Google a záložku prohlížeče.
// Texty se berou z locales, takže se nic nepíše dvakrát.
// Používá se na dvou místech:
//   - vite.config.js: při buildu vytvoří HTML pro každou stránku + sitemap.xml
//   - usePageMeta.js: za běhu mění titulek podle stránky a jazyka

import en from "./locales/en.js";
import { SOCIALS } from "./locales/shared.js";

export const SITE_NAME = "Vojtěch Drozd";

// Hlavní adresa webu (sitemap, canonical odkazy, strukturovaná data)
export const SITE_URL = "https://vojtechdrozd.com";

// Všechny stránky webu (pro sitemap a předgenerované HTML); projekty podle locales → projectDetails
export const ROUTES = [
  "/",
  "/projects",
  "/experience",
  "/hobbies",
  ...Object.keys(en.projectDetails).map((slug) => `/projects/${slug}`),
];

const stripHtml = (text) => text.replace(/<br\s*\/?>/g, " ").replace(/\s+/g, " ").trim();

// Titulek a popis stránky z textů daného jazyka (t = objekt z locales/en.js nebo cs.js).
// Domovská stránka vrací null → použije se <title> a description přímo z index.html.
export function pageMeta(path, t) {
  const withName = (title) => `${title} – ${SITE_NAME}`;

  if (path === "/") return null;

  const project = path.match(/^\/projects\/(.+)$/);
  if (project) {
    const detail = t.projectDetails[project[1]];
    if (detail) return { title: withName(detail.title), description: detail.description };
  }

  const pages = {
    "/projects": { title: t.nav.projects, description: t.projectsPage.heroDescription },
    "/experience": { title: t.nav.experience, description: t.experiencePage.heroDescription },
    "/hobbies": { title: t.nav.hobbies, description: t.hobbiesPage.heroDescription },
  };
  const page = pages[path];
  if (page) return { title: withName(page.title), description: stripHtml(page.description) };

  // Neznámá adresa → stránka 404
  return { title: withName(t.notFoundPage.title), description: stripHtml(t.notFoundPage.description) };
}

// Strukturovaná data pro Google (schema.org) – kdo je autor webu
export function personJsonLd(siteUrl) {
  // Varianty jména, pod kterými lidé hledají
  const alternateName = ["Vojtech Drozd", "Drozd Vojtěch", "Drozd Vojtech"];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: SITE_NAME,
        alternateName,
        url: `${siteUrl}/`,
        image: `${siteUrl}/icon-512.png`,
        jobTitle: "Web Developer",
        sameAs: [SOCIALS.github, SOCIALS.instagram],
        alumniOf: { "@type": "CollegeOrUniversity", name: "Czech Technical University in Prague" },
        address: { "@type": "PostalAddress", addressLocality: "Prague", addressCountry: "CZ" },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: SITE_NAME,
        alternateName,
        author: { "@id": `${siteUrl}/#person` },
        inLanguage: ["en", "cs"],
      },
    ],
  };
}
