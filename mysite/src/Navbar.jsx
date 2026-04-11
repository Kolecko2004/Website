import React from "react";
import blobBg from "./assets/blob-scene-haikei.svg";
import logoBlack from "./assets/logo_black_transparent.png";

const NavbarLink = ({ href, children }) => (
  <a
    href={href}
    className="group flex flex-col font-semibold text-lg text-white py-1 cursor-pointer transition-all"
  >
    <span>{children}</span>

    <div className="relative h-[2px] w-full mt-0.5 overflow-hidden">
      <div className="absolute inset-0 bg-slate-600"></div>
      <div className="absolute inset-0 bg-green-400 translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
    </div>
  </a>
);

export default function Navbar() {
  return (
    <nav className="relative w-full bg-slate-900 px-10 flex justify-center md:justify-between items-center top-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("${blobBg}")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center right",
          backgroundSize: "cover",
        }}
      />

      <img
        src={logoBlack}
        alt="logo"
        className="hidden md:block h-28 w-auto brightness-0 invert"
      />

      <div className="relative z-10 flex items-center space-x-16 font-medium text-white py-4">
        <NavbarLink href="/hello">Home</NavbarLink>
        <NavbarLink href="/hello">Projects</NavbarLink>
        <NavbarLink href="/hello">About</NavbarLink>
      </div>

      <button className="hidden border-2 hover:border-transparent border-white md:block py-3 relative z-10 hover:bg-white hover:text-green-400 px-4 rounded-xl text-md font-bold bg-transparent text-white">
        Get in Touch
      </button>
    </nav>
  );
}
