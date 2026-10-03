import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import Hero from "../components/Hero";
import { FeatureBlock } from "../components/FeatureBlock";
import Reveal from "../components/Reveal";
import { Button } from "../components/Button";
import PortfolioReturns from "../components/PortfolioReturns";
import { CONTACT_EMAIL } from "../data/locales/shared";
import { PROJECTS } from "../data/visuals";
import NotFound from "./NotFound";

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { t } = useTranslation();

  const project = t(`projectDetails.${projectId}`, { returnObjects: true });
  if (!Object.hasOwn(PROJECTS, projectId) || typeof project !== "object") {
    return <NotFound />;
  }
  const { images } = PROJECTS[projectId];

  return (
    <div className="pb-8">
      <Hero badge={project.badge} title={project.title} description={project.description}>
        {/* Vždy vede na přehled projektů (i když uživatel přišel přímo odkazem zvenku) */}
        <Button to="/projects" back>
          {t("projectDetailUI.backButton")}
        </Button>
      </Hero>

      <div className="max-w-5xl mx-auto px-4 md:px-6 grid grid-cols-1 gap-9">
        {project.sections?.map((section, index) => (
          <Reveal key={index}>
            <FeatureBlock
              title={section.title}
              description={section.content || section.description}
              align={section.type === "contact" ? "center" : "left"}
            >
              {section.type === "image-grid" && images && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {images.map((img, i) => (
                    <div key={img} className="rounded-[26px] shadow-neu-in p-2.5">
                      <img
                        src={img}
                        alt={`${project.title} ${i + 1}`}
                        loading="lazy"
                        className="h-72 w-full object-cover rounded-[20px]"
                      />
                    </div>
                  ))}
                </div>
              )}

              {section.type === "portfolio" && <PortfolioReturns />}

              {section.type === "contact" && (
                <Button href={`mailto:${CONTACT_EMAIL}`} variant="primary">
                  {section.buttonText}
                </Button>
              )}
            </FeatureBlock>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
