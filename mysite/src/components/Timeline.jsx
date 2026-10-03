import Reveal from "./Reveal";

const TimelineItem = ({ year, title, subtitle, description, isLast }) => (
  <div className="relative pl-8 pb-12 group">
    {/* Svislá čára k další položce */}
    {!isLast && (
      <div className="absolute left-[11px] top-2 h-full w-[2px] bg-slate-200 group-hover:bg-slate-300 dark:bg-slate-800 dark:group-hover:bg-slate-700 transition-colors" />
    )}

    {/* Tečka s přechodem barev (stejný jako v patičce) */}
    <div className="absolute left-0 top-1 z-10 size-6 rounded-full border-4 border-white dark:border-slate-950 bg-gradient-to-r from-green-400 to-cyan-400 shadow-sm" />

    <div className="flex flex-col">
      <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 dark:text-cyan-400 mb-1">
        {year}
      </span>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="font-medium text-slate-500 dark:text-slate-400 mb-3">{subtitle}</p>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl text-sm">
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
