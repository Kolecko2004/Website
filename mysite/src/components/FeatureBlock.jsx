import React from "react";
import { Header } from "./Headers";

// icon: volitelná ikona nad nadpisem
// align: "center" pro krátké texty karet, "left" pro delší odstavce (lépe se čte)
export const FeatureBlock = ({
  title,
  description,
  icon,
  align = "center",
  accentColor = "bg-green-400",
  children,
}) => {
  return (
    <div className="group relative overflow-hidden bg-slate-900 max-w-6xl mx-auto text-center border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl w-full h-full flex flex-col transition-colors duration-500 hover:border-slate-700 dark:bg-slate-900/40 dark:backdrop-blur-sm dark:border-white/10 dark:hover:border-white/20 dark:shadow-black/30">
      {/* Barevná záře – pomalu se pohybuje, při najetí myší zesílí */}
      <div className="glow-drift absolute -top-24 -left-24 w-64 h-64 bg-green-400/15 group-hover:bg-green-400/25 rounded-full blur-3xl pointer-events-none transition-colors duration-700" />
      <div className="glow-drift-reverse absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-400/15 group-hover:bg-cyan-400/25 rounded-full blur-3xl pointer-events-none transition-colors duration-700" />

      <div className="relative z-10 grid gap-5 flex-grow content-start">
        {icon && (
          <div className="mx-auto flex items-center justify-center size-14 rounded-xl bg-slate-800/80 border border-slate-700 dark:bg-white/5 dark:border-white/10">
            {icon}
          </div>
        )}
        <Header level={2} className="text-white">
          {title}
        </Header>
        <div className={`w-16 h-1 ${accentColor} mx-auto rounded-full transition-all duration-500 ease-out group-hover:w-28`}></div>
        <div
          className={`md:px-8 text-slate-300 leading-relaxed text-base md:text-lg whitespace-pre-line ${
            align === "left" ? "text-left max-w-3xl mx-auto" : ""
          }`}
        >
          {description}
        </div>
      </div>

      {children && <div className="relative z-10 mt-6">{children}</div>}
    </div>
  );
};
