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
import Hobbies from "./pages/Hobbies";

function ProjectWrapper() {
  const { projectId } = useParams(); 
  const data = projectData[projectId];
  
  if (!data) {
    // Schválně přidáme křiklavě červené pozadí, abychom měli jistotu, že to nepřehlédneme
    return (
      <div className="bg-red-500 text-white text-4xl text-center py-20">
        DATA NENALEZENA PRO: {projectId}
      </div>
    );
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
          <Route path="/hobbies" element={<Hobbies />} />

          <Route path="/projects/:projectId" element={<ProjectWrapper />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}