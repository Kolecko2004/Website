import React from "react";
import Hero from "../components/Hero";
import { FeatureBlock } from "../components/FeatureBlock";
import { Printer, Box, Globe, Cpu } from "lucide-react";

const hobbies = [
  {
    title: "Gym",
    description:
      "Developing responsive, high-performance web applications using React, Tailwind, and modern full-stack technologies.",
    icon: <Globe className="text-green-400" size={32} />,
    color: "bg-cyan-400",
  },
  {
    title: "Formula 1",
    description:
      "Designing complex geometries and functional parts in CAD software, optimized for both aesthetics and structural integrity.",
    icon: <Box className="text-cyan-400" size={32} />,
    color: "bg-green-400",
  },
  {
    title: "3D Printing",
    description:
      "From slicing to post-processing. Experience with FDM printing, material selection (PLA/PETG/ASA), and printer maintenance.",
    icon: <Printer className="text-purple-400" size={32} />,
    color: "bg-green-400",
  },
  {
    title: "Going out woth friends",
    description:
      "Programming industrial controllers and integrating hardware/software for automated manufacturing processes.",
    icon: <Cpu className="text-green-400" size={32} />,
    color: "bg-cyan-400",
  },
  {
    title: "Plants",
    description:
      "Programming industrial controllers and integrating hardware/software for automated manufacturing processes.",
    icon: <Cpu className="text-cyan-400" size={32} />,
    color: "bg-cyan-400",
  },
  {
    title: "Cats",
    description:
      "Programming industrial controllers and integrating hardware/software for automated manufacturing processes.",
    icon: <Cpu className="text-purple-400" size={32} />,
    color: "bg-cyan-400",
  },
];

const USE_ALTERNATING_COLORS = true; 

const COLORS = ["bg-green-400", "bg-cyan-400", "bg-purple-400"];

function Hobbies() {
  return (
    <div>
      <Hero
        badge="Hobbies"
        title={<>Free time</>}
        description="In here you can find lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec tellus nibh,"
      />
      <div className="grid gap-8 max-w-6xl mx-auto mb-12">
        {hobbies.map((project, index) => {
          const blockColor = USE_ALTERNATING_COLORS 
            ? COLORS[index % COLORS.length]
            : "bg-green-400";
          return (
            <div key={index} className="flex flex-col">
              <FeatureBlock
                title={project.title}
                description={project.description}
                accentColor={blockColor} 
              >
                <div className="flex justify-center items-center gap-4">
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

export default Hobbies;
