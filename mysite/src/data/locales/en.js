// Texty webu – angličtina (EN)
// Struktura je stejná jako v ostatních jazycích; klíče musí sedět.

import { CONTACT_EMAIL } from "./shared";

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
  },
  footer: {
    socials: "Socials",
    contact: "Contact",
    emailMe: "Email Me",
    builtWith: "Built with React, Tailwind, and Lucide.",
    lastUpdated: "Last updated",
  },

  // ============================================================
  // HOME PAGE – hero
  // ============================================================
  heroBadge: "Student & Developer",
  heroDescription:
    "Welcome to my digital portfolio. Explore my background, projects, and the things I enjoy doing in my free time.",
  explore: "Explore",

  // ============================================================
  // HOME PAGE – rozcestník (karty sekcí)
  // ============================================================
  projects: {
    title: "Projects",
    description:
      "Web apps, 3D models, prints and investing – a look at what I build and explore outside of school and work.",
  },
  experience: {
    title: "Experience",
    description:
      "From my first job to university – the roles and schools that shaped me.",
  },
  hobbies: {
    title: "Hobbies",
    description:
      "Gym, Formula 1, good films and time with friends – what keeps me going.",
  },

  // ============================================================
  // STRÁNKA: Zkušenosti (/experience)
  // ============================================================
  experiencePage: {
    badge: "experience",
    heroTitle: "My journey <br /> so far",
    heroDescription:
      "In here you can find an overview of my professional work experience and educational background.",
    workTitle: "Work Experience",
    educationTitle: "Education",

    // --- Vzdělání (od nejnovějšího) ---
    education: [
      {
        year: "2024 — Present",
        title: "Faculty of Electrical Engineering CTU in Prague",
        subtitle: "BSc in Computer Science",
        description:
          "Degree program: Open Informatics. Specialization: Computer Games and Graphics. Focused on software engineering, algorithms, and lower-level programming.",
      },
      {
        year: "2020 — 2024",
        title: "Secondary Technical School of Mechanical Engineering",
        subtitle: "Information Technology",
        description:
          "Introduction to programming (mainly C#), networking, hardware systems, 3D modeling and basic computer integrated manufacturing.",
      },
      {
        year: "2011 — 2020",
        title: "Primary School",
        subtitle: "Red Hill Primary School",
        description: "Quality primary school in Prague.",
      },
    ],

    // --- Práce (od nejnovější) ---
    jobs: [
      {
        year: "2024 — Present",
        title: "Security & Reception Services",
        subtitle: "Part-time",
        description:
          "Responsible for site monitoring and administrative tasks. This role provides a professional environment that allows me to balance work with my ongoing university studies.",
      },
      {
        year: "2023 — 2024",
        title: "Frontend Developer",
        subtitle: "Numoteq",
        description:
          "Modernized legacy web applications by migrating to React and Tailwind CSS. Successfully optimized performance, leading to a 40% improvement in page load speeds.",
      },
      {
        year: "May 2022 (2 weeks)",
        title: "IT Support Intern",
        subtitle: "Eaton",
        description:
          "Completed a mandatory school internship focused on corporate IT infrastructure. Provided technical assistance to staff and assisted with hardware maintenance.",
      },
      {
        year: "July 2021 — April 2023",
        title: "Team member / Cashier / Guest Experience Leader",
        subtitle: "McDonald's",
        description:
          "Started as a team member and cashier was promoted to Guest Experience Leader due to strong performance. Working in a high-traffic city center location, I communicated daily with international customers in English.",
      },
    ],
  },

  // ============================================================
  // STRÁNKA: Zájmy (/hobbies)
  // ============================================================
  hobbiesPage: {
    badge: "Hobbies",
    heroTitle: "Free time",
    heroDescription:
      "In here you can find what I enjoy doing when I'm not studying or working.",

    // --- Karty zájmů (id musí odpovídat ikoně v Hobbies.jsx) ---
    items: [
      {
        id: "gym",
        title: "Gym",
        description:
          "Regular workouts help me clear my head and stay in good shape.",
      },
      {
        id: "formula1",
        title: "Formula 1",
        description:
          "I follow the races, the strategy, and the technology behind the cars.",
      },
      {
        id: "3d-printing",
        title: "3D Printing",
        description:
          "Designing and printing practical parts and small gadgets for home and fun.",
      },
      {
        id: "friends",
        title: "Going out with friends",
        description:
          "Spending time with friends is the best way for me to relax and recharge.",
      },
      {
        id: "plants",
        title: "Plants",
        description:
          "I enjoy taking care of my plants and watching them grow.",
      },
      {
        id: "cats",
        title: "Cats",
        description: "Cats are simply the best company at home.",
      },
      {
        id: "investing",
        title: "Investing",
        description:
          "I manage my own portfolio and enjoy following the markets and the economy.",
      },
      {
        id: "movies",
        title: "Movies & TV Shows",
        description:
          "After a long day, I like to unwind with a good movie or a new series.",
      },
    ],
  },

  // ============================================================
  // STRÁNKA: Projekty – přehled (/projects)
  // ============================================================
  projectsPage: {
    badge: "Projects",
    heroTitle: "My personal <br /> projects",
    heroDescription:
      "In here you can find what I'm working on in my personal time or what excites me.",
    viewProject: "View details",

    // --- Karty projektů (slug musí odpovídat klíči v projectDetails) ---
    categories: [
      {
        slug: "web-production",
        title: "Web Production",
        description:
          "Building web applications with React and Tailwind CSS, done primarily for fun and personal growth.",
      },
      {
        slug: "investing",
        title: "Investing & Finance",
        description:
          "Financial market analysis, personal portfolio management, and investment strategies.",
      },
      {
        slug: "3d-modeling",
        title: "3D Modeling",
        description:
          "Creating functional and aesthetic CAD models, from technical designs to preparation for 3D printing.",
      },
      {
        slug: "3d-printing",
        title: "3D Printing",
        description:
          "A passion where I turn digital ideas into real physical objects, primarily for personal projects and fun.",
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
    updated: "Updated {{date}}",
    note: "Time-weighted return, deposits and withdrawals excluded. Live data from Trading 212.",
    unavailable: "Live portfolio data is not available right now.",
  },

  // ============================================================
  // STRÁNKA: Detail projektu – společné texty UI
  // ============================================================
  projectDetailUI: {
    notFound: "Project not found.",
    backButton: "Back to Projects",
    contactFallback: "Contact Me",
  },

  // ============================================================
  // STRÁNKA: Detail projektu – obsah jednotlivých projektů
  // (klíč = slug z projectsPage.categories)
  // ============================================================
  projectDetails: {
    // ---------- web-production ----------
    "web-production": {
      title: "Web Production",
      badge: "Development",
      description:
        "Building web applications with React and Tailwind CSS, done primarily for fun and personal growth.",
      sections: [
        {
          type: "text",
          title: "About My Web Development",
          content:
            "I learned to program websites using modern technologies like React and Tailwind CSS mainly thanks to my practical experience at numoteq.\n\nToday, I pursue web development primarily as a hobby and a great way to continuously expand my skill set.\n\nAnd if you're curious about what a website built by me looks like in practice, you don't have to look far – this site you are currently browsing is the best example.",
        },
        {
          type: "contact",
          title: "Get in Touch",
          description:
            "Have a question about web development or want to collaborate? Feel free to reach out.",
          buttonText: "Send an Email",
          email: CONTACT_EMAIL,
        },
      ],
    },

    // ---------- investing ----------
    investing: {
      title: "Investing & Finance",
      badge: "Finance",
      description:
        "Financial market analysis, personal portfolio management, and investment strategies.",
      sections: [
        {
          type: "text",
          title: "My Approach to Investing",
          content:
            "I apply an analytical approach to managing my personal portfolio, focusing on long-term growth, market analysis, and risk management.\n\nIt is a great way to combine data analysis with real-world economics.",
        },
        {
          type: "portfolio",
          title: "Portfolio Performance",
          description: "Live return of my personal portfolio, updated every hour.",
        },
        {
          type: "contact",
          title: "Get in Touch",
          description:
            "Want to discuss financial markets or investment strategies? Feel free to reach out.",
          buttonText: "Send an Email",
          email: CONTACT_EMAIL,
        },
      ],
    },

    // ---------- 3d-modeling ----------
    "3d-modeling": {
      title: "3D Modeling",
      badge: "Design",
      description:
        "Creating functional and aesthetic CAD models, from technical designs to preparation for 3D printing.",
      sections: [
        {
          type: "text",
          title: "My Journey to 3D Modeling",
          content:
            "I gained the basics of 3D modeling and technical drawing back in secondary school. We learned to convert technical designs into 3D models using CAD software (AutoCAD, Inventor, Solid Edge).\n\nI consider my graduation exam in 3D modeling to be the highlight of my CAD capabilities so far. Our task was to model a complete steam engine based on provided technical documentation – from individual small components to their final assembly.\n\nAlthough I don't have as many opportunities to study this field directly at university, 3D printing keeps me in regular contact with it. Designing functional parts or modeling for fun is a great way to maintain and advance these skills, especially using software like Fusion 360.",
        },
        {
          type: "image-grid",
          title: "Work Samples",
          description: "Drafts and final renders of a mechanical assembly.",
        },
        {
          type: "contact",
          title: "Get in Touch",
          description:
            "Interested in my work or need something modeled? Get in touch.",
          buttonText: "Send an Email",
          email: CONTACT_EMAIL,
        },
      ],
    },

    // ---------- 3d-printing ----------
    "3d-printing": {
      title: "3D Printing",
      badge: "Hardware",
      description:
        "A passion where I turn digital ideas into real physical objects, primarily for personal projects and fun.",
      sections: [
        {
          type: "text",
          title: "My Journey to 3D Printing",
          content:
            "3D printing is a relatively new hobby of mine, but one that instantly hooked me. I recently acquired my own 3D printer, opening up whole new possibilities to bring my ideas to life.\n\nI use the printer mainly for personal projects and fun. Whether it's printing practical organizers, replacement parts, or small gadgets, I love watching physical objects grow right in front of my eyes.\n\nIt also complements my CAD experience brilliantly. When I need a specific part at home, I simply design it, process it in a slicer, and print it right away.",
        },
        {
          type: "contact",
          title: "Get in Touch",
          description:
            "Interested in 3D printing or want to discuss something? Write to me.",
          buttonText: "Send an Email",
          email: CONTACT_EMAIL,
        },
      ],
    },
  },
};

export default en;
