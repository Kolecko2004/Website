import React from "react";
import { useTranslation, Trans } from "react-i18next";
import Hero from "../components/Hero";
import { FeatureBlock } from "../components/FeatureBlock";
import Reveal from "../components/Reveal";
import { Printer, Box, Globe, TrendingUp } from "lucide-react";
import { Button } from "../components/Button";

const categoryConfig = {
  "web-production": {
    icon: <Globe className="text-cyan-400" size={28} />,
    color: "bg-cyan-400",
    text: "text-cyan-400",
  },
  investing: {
    icon: <TrendingUp className="text-green-400" size={28} />,
    color: "bg-green-400",
    text: "text-green-400",
  },
  "3d-modeling": {
    icon: <Box className="text-green-400" size={28} />,
    color: "bg-green-400",
    text: "text-green-400",
  },
  "3d-printing": {
    icon: <Printer className="text-cyan-400" size={28} />,
    color: "bg-cyan-400",
    text: "text-cyan-400",
  },
};

export default function Projects() {
  const { t } = useTranslation();

  const categories = t("projectsPage.categories", { returnObjects: true }) || [];

  return (
    <div>
      <Hero
        badge={t("projectsPage.badge")}
        title={
          <Trans i18nKey="projectsPage.heroTitle">
            My personal <br /> projects
          </Trans>
        }
        description={t("projectsPage.heroDescription")}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto mb-16 px-6">
        {categories.map((project, index) => {
          const config = categoryConfig[project.slug] || {};
          const isLastAndOdd =
            index === categories.length - 1 && categories.length % 2 !== 0;

          return (
            <Reveal
              key={project.slug || index}
              delay={(index % 2) * 150}
              className={`flex flex-col ${isLastAndOdd ? "md:col-span-2" : ""}`}
            >
              <FeatureBlock
                title={project.title}
                description={project.description}
                icon={config.icon}
                accentColor={config.color}
              >
                <Button
                  to={`/projects/${project.slug}`}
                  className="mx-auto"
                  arrowColor={config.text}
                >
                  {t("projectsPage.viewProject")}
                </Button>
              </FeatureBlock>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
