// Texty webu – angličtina (EN)
// Struktura je stejná jako v ostatních jazycích; klíče musí sedět.

const en = {
  // ============================================================
  // SPOLEČNÉ – navigace a patička (na všech stránkách)
  // ============================================================
  nav: {
    home: "Home",
    projects: "Projects",
    experience: "Experience",
    hobbies: "Hobbies",
    email: "Send me an email",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    theme: "Color mode",
    lightMode: "Light mode",
    darkMode: "Dark mode",
    language: "Language",
  },
  footer: {
    socials: "Socials",
    contact: "Contact",
    emailMe: "Email Me",
    builtWith: "Web developer and student from Prague. I designed and built this site myself.",
    copyright: "Vojtěch Drozd",
    instagram: "Instagram",
    github: "GitHub",
    linkedin: "LinkedIn",
    lastUpdated: "Last updated",
  },

  // ============================================================
  // HOME PAGE – hero
  // ============================================================
  heroTitle: "Vojtěch <br /> Drozd",
  heroBadge: "Student & Developer",
  heroDescription:
    "Third-year Open Informatics student at CTU in Prague, building modern websites with React. I started on the frontend and I'm now learning the backend too. Need a website? I'd be glad to build it for you.",
  explore: "Explore",
  // Štítky kolem monogramu v úvodu domovské stránky
  heroChips: {
    role: "Web developer",
    study: "CTU FEL · Open Informatics",
    city: "Prague",
  },

  // ============================================================
  // HOME PAGE – rozcestník (karty sekcí)
  // ============================================================
  projects: {
    title: "Projects",
    description:
      "Websites built to order, 3D modeling and printing, and investing – what I do and how I can help.",
  },
  experience: {
    title: "Experience",
    description:
      "From McDonald's through frontend work at Numoteq to CTU – where I've worked and studied.",
  },
  hobbies: {
    title: "Hobbies",
    description:
      "The gym, Formula 1, good films and friends – how I recharge.",
  },

  // ============================================================
  // STRÁNKA: Zkušenosti (/experience)
  // ============================================================
  experiencePage: {
    badge: "experience",
    heroTitle: "My journey <br /> so far",
    heroDescription:
      "The jobs and schools that got me where I am today.",
    workTitle: "Work Experience",
    educationTitle: "Education",

    // --- Vzdělání (od nejnovějšího) ---
    education: [
      {
        year: "2024 — Present",
        title: "Faculty of Electrical Engineering, CTU in Prague",
        subtitle: "Bachelor's degree · Open Informatics",
        description:
          "Specialization in Computer Games and Graphics – graphics and game programming, algorithms and software engineering.",
      },
      {
        year: "2020 — 2024",
        title: "SPŠS Betlémská, Prague",
        subtitle: "Information Technology · Graduated with honours",
        description:
          "IT programme at a mechanical engineering school: programming (mainly C#), networking, hardware and 3D modeling, plus the basics of CNC programming and automation.",
      },
    ],

    // --- Práce (od nejnovější) ---
    jobs: [
      {
        year: "2024 — Present",
        title: "Reception & Security",
        subtitle: "Eaton · Roztoky near Prague · Part-time",
        description:
          "I handle reception, site security and administrative tasks – a job I balance alongside full-time studies at CTU.",
      },
      {
        year: "2023 — 2024",
        title: "Frontend Developer",
        subtitle: "Numoteq",
        description:
          "What started as a two-week internship turned into a long-term role. In a four-person team, I turned designs into websites and web apps for smaller businesses using React and Tailwind CSS.",
      },
      {
        year: "May 2022 (2 weeks)",
        title: "IT Support Intern",
        subtitle: "Eaton · School internship",
        description:
          "I solved colleagues' computer issues, set up devices for new hires and joined meetings about the company's IT and day-to-day operations.",
      },
      {
        year: "July 2021 — April 2023",
        title: "Guest Experience Leader",
        subtitle: "McDonald's · Prague city centre",
        description:
          "I started at the till, where customers quickly appreciated my friendly approach. I was later promoted to Guest Experience Leader – whenever a guest had a problem, I was the one who solved it. At a busy city-centre branch, I spoke English with customers every day.",
      },
    ],
  },

  // ============================================================
  // STRÁNKA: Zájmy (/hobbies)
  // ============================================================
  hobbiesPage: {
    badge: "Hobbies",
    heroTitle: "When I'm not coding",
    heroDescription:
      "The gym, Formula 1, good films and the people around me – this is how I recharge.",

    // --- Karty zájmů (id musí odpovídat ikoně v Hobbies.jsx) ---
    items: [
      {
        id: "gym",
        title: "Gym",
        description:
          "I go four to five times a week. Besides training, it's where I catch up with friends.",
      },
      {
        id: "formula1",
        title: "Formula 1",
        description:
          "I follow the races, the strategy and the tech behind them. I mainly root for Lando Norris and Max Verstappen.",
      },
      {
        id: "movies",
        title: "Movies & TV Shows",
        description:
          "After a long day I love a good film. My all-time favourites: True Detective and anything by Denis Villeneuve.",
      },
      {
        id: "friends",
        title: "Friends",
        description:
          "We go out, take trips and just hang out. The best way to recharge.",
      },
      {
        id: "cats",
        title: "Cats",
        description:
          "They're simply the best. Nothing more to say.",
      },
      {
        id: "plants",
        title: "Plants",
        description:
          "Mostly cacti and aloe vera – low-maintenance, but it's still a joy to watch them grow.",
      },
    ],
  },

  // ============================================================
  // STRÁNKA: Projekty – přehled (/projects)
  // ============================================================
  projectsPage: {
    badge: "Projects",
    heroTitle: "What I <br /> work on",
    heroDescription:
      "Websites, 3D modeling, 3D printing and investing – what I do and how I can help you.",
    viewProject: "View details",

    // --- Karty projektů (slug musí odpovídat klíči v projectDetails) ---
    categories: [
      {
        slug: "web-production",
        title: "Web Development",
        description:
          "Informational websites and personal sites built to order – from design to launch. Fast, modern and great on mobile.",
      },
      {
        slug: "investing",
        title: "Investing & Finance",
        description:
          "Long-term investing: I hold positions for 3+ years and decide based on what's happening in global markets.",
      },
      {
        slug: "3d-modeling",
        title: "3D Modeling",
        description:
          "Functional and design CAD models – from a technical drawing to a part ready for 3D printing.",
      },
      {
        slug: "3d-printing",
        title: "3D Printing",
        description:
          "I print practical parts and fun pieces on my own Bambu Lab A1 – and I'm happy to design and print something for you too.",
      },
    ],
  },

  // ============================================================
  // Živá výnosnost portfolia (sekce "portfolio" v projectDetails)
  // ============================================================
  portfolio: {
    periods: {
      threeMonths: "Last 3 months",
      ytd: "Year to date",
      oneYear: "Last year",
    },
    since: "since {{date}}",
    updated: "Last updated:",
    nextUpdate: "Next update in",
    unavailable: "Live portfolio data is not available right now.",
    syncing: "Loading trade history from Trading 212 – the numbers will appear shortly.",
  },

  // ============================================================
  // STRÁNKA: 404 – stránka nenalezena
  // ============================================================
  notFoundPage: {
    badge: "Error 404",
    title: "Page not found",
    description:
      "The page you are looking for doesn't exist or has been moved. Try heading back home or check out my projects.",
    homeButton: "Back to Home",
    projectsButton: "View Projects",
  },

  // ============================================================
  // STRÁNKA: Detail projektu – společné texty UI
  // ============================================================
  projectDetailUI: {
    backButton: "Back to Projects",
  },

  // ============================================================
  // STRÁNKA: Detail projektu – obsah jednotlivých projektů
  // (klíč = slug z projectsPage.categories)
  // ============================================================
  projectDetails: {
    // ---------- web-production ----------
    "web-production": {
      title: "Web Development",
      badge: "Development",
      description:
        "Informational websites and personal sites built to order – from design to launch. Fast, modern and great on mobile.",
      sections: [
        {
          type: "text",
          title: "What I Can Do for You",
          content:
            "I build informational websites and personal sites – simpler websites that present you or your business clearly and quickly. You don't need a ready-made design: we'll talk about what you have in mind and I'll design it.\n\nI work with React and Tailwind CSS, the same stack I used at Numoteq. I'm also learning the backend (Node.js, Express, TypeScript and PostgreSQL), so online shops are next.\n\nWant to see what that looks like in practice? You're looking at one right now.",
        },
        {
          type: "contact",
          title: "Get in Touch",
          description:
            "Need a website for yourself or your business? Tell me what you have in mind and we'll take it from there.",
          buttonText: "Send an Email",
        },
      ],
    },

    // ---------- investing ----------
    investing: {
      title: "Investing & Finance",
      badge: "Finance",
      description:
        "Long-term investing: I hold positions for 3+ years and decide based on what's happening in global markets.",
      sections: [
        {
          type: "text",
          title: "My Approach to Investing",
          content:
            "I've been investing seriously for about four years, with a long-term focus – I usually hold positions for three years or more. The core of my portfolio is US equities and the tech sector, and I've also invested in crypto since 2021.\n\nBefore I put money into anything, I follow world news and market developments and check information across several sources. Does it work? See my portfolio's performance below.",
        },
        {
          type: "portfolio",
          title: "Portfolio Performance",
          description: "Live return of my personal portfolio, updated every hour.",
        },
        {
          type: "contact",
          title: "Let's Talk Markets",
          description:
            "Curious about long-term investing or what's moving the markets? I'm happy to talk it through – as one investor to another, not as financial advice.",
          buttonText: "Send an Email",
        },
      ],
    },

    // ---------- 3d-modeling ----------
    "3d-modeling": {
      title: "3D Modeling",
      badge: "Design",
      description:
        "Functional and design CAD models – from a technical drawing to a part ready for 3D printing.",
      sections: [
        {
          type: "text",
          title: "How I Got Into 3D Modeling",
          content:
            "I learned the basics of 3D modeling and technical drawing at secondary school, modeling from technical documentation in AutoCAD, Inventor and Solid Edge.\n\nThe highlight was my practical graduation exam: modeling a complete steam engine from the provided documentation – from individual components to the final assembly.\n\nToday I model mainly in Fusion 360, and 3D printing keeps me at it regularly: I design functional parts, print them and test them right away.",
        },
        {
          type: "image-grid",
          title: "Work Samples",
          description: "Two models from Fusion 360: a twisted vase and a no-flyers sign for a mailbox.",
        },
        {
          type: "contact",
          title: "Get in Touch",
          description:
            "Need something designed or modeled? Send me an email and we'll work it out.",
          buttonText: "Send an Email",
        },
      ],
    },

    // ---------- 3d-printing ----------
    "3d-printing": {
      title: "3D Printing",
      badge: "Hardware",
      description:
        "I print practical parts and fun pieces on my own Bambu Lab A1 – and I'm happy to design and print something for you too.",
      sections: [
        {
          type: "text",
          title: "From Idea to Print",
          content:
            "I've been printing for about a year on a Bambu Lab A1. In that time I've upgraded loads of things around the house – from practical organizers to replacement parts – and I'm running out of things to print at home.\n\nSo now I print for others too. Thanks to my CAD experience, you don't need a ready-made model: we'll talk about what you need, I'll design it in Fusion 360 and print it.",
        },
        {
          type: "contact",
          title: "Get in Touch",
          description:
            "Have an idea for a print? Send me an email and we'll figure it out together.",
          buttonText: "Send an Email",
        },
      ],
    },
  },
};

export default en;
