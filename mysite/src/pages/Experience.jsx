import { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Briefcase, GraduationCap } from "lucide-react";
import Hero from "../components/Hero";
import Timeline from "../components/Timeline";

// Přepínač Práce / Vzdělání (klíč = seznam v locales → experiencePage)
const TABS = [
  { key: "jobs", title: "workTitle", Icon: Briefcase },
  { key: "education", title: "educationTitle", Icon: GraduationCap },
];

export default function Experience() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("jobs");
  const items = t(`experiencePage.${tab}`, { returnObjects: true }) || [];

  return (
    <div className="pb-8">
      <Hero
        badge={t("experiencePage.badge")}
        title={<Trans i18nKey="experiencePage.heroTitle" />}
        description={t("experiencePage.heroDescription")}
      >
        <div role="group" aria-label={t("experiencePage.badge")} className="flex flex-wrap justify-center gap-1.5 p-1.5 rounded-[30px] shadow-neu-in">
          {TABS.map(({ key, title, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              aria-pressed={tab === key}
              className={`inline-flex items-center gap-2.5 min-h-12 px-6 rounded-full font-bold cursor-pointer transition-shadow duration-200 ${
                tab === key ? "bg-surface shadow-neu-sm" : "text-muted hover:text-ink"
              }`}
            >
              <Icon size={18} aria-hidden="true" className="text-accent-ink" />
              {t(`experiencePage.${title}`)}
            </button>
          ))}
        </div>
      </Hero>
      <Timeline key={tab} items={items} />
    </div>
  );
}
