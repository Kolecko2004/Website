import React from "react";
import { ArrowRight } from "lucide-react";
import { Header } from "./Headers";
import { Button } from "./Button";

export default function Hero({
  badge = "Software Developer",
  title,
  description,
  primaryBtnText,
  primaryBtnAction,
  secondaryBtnText,
  secondaryBtnHref,
}) {
  return (
    <section className="w-full min-h-[70vh] flex justify-center text-center items-center bg-white px-10 my-12">
      <div className="max-w-4xl grid gap-4">
        <Header level={4}>{badge}</Header>

        <Header level={1}>{title}</Header>

        <p className="text-xl text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed">
          {description}
        </p>

        {(primaryBtnText || secondaryBtnText) && (
          <div className="flex flex-wrap justify-center items-center gap-6">
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
