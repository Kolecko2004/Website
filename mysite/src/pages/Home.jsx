import React from "react";
import { useTranslation } from "react-i18next";
import Hero from "../components/Hero";
import { FeatureBlock } from "../components/FeatureBlock";
import { Button } from "../components/Button";

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
        title={
          <>
            Vojtěch <br /> Drozd
          </>
        }
        description={t("heroDescription")}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto my-12 px-6">
        {featureData.map((item, index) => (
          <div key={item.id} className={index === 0 ? "md:col-span-2" : ""}>
            <FeatureBlock title={item.title} description={item.description}>
              <Button className="mx-auto" to={item.path}>
                {t("explore")} {item.title}
              </Button>
            </FeatureBlock>
          </div>
        ))}
      </div>
    </div>
  );
}