import { useTranslation, Trans } from "react-i18next";
import Hero from "../components/Hero";
import { FeatureBlock } from "../components/FeatureBlock";
import Reveal from "../components/Reveal";
import { Button } from "../components/Button";
import { PROJECTS, accentAt } from "../data/visuals";

export default function Projects() {
  const { t } = useTranslation();

  const categories = t("projectsPage.categories", { returnObjects: true }) || [];

  return (
    <div>
      <Hero
        badge={t("projectsPage.badge")}
        title={<Trans i18nKey="projectsPage.heroTitle" />}
        description={t("projectsPage.heroDescription")}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto mb-16 px-6">
        {categories.map((project, index) => {
          const { Icon, accent = accentAt(0) } = PROJECTS[project.slug] || {};
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
                icon={Icon && <Icon className={accent.text} size={28} />}
                accentColor={accent.bg}
              >
                <Button
                  to={`/projects/${project.slug}`}
                  className="mx-auto"
                  arrowColor={accent.text}
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
