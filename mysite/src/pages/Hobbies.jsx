import { useTranslation } from "react-i18next";
import { Cat, Clapperboard, Dumbbell, Flag, Sprout, Users } from "lucide-react";
import Hero from "../components/Hero";
import Reveal from "../components/Reveal";

// Ikony podle id zájmu (texty jsou v locales/*.js → hobbiesPage.items)
const ICONS = {
  gym: Dumbbell,
  formula1: Flag,
  friends: Users,
  plants: Sprout,
  cats: Cat,
  movies: Clapperboard,
};

export default function Hobbies() {
  const { t } = useTranslation();

  const hobbies = t("hobbiesPage.items", { returnObjects: true }) || [];

  return (
    <div className="pb-8">
      <Hero
        badge={t("hobbiesPage.badge")}
        title={t("hobbiesPage.heroTitle")}
        description={t("hobbiesPage.heroDescription")}
      />
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-wrap gap-8">
        {hobbies.map((hobby, index) => {
          const Icon = ICONS[hobby.id];
          return (
            <Reveal key={hobby.id} delay={(index % 3) * 100} className="flex-[1_1_300px] min-w-0 flex">
              <article className="w-full flex flex-col items-center text-center gap-4 rounded-[34px] bg-surface shadow-neu p-6 sm:p-8">
                <span className="flex items-center justify-center size-[84px] rounded-full shadow-neu-in text-accent-ink">
                  {Icon && <Icon size={32} aria-hidden="true" />}
                </span>
                <h2 className="mt-1 text-[22px] font-extrabold">{hobby.title}</h2>
                <p className="text-muted leading-relaxed">{hobby.description}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
