// Ikony a obrázky projektů podle slugu (locales → projectsPage.categories a projectDetails)

import { Box, Globe, Printer, TrendingUp } from "lucide-react";
import modeling1 from "../assets/3d-modeling-1.webp";
import modeling2 from "../assets/3d-modeling-2.webp";

export const PROJECTS = {
  "web-production": { Icon: Globe },
  investing: { Icon: TrendingUp },
  "3d-modeling": { Icon: Box, images: [modeling1, modeling2] },
  "3d-printing": { Icon: Printer },
};
