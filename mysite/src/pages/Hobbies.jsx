import { useTranslation } from "react-i18next";
import {
  Cat,
  Clapperboard,
  Dumbbell,
  Flag,
  Printer,
  Sprout,
  TrendingUp,
  Users,
} from "lucide-react";
import Hero from "../components/Hero";
import { FeatureBlock } from "../components/FeatureBlock";
import Reveal from "../components/Reveal";
import { accentAt } from "../data/visuals";

// Ikony podle id zájmu (texty jsou v locales/*.js → hobbiesPage.items)
const ICONS = {
  gym: Dumbbell,
  formula1: Flag,
  "3d-printing": Printer,
  friends: Users,
  plants: Sprout,
  cats: Cat,
  investing: TrendingUp,
  movies: Clapperboard,
};

export default function Hobbies() {
  const { t } = useTranslation();

  const hobbies = t("hobbiesPage.items", { returnObjects: true }) || [];

  return (
    <div>
      <Hero
        badge={t("hobbiesPage.badge")}
        title={t("hobbiesPage.heroTitle")}
        description={t("hobbiesPage.heroDescription")}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto mb-16 px-6">
        {hobbies.map((hobby, index) => {
          const Icon = ICONS[hobby.id];
          const accent = accentAt(index);
          return (
            <Reveal key={hobby.id} delay={(index % 2) * 150} className="flex flex-col">
              <FeatureBlock
                title={hobby.title}
                description={hobby.description}
                icon={Icon && <Icon className={accent.text} size={28} />}
                accentColor={accent.bg}
              />
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
