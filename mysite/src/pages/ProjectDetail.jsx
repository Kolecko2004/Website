import React from "react";
import { useTranslation } from "react-i18next";
import { FeatureBlock } from "../components/FeatureBlock";
import { Header } from "../components/Headers";
import { Button } from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";

import img1 from "../data/3d-modeling-img1.png";
import img2 from "../data/3d-modeling-img2.png";

const projectConfig = {
  "web-production": {
    color: "bg-cyan-400"
  },
  "3d-modeling": {
    color: "bg-green-400",
    images: [img1, img2]
  },
  "3d-printing": {
    color: "bg-green-400"
  }
};

export default function ProjectDetail({ projectId: propProjectId }) {
  const navigate = useNavigate();
  const { projectId: urlProjectId } = useParams();
  const { t } = useTranslation();

  const activeId = propProjectId || urlProjectId;
  const projectData = t(`projectDetails.${activeId}`, { returnObjects: true });
  const config = projectConfig[activeId];

  if (!projectData || typeof projectData === "string" || !config) {
    return (
      <div className="text-white p-20 text-center">
        {t("projectDetailUI.notFound", "Project not found.")}
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="text-center grid gap-4 justify-center my-12 px-6">
        <Header level={4}>{projectData.badge}</Header>
        <Header>{projectData.title}</Header>
        <Header level={3} className="text-slate-400 max-w-2xl mx-auto">
          {projectData.description}
        </Header>
        <Button className="mx-auto" onClick={() => navigate(-1)}>
          {t("projectDetailUI.backButton", "Back to Projects")}
        </Button>
      </div>

      <div className="grid gap-8 px-6">
        {projectData.sections?.map((section, index) => (
          <FeatureBlock
            key={index}
            title={section.title}
            description={
              <span className="whitespace-pre-line">
                {section.content || section.description}
              </span>
            }
            accentColor={config.color}
          >
            {section.type === "image-grid" && config.images && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {config.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Project visual ${i + 1}`}
                    className="h-72 w-full object-cover rounded-xl border border-slate-700 shadow-lg"
                  />
                ))}
              </div>
            )}

            {section.type === "contact" && (
              <div className="flex justify-center">
                <Button 
                  href={`mailto:${section.email}`}
                  variant="secondary"
                  className="mx-auto"
                >
                  {section.buttonText || t("projectDetailUI.contactFallback", "Contact Me")}
                </Button>
              </div>
            )}
          </FeatureBlock>
        ))}
      </div>
    </div>
  );
}