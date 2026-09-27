import React from "react";
import { useTranslation } from "react-i18next";
import Hero from "../components/Hero";
import { FeatureBlock } from "../components/FeatureBlock";
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
  gym: <Dumbbell className="text-green-400" size={32} />,
  formula1: <Flag className="text-cyan-400" size={32} />,
  "3d-printing": <Printer className="text-purple-400" size={32} />,
  friends: <Users className="text-green-400" size={32} />,
  plants: <Sprout className="text-cyan-400" size={32} />,
  cats: <Cat className="text-purple-400" size={32} />,
  investing: <TrendingUp className="text-green-400" size={32} />,
  movies: <Clapperboard className="text-cyan-400" size={32} />,
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
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12 px-6">
        {hobbies.map((hobby, index) => {
          const blockColor = USE_ALTERNATING_COLORS
            ? COLORS[index % COLORS.length]
            : "bg-green-400";
          return (
            <div key={hobby.id} className="flex flex-col">
              <FeatureBlock
                title={hobby.title}
                description={hobby.description}
                accentColor={blockColor}
              >
                <div className="flex justify-center items-center gap-4">
                  <div>{ICONS[hobby.id]}</div>
                </div>
              </FeatureBlock>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Hobbies;
