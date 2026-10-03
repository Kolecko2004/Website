import { Badge } from "./Headers";

// Úvod stránky. S `aside` (jen domovská stránka) je text vlevo a obrázek vpravo,
// ostatní stránky mají kompaktní hero na střed, aby byl obsah hned vidět.
export default function Hero({ badge, title, description, aside, children }) {
  const split = Boolean(aside);

  return (
    <section
      className={`w-full max-w-6xl mx-auto px-4 md:px-6 ${
        split ? "flex flex-wrap items-center gap-12 md:gap-16 pt-10 pb-16 md:pt-16" : "pt-16 pb-12 md:pt-20 md:pb-16"
      }`}
    >
      <div
        className={`hero-in flex flex-col gap-6 ${
          split ? "flex-[1_1_460px] min-w-0 items-start" : "items-center text-center max-w-3xl mx-auto"
        }`}
      >
        {badge && <Badge>{badge}</Badge>}

        <h1
          className={`font-extrabold break-words hyphens-auto ${
            split
              ? "text-[clamp(3.75rem,8.5vw,7.25rem)] leading-[0.95] tracking-[-0.045em]"
              : "text-[clamp(3rem,7vw,5.5rem)] leading-none tracking-[-0.04em]"
          }`}
        >
          {title}
        </h1>

        {description && <p className="max-w-xl text-lg md:text-xl leading-relaxed text-muted">{description}</p>}

        {children && <div className="mt-2">{children}</div>}
      </div>

      {aside && <div className="flex-[1_1_380px] min-w-0 flex justify-center p-2 sm:p-6">{aside}</div>}
    </section>
  );
}
