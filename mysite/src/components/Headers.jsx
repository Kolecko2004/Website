// Nadpis stránky (level 1) nebo sekce (level 2)
const SIZES = {
  1: "text-5xl sm:text-6xl md:text-8xl font-black text-slate-900 tracking-tight dark:bg-gradient-to-b dark:from-white dark:to-slate-400 dark:bg-clip-text dark:text-transparent",
  2: "text-3xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent",
};

export const Header = ({ level = 1, children, className = "" }) => {
  const Tag = `h${level}`;
  return <Tag className={`leading-tight ${SIZES[level]} ${className}`}>{children}</Tag>;
};
