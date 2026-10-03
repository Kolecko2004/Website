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

// Odkaz s animovaným podtržením; aktivní stránka má podtržení trvale
const NavbarLink = ({ to, children }) => (
  <NavLink
    to={to}
    end={to === "/"}
    className="group flex flex-col font-semibold text-lg text-white py-1"
  >
    {({ isActive }) => (
      <>
        <span className={isActive ? "text-green-400" : ""}>{children}</span>
        <div className="relative h-[2px] w-full mt-0.5 bg-slate-700 overflow-hidden">
          <div
            className={`absolute inset-0 bg-green-400 transition-transform duration-500 ease-in-out ${
              isActive ? "translate-x-0" : "-translate-x-[101%] group-hover:translate-x-0"
            }`}
          />
        </div>
      </>
    )}
  </NavLink>
);

const MailButton = () => {
  const { t } = useTranslation();
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      aria-label={t("nav.email")}
      title={t("nav.email")}
      className="flex items-center justify-center size-10 rounded-full bg-slate-800 border border-slate-700 dark:bg-white/5 dark:border-white/10 text-green-400 hover:border-green-400 transition-colors"
    >
      <Mail size={18} />
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
    <nav className="sticky top-0 z-50 w-full bg-slate-900/95 backdrop-blur px-6 md:px-10 overflow-hidden border-b border-slate-800 dark:bg-slate-950/75 dark:border-white/10">
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex items-center justify-between py-4 min-h-[72px]">
        <Link to="/" className="shrink-0">
          <img
            src={logo}
            alt="Vojtěch Drozd"
            width={232}
            height={144}
            className="h-10 md:h-12 w-auto transition-opacity hover:opacity-80"
          />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">{links}</div>
        <div className="hidden md:flex items-center gap-3">{controls}</div>

        {/* Mobil – tlačítko menu */}
        <button
          type="button"
          onClick={() => setOpenedAt(menuOpen ? null : pathname)}
          aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
          aria-expanded={menuOpen}
          className="md:hidden flex items-center justify-center size-10 rounded-full bg-slate-800 border border-slate-700 dark:bg-white/5 dark:border-white/10 text-white cursor-pointer"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobil – rozbalené menu */}
      {menuOpen && (
        <div className="relative md:hidden flex flex-col gap-2 pb-6">
          {links}
          <div className="flex items-center gap-3 pt-4">{controls}</div>
        </div>
      )}
    </nav>
  );
}
