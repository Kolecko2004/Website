import React from "react";
import { FeatureBlock } from "../components/FeatureBlock";
import { Header } from "../components/Headers";
import { Button } from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function ProjectDetail({ data }) {
  const navigate = useNavigate();

  if (!data)
    return (
      <div className="text-white p-20 text-center">Project not found.</div>
    );

  return (
    <div className="min-h-screen pb-20">
      <div className="text-center grid gap-4 justify-center my-12 px-6">
        <Header level={4}>{data.badge}</Header>
        <Header>{data.title}</Header>
        <Header level={3} className="text-slate-400 max-w-2xl mx-auto">
          {data.description}
        </Header>
        <Button className="mx-auto" onClick={() => navigate(-1)}>
          Back to Projects
        </Button>
      </div>

      <div className="grid gap-8 px-6">
        {data.sections?.map((section, index) => (
          <FeatureBlock
            key={index}
            title={section.title}
            description={section.content || section.description}
            accentColor={data.color}
          >
            {section.type === "image-grid" && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Project visual ${i + 1}`}
                    className="h-72 w-full object-cover rounded-xl border border-slate-700 shadow-lg"
                  />
                ))}
              </div>
            )}

            {section.type === "contact" && (
              <div className="flex justify-center">
                <Button 
                  href={`mailto:${section.email}`}
                  variant="secondary"
                  className="mx-auto"
                >
                  {section.buttonText || "Contact Me"}
                </Button>
              </div>
            )}
          </FeatureBlock>
        ))}
      </div>
    </div>
  );
}
