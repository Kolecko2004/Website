import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const VARIANTS = {
  primary: "bg-accent text-white shadow-neu-sm",
  secondary: "bg-surface text-ink shadow-neu-sm",
};

// Odkaz ve tvaru tlačítka: `to` = stránka webu, `href` = cokoli jiného (např. mailto:)
// back: šipka doleva před textem (tlačítka „Zpět“)
export const Button = ({ href, to, children, className = "", variant = "secondary", back = false }) => {
  const Arrow = back ? ArrowLeft : ArrowRight;
  const arrow = (
    <Arrow
      size={18}
      strokeWidth={2.2}
      aria-hidden="true"
      className={`transition-transform duration-300 ${variant === "secondary" ? "text-accent-ink" : ""} ${
        back ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"
      }`}
    />
  );

  const content = (
    <>
      {back && arrow}
      {children}
      {!back && arrow}
    </>
  );

  const classes = `press group inline-flex items-center justify-center gap-2.5 min-h-12 px-6 rounded-full font-bold hover:-translate-y-0.5 ${VARIANTS[variant]} ${className}`;

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
