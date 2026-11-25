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
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#08090C]"
    >
      {/* Subtle architectural perspective hairline grid */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(101,200,245,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(242,240,236,0.08) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse 85% 75% at 50% 35%, black 15%, transparent 80%)",
        }}
      />

      {/* Restrained chrome/arctic parametric orbital watermark */}
      <svg
        viewBox="0 0 320 320"
        className="absolute right-[6%] top-[16%] h-72 w-72 opacity-30 sm:h-96 sm:w-96"
        fill="none"
      >
        <circle
          cx="160"
          cy="160"
          r="128"
          stroke="#65C8F5"
          strokeOpacity="0.45"
          strokeWidth="1"
          strokeDasharray="4 8"
        />
        <ellipse
          cx="160"
          cy="160"
          rx="96"
          ry="44"
          transform="rotate(-24 160 160)"
          stroke="#F2F0EC"
          strokeOpacity="0.4"
          strokeWidth="1.2"
        />
        <ellipse
          cx="160"
          cy="160"
          rx="96"
          ry="44"
          transform="rotate(34 160 160)"
          stroke="#65C8F5"
          strokeOpacity="0.58"
          strokeWidth="1.2"
        />
        <circle cx="160" cy="160" r="4" fill="#65C8F5" />
      </svg>

      {/* Non-intrusive screen-reader & test verification marker */}
      <span className="sr-only">{labelText}</span>
    </div>
  );
}
