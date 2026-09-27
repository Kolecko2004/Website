import React from 'react';

export const Header = ({ level = 1, children, className = "" }) => {
  const baseStyles = "leading-tight";

  const sizes = {
    1: "text-5xl sm:text-6xl md:text-8xl font-black text-slate-900 tracking-tight",
    2: "text-3xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent",
    3: "text-xl md:text-2xl bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent",
    4: "text-green-500 font-bold tracking-widest uppercase text-sm",
  };

  const Tag = `h${level}`;

  return (
    <Tag className={`${baseStyles} ${sizes[level]} ${className}`}>
      {children}
    </Tag>
  );
};
