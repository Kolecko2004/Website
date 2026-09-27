import React from "react";
import { Routes, Route, useParams } from "react-router-dom"; 
import Home from "./pages/Home";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Hobbies from "./pages/Hobbies";
import ScrollToTop from "./components/ScrollToTop";

function ProjectWrapper() {
  const { projectId } = useParams(); 
  return <ProjectDetail projectId={projectId} />;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/hobbies" element={<Hobbies />} />
          <Route path="/projects/:projectId" element={<ProjectWrapper />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}