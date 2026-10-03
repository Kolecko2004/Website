import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Mail, Menu, X } from "lucide-react";
import logo from "./assets/logo_white_transparent_cropped.png";
import { LanguageSwitcher, ThemeSwitcher } from "./components/Switchers";
import { CONTACT_EMAIL } from "./data/locales/shared";

const LINKS = [
  { to: "/", key: "home" },
  { to: "/projects", key: "projects" },
  { to: "/experience", key: "experience" },
  { to: "/hobbies", key: "hobbies" },
];

// Aktivní stránka je „zamáčknutá“, ostatní při najetí myší vystoupí
const NavbarLink = ({ to, children }) => (
  <NavLink
    to={to}
    end={to === "/"}
    className={({ isActive }) =>
      `inline-flex items-center min-h-12 px-6 rounded-full font-bold transition-shadow duration-200 ${
        isActive ? "shadow-neu-in" : "hover:shadow-neu-sm"
      }`
    }
  >
    {children}
  </NavLink>
);

const MailButton = () => {
  const { t } = useTranslation();
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      aria-label={t("nav.email")}
      title={t("nav.email")}
      className="press flex items-center justify-center size-12 shrink-0 rounded-full bg-surface shadow-neu-sm text-accent-ink"
    >
      <Mail size={20} aria-hidden="true" />
    </a>
  );
};

export default function Navbar() {
  const { t } = useTranslation();
  const { pathname } = useLocation();

  // Menu si pamatuje stránku, na které bylo otevřeno → po přechodu jinam se samo zavře
  const [openedAt, setOpenedAt] = useState(null);
  const menuOpen = openedAt === pathname;

  // Odkazy a ovládání: na počítači v liště, na mobilu v rozbaleném menu
  const links = LINKS.map(({ to, key }) => (
    <NavbarLink key={to} to={to}>
      {t(`nav.${key}`)}
    </NavbarLink>
  ));
  const controls = (
    <>
      <MailButton />
      <ThemeSwitcher />
      <LanguageSwitcher />
    </>
  );

  return (
    <div className="sticky top-0 z-50 bg-surface pt-4 pb-3">
      <nav className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="rounded-[30px] bg-surface shadow-neu px-4 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo v barvě textu (maska z bílého PNG), funguje ve světlém i tmavém režimu */}
            <Link
              to="/"
              aria-label="Vojtěch Drozd"
              className="press flex items-center justify-center size-[52px] shrink-0 rounded-full bg-surface shadow-neu-sm"
            >
              <span
                className="block w-8 h-5 bg-ink"
                style={{
                  WebkitMask: `url(${logo}) center / contain no-repeat`,
                  mask: `url(${logo}) center / contain no-repeat`,
                }}
              />
            </Link>

            {/* Desktop */}
            <div className="hidden lg:flex items-center gap-2">{links}</div>
            <div className="hidden lg:flex items-center gap-3.5">{controls}</div>

            {/* Mobil – tlačítko menu */}
            <button
              type="button"
              onClick={() => setOpenedAt(menuOpen ? null : pathname)}
              aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
              aria-expanded={menuOpen}
              className={`lg:hidden flex items-center justify-center size-12 rounded-full bg-surface cursor-pointer transition-shadow ${
                menuOpen ? "shadow-neu-in" : "shadow-neu-sm"
              }`}
            >
              {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>

          {/* Mobil – rozbalené menu */}
          {menuOpen && (
            <div className="lg:hidden flex flex-col gap-1.5 pt-4">
              {links}
              <div className="flex flex-wrap items-center gap-3.5 pt-4 pb-1 px-1">{controls}</div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}
