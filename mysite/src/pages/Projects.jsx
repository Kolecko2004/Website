import { useTranslation, Trans } from "react-i18next";
import Hero from "../components/Hero";
import { FeatureBlock } from "../components/FeatureBlock";
import Reveal from "../components/Reveal";
import { Button } from "../components/Button";
import { PROJECTS } from "../data/visuals";

export default function Projects() {
  const { t } = useTranslation();

  const categories = t("projectsPage.categories", { returnObjects: true }) || [];

  return (
    <div className="pb-8">
      <Hero
        badge={t("projectsPage.badge")}
        title={<Trans i18nKey="projectsPage.heroTitle" />}
        description={t("projectsPage.heroDescription")}
      />
      <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-wrap gap-9">
        {categories.map((project, index) => {
          const Icon = PROJECTS[project.slug]?.Icon;
          return (
            <Reveal key={project.slug} delay={(index % 2) * 150} className="flex-[1_1_440px] min-w-0 flex">
              <FeatureBlock
                align="left"
                title={project.title}
                description={project.description}
                icon={Icon && <Icon size={30} aria-hidden="true" />}
                tag={t(`projectDetails.${project.slug}.badge`)}
              >
                <Button to={`/projects/${project.slug}`}>{t("projectsPage.viewProject")}</Button>
              </FeatureBlock>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
