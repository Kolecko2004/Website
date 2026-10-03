// Vzhled karet: barvy a ikony projektů (texty jsou v locales).
// Třídy jsou celé, aby je Tailwind při buildu našel.

import { Box, Globe, Printer, TrendingUp } from "lucide-react";
import modeling1 from "../assets/3d-modeling-1.webp";
import modeling2 from "../assets/3d-modeling-2.webp";

const GREEN = { bg: "bg-green-400", text: "text-green-400" };
const CYAN = { bg: "bg-cyan-400", text: "text-cyan-400" };
const PURPLE = { bg: "bg-purple-400", text: "text-purple-400" };

// Karty v seznamu střídají barvy podle pořadí (domovská stránka, zájmy)
export const accentAt = (index) => [GREEN, CYAN, PURPLE][index % 3];

// Projekty podle slugu (locales → projectsPage.categories a projectDetails)
export const PROJECTS = {
  "web-production": { Icon: Globe, accent: CYAN },
  investing: { Icon: TrendingUp, accent: GREEN },
  "3d-modeling": { Icon: Box, accent: GREEN, images: [modeling1, modeling2] },
  "3d-printing": { Icon: Printer, accent: CYAN },
};
