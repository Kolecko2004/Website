import React from "react";
import { Header } from "./Headers";

export const FeatureBlock = ({
  title,
  description,
  accentColor = "bg-green-400",
  children,
}) => {
  return (
    <div className="relative overflow-hidden bg-slate-900 max-w-6xl mx-auto text-center border border-slate-800 rounded-2xl p-8 shadow-2xl w-full">
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-400/15 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl" />

      <div className="relative z-10 grid gap-6">
        <Header level={2} className="text-white">
          {title}
        </Header>
        <div className={`w-16 h-1 ${accentColor} mx-auto rounded-full`}></div>
        <p className="px-4 md:px-8 text-slate-400 leading-relaxed text-lg">
          {description}
        </p>

        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
};
