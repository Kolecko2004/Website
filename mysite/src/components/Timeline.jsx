import React from "react";
import Reveal from "./Reveal";

const TimelineItem = ({ year, title, subtitle, description, isLast }) => (
  <div className="relative pl-8 pb-12 group">
    {/* The Vertical Line */}
    {!isLast && (
      <div className="absolute left-[11px] top-2 h-full w-[2px] bg-slate-200 group-hover:bg-slate-300 transition-colors" />
    )}
    
    {/* The Timeline Dot (Gradient to match your footer) */}
    <div className="absolute left-0 top-1 z-10 size-6 rounded-full border-4 border-white bg-gradient-to-r from-green-400 to-cyan-400 shadow-sm" />

    {/* Content */}
    <div className="flex flex-col">
      <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 mb-1">
        {year}
      </span>
      <h3 className="text-xl font-bold text-slate-900">{title}</h3>
      <h4 className="text-md font-medium text-slate-500 mb-3">{subtitle}</h4>
      <p className="text-slate-500 leading-relaxed max-w-2xl text-sm">
        {description}
      </p>
    </div>
  </div>
);

export default function Timeline({ items }) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      {items.map((item, index) => (
        <Reveal key={index}>
          <TimelineItem {...item} isLast={index === items.length - 1} />
        </Reveal>
      ))}
    </div>
  );
}