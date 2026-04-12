import React from "react";
import { FeatureBlock } from "../components/FeatureBlock";
import { Header } from "../components/Headers";
import { Button } from "../components/Button";

export default function ProjectDetail({ data }) {
  if (!data) return <div className="text-white p-20 text-center">Project not found.</div>;

  return (
    <div className="min-h-screen pb-20">
      <div className="text-center grid gap-4 justify-center my-12 px-6">
        <Header level={4}>{data.badge}</Header>
        <Header>{data.title}</Header>
        <Header level={3} className="text-slate-400 max-w-2xl mx-auto">
          {data.description}
        </Header>
        <Button className="mx-auto" onClick={() => window.history.back()}>
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
                  <div key={i} className="h-64 bg-slate-800 rounded-xl border border-slate-700 flex items-center justify-center text-slate-500">
                    Placeholder for {img}
                  </div>
                ))}
              </div>
            )}
          </FeatureBlock>
        ))}
      </div>
    </div>
  );
}