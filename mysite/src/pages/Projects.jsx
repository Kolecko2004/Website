import React from "react";
import Hero from "../components/Hero";
import { Header } from "../components/Headers";
import { FeatureBlock } from "../components/FeatureBlock";
import { Printer, Box, Globe, Cpu } from "lucide-react";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

const projectCategories = [
  {
    slug: "web-production", // Used for the URL
    title: "Web Production",
    description:
      "Tvorba webových stránek v Reactu a Tailwindu, kterou dělám primárně pro radost a osobní rozvoj.",
    icon: <Globe className="text-cyan-400" size={32} />,
    color: "bg-cyan-400",
  },
  {
    slug: "3d-modeling",
    title: "3D Modeling",
    description:
      "Tvorba funkčních a estetických CAD modelů, od technických návrhů až po přípravu pro 3D tisk.",
    icon: <Box className="text-green-400" size={32} />,
    color: "bg-green-400",
  },
  {
    slug: "3d-printing",
    title: "3D Printing",
    description:
      "Můj nový koníček, díky kterému převádím digitální nápady do reálných předmětů, primárně pro osobní účely a zábavu.",
    icon: <Printer className="text-green-400" size={32} />,
    color: "bg-green-400",
  },
];

function Projects() {
  const navigate = useNavigate();
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
        {projectCategories.map((project, index) => {
          const isLastAndOdd = 
            index === projectCategories.length - 1 && 
            projectCategories.length % 2 !== 0;

          return (
            <div 
              key={index} 
              className={`flex flex-col ${isLastAndOdd ? "md:col-span-2" : ""}`}
            >
              <FeatureBlock
                title={project.title}
                description={project.description}
                accentColor={project.color}
              >
                <div className="flex justify-center items-center gap-4">
                  <Button
                    to={`/projects/${project.slug}`}
                    className="w-full md:w-auto"
                  >
                    Podívat se
                  </Button>
                  <div>{project.icon}</div>
                </div>
              </FeatureBlock>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Projects;
