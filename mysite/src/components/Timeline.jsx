import Reveal from "./Reveal";

const TimelineItem = ({ year, title, subtitle, description, isLast }) => (
  <div className="flex gap-3 sm:gap-5 md:gap-7">
    {/* Vystouplá tečka a zamáčknutá drážka k další položce */}
    <div className="flex flex-col items-center w-10 shrink-0">
      <span className="flex items-center justify-center size-10 shrink-0 rounded-full bg-surface shadow-neu-sm">
        <span className="size-3.5 rounded-full bg-accent" />
      </span>
      {!isLast && <span className="w-2 flex-1 min-h-8 my-3.5 rounded-full shadow-neu-in" />}
    </div>

    <article className="flex-1 min-w-0 flex flex-col gap-2 rounded-[30px] bg-surface shadow-neu px-5 py-6 sm:px-6 sm:py-7 md:px-8 mb-9">
      <span className="self-start px-4 py-2 rounded-full shadow-neu-in text-xs font-bold tracking-[0.1em] uppercase">
        {year}
      </span>
      <h3 className="mt-2 text-xl md:text-[23px] font-extrabold tracking-[-0.01em]">{title}</h3>
      <p className="font-semibold text-muted">{subtitle}</p>
      <p className="mt-1 leading-relaxed text-muted">{description}</p>
    </article>
  </div>
);

export default function Timeline({ items }) {
  return (
    <div className="max-w-[860px] mx-auto px-4 md:px-6">
      {items.map((item, index) => (
        <Reveal key={item.title}>
          <TimelineItem {...item} isLast={index === items.length - 1} />
        </Reveal>
      ))}
    </div>
  );
}
