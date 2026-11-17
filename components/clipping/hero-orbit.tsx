import { cn } from "cn";

export function HeroOrbit() {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -right-24 -top-24 size-[420px] md:size-[560px] opacity-40 lg:opacity-60",
        "animate-in fade-in duration-1000 motion-reduce:animate-none"
      )}
    >
      <svg
        viewBox="0 0 560 560"
        fill="none"
        className="size-full text-border animate-[spin_60s_linear_infinite] motion-reduce:animate-none"
      >
        <circle cx="280" cy="280" r="260" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
        <circle cx="280" cy="280" r="190" stroke="currentColor" strokeWidth="1" />
        <circle cx="280" cy="280" r="110" stroke="currentColor" strokeWidth="1" strokeDasharray="8 8" />
        <circle cx="280" cy="20" r="6" fill="#C6FF00" />
        <circle cx="90" cy="280" r="4" fill="#C7CBD1" />
        <circle cx="390" cy="280" r="5" fill="#C6FF00" />
      </svg>
    </div>
  );
}
