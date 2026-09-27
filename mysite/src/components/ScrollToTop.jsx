import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Posune stránku na úplný začátek (nahoru a doleva)
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Komponenta nic nevykresluje
}