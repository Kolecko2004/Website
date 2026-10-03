// Vystouplá karta. icon: ikona v zamáčknuté jamce nad nadpisem; tag: štítek vpravo od ikony.
// align: "center" pro krátké texty karet, "left" pro delší odstavce (lépe se čte)
export const FeatureBlock = ({ title, description, icon, tag, align = "center", children }) => {
  const left = align === "left";

  return (
    <div
      className={`w-full h-full flex flex-col gap-5 rounded-[34px] bg-surface shadow-neu p-8 md:p-9 ${
        left ? "items-start text-left" : "items-center text-center"
      }`}
    >
      {(icon || tag) && (
        <div className={`flex items-center gap-4 ${left ? "self-stretch justify-between" : "justify-center"}`}>
          {icon && (
            <span className="flex items-center justify-center size-[70px] rounded-3xl shadow-neu-in text-accent-ink">
              {icon}
            </span>
          )}
          {tag && (
            <span className="px-4 py-2 rounded-full shadow-neu-in text-xs font-bold tracking-[0.1em] uppercase">
              {tag}
            </span>
          )}
        </div>
      )}

      <h2 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.02em] leading-tight">{title}</h2>

      {description && (
        <div className={`text-muted leading-relaxed md:text-lg whitespace-pre-line ${left ? "max-w-3xl" : ""}`}>
          {description}
        </div>
      )}

      {children && <div className={`mt-auto pt-2 self-stretch ${left ? "" : "flex justify-center"}`}>{children}</div>}
    </div>
  );
};
