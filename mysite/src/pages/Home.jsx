import { useTranslation, Trans } from "react-i18next";
import Hero from "../components/Hero";
import { FeatureBlock } from "../components/FeatureBlock";
import Reveal from "../components/Reveal";
import { Button } from "../components/Button";
import { accentAt } from "../data/visuals";

// Rozcestník: klíč textů v locales = adresa stránky
const SECTIONS = ["projects", "experience", "hobbies"];

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <Hero
        fullHeight
        badge={t("heroBadge")}
        title={<Trans i18nKey="heroTitle" />}
        description={t("heroDescription")}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-16 px-6">
        {SECTIONS.map((id, index) => {
          const accent = accentAt(index);
          return (
            <Reveal
              key={id}
              delay={index === 0 ? 0 : (index - 1) * 150}
              className={index === 0 ? "md:col-span-2" : ""}
            >
              <FeatureBlock
                title={t(`${id}.title`)}
                description={t(`${id}.description`)}
                accentColor={accent.bg}
              >
                <Button className="mx-auto" to={`/${id}`} arrowColor={accent.text}>
                  {t("explore")} {t(`${id}.title`)}
                </Button>
              </FeatureBlock>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
