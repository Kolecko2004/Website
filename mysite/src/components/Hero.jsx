import React from "react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="w-full min-h-[70vh] flex justify-center text-center items-center bg-white px-10">
      <div className="max-w-4xl">
        <p className="text-green-400 font-bold tracking-widest uppercase text-sm mb-4">
          Software Developer
        </p>

        <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8">
          Vojtěch <br /> Drozd
        </h1>

        <p className="text-xl text-slate-400 max-w-xl mb-10 leading-relaxed">
          I build functional web applications using React and Tailwind. Focused
          on clean code and simple interfaces.
        </p>

        <div className="flex justify-center items-center gap-6">
          <button className="bg-green-400 text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-transparent hover:text-green-400 transition-colors flex items-center gap-2">
            My Projects
            <ArrowRight size={20} />
          </button>
          <a
            href="#contact"
            className="text-slate-900 font-bold pb-1 group flex flex-col text-lg py-1 cursor-pointer transition-all"
          >
            Contact Me
            <div className="relative h-[2px] w-full mt-0.5 overflow-hidden">
              <div className="absolute inset-0 bg-slate-300"></div>
              <div className="absolute inset-0 bg-green-400 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
