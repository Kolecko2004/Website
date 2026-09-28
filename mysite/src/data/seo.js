// SEO – titulky a popisy stránek pro Google a záložku prohlížeče.
// Texty se berou z locales, takže se nic nepíše dvakrát.
// Používá se na dvou místech:
//   - vite.config.js: při buildu vytvoří HTML pro každou stránku + sitemap.xml
//   - usePageMeta.js: za běhu mění titulek podle stránky a jazyka

export const SITE_NAME = "Vojtěch Drozd";

// Hlavní adresa webu (sitemap, canonical odkazy, strukturovaná data)
export const SITE_URL = "https://vojtechdrozd.com";

export const PERSON = {
  name: "Vojtěch Drozd",
  // Varianty jména, pod kterými lidé hledají
  alternateName: ["Vojtech Drozd", "Drozd Vojtěch", "Drozd Vojtech"],
  jobTitle: "Web Developer",
  sameAs: [
    "https://github.com/Kolecko2004",
    "https://www.instagram.com/drozd_vojtech",
  ],
  alumniOf: "Czech Technical University in Prague",
  address: "Prague, Czech Republic",
};

// Všechny stránky webu (pro sitemap a předgenerované HTML)
export const PROJECT_SLUGS = ["web-production", "investing", "3d-modeling", "3d-printing"];

export const ROUTES = [
  "/",
  "/projects",
  "/experience",
  "/hobbies",
  ...PROJECT_SLUGS.map((slug) => `/projects/${slug}`),
];

const stripHtml = (text) => text.replace(/<br\s*\/?>/g, " ").replace(/\s+/g, " ").trim();

// Titulek a popis stránky z textů daného jazyka (t = objekt z locales/en.js nebo cs.js)
export function pageMeta(path, t) {
  const withName = (title) => `${title} – ${SITE_NAME}`;

  if (path === "/") {
    return {
      title: `${SITE_NAME} – ${t.heroBadge}`,
      description: `${SITE_NAME}: ${t.heroDescription}`,
    };
  }

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

  return { title: SITE_NAME, description: stripHtml(t.heroDescription) };
}

// Strukturovaná data pro Google (schema.org) – kdo je autor webu
export function personJsonLd(siteUrl) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: PERSON.name,
        alternateName: PERSON.alternateName,
        url: `${siteUrl}/`,
        jobTitle: PERSON.jobTitle,
        sameAs: PERSON.sameAs,
        alumniOf: { "@type": "CollegeOrUniversity", name: PERSON.alumniOf },
        address: { "@type": "PostalAddress", addressLocality: "Prague", addressCountry: "CZ" },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: SITE_NAME,
        alternateName: PERSON.alternateName,
        author: { "@id": `${siteUrl}/#person` },
        inLanguage: ["en", "cs"],
      },
    ],
  };
}
