import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./pages/Home";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Hobbies from "./pages/Hobbies";
import NotFound from "./pages/NotFound";
import usePageMeta from "./components/usePageMeta";

// Administrace se stahuje až při otevření /admin (běžní návštěvníci ji nenačítají)
const AdminPage = lazy(() => import("./admin/AdminPage"));

export default function App() {
  const { pathname } = useLocation();
  usePageMeta();

  // Každá stránka začíná nahoře
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return (
      <Suspense fallback={null}>
        <AdminPage />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main key={pathname} className="flex-grow page-in">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/hobbies" element={<Hobbies />} />
          <Route path="/projects/:projectId" element={<ProjectDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
