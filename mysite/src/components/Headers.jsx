// Štítek nad nadpisem – vystouplá „pilulka“ s tečkou v barvě akcentu
export const Badge = ({ children }) => (
  <span className="inline-flex items-center gap-2.5 px-[18px] py-[11px] rounded-full bg-surface shadow-neu-sm text-[13px] font-bold tracking-[0.14em] uppercase">
    <span className="size-2 rounded-full bg-accent-ink" />
    {children}
  </span>
);
