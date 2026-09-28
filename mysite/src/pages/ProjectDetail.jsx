import React from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Hero from "../components/Hero";
import { FeatureBlock } from "../components/FeatureBlock";
import Reveal from "../components/Reveal";
import { Button } from "../components/Button";
import PortfolioReturns from "../components/PortfolioReturns";

import img1 from "../data/3d-modeling-img1.png";
import img2 from "../data/3d-modeling-img2.png";

const projectConfig = {
  "web-production": {
    color: "bg-cyan-400",
    text: "text-cyan-400",
  },
  investing: {
    color: "bg-green-400",
    text: "text-green-400",
  },
  "3d-modeling": {
    color: "bg-green-400",
    text: "text-green-400",
    images: [img1, img2],
  },
  "3d-printing": {
    color: "bg-cyan-400",
    text: "text-cyan-400",
  },
};

export default function ProjectDetail({ projectId: propProjectId }) {
  const { projectId: urlProjectId } = useParams();
  const { t } = useTranslation();

  const activeId = propProjectId || urlProjectId;
  const projectData = t(`projectDetails.${activeId}`, { returnObjects: true });
  const config = projectConfig[activeId];

  // Vždy vede na přehled projektů (i když uživatel přišel přímo odkazem zvenku)
  const backButton = (
    <Button className="mx-auto" to="/projects" back>
      {t("projectDetailUI.backButton", "Back to Projects")}
    </Button>
  );

  if (!projectData || typeof projectData === "string" || !config) {
    return (
      <Hero title={t("projectDetailUI.notFound", "Project not found.")}>
        {backButton}
      </Hero>
    );
  }

  return (
    <div className="pb-16">
      <Hero
        badge={projectData.badge}
        title={projectData.title}
        description={projectData.description}
      >
        {backButton}
      </Hero>

      <div className="grid gap-6 md:gap-8 max-w-5xl mx-auto px-6">
        {projectData.sections?.map((section, index) => (
          <Reveal key={index}>
            <FeatureBlock
              title={section.title}
              description={section.content || section.description}
              align={section.type === "text" ? "left" : "center"}
              accentColor={config.color}
            >
              {section.type === "image-grid" && config.images && (
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {config.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${projectData.title} ${i + 1}`}
                      loading="lazy"
                      className="h-72 w-full object-cover rounded-xl border border-slate-700 shadow-lg"
                    />
                  ))}
                </div>
              )}

              {section.type === "portfolio" && <PortfolioReturns />}

              {section.type === "contact" && (
                <Button
                  href={`mailto:${section.email}`}
                  variant="secondary"
                  className="mx-auto"
                  arrowColor={config.text}
                >
                  {section.buttonText ||
                    t("projectDetailUI.contactFallback", "Contact Me")}
                </Button>
              )}
            </FeatureBlock>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
