import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      heroDescription:
        "I build functional web applications using React and Tailwind. Focused on clean code and simple interfaces.",
      explore: "Explore",
      projects: {
        title: "Projects",
        description:
          "Here you can see all my projects and the things I work on in my free time.",
      },
      experience: {
        title: "Experience",
        description:
          "Here you can see my professional and educational journey.",
      },
      hobbies: {
        title: "Hobbies",
        description:
          "Here you can see how I relax, have fun, and spend my free time.",
      },
      experiencePage: {
        badge: "experience",
        heroTitle: "My journey <br /> so far",
        heroDescription:
          "In here you can find an overview of my professional work experience and educational background.",
        workTitle: "Work Experience",
        educationTitle: "Education",
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
      projectsPage: {
        badge: "Projects",
        heroTitle: "My personal <br /> projects",
        heroDescription:
          "In here you can find what I'm working on in my personal time or what excites me.",
        viewProject: "View details",
        categories: [
          {
            slug: "web-production",
            title: "Web Production",
            description:
              "Building web applications with React and Tailwind CSS, done primarily for fun and personal growth.",
          },
          {
            slug: "investing",
            title: "Investování & Finance",
            description:
              "Analýza finančních trhů, správa osobního portfolia a investiční strategie.",
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
      projectDetailUI: {
        notFound: "Project not found.",
        backButton: "Back to Projects",
        contactFallback: "Contact Me",
      },
      projectDetails: {
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
              email: "vojtech.drozd.web@protonmail.com",
            },
          ],
        },
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
              type: "contact",
              title: "Get in Touch",
              description:
                "Want to discuss financial markets or investment strategies? Feel free to reach out.",
              buttonText: "Send an Email",
              email: "vojtech.drozd.web@protonmail.com",
            },
          ],
        },
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
              email: "vojtech.drozd.web@protonmail.com",
            },
          ],
        },
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
              email: "vojtech.drozd.web@protonmail.com",
            },
          ],
        },
      },
    },
  },
  cs: {
    translation: {
      heroDescription:
        "Tvořím funkční webové aplikace v Reactu a Tailwindu. Zaměřuji se na čistý kód a jednoduchá uživatelská rozhraní.",
      explore: "Prozkoumat",
      projects: {
        title: "Projekty",
        description:
          "Tady můžete vidět všechny moje projekty nebo věci, na kterých pracuji ve svém volném čase.",
      },
      experience: {
        title: "Zkušenosti",
        description: "Zde můžete vidět moji dosavadní profesní a studentskou cestu.",
      },
      hobbies: {
        title: "Zájmy",
        description:
          "Zde můžete vidět, jakým způsobem odpočívám, bavím se nebo trávím svůj volný čas.",
      },
      experiencePage: {
        badge: "zkušenosti",
        heroTitle: "Moje dosavadní <br /> cesta",
        heroDescription:
          "Zde najdete přehled mé dosavadní pracovní praxe a absolvovaného vzdělání.",
        workTitle: "Pracovní zkušenosti",
        educationTitle: "Vzdělání",
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
      projectsPage: {
        badge: "Projekty",
        heroTitle: "Moje osobní <br /> projekty",
        heroDescription:
          "Zde najdete to, na čem pracuji ve svém volném čase, nebo co mě baví.",
        viewProject: "Podívat se",
        categories: [
          {
            slug: "web-production",
            title: "Vývoj webů",
            description:
              "Tvorba webových stránek v Reactu a Tailwindu, kterou dělám primárně pro radost a osobní rozvoj.",
          },
          {
            slug: "investing",
            title: "Investing & Finance",
            description:
              "Financial market analysis, personal portfolio management, and investment strategies.",
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
      projectDetailUI: {
        notFound: "Projekt nenalezen.",
        backButton: "Zpět na projekty",
        contactFallback: "Napsat",
      },
      projectDetails: {
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
              email: "vojtech.drozd.web@protonmail.com",
            },
          ],
        },
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
              email: "vojtech.drozd.web@protonmail.com",
            },
          ],
        },
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
              email: "vojtech.drozd.web@protonmail.com",
            },
          ],
        },
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
              email: "vojtech.drozd.web@protonmail.com",
            },
          ],
        },
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
