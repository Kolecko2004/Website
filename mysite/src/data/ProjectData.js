import img1 from "./3d-modeling-img1.png";
import img2 from "./3d-modeling-img2.png";

export const projectData = {
  "web-production": {
    title: "Web Production",
    badge: "Development",
    description:
      "Tvorba webových stránek v Reactu a Tailwindu, kterou dělám primárně pro radost a osobní rozvoj.",
    color: "bg-cyan-400",
    sections: [
      {
        type: "text",
        title: "O mém webovém vývoji",
        content:
          "Programovat webové stránky pomocí moderních technologií jako React a Tailwind CSS jsem se naučil především díky své praxi ve firmě numoteq.\n\n Dnes se webovému vývoji věnuji hlavně jako zábavě a skvělému způsobu, jak si neustále rozšiřovat své individuální schopnosti.\n\n A pokud vás zajímá, jak takový web z mé dílny vypadá v praxi, nemusíte chodit daleko – tou nejlepší vizitkou je přímo tato stránka, kterou si právě prohlížíte.",
      },
      {
        type: "contact",
        title: "Get in Touch",
        description:
          "Máš otázku k webům nebo chceš na něčem spolupracovat? Ozvi se mi.",
        buttonText: "Napsat e-mail",
        email: "vojtech.drozd@protonmail.com",
      },
    ],
  },
  "3d-modeling": {
    title: "3D Modeling",
    badge: "Design",
    description:
      "Tvorba funkčních a estetických CAD modelů, od technických návrhů až po přípravu pro 3D tisk.",
    color: "bg-green-400",
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
        images: [img1, img2],
        description: "Drafts and final renders of a mechanical assembly.",
      },
      {
        type: "contact",
        title: "Get in Touch",
        description:
          "Zaujala tě moje práce nebo potřebuješ něco vymodelovat? Ozvi se mi.",
        buttonText: "Napsat e-mail",
        email: "vojtech.drozd@protonmail.com",
      },
    ],
  },
  "3d-printing": {
    title: "3D Printing",
    badge: "Hardware",
    description:
      "Můj nový koníček, díky kterému převádím digitální nápady do reálných předmětů, primárně pro osobní účely a zábavu.",
    color: "bg-green-400",
    sections: [
      {
        type: "text",
        title: "Moje cesta k 3D tisku",
        content:
          "3D tisk je mým poměrně novým koníčkem, který mě ale okamžitě naplno chytnul. Nedávno jsem si pořídil vlastní 3D tiskárnu a otevřely se mi tak úplně nové možnosti, jak zhmotnit své nápady.\n\nTiskárnu využívám hlavně pro osobní účely a pro zábavu. Ať už jde o tisk různých praktických organizérů, náhradních dílů, nebo jen drobných vychytávek pro radost, hrozně mě baví sledovat, jak mi fyzický výrobek roste doslova před očima.\n\nCelé se to navíc neuvěřitelně skvěle doplňuje s mými zkušenostmi s CAD softwarem. Když mi doma něco chybí nebo potřebuji specifickou součástku, prostě si ji sám navrhnu, připravím ve sliceru a rovnou vytisknu přesně podle svých představ.",
      },
      {
        type: "contact",
        title: "Get in Touch",
        description:
          "Zajímá tě 3D tisk nebo bys chtěl poradit či něco probrat? Napiš mi.",
        buttonText: "Napsat e-mail",
        email: "vojtech.drozd@protonmail.com",
      },
    ],
  },
};
