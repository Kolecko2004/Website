import React from "react";
import { MoveUpRight } from "lucide-react";
import blobBg from "./assets/blob-scene-haikei.svg";

const FooterLink = ({ href, children }) => (
  <a
    className="group flex flex-col font-semibold text-lg text-white py-1 mix-blend-difference"
  >
    <div className="flex justify-between items-center w-full">
      <span>{children}</span>
      <MoveUpRight size={18} />
    </div>
    
    <div className="relative h-[1px] w-full mt-0.5 overflow-hidden">
      <div className="absolute inset-0 bg-white/20"></div>
      <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
    </div>
  </a>
);

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-slate-900 text-white pt-24 pb-12">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("${blobBg}")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      <div className="relative z-10 max-w-6xl grid grid-cols-1 w-full text-center mx-auto md:grid-cols-3">
        <div>
          <p className="font-bold mb-4 text-2xl">Socials</p>
          <div className="text-left px-10 grid">
            <FooterLink href="https://www.instagram.com/vojtech_drozd">
              Instagram
            </FooterLink>
            <FooterLink href="https://github.com/Kolecko2004">
              GitHub
            </FooterLink>
            <FooterLink href="https://www.facebook.com/vojta.drozd.1/">
              Facebook
            </FooterLink>
            <FooterLink href="https://www.linkedin.com/in/vojt%C4%9Bch-drozd-3918bb28b/">
              LinkedIn
            </FooterLink>
          </div>
        </div>

        <div>
          <p className="font-bold mb-4 text-2xl">Contact</p>
          <div className="px-10 grid">
            <FooterLink href="mailto:your@email.com">Email Me</FooterLink>
            <FooterLink href="https://linkedin.com/...">LinkedIn</FooterLink>
          </div>
        </div>

        <div>
          <p className="font-bold mb-4 text-2xl">Discovery</p>
          <div className="px-10 grid">
            <FooterLink href="">Schools</FooterLink>
            <FooterLink href="">Work</FooterLink>
            <FooterLink href="">Internships</FooterLink>
            <FooterLink href="">Hobbies</FooterLink>
          </div>
        </div>
      </div>

      <div className="relative z-10 text-center pt-12 text-slate-600 text-xs font-medium">
        <p>Copyright: © 2026 Vojtěch Drozd</p>
        <p>Built with React, Tailwind, and Lucide.</p>
        <p>Last updated: 9.4.2026</p>
      </div>
    </footer>
  );
}
