"use client";

import { useRef, useState } from "react";
import { useMotionCapabilities } from "@/hooks/useMotionCapabilities";
import { cn } from "@/lib/utils";

interface MagneticSurfaceProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

/** Subtle magnetic pointer pull on desktop fine pointers; passes clicks cleanly through. */
export function MagneticSurface({
  children,
  className,
  strength = 0.22,
}: MagneticSurfaceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { reducedMotion, canHover } = useMotionCapabilities();
  const [offset, setOffset] = useState({ x: 0, y: 0, active: false });

  const enabled = canHover && !reducedMotion;

  return (
    <div
      ref={ref}
      onPointerMove={(e) => {
        if (!enabled || e.pointerType === "touch" || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const dx = (e.clientX - (rect.left + rect.width / 2)) * strength;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * strength;
        setOffset({
          x: Math.max(-7, Math.min(7, dx)),
          y: Math.max(-7, Math.min(7, dy)),
          active: true,
        });
      }}
      onPointerLeave={() => {
        if (enabled) setOffset({ x: 0, y: 0, active: false });
      }}
      style={
        enabled
          ? {
              transform: `translate3d(${offset.x.toFixed(2)}px, ${offset.y.toFixed(2)}px, 0)`,
              transition: offset.active
                ? "transform 110ms cubic-bezier(0.22, 1, 0.36, 1)"
                : "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
            }
          : undefined
      }
      className={cn("inline-flex", className)}
    >
      {children}
    </div>
  );
}
