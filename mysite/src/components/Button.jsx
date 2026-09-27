import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Button = ({ 
  href, 
  onClick,
  children,
  to,
  className = "", 
  variant = "secondary" 
}) => {
  const baseStyles = "relative overflow-hidden group flex items-center justify-center gap-4 px-6 py-2 font-semibold rounded-full border transition-all w-fit cursor-pointer";
  
  const variants = {
    primary: "bg-green-400 text-slate-900 border-green-400",
    secondary: "bg-slate-800 text-white border-slate-700"
  };

  const content = (
    <>
      <div className="absolute inset-0 flex justify-center">
        <div className="relative h-full w-full">
          <div className="absolute top-0 -left-[100%] h-full w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-[1250ms] ease-in-out"></div>
        </div>
      </div>

      <span className="relative z-10">{children}</span>
      
      <ArrowRight
        size={20}
        className={`relative z-10 ${variant === 'primary' ? 'text-slate-900' : 'text-green-400'} group-hover:translate-x-2 transition-transform duration-[400ms]`}
      />
    </>
  );

  if (href) {
    return (
      <a href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {content}
      </a>
    );
  }

  if (to) {
    return (
      <Link to={to} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {content}
    </button>
  );
};