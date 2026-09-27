// Texty webu – čeština (CS)
// Struktura je stejná jako v ostatních jazycích; klíče musí sedět.

import { CONTACT_EMAIL } from "./shared";

const cs = {
  // ============================================================
  // SPOLEČNÉ – navigace a patička (na všech stránkách)
  // ============================================================
  nav: {
    home: "Domů",
    projects: "Projekty",
    experience: "Zkušenosti",
    hobbies: "Zájmy",
    email: "Napsat e-mail",
    openMenu: "Otevřít menu",
    closeMenu: "Zavřít menu",
  },
  footer: {
    socials: "Sítě",
    contact: "Kontakt",
    emailMe: "Napište mi",
    builtWith: "Vytvořeno pomocí Reactu, Tailwindu a Lucide.",
    lastUpdated: "Naposledy aktualizováno",
  },

  // ============================================================
  // HOME PAGE – hero
  // ============================================================
  heroBadge: "Softwarový vývojář",
  heroDescription:
    "Tvořím funkční webové aplikace v Reactu a Tailwindu. Zaměřuji se na čistý kód a jednoduchá uživatelská rozhraní.",
  explore: "Prozkoumat",

  // ============================================================
  // HOME PAGE – rozcestník (karty sekcí)
  // ============================================================
  projects: {
    title: "Projekty",
    description:
      "Tady můžete vidět všechny moje projekty nebo věci, na kterých pracuji ve svém volném čase.",
  },
  experience: {
    title: "Zkušenosti",
    description:
      "Zde můžete vidět moji dosavadní profesní a studentskou cestu.",
  },
  hobbies: {
    title: "Zájmy",
    description:
      "Zde můžete vidět, jakým způsobem odpočívám, bavím se nebo trávím svůj volný čas.",
  },

  // ============================================================
  // STRÁNKA: Zkušenosti (/experience)
  // ============================================================
  experiencePage: {
    badge: "zkušenosti",
    heroTitle: "Moje dosavadní <br /> cesta",
    heroDescription:
      "Zde najdete přehled mé dosavadní pracovní praxe a absolvovaného vzdělání.",
    workTitle: "Pracovní zkušenosti",
    educationTitle: "Vzdělání",

    // --- Vzdělání (od nejnovějšího) ---
    education: [
      {
        year: "2024 — Dosud",
        title: "Fakulta elektrotechnická ČVUT v Praze",
        subtitle: "Bakalářské studium - Informatika",
        description:
          "Studijní program: Otevřená informatika. Specializace: Počítačové hry a grafika. Zaměřeno na softwarové inženýrství, algoritmy a vývoj aplikací.",
      },
      {
        year: "2020 — 2024",
        title: "Střední průmyslová škola strojnická",
        subtitle: "Informační technologie",
        description:
          "Základy programování (především C#), počítačové sítě, hardware, 3D modelování a základy počítačem integrované výroby.",
      },
      {
        year: "2011 — 2020",
        title: "Základní škola",
        subtitle: "ZŠ Červený vrch",
        description: "Základní vzdělání v Praze.",
      },
    ],

    // --- Práce (od nejnovější) ---
    jobs: [
      {
        year: "2024 — Dosud",
        title: "Bezpečnostní a recepční služby",
        subtitle: "Cvičení / Brigáda",
        description:
          "Odpovědnost za dohled nad objektem a administrativní úkony. Role poskytuje stabilní prostředí s možností skloubení práce se studiem na vysoké škole.",
      },
      {
        year: "2023 — 2024",
        title: "Frontend Developer",
        subtitle: "Numoteq",
        description:
          "Modernizace starších webových aplikací přechodem na React a Tailwind CSS. Optimalizace výkonu a zrychlení načítání stránek o 40 %.",
      },
      {
        year: "Květen 2022 (2 týdny)",
        title: "Stážista IT podpory",
        subtitle: "Eaton",
        description:
          "Odborná školní praxe zaměřená na firemní IT infrastrukturu. Poskytování technické podpory zaměstnancům a údržba hardwaru.",
      },
      {
        year: "Červenec 2021 — Duben 2023",
        title: "Člen týmu / Pokladní / Guest Experience Leader",
        subtitle: "McDonald's",
        description:
          "Postup z řadového člena týmu na pozici Guest Experience Leader díky vysokému pracovnímu nasazení. Denní komunikace s mezinárodními zákazníky v angličtině na frekventované pobočce v centru města.",
      },
    ],
  },

  // ============================================================
  // STRÁNKA: Zájmy (/hobbies)
  // ============================================================
  hobbiesPage: {
    badge: "Zájmy",
    heroTitle: "Volný čas",
    heroDescription:
      "Zde najdete, čemu se rád věnuji, když zrovna nestuduji nebo nepracuji.",

    // --- Karty zájmů (id musí odpovídat ikoně v Hobbies.jsx) ---
    items: [
      {
        id: "gym",
        title: "Posilovna",
        description:
          "Pravidelné cvičení mi pomáhá vyčistit hlavu a udržet se v kondici.",
      },
      {
        id: "formula1",
        title: "Formule 1",
        description:
          "Sleduji závody, strategii týmů i technologie, které stojí za monoposty.",
      },
      {
        id: "3d-printing",
        title: "3D Tisk",
        description:
          "Navrhuji a tisknu praktické díly a drobné vychytávky pro domov i pro zábavu.",
      },
      {
        id: "friends",
        title: "Čas s přáteli",
        description:
          "Čas strávený s přáteli je pro mě nejlepší způsob, jak si odpočinout a nabít baterky.",
      },
      {
        id: "plants",
        title: "Rostliny",
        description: "Baví mě starat se o své rostliny a sledovat, jak rostou.",
      },
      {
        id: "cats",
        title: "Kočky",
        description: "Kočky jsou prostě ta nejlepší společnost doma.",
      },
      {
        id: "investing",
        title: "Investování",
        description:
          "Spravuji své vlastní portfolio a baví mě sledovat dění na trzích a v ekonomice.",
      },
      {
        id: "movies",
        title: "Filmy a seriály",
        description:
          "Po dlouhém dni si rád odpočinu u dobrého filmu nebo nového seriálu.",
      },
    ],
  },

  // ============================================================
  // STRÁNKA: Projekty – přehled (/projects)
  // ============================================================
  projectsPage: {
    badge: "Projekty",
    heroTitle: "Moje osobní <br /> projekty",
    heroDescription:
      "Zde najdete to, na čem pracuji ve svém volném čase, nebo co mě baví.",
    viewProject: "Podívat se",

    // --- Karty projektů (slug musí odpovídat klíči v projectDetails) ---
    categories: [
      {
        slug: "web-production",
        title: "Vývoj webů",
        description:
          "Tvorba webových stránek v Reactu a Tailwindu, kterou dělám primárně pro radost a osobní rozvoj.",
      },
      {
        slug: "investing",
        title: "Investování & Finance",
        description:
          "Analýza finančních trhů, správa osobního portfolia a investiční strategie.",
      },
      {
        slug: "3d-modeling",
        title: "3D Modelování",
        description:
          "Tvorba funkčních a estetických CAD modelů, od technických návrhů až po přípravu pro 3D tisk.",
      },
      {
        slug: "3d-printing",
        title: "3D Tisk",
        description:
          "Můj koníček, díky kterému převádím digitální nápady do reálných předmětů, primárně pro osobní účely a zábavu.",
      },
    ],
  },

  // ============================================================
  // STRÁNKA: Detail projektu – společné texty UI
  // ============================================================
  projectDetailUI: {
    notFound: "Projekt nenalezen.",
    backButton: "Zpět na projekty",
    contactFallback: "Napsat",
  },

  // ============================================================
  // STRÁNKA: Detail projektu – obsah jednotlivých projektů
  // (klíč = slug z projectsPage.categories)
  // ============================================================
  projectDetails: {
    // ---------- web-production ----------
    "web-production": {
      title: "Vývoj webů",
      badge: "Development",
      description:
        "Tvorba webových stránek v Reactu a Tailwindu, kterou dělám primárně pro radost a osobní rozvoj.",
      sections: [
        {
          type: "text",
          title: "O mém webovém vývoji",
          content:
            "Programovat webové stránky pomocí moderních technologií jako React a Tailwind CSS jsem se naučil především díky své praxi ve firmě numoteq.\n\nDnes se webovému vývoji věnuji hlavně jako zábavě a skvělému způsobu, jak si neustále rozšiřovat své individuální schopnosti.\n\nA pokud vás zajímá, jak takový web z mé dílny vypadá v praxi, nemusíte chodit daleko – tou nejlepší vizitkou je přímo tato stránka, kterou si právě prohlížíte.",
        },
        {
          type: "contact",
          title: "Napište mi",
          description:
            "Máš otázku k webům nebo chceš na něčem spolupracovat? Ozvi se mi.",
          buttonText: "Napsat e-mail",
          email: CONTACT_EMAIL,
        },
      ],
    },

    // ---------- investing ----------
    investing: {
      title: "Investování a finance",
      badge: "Finance",
      description:
        "Analýza finančních trhů, správa osobního portfolia a investiční strategie.",
      sections: [
        {
          type: "text",
          title: "Můj přístup k investování",
          content:
            "K budování svého osobního portfolia přistupuji analyticky. Zaměřuji se na dlouhodobý růst, analýzu tržních trendů a efektivní řízení rizik.\n\nBaví mě propojovat práci s daty a analytické myšlení s reálnou ekonomikou.",
        },
        {
          type: "contact",
          title: "Napište mi",
          description:
            "Zajímají tě finance nebo chceš probrat investiční strategie? Ozvi se mi.",
          buttonText: "Napsat e-mail",
          email: CONTACT_EMAIL,
        },
      ],
    },

    // ---------- 3d-modeling ----------
    "3d-modeling": {
      title: "3D Modelování",
      badge: "Design",
      description:
        "Tvorba funkčních a estetických CAD modelů, od technických návrhů až po přípravu pro 3D tisk.",
      sections: [
        {
          type: "text",
          title: "Moje cesta k 3D modelování",
          content:
            "Základy 3D modelování a technického kreslení jsem získal už na střední škole. Učili jsme se převádět technické návrhy do reálných 3D modelů pomocí softwaru (AutoCAD, Inventor, Solid Edge).\n\nZa pomyslný vrchol svých dosavadních CAD schopností považuji praktickou maturitní zkoušku z 3D modelování. Naším úkolem bylo podle dodané dokumentace vymodelovat kompletní parní stroj – od konstrukce jednotlivých menších součástek až po jejich finální složení do jedné velké funkční sestavy.\n\nAčkoliv na vysoké škole nemám tolik příležitostí tento obor přímo studijně rozvíjet, díky 3D tisku s ním zůstávám v pravidelném kontaktu. Navrhování vlastních funkčních dílů nebo jen modelování pro zábavu je pro mě skvělý způsob, jak si tyto dovednosti udržet a dále je posouvat, zejména s ohledem na 3D tisknutelnost a software jako Fusion 360.",
        },
        {
          type: "image-grid",
          title: "Ukázky práce",
          description: "Návrhy a finální rendery mechanické sestavy.",
        },
        {
          type: "contact",
          title: "Napište mi",
          description:
            "Zaujala tě moje práce nebo potřebuješ něco vymodelovat? Ozvi se mi.",
          buttonText: "Napsat e-mail",
          email: CONTACT_EMAIL,
        },
      ],
    },

    // ---------- 3d-printing ----------
    "3d-printing": {
      title: "3D Tisk",
      badge: "Hardware",
      description:
        "Můj nový koníček, díky kterému převádím digitální nápady do reálných předmětů, primárně pro osobní účely a zábavu.",
      sections: [
        {
          type: "text",
          title: "Moje cesta k 3D tisku",
          content:
            "3D tisk je mým poměrně novým koníčkem, který mě ale okamžitě naplno chytnul. Nedávno jsem si pořídil vlastní 3D tiskárnu a otevřely se mi tak úplně nové možnosti, jak zhmotnit své nápady.\n\nTiskárnu využívám hlavně pro osobní účely a pro zábavu. Ať už jde o tisk různých praktických organizérů, náhradních dílů, nebo jen drobných vychytávek pro radost, hrozně mě baví sledovat, jak mi fyzický výrobek roste doslova před očima.\n\nCelé se to navíc neuvěřitelně skvěle doplňuje s mými zkušenostmi s CAD softwarem. Když mi doma něco chybí nebo potřebuji specifickou součástku, prostě si ji sám navrhnu, připravím ve sliceru a rovnou vytisknu přesně podle svých představ.",
        },
        {
          type: "contact",
          title: "Napište mi",
          description:
            "Zajímá tě 3D tisk nebo bys chtěl poradit či něco probrat? Napiš mi.",
          buttonText: "Napsat e-mail",
          email: CONTACT_EMAIL,
        },
      ],
    },
  },
};

export default cs;
