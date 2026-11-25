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
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#080808]"
    >
      {/* Subtle architectural perspective hairline grid */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(65,105,255,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(241,240,235,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 85% 75% at 50% 35%, black 15%, transparent 80%)",
        }}
      />

      {/* Restrained parametric chrome/blue watermark */}
      <svg
        viewBox="0 0 320 320"
        className="absolute right-[6%] top-[16%] h-72 w-72 opacity-30 sm:h-96 sm:w-96"
        fill="none"
      >
        <circle
          cx="160"
          cy="160"
          r="128"
          stroke="#4169FF"
          strokeOpacity="0.48"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        <ellipse
          cx="160"
          cy="160"
          rx="96"
          ry="44"
          transform="rotate(-24 160 160)"
          stroke="#F1F0EB"
          strokeOpacity="0.38"
          strokeWidth="1.2"
        />
        <ellipse
          cx="160"
          cy="160"
          rx="96"
          ry="44"
          transform="rotate(34 160 160)"
          stroke="#4169FF"
          strokeOpacity="0.58"
          strokeWidth="1.2"
        />
        <circle cx="160" cy="160" r="4" fill="#4169FF" />
      </svg>

      {/* Non-intrusive screen-reader & test verification marker */}
      <span className="sr-only">{labelText}</span>
    </div>
  );
}
