import React from "react";
import { useTranslation } from "react-i18next";
import Hero from "../components/Hero";
import { FeatureBlock } from "../components/FeatureBlock";
import Reveal from "../components/Reveal";
import {
  Printer,
  Dumbbell,
  Flag,
  Users,
  Sprout,
  Cat,
  TrendingUp,
  Clapperboard,
} from "lucide-react";

// Ikony podle id zájmu (texty jsou v locales/*.js → hobbiesPage.items)
const ICONS = {
  gym: <Dumbbell className="text-green-400" size={28} />,
  formula1: <Flag className="text-cyan-400" size={28} />,
  "3d-printing": <Printer className="text-purple-400" size={28} />,
  friends: <Users className="text-green-400" size={28} />,
  plants: <Sprout className="text-cyan-400" size={28} />,
  cats: <Cat className="text-purple-400" size={28} />,
  investing: <TrendingUp className="text-green-400" size={28} />,
  movies: <Clapperboard className="text-cyan-400" size={28} />,
};

const USE_ALTERNATING_COLORS = true;

const COLORS = ["bg-green-400", "bg-cyan-400", "bg-purple-400"];

function Hobbies() {
  const { t } = useTranslation();

  const hobbies = t("hobbiesPage.items", { returnObjects: true }) || [];

  return (
    <div>
      <Hero
        badge={t("hobbiesPage.badge")}
        title={<>{t("hobbiesPage.heroTitle")}</>}
        description={t("hobbiesPage.heroDescription")}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto mb-16 px-6">
        {hobbies.map((hobby, index) => {
          const blockColor = USE_ALTERNATING_COLORS
            ? COLORS[index % COLORS.length]
            : "bg-green-400";
          return (
            <Reveal key={hobby.id} delay={(index % 2) * 150} className="flex flex-col">
              <FeatureBlock
                title={hobby.title}
                description={hobby.description}
                icon={ICONS[hobby.id]}
                accentColor={blockColor}
              />
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}

export default Hobbies;
