import React from "react";
import { useTranslation } from "react-i18next";
import Hero from "../components/Hero";
import { FeatureBlock } from "../components/FeatureBlock";
import Reveal from "../components/Reveal";
import { Button } from "../components/Button";

// Barvy karet se střídají stejně jako na ostatních stránkách
const ACCENTS = [
  { bg: "bg-green-400", text: "text-green-400" },
  { bg: "bg-cyan-400", text: "text-cyan-400" },
  { bg: "bg-purple-400", text: "text-purple-400" },
];

export default function Home() {
  const { t } = useTranslation();

  const featureData = [
    {
      path: "/projects",
      id: "projects",
      title: t("projects.title"),
      description: t("projects.description"),
    },
    {
      path: "/experience",
      id: "experience",
      title: t("experience.title"),
      description: t("experience.description"),
    },
    {
      path: "/hobbies",
      id: "hobbies",
      title: t("hobbies.title"),
      description: t("hobbies.description"),
    },
  ];

  return (
    <div>
      <Hero
        fullHeight
        badge={t("heroBadge")}
        title={
          <>
            Vojtěch <br /> Drozd
          </>
        }
        description={t("heroDescription")}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-16 px-6">
        {featureData.map((item, index) => (
          <Reveal
            key={item.id}
            delay={index === 0 ? 0 : (index - 1) * 150}
            className={index === 0 ? "md:col-span-2" : ""}
          >
            <FeatureBlock
              title={item.title}
              description={item.description}
              accentColor={ACCENTS[index % ACCENTS.length].bg}
            >
              <Button
                className="mx-auto"
                to={item.path}
                arrowColor={ACCENTS[index % ACCENTS.length].text}
              >
                {t("explore")} {item.title}
              </Button>
            </FeatureBlock>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
