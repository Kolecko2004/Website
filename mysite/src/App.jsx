import React, { Suspense, lazy } from "react";
import { Routes, Route, useParams, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Hobbies from "./pages/Hobbies";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import usePageMeta from "./components/usePageMeta";

// Administrace se stahuje až při otevření /admin (běžní návštěvníci ji nenačítají)
const AdminPage = lazy(() => import("./admin/AdminPage"));

function ProjectWrapper() {
  const { projectId } = useParams(); 
  return <ProjectDetail projectId={projectId} />;
}

export default function App() {
  const { pathname } = useLocation();
  usePageMeta();

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return (
      <Suspense fallback={null}>
        <AdminPage />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main key={pathname} className="flex-grow page-in">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/hobbies" element={<Hobbies />} />
          <Route path="/projects/:projectId" element={<ProjectWrapper />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}