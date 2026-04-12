import React from "react";
import Hero from "../components/Hero";
import { Header } from "../components/Headers";
import { FeatureBlock } from "../components/FeatureBlock";
import { Printer, Box, Globe, Cpu } from "lucide-react";
import { Button } from "../components/Button";

const projectCategories = [
  {
    slug: "web-production", // Used for the URL
    title: "Web Production",
    description:
      "Developing responsive, high-performance web applications using React, Tailwind, and modern full-stack technologies.",
    icon: <Globe className="text-cyan-400" size={32} />,
    color: "bg-cyan-400",
  },
  {
    slug: "3d-modeling",
    title: "3D Modeling",
    description:
      "Designing complex geometries and functional parts in CAD software, optimized for both aesthetics and structural integrity.",
    icon: <Box className="text-green-400" size={32} />,
    color: "bg-green-400",
  },
  {
    slug: "3d-printing",
    title: "3D Printing",
    description:
      "From slicing to post-processing. Experience with FDM printing, material selection (PLA/PETG/ASA), and printer maintenance.",
    icon: <Printer className="text-green-400" size={32} />,
    color: "bg-green-400",
  },
  {
    slug: "automation",
    title: "PLC & Automation",
    description:
      "Programming industrial controllers and integrating hardware/software for automated manufacturing processes.",
    icon: <Cpu className="text-cyan-400" size={32} />,
    color: "bg-cyan-400",
  },
];

function Projects() {
  return (
    <div className="max-w-6xl mx-auto">
      <Hero
        badge="Projects"
        title={
          <>
            My personal <br /> projects
          </>
        }
        description="In here you can find what im working on in my presonal time or what excite me"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
        {projectCategories.map((project, index) => (
          <div key={index} className="flex flex-col">
            <FeatureBlock
              title={project.title}
              description={project.description}
              accentColor={project.color}
            >
              <div className="flex justify-center items-center gap-4">
                <Button
                  onClick={() =>
                    (window.location.href = `/projects/${project.slug}`)
                  }
                  className="w-full md:w-auto"
                >
                  View Projects
                </Button>
                <div>{project.icon}</div>
              </div>
            </FeatureBlock>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;
