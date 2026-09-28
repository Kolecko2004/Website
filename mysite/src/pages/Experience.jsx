import React from "react";
import { useTranslation, Trans } from "react-i18next";
import Hero from "../components/Hero";
import Timeline from "../components/Timeline";
import Reveal from "../components/Reveal";
import { Header } from "../components/Headers";

function Experience() {
  const { t } = useTranslation();

  // Získání polí objektů z překladového souboru
  const education = t("experiencePage.education", { returnObjects: true }) || [];
  const jobs = t("experiencePage.jobs", { returnObjects: true }) || [];

  return (
    <div>
      <Hero
        badge={t("experiencePage.badge")}
        title={
          <Trans i18nKey="experiencePage.heroTitle">
            My journey <br /> so far
          </Trans>
        }
        description={t("experiencePage.heroDescription")}
      />
      <div className="pb-8">
        <Reveal>
          <Header className="text-center px-6" level={2}>
            {t("experiencePage.workTitle")}
          </Header>
        </Reveal>
        <Timeline items={jobs} />

        <Reveal>
          <Header className="text-center px-6 mt-8" level={2}>
            {t("experiencePage.educationTitle")}
          </Header>
        </Reveal>
        <Timeline items={education} />
      </div>
    </div>
  );
}

export default Experience;