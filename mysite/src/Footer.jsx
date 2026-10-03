import { useTranslation } from "react-i18next";
import { Mail } from "lucide-react";
import { SocialIcon } from "./components/SocialIcons";
import { CONTACT_EMAIL, SOCIALS } from "./data/locales/shared";

// Datum posledního commitu – doplní se automaticky při buildu (viz vite.config.js)
const LAST_UPDATED = import.meta.env.VITE_LAST_UPDATED;

const SectionTitle = ({ children }) => (
  <h2 className="text-[13px] font-bold tracking-[0.14em] uppercase text-muted">{children}</h2>
);

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="max-w-6xl mx-auto px-4 md:px-6 pt-12 pb-10">
      <div className="flex flex-wrap gap-10 rounded-[40px] bg-surface shadow-neu p-8 md:p-10">
        <div className="flex-[1_1_240px] flex flex-col gap-4">
          <span className="text-2xl font-extrabold tracking-[-0.02em]">{t("footer.copyright")}</span>
          <p className="text-muted leading-relaxed">{t("footer.builtWith")}</p>
        </div>

        <nav aria-label={t("footer.socials")} className="flex-[1_1_240px] flex flex-col gap-4">
          <SectionTitle>{t("footer.socials")}</SectionTitle>
          <div className="flex gap-4">
            {Object.entries(SOCIALS).map(([name, href]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t(`footer.${name}`)}
                title={t(`footer.${name}`)}
                className="press flex items-center justify-center size-[52px] rounded-[18px] bg-surface shadow-neu-sm hover:text-accent-ink"
              >
                <SocialIcon name={name} />
              </a>
            ))}
          </div>
        </nav>

        <div className="flex-[1_1_300px] flex flex-col gap-4">
          <SectionTitle>{t("footer.contact")}</SectionTitle>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            aria-label={t("footer.emailMe")}
            className="self-start inline-flex items-center gap-2.5 max-w-full min-h-12 px-5 rounded-full shadow-neu-in text-sm font-bold [overflow-wrap:anywhere] hover:text-accent-ink"
          >
            <Mail size={18} aria-hidden="true" className="shrink-0 text-accent-ink" />
            {CONTACT_EMAIL}
          </a>
        </div>

        <div className="basis-full h-1.5 rounded-full shadow-neu-in" />
        <div className="basis-full flex flex-wrap justify-between gap-3 text-[13px] text-muted">
          <p>
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <p>
            {t("footer.lastUpdated")}: {LAST_UPDATED}
          </p>
        </div>
      </div>
    </footer>
  );
}
