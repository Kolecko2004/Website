import React from "react";
import logoBlack from "./assets/logo_white_transparent_cropped.png";
import { Button } from "./components/Button";

const NavbarLink = ({ href, children }) => (
  <a
    href={href}
    className="group flex flex-col font-semibold text-lg text-white py-1"
  >
    <span>{children}</span>
    {/* Underline Track */}
    <div className="relative h-[2px] w-full mt-0.5 bg-slate-700 overflow-hidden">
      {/* Animated Progress */}
      <div className="absolute inset-0 bg-green-400 -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />
    </div>
  </a>
);

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-900 px-6 md:px-10 overflow-hidden">
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-green-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex items-center justify-center py-6 min-h-[80px]">
        <div className="hidden md:block absolute left-0">
          <a href="/" className="cursor-pointer">
            <img
              src={logoBlack}
              alt="logo"
              className="h-16 w-auto brightness-0 invert transition-opacity hover:opacity-80"
            />
          </a>
        </div>

        <div className="flex items-center space-x-8 md:space-x-16 z-10">
          <NavbarLink href="/">Home</NavbarLink>
          <NavbarLink href="/projects">Projects</NavbarLink>
          <NavbarLink href="/about">About</NavbarLink>
        </div>

        <div className="hidden md:block absolute right-0">
          <Button>Get in Touch</Button>
        </div>
      </div>
    </nav>
  );
}
