import React from "react";
import { useTranslation, Trans } from "react-i18next";
import Hero from "../components/Hero";
import { FeatureBlock } from "../components/FeatureBlock";
import { Printer, Box, Globe, TrendingUp } from "lucide-react";
import { Button } from "../components/Button";

export default function Projects() {
  const { t } = useTranslation();

  const categoryConfig = {
    "web-production": {
      icon: <Globe className="text-cyan-400" size={32} />,
      color: "bg-cyan-400",
    },
    "investing": {
      icon: <TrendingUp className="text-green-400" size={32} />,
      color: "bg-green-400",
    },
    "3d-modeling": {
      icon: <Box className="text-green-400" size={32} />,
      color: "bg-green-400",
    },
    "3d-printing": {
      icon: <Printer className="text-cyan-400" size={32} />,
      color: "bg-cyan-400",
    },
  };

  const categories = t("projectsPage.categories", { returnObjects: true }) || [];

  return (
    <div className="max-w-6xl mx-auto">
      <Hero
        badge={t("projectsPage.badge")}
        title={
          <Trans i18nKey="projectsPage.heroTitle">
            My personal <br /> projects
          </Trans>
        }
        description={t("projectsPage.heroDescription")}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12 px-6">
        {categories.map((project, index) => {
          const config = categoryConfig[project.slug] || {};
          const isLastAndOdd =
            index === categories.length - 1 && categories.length % 2 !== 0;

          return (
            <div
              key={project.slug || index}
              className={`flex flex-col ${isLastAndOdd ? "md:col-span-2" : ""}`}
            >
              <FeatureBlock
                title={project.title}
                description={project.description}
                accentColor={config.color}
              >
                <div className="flex justify-center items-center gap-4">
                  <Button
                    to={`/projects/${project.slug}`}
                    className="w-full md:w-auto"
                  >
                    {t("projectsPage.viewProject")}
                  </Button>
                  <div>{config.icon}</div>
                </div>
              </FeatureBlock>
            </div>
          );
        })}
      </div>
    </div>
  );
}