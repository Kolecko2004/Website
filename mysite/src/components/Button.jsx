import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const VARIANTS = {
  primary: "bg-green-400 text-slate-900 border-green-400",
  secondary: "bg-slate-800 text-white border-slate-700 dark:bg-white/5 dark:border-white/15 dark:hover:border-white/30",
};

// Odkaz ve tvaru tlačítka: `to` = stránka webu, `href` = cokoli jiného (např. mailto:)
// back: šipka doleva před textem (tlačítka „Zpět“)
// arrowColor: barva šipky (sladit s barvou karty)
export const Button = ({
  href,
  to,
  children,
  className = "",
  variant = "secondary",
  back = false,
  arrowColor = "text-green-400",
}) => {
  const Arrow = back ? ArrowLeft : ArrowRight;
  const arrow = (
    <Arrow
      size={20}
      className={`relative z-10 transition-transform duration-[400ms] ${
        variant === "primary" ? "text-slate-900" : arrowColor
      } ${back ? "group-hover:-translate-x-2" : "group-hover:translate-x-2"}`}
    />
  );

  const content = (
    <>
      {/* Lesklý pruh, který při najetí myší přejede přes tlačítko */}
      <span className="absolute top-0 -left-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-[1250ms] ease-in-out" />
      {back && arrow}
      <span className="relative z-10">{children}</span>
      {!back && arrow}
    </>
  );

  const classes = `relative overflow-hidden group flex items-center justify-center gap-4 px-6 py-2 font-semibold rounded-full border transition-all w-fit ${VARIANTS[variant]} ${className}`;

  return to ? (
    <Link to={to} className={classes}>
      {content}
    </Link>
  ) : (
    <a href={href} className={classes}>
      {content}
    </a>
  );
};
