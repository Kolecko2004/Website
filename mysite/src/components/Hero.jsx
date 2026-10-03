import { Header } from "./Headers";

// fullHeight: velký úvod přes většinu obrazovky (jen domovská stránka),
// ostatní stránky mají kompaktní hero, aby byl obsah hned vidět
export default function Hero({ badge, title, description, fullHeight = false, children }) {
  return (
    <section
      className={`w-full flex justify-center text-center items-center px-6 ${
        fullHeight ? "min-h-[calc(85vh-72px)] py-16" : "pt-16 pb-12 md:pt-24 md:pb-16"
      }`}
    >
      <div className="hero-in max-w-4xl grid gap-4">
        {badge && (
          <p className="leading-tight text-green-500 dark:text-green-400 font-bold tracking-widest uppercase text-sm">
            {badge}
          </p>
        )}

        <Header level={1} className="break-words hyphens-auto">
          {title}
        </Header>

        {description && (
          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        )}

        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
