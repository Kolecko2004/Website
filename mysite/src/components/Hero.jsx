import React from "react";
import { Header } from "./Headers";
import { Button } from "./Button";

// fullHeight: velký úvod přes většinu obrazovky (jen domovská stránka),
// ostatní stránky mají kompaktní hero, aby byl obsah hned vidět
export default function Hero({
  badge,
  title,
  description,
  fullHeight = false,
  children,
  primaryBtnText,
  primaryBtnAction,
  secondaryBtnText,
  secondaryBtnHref,
}) {
  return (
    <section
      className={`w-full flex justify-center text-center items-center bg-white px-6 ${
        fullHeight ? "min-h-[calc(85vh-72px)] py-16" : "pt-16 pb-12 md:pt-24 md:pb-16"
      }`}
    >
      <div className="max-w-4xl grid gap-4">
        {badge && <Header level={4}>{badge}</Header>}

        <Header level={1} className="break-words hyphens-auto">
          {title}
        </Header>

        {description && (
          <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        )}

        {children && <div className="mt-6">{children}</div>}

        {(primaryBtnText || secondaryBtnText) && (
          <div className="flex flex-wrap justify-center items-center gap-6 mt-6">
            {primaryBtnText && (
              <Button onClick={primaryBtnAction} className="py-4">
                {primaryBtnText}
              </Button>
            )}

            {secondaryBtnText && (
              <a
                href={secondaryBtnHref || "#"}
                className="text-slate-900 font-bold group flex flex-col text-lg py-4 cursor-pointer transition-all"
              >
                {secondaryBtnText}
                <div className="relative h-[2px] w-full mt-0.5 overflow-hidden">
                  <div className="absolute inset-0 bg-slate-300"></div>
                  <div className="absolute inset-0 bg-green-400 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
                </div>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
