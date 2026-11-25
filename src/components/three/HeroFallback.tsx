interface HeroFallbackProps {
  label?: string;
}

export function HeroFallback({
  label = "ARCHITECTURAL GEOMETRIC LATTICE",
}: HeroFallbackProps) {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-[#27272A] bg-[#111114] p-6">
      <svg
        viewBox="0 0 280 280"
        className="h-56 w-56 sm:h-64 sm:w-64"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="140" cy="140" r="108" stroke="#27272A" strokeWidth="1" strokeDasharray="4 6" />
        <polygon
          points="140,34 232,87 232,193 140,246 48,193 48,87"
          stroke="#3F3F46"
          strokeWidth="1.5"
        />
        <polygon
          points="140,60 209,100 209,180 140,220 71,180 71,100"
          stroke="#38BDF8"
          strokeWidth="1.5"
          strokeOpacity="0.85"
        />
        <polygon
          points="140,92 182,140 140,188 98,140"
          stroke="#7DD3FC"
          strokeWidth="1.25"
          fill="#38BDF8"
          fillOpacity="0.08"
        />
        <line x1="140" y1="34" x2="140" y2="246" stroke="#27272A" strokeWidth="1" />
        <line x1="48" y1="87" x2="232" y2="193" stroke="#27272A" strokeWidth="1" />
        <line x1="232" y1="87" x2="48" y2="193" stroke="#27272A" strokeWidth="1" />
        <circle cx="140" cy="140" r="4" fill="#38BDF8" />
      </svg>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-[#A1A1AA]">
        {label}
      </p>
    </div>
  );
}
