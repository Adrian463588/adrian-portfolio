"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface TiltSurfaceProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltSurface({ children, className, maxTilt = 4.5 }: TiltSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(900px) rotateX(0deg) rotateY(0deg)");
  const [highlight, setHighlight] = useState({ x: 50, y: 50, active: false });
  const [tiltEnabled, setTiltEnabled] = useState(false);

  useEffect(() => {
    const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = requestAnimationFrame(() => {
      setTiltEnabled(hoverCapable && !reducedMotion);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tiltEnabled || e.pointerType === "touch" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = ((px - 0.5) * 2 * maxTilt).toFixed(2);
    const rotateX = ((0.5 - py) * 2 * maxTilt).toFixed(2);
    setTransform(`perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(2px)`);
    setHighlight({ x: Math.round(px * 100), y: Math.round(py * 100), active: true });
  };

  const handlePointerLeave = () => {
    setTransform("perspective(900px) rotateX(0deg) rotateY(0deg)");
    setHighlight((prev) => ({ ...prev, active: false }));
  };

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={
        tiltEnabled
          ? {
              transform,
              transition: highlight.active ? "transform 120ms ease-out" : "transform 220ms ease-out",
            }
          : undefined
      }
      className={cn("relative min-w-0", className)}
    >
      {children}
      {tiltEnabled && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-200"
          style={{
            opacity: highlight.active ? 1 : 0,
            background: `radial-gradient(280px circle at ${highlight.x}% ${highlight.y}%, rgba(56, 189, 248, 0.08), transparent 65%)`,
          }}
        />
      )}
    </div>
  );
}
