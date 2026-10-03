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
  const { accent, images } = PROJECTS[projectId];

  return (
    <div className="pb-16">
      <Hero
        badge={project.badge}
        title={project.title}
        description={project.description}
      >
        {/* Vždy vede na přehled projektů (i když uživatel přišel přímo odkazem zvenku) */}
        <Button className="mx-auto" to="/projects" back>
          {t("projectDetailUI.backButton")}
        </Button>
      </Hero>

      <div className="grid gap-6 md:gap-8 max-w-5xl mx-auto px-6">
        {project.sections?.map((section, index) => (
          <Reveal key={index}>
            <FeatureBlock
              title={section.title}
              description={section.content || section.description}
              align={section.type === "text" ? "left" : "center"}
              accentColor={accent.bg}
            >
              {section.type === "image-grid" && images && (
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {images.map((img, i) => (
                    <img
                      key={img}
                      src={img}
                      alt={`${project.title} ${i + 1}`}
                      loading="lazy"
                      className="h-72 w-full object-cover rounded-xl border border-slate-700 shadow-lg"
                    />
                  ))}
                </div>
              )}

              {section.type === "portfolio" && <PortfolioReturns />}

              {section.type === "contact" && (
                <Button
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mx-auto"
                  arrowColor={accent.text}
                >
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
