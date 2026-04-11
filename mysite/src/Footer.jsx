import React from "react";
import { MoveUpRight } from "lucide-react";

const FooterLink = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="group flex flex-col py-2 text-lg font-semibold text-white transition-colors hover:text-green-400"
  >
    <div className="flex items-center justify-between w-full">
      <span>{children}</span>
      <MoveUpRight
        size={18}
        className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
      />
    </div>

    {/* Animated Underline */}
    <div className="relative h-px w-full mt-1 bg-white/20 overflow-hidden">
      <div className="absolute inset-0 bg-green-400 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
    </div>
  </a>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-3xl font-black uppercase tracking-widest bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent mb-6">
    {children}
  </h2>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-slate-900 text-white pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <nav aria-label="Social links">
          <SectionTitle>Socials</SectionTitle>
          <div className="flex flex-col">
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
        </nav>

        <nav aria-label="Contact info">
          <SectionTitle>Contact</SectionTitle>
          <div className="flex flex-col">
            <FooterLink href="mailto:your@email.com">Email Me</FooterLink>
            <FooterLink href="https://linkedin.com/in/...">LinkedIn</FooterLink>
          </div>
        </nav>

        <nav aria-label="Discovery links">
          <SectionTitle>Discovery</SectionTitle>
          <div className="flex flex-col">
            <FooterLink href="#schools">Schools</FooterLink>
            <FooterLink href="#work">Work</FooterLink>
            <FooterLink href="#internships">Internships</FooterLink>
            <FooterLink href="#hobbies">Hobbies</FooterLink>
          </div>
        </nav>
      </div>

      <div className="mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs font-medium space-y-1">
        <p>© {currentYear} Vojtěch Drozd</p>
        <p>Built with React, Tailwind, and Lucide.</p>
        <p>Last updated: 9.4.2026</p>
      </div>
    </footer>
  );
}
