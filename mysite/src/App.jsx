import React from "react";
// PŘIDÁNO: useParams musí být importován z react-router-dom
import { Routes, Route, useParams } from "react-router-dom"; 
import Home from "./pages/Home";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import { projectData } from "./data/ProjectData";

function ProjectWrapper() {
  const { projectId } = useParams(); 
  const data = projectData[projectId];
  
  // DOBRÁ PRAXE: Kontrola, zda data existují
  if (!data) {
    return <div className="text-white text-center py-20">Project not found!</div>;
  }

  return <ProjectDetail data={data} />;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:projectId" element={<ProjectWrapper />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}