import React from 'react';

export const Header = ({ level = 1, children, className = "" }) => {
  const baseStyles = "leading-tight";

  const sizes = {
    1: "text-6xl md:text-8xl font-black text-slate-900 mb-8",
    2: "text-3xl md:text-5xl font-bold text-green-400",
    3: "text-xl md:text-3xl",
    4: "text-green-400 font-bold tracking-widest uppercase text-sm mb-4",
  };

  const Tag = `h${level}`;

  return (
    <Tag className={`${baseStyles} ${sizes[level]} ${className}`}>
      {children}
    </Tag>
  );
};