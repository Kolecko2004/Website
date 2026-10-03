import { useTranslation } from "react-i18next";
import Hero from "../components/Hero";
import { Button } from "../components/Button";

// Stránka 404 – neexistující adresa nebo neznámý projekt
export default function NotFound() {
  const { t } = useTranslation();

  return (
    <Hero
      badge={t("notFoundPage.badge")}
      title={t("notFoundPage.title")}
      description={t("notFoundPage.description")}
    >
      <div className="flex flex-wrap justify-center gap-4">
        <Button to="/" variant="primary" back>
          {t("notFoundPage.homeButton")}
        </Button>
        <Button to="/projects">{t("notFoundPage.projectsButton")}</Button>
      </div>
    </Hero>
  );
}
