"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useMotionCapabilities } from "@/hooks/useMotionCapabilities";
import { cn } from "@/lib/utils";

interface ChibiShowcaseProps {
  compact?: boolean;
  className?: string;
}

/** Tactile 2D spatial presentation of Adrian's custom engineering workstation illustration. */
export function ChibiShowcase({ compact = false, className }: ChibiShowcaseProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const { reducedMotion, canHover } = useMotionCapabilities();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, hx: 50, hy: 50, active: false });

  const interactive = canHover && !reducedMotion;

  return (
    <div
      ref={frameRef}
      onPointerMove={(e) => {
        if (!interactive || e.pointerType === "touch" || !frameRef.current) return;
        const rect = frameRef.current.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        setTilt({
          rx: (0.5 - py) * 9,
          ry: (px - 0.5) * 9,
          hx: Math.round(px * 100),
          hy: Math.round(py * 100),
          active: true,
        });
      }}
      onPointerLeave={() => {
        if (interactive) {
          setTilt((prev) => ({ ...prev, rx: 0, ry: 0, active: false }));
        }
      }}
      style={
        interactive
          ? {
              transform: `perspective(1000px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) translateZ(0)`,
              transition: tilt.active
                ? "transform 120ms cubic-bezier(0.22, 1, 0.36, 1)"
                : "transform 420ms cubic-bezier(0.22, 1, 0.36, 1)",
            }
          : undefined
      }
      className={cn(
        "group relative isolate mx-auto w-full max-w-[380px]",
        compact && "max-w-[260px]",
        className
      )}
    >
      {/* Restrained studio rim glow behind avatar frame */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 -z-10 rounded-[36px] bg-gradient-to-br from-[#00C8F5]/14 via-transparent to-[#2563EB]/14 blur-xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <figure className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[#101216] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)]">
        <div className="relative aspect-square w-full overflow-hidden rounded-[30px]">
          <Image
            src="/images/avatar/professional-chibi.webp"
            alt="Illustrated chibi portrait of Adrian Syah Abidin coding on laptop with stack of DevSecOps, Android Compose, AI/LLM, QA Testing, and Cloud/K8s books, UGM crest, and Tugu Yogyakarta"
            width={1000}
            height={1000}
            className="h-full w-full scale-[1.055] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
          />

          {/* Directional pointer spotlight */}
          {interactive && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: tilt.active ? 1 : 0,
                background: `radial-gradient(280px circle at ${tilt.hx}% ${tilt.hy}%, rgba(0, 200, 245, 0.14), transparent 65%)`,
              }}
            />
          )}
        </div>

        <figcaption className="flex items-center justify-between border-t border-white/10 bg-[#08090B]/90 px-4 py-2.5 font-mono text-[11px] tracking-wider text-[#A0A6B0]">
          <span>YOGYAKARTA · FT UGM</span>
          <span className="text-[#00C8F5]">QA · DEVOPS · AI</span>
        </figcaption>
      </figure>
    </div>
  );
}
