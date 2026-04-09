import React from "react";
import { MoveUpRight } from "lucide-react";

const FooterLink = ({ href, children }) => (
  <a
    href={href}
    className="group flex justify-between items-center font-semibold text-lg text-green-400 py-1"
  >
    <div className="flex justify-between w-full border-b border-transparent group-hover:border-green-400 transition-all">
      <span>{children}</span>
      <MoveUpRight size={18} />
    </div>
  </a>
);

export default function Footer() {
  return (
    <footer className="bg-slate-900 rounded-t-[82px] text-white pt-24 pb-12">
      <div className="max-w-6xl grid grid-cols-3 w-full text-center mx-auto">
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
      <div className="text-center pt-12 text-slate-600 text-xs">
        <p>Copyright: © 2026 Vojtěch Drozd</p>
        <p>Built with React, Tailwind, and Lucide.</p>
        <p>Last updated: 9.4.2026</p>
      </div>
    </footer>
  );
}
