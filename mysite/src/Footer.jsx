import { useTranslation } from "react-i18next";
import { MoveUpRight } from "lucide-react";
import { CONTACT_EMAIL, SOCIALS } from "./data/locales/shared";

// Datum posledního commitu – doplní se automaticky při buildu (viz vite.config.js)
const LAST_UPDATED = import.meta.env.VITE_LAST_UPDATED;

const FooterLink = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex flex-col py-2 text-lg font-semibold text-white transition-colors hover:text-green-400"
  >
    <div className="flex items-center justify-between w-full">
      <span>{children}</span>
      <MoveUpRight
        size={18}
        className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
      />
    </div>

    {/* Animované podtržení */}
    <div className="relative h-px w-full mt-1 bg-white/20 overflow-hidden">
      <div className="absolute inset-0 bg-green-400 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
    </div>
  </a>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-widest bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-6">
    {children}
  </h2>
);

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative bg-slate-900 text-white pt-20 pb-10 px-6 dark:bg-slate-950/80 dark:border-t dark:border-white/10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-center">
        <nav aria-label={t("footer.socials")}>
          <SectionTitle>{t("footer.socials")}</SectionTitle>
          <div className="flex flex-col">
            {Object.entries(SOCIALS).map(([name, href]) => (
              <FooterLink key={name} href={href}>
                {t(`footer.${name}`)}
              </FooterLink>
            ))}
          </div>
        </nav>

        <nav aria-label={t("footer.contact")}>
          <SectionTitle>{t("footer.contact")}</SectionTitle>
          <div className="flex flex-col">
            <FooterLink href={`mailto:${CONTACT_EMAIL}`}>{t("footer.emailMe")}</FooterLink>
          </div>
        </nav>
      </div>

      <div
        className="max-w-6xl mx-auto mt-16 pt-8 border-t-2 border-transparent text-center text-slate-500 text-xs font-medium space-y-1"
        style={{ borderImage: "linear-gradient(to right, #4ade80, #22d3ee) 1" }}
      >
        <p>© {new Date().getFullYear()} {t("footer.copyright")}</p>
        <p>{t("footer.builtWith")}</p>
        <p>
          {t("footer.lastUpdated")}: {LAST_UPDATED}
        </p>
      </div>
    </footer>
  );
}
