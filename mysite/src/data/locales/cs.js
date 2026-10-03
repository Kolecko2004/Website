// Texty webu – čeština (CS)
// Struktura je stejná jako v ostatních jazycích; klíče musí sedět.

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
    theme: "Barevný režim",
    lightMode: "Světlý režim",
    darkMode: "Tmavý režim",
    language: "Jazyk",
  },
  footer: {
    socials: "Sociální Sítě",
    contact: "Kontakt",
    emailMe: "Napište mi",
    builtWith: "Webový vývojář a student z Prahy. Tenhle web jsem si sám navrhl i postavil.",
    copyright: "Vojtěch Drozd",
    instagram: "Instagram",
    github: "GitHub",
    linkedin: "LinkedIn",
    lastUpdated: "Naposledy aktualizováno",
  },

  // ============================================================
  // HOME PAGE – hero
  // ============================================================
  heroTitle: "Vojtěch <br /> Drozd",
  heroBadge: "Student & vývojář",
  heroDescription:
    "Studuji třetí ročník Otevřené informatiky na ČVUT FEL a stavím moderní weby v Reactu. Začínal jsem na frontendu, dnes se učím i backend. Potřebujete web? Rád vám ho postavím.",
  explore: "Prozkoumat",
  // Štítky kolem monogramu v úvodu domovské stránky
  heroChips: {
    role: "Webový vývojář",
    study: "ČVUT FEL · Otevřená informatika",
    city: "Praha",
  },

  // ============================================================
  // HOME PAGE – rozcestník (karty sekcí)
  // ============================================================
  projects: {
    title: "Projekty",
    description:
      "Weby na míru, 3D modelování a tisk i investování – co dělám a s čím vám můžu pomoct.",
  },
  experience: {
    title: "Zkušenosti",
    description:
      "Od McDonald's přes frontend v Numoteq až po ČVUT – kde jsem pracoval a co jsem vystudoval.",
  },
  hobbies: {
    title: "Zájmy",
    description:
      "Posilovna, Formule 1, dobré filmy a kamarádi – u toho si odpočinu.",
  },

  // ============================================================
  // STRÁNKA: Zkušenosti (/experience)
  // ============================================================
  experiencePage: {
    badge: "zkušenosti",
    heroTitle: "Moje dosavadní <br /> cesta",
    heroDescription:
      "Práce a škola, které mě dovedly tam, kde jsem dnes.",
    workTitle: "Pracovní zkušenosti",
    educationTitle: "Vzdělání",

    // --- Vzdělání (od nejnovějšího) ---
    education: [
      {
        year: "2024 — dosud",
        title: "Fakulta elektrotechnická ČVUT v Praze",
        subtitle: "Bakalářské studium · Otevřená informatika",
        description:
          "Specializace Počítačové hry a grafika – programování grafiky a her, algoritmy a softwarové inženýrství.",
      },
      {
        year: "2020 — 2024",
        title: "SPŠS Betlémská, Praha",
        subtitle: "Informační technologie · maturita s vyznamenáním",
        description:
          "Obor informačních technologií na strojní průmyslovce: programování (hlavně C#), počítačové sítě, hardware a 3D modelování, k tomu základy CNC programování a automatizace.",
      },
    ],

    // --- Práce (od nejnovější) ---
    jobs: [
      {
        year: "2024 — dosud",
        title: "Recepce a ostraha",
        subtitle: "Eaton · Roztoky u Prahy · brigáda",
        description:
          "Starám se o recepci, ostrahu areálu a administrativní úkoly. Práci zvládám vedle denního studia na ČVUT.",
      },
      {
        year: "2023 — 2024",
        title: "Frontend Developer",
        subtitle: "Numoteq",
        description:
          "Z dvoutýdenní stáže se stala dlouhodobá spolupráce. Ve čtyřčlenném týmu jsem podle grafických návrhů stavěl weby a webové aplikace pro menší firmy v Reactu a Tailwind CSS.",
      },
      {
        year: "Květen 2022 (2 týdny)",
        title: "Stážista IT podpory",
        subtitle: "Eaton · školní praxe",
        description:
          "Řešil jsem počítačové problémy kolegů, připravoval zařízení pro nově nastupující zaměstnance a účastnil se porad o firemním IT a chodu firmy.",
      },
      {
        year: "Červenec 2021 — duben 2023",
        title: "Leader péče o hosty",
        subtitle: "McDonald's · centrum Prahy",
        description:
          "Začínal jsem na pokladně, kde si zákazníci hned od začátku chválili můj přístup. Později mě povýšili na leadera péče o hosty – když měl host jakýkoli problém, řešil jsem ho já. Na frekventované pobočce v centru Prahy jsem denně mluvil anglicky.",
      },
    ],
  },

  // ============================================================
  // STRÁNKA: Zájmy (/hobbies)
  // ============================================================
  hobbiesPage: {
    badge: "Zájmy",
    heroTitle: "Když zrovna nekóduji",
    heroDescription:
      "Posilovna, Formule 1, dobré filmy a lidi kolem mě – u toho si odpočinu a načerpám energii.",

    // --- Karty zájmů (id musí odpovídat ikoně v Hobbies.jsx) ---
    items: [
      {
        id: "gym",
        title: "Posilovna",
        description:
          "Chodím tam čtyřikrát až pětkrát týdně. Kromě tréninku je to i místo, kde potkávám kamarády.",
      },
      {
        id: "formula1",
        title: "Formule 1",
        description:
          "Sleduji závody, strategii i techniku za nimi. Fandím hlavně Landu Norrisovi a Maxu Verstappenovi.",
      },
      {
        id: "movies",
        title: "Filmy a seriály",
        description:
          "Po dlouhém dni si rád pustím dobrý film. Srdcovka je True Detective a cokoliv od Denise Villeneuva.",
      },
      {
        id: "friends",
        title: "Kamarádi",
        description:
          "Chodíme ven, jezdíme na výlety a prostě spolu trávíme čas. Nejlepší způsob, jak si odpočinout.",
      },
      {
        id: "cats",
        title: "Kočky",
        description:
          "Jsou prostě nejlepší. Víc k tomu není co dodat.",
      },
      {
        id: "plants",
        title: "Rostliny",
        description:
          "Pěstuji hlavně kaktusy a aloe vera – nenáročné, a přesto mě baví sledovat, jak rostou.",
      },
    ],
  },

  // ============================================================
  // STRÁNKA: Projekty – přehled (/projects)
  // ============================================================
  projectsPage: {
    badge: "Projekty",
    heroTitle: "Na čem <br /> pracuji",
    heroDescription:
      "Weby, 3D modelování, 3D tisk a investování – čemu se věnuji a s čím vám můžu pomoct.",
    viewProject: "Podívat se",

    // --- Karty projektů (slug musí odpovídat klíči v projectDetails) ---
    categories: [
      {
        slug: "web-production",
        title: "Tvorba webů",
        description:
          "Informační weby a osobní vizitky na míru – od návrhu designu po spuštění. Rychlé, moderní a skvěle fungují i na mobilu.",
      },
      {
        slug: "investing",
        title: "Investování a finance",
        description:
          "Dlouhodobé investování: pozice držím 3 a více let a rozhoduji se podle dění na světových trzích.",
      },
      {
        slug: "3d-modeling",
        title: "3D modelování",
        description:
          "Funkční i designové CAD modely – od technického výkresu po díl připravený k 3D tisku.",
      },
      {
        slug: "3d-printing",
        title: "3D tisk",
        description:
          "Na vlastní tiskárně Bambu Lab A1 tisknu praktické díly i věci pro radost – a rád navrhnu a vytisknu něco i pro vás.",
      },
    ],
  },

  // ============================================================
  // Živá výnosnost portfolia (sekce "portfolio" v projectDetails)
  // ============================================================
  portfolio: {
    periods: {
      threeMonths: "Poslední 3 měsíce",
      ytd: "Od začátku roku",
      oneYear: "Poslední rok",
    },
    since: "od {{date}}",
    updated: "Naposledy aktualizováno:",
    nextUpdate: "Další aktualizace za",
    unavailable: "Živá data portfolia teď nejsou k dispozici.",
    syncing: "Načítám historii obchodů z Trading 212 – čísla se brzy objeví.",
  },

  // ============================================================
  // STRÁNKA: 404 – stránka nenalezena
  // ============================================================
  notFoundPage: {
    badge: "Chyba 404",
    title: "Stránka nenalezena",
    description:
      "Stránka, kterou hledáte, neexistuje nebo byla přesunuta. Zkuste se vrátit na úvod nebo se podívat na moje projekty.",
    homeButton: "Zpět na úvod",
    projectsButton: "Zobrazit projekty",
  },

  // ============================================================
  // STRÁNKA: Detail projektu – společné texty UI
  // ============================================================
  projectDetailUI: {
    backButton: "Zpět na projekty",
  },

  // ============================================================
  // STRÁNKA: Detail projektu – obsah jednotlivých projektů
  // (klíč = slug z projectsPage.categories)
  // ============================================================
  projectDetails: {
    // ---------- web-production ----------
    "web-production": {
      title: "Tvorba webů",
      badge: "Development",
      description:
        "Informační weby a osobní vizitky na míru – od návrhu designu po spuštění. Rychlé, moderní a skvěle fungují i na mobilu.",
      sections: [
        {
          type: "text",
          title: "Co pro vás můžu udělat",
          content:
            "Stavím informační weby a osobní vizitky – jednodušší weby, které rychle a přehledně představí vás nebo vaši firmu. Design nemusíte mít připravený: domluvíme se, co si představujete, a navrhnu ho já.\n\nPracuji v Reactu a Tailwind CSS, stejně jako ve firmě Numoteq. Učím se i backend (Node.js, Express, TypeScript a PostgreSQL), takže na řadě jsou e-shopy.\n\nChcete vidět, jak takový web vypadá v praxi? Právě se na jeden díváte.",
        },
        {
          type: "contact",
          title: "Napište mi",
          description:
            "Potřebujete web pro sebe nebo pro firmu? Napište mi, co si představujete, a domluvíme se.",
          buttonText: "Napsat e-mail",
        },
      ],
    },

    // ---------- investing ----------
    investing: {
      title: "Investování a finance",
      badge: "Finance",
      description:
        "Dlouhodobé investování: pozice držím 3 a více let a rozhoduji se podle dění na světových trzích.",
      sections: [
        {
          type: "text",
          title: "Můj přístup k investování",
          content:
            "Seriózně investuji zhruba čtyři roky a zaměřuji se na dlouhodobé investice – pozice obvykle držím tři roky a déle. Jádro portfolia tvoří americký akciový trh a technologický sektor, od roku 2021 investuji i do kryptoměn.\n\nNež do něčeho vložím peníze, sleduji světové zprávy a dění na trzích a informace si ověřuji z více zdrojů. Funguje to? Podívejte se na výnosnost mého portfolia níže.",
        },
        {
          type: "portfolio",
          title: "Výkonnost portfolia",
          description: "Živá výnosnost mého osobního portfolia, aktualizovaná každou hodinu.",
        },
        {
          type: "contact",
          title: "Rád to s vámi proberu",
          description:
            "Zajímá vás dlouhodobé investování nebo dění na trzích? Rád si o tom popovídám – jako investor s investorem, nejde o investiční poradenství.",
          buttonText: "Napsat e-mail",
        },
      ],
    },

    // ---------- 3d-modeling ----------
    "3d-modeling": {
      title: "3D modelování",
      badge: "Design",
      description:
        "Funkční i designové CAD modely – od technického výkresu po díl připravený k 3D tisku.",
      sections: [
        {
          type: "text",
          title: "Jak jsem se dostal k 3D modelování",
          content:
            "Základy 3D modelování a technického kreslení jsem získal na střední škole, kde jsme podle technické dokumentace modelovali v AutoCADu, Inventoru a Solid Edge.\n\nVrcholem byla praktická maturita: podle dodané dokumentace vymodelovat kompletní parní stroj – od jednotlivých součástek až po finální sestavu.\n\nDnes modeluji hlavně ve Fusion 360 a díky 3D tisku u toho zůstávám pravidelně: navrhuji funkční díly, které hned vytisknu a vyzkouším.",
        },
        {
          type: "image-grid",
          title: "Ukázky práce",
          description: "Dva modely z Fusion 360: točená váza a cedulka na poštovní schránku.",
        },
        {
          type: "contact",
          title: "Napište mi",
          description:
            "Potřebujete něco navrhnout nebo vymodelovat? Napište mi na e-mail a domluvíme se.",
          buttonText: "Napsat e-mail",
        },
      ],
    },

    // ---------- 3d-printing ----------
    "3d-printing": {
      title: "3D tisk",
      badge: "Hardware",
      description:
        "Na vlastní tiskárně Bambu Lab A1 tisknu praktické díly i věci pro radost – a rád navrhnu a vytisknu něco i pro vás.",
      sections: [
        {
          type: "text",
          title: "Od nápadu po výtisk",
          content:
            "Tisknu zhruba rok na tiskárně Bambu Lab A1. Za tu dobu jsem doma vylepšil spoustu věcí – od praktických organizérů po náhradní díly – a doma už mi skoro nezbývá, co tisknout.\n\nProto teď tisknu i pro ostatní. Díky zkušenostem s CAD nemusíte mít hotový model: domluvíme se, co potřebujete, navrhnu to ve Fusion 360 a vytisknu.",
        },
        {
          type: "contact",
          title: "Napište mi",
          description:
            "Máte nápad na výtisk? Napište mi na e-mail a vymyslíme to spolu.",
          buttonText: "Napsat e-mail",
        },
      ],
    },
  },
};

export default cs;
