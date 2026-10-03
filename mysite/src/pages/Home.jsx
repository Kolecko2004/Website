import { useTranslation, Trans } from "react-i18next";
import { Briefcase, Flag, GraduationCap, MapPin, TrendingUp } from "lucide-react";
import Hero from "../components/Hero";
import { FeatureBlock } from "../components/FeatureBlock";
import Reveal from "../components/Reveal";
import { Button } from "../components/Button";
import { CountdownRing } from "../components/PortfolioReturns";
import { CONTACT_EMAIL } from "../data/locales/shared";

// Rozcestník: klíč textů v locales = adresa stránky
const SECTIONS = [
  { id: "projects", Icon: Briefcase },
  { id: "experience", Icon: GraduationCap },
  { id: "hobbies", Icon: Flag },
];

const Chip = ({ icon: Icon, children, className }) => (
  <span
    className={`absolute inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-surface shadow-neu-sm px-4 py-3 text-[13px] font-bold ${className}`}
  >
    <Icon size={16} aria-hidden="true" className="text-accent-ink" />
    {children}
  </span>
);

// Kruhový „ovladač“ s monogramem vedle úvodního textu (jen ozdoba)
function Dial() {
  const { t } = useTranslation();
  const arc = "conic-gradient(from 200deg, var(--accent) 0 34%, transparent 34% 100%)";
  const mask = "radial-gradient(farthest-side, transparent calc(100% - 9px), #000 calc(100% - 8px))";

  return (
    <div className="relative w-[440px] max-w-full aspect-square" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-surface shadow-neu" />
      <div className="absolute inset-[9%] rounded-full shadow-neu-in" />
      <div className="absolute inset-[9%] rounded-full" style={{ background: arc, WebkitMask: mask, mask }} />
      <div
        className="absolute inset-[23%] rounded-full bg-surface flex flex-col items-center justify-center gap-1.5"
        style={{
          boxShadow:
            "10px 10px 24px var(--lo), -10px -10px 24px var(--hi), 0 0 48px color-mix(in srgb, var(--accent) 38%, transparent)",
        }}
      >
        <span className="text-[clamp(2.5rem,6vw,4.25rem)] font-extrabold leading-none tracking-[-0.05em]">VD</span>
        <span className="text-[13px] font-semibold text-muted">{t("heroChips.role")}</span>
      </div>
      <Chip icon={GraduationCap} className="top-[4%] -left-[6%]">
        {t("heroChips.study")}
      </Chip>
      <Chip icon={MapPin} className="bottom-[6%] -right-[4%]">
        {t("heroChips.city")}
      </Chip>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="pb-8">
      <Hero
        badge={t("heroBadge")}
        title={<Trans i18nKey="heroTitle" />}
        description={t("heroDescription")}
        aside={<Dial />}
      >
        <div className="flex flex-wrap gap-4">
          <Button to="/projects" variant="primary" className="min-h-14 px-8">
            {t("explore")} {t("projects.title")}
          </Button>
          <Button href={`mailto:${CONTACT_EMAIL}`} className="min-h-14 px-8">
            {t("nav.email")}
          </Button>
        </div>
      </Hero>

      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-10">
        <div className="flex flex-wrap gap-8">
          {SECTIONS.map(({ id, Icon }, index) => (
            <Reveal key={id} delay={index * 120} className="flex-[1_1_300px] flex">
              <FeatureBlock
                align="left"
                title={t(`${id}.title`)}
                description={t(`${id}.description`)}
                icon={<Icon size={28} aria-hidden="true" />}
              >
                <Button to={`/${id}`}>
                  {t("explore")} {t(`${id}.title`)}
                </Button>
              </FeatureBlock>
            </Reveal>
          ))}
        </div>

        {/* Upoutávka na živou výnosnost portfolia */}
        <Reveal>
          <section className="flex flex-wrap items-center gap-12 rounded-[40px] bg-surface shadow-neu p-8 md:p-10">
            <div className="flex-[1_1_380px] flex flex-col items-start gap-5">
              <span className="flex items-center justify-center size-[70px] rounded-3xl shadow-neu-in text-accent-ink">
                <TrendingUp size={28} aria-hidden="true" />
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-[-0.02em]">
                {t("projectDetails.investing.sections.1.title")}
              </h2>
              <p className="max-w-md text-muted leading-relaxed md:text-lg">
                {t("projectDetails.investing.sections.1.description")}
              </p>
              <Button to="/projects/investing">{t("projectsPage.viewProject")}</Button>
            </div>
            <div className="flex-[0_1_260px] flex justify-center">
              <CountdownRing size={240} />
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
