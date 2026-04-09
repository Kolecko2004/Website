import React from "react";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="text-2xl font-black text-indigo-600 tracking-tighter">
        MYSITE
      </div>
      <div className="space-x-8 font-medium text-gray-600">
        <a href="/" className="hover:text-indigo-600 transition">
          Home
        </a>
        <a href="/projects" className="hover:text-indigo-600 transition">
          Projects
        </a>
        <a href="/about" className="hover:text-indigo-600 transition">
          About
        </a>
      </div>
      <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm hover:bg-slate-800 transition">
        Get in Touch
      </button>
    </nav>
  );
}
