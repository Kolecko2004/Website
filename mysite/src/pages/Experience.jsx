import React from "react";
import { useTranslation, Trans } from "react-i18next";
import Hero from "../components/Hero";
import Timeline from "../components/Timeline";
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
      <div>
        <Header className="text-center" level={2}>
          {t("experiencePage.workTitle")}
        </Header>
        <Timeline items={jobs} />

        <Header className="text-center" level={2}>
          {t("experiencePage.educationTitle")}
        </Header>
        <Timeline items={education} />
      </div>
    </div>
  );
}

export default Experience;