interface SpatialFallbackProps {
  reason: "reduced-motion" | "webgl-unavailable" | "initializing";
}

/** Atmospheric CSS architectural horizon fallback for WebGL-off or reduced-motion contexts. */
export function SpatialFallback({ reason }: SpatialFallbackProps) {
  const labelText =
    reason === "reduced-motion"
      ? "REDUCED MOTION · STATIC GEOMETRY"
      : reason === "webgl-unavailable"
        ? "WEBGL FALLBACK"
        : "INITIALIZING SPATIAL GEOMETRY";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#08090B]"
    >
      {/* Subtle architectural perspective hairline grid */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,200,245,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(37,99,235,0.14) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 85% 75% at 50% 35%, black 15%, transparent 80%)",
        }}
      />

      {/* Restrained geometric lattice watermark */}
      <svg
        viewBox="0 0 320 320"
        className="absolute right-[6%] top-[16%] h-72 w-72 opacity-30 sm:h-96 sm:w-96"
        fill="none"
      >
        <circle
          cx="160"
          cy="160"
          r="128"
          stroke="#2563EB"
          strokeOpacity="0.45"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        <polygon
          points="160,40 264,100 264,220 160,280 56,220 56,100"
          stroke="#00C8F5"
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />
        <polygon
          points="160,84 226,160 160,236 94,160"
          stroke="#60A5FA"
          strokeOpacity="0.55"
          strokeWidth="1.1"
        />
        <circle cx="160" cy="160" r="4" fill="#00C8F5" />
      </svg>

      {/* Non-intrusive screen-reader & test verification marker */}
      <span className="sr-only">{labelText}</span>
    </div>
  );
}
