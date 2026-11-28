"use client";

import { useRef, useState } from "react";
import { InteractiveAvatar } from "./InteractiveAvatar";
import { SpeechBubble } from "./SpeechBubble";
import { useAvatarInteraction } from "./useAvatarInteraction";
import { useMotionCapabilities } from "@/hooks/useMotionCapabilities";
import { cn } from "@/lib/utils";

interface ChibiShowcaseProps {
  compact?: boolean;
  className?: string;
}

/** Tactile 2D spatial presentation of Adrian's custom engineering workstation illustration. */
export function ChibiShowcase({ compact = false, className }: ChibiShowcaseProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLElement>(null);
  const { reducedMotion, canHover } = useMotionCapabilities();
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, hx: 50, hy: 50, active: false });

  const {
    buttonRef,
    frames,
    expression,
    revealed,
    visible,
    activate,
    handlePointerEnter,
    handlePointerLeave,
  } = useAvatarInteraction();

  const interactive = canHover && !reducedMotion;

  return (
    <div
      ref={outerRef}
      className={cn(
        "relative isolate mx-auto w-full max-w-[380px]",
        compact && "max-w-[260px]",
        className
      )}
    >
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
        className="group relative"
      >
        {/* Restrained Arctic studio halo behind portrait frame */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-3 -z-10 rounded-[36px] bg-gradient-to-br from-[#65C8F5]/16 via-transparent to-[#F2F0EC]/10 blur-xl transition-opacity duration-500 group-hover:opacity-100"
        />

        <figure
          ref={figureRef}
          className="relative overflow-clip rounded-[30px] border border-white/10 bg-[#15171C] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)]"
        >
          <div className="relative aspect-square w-full overflow-clip rounded-[30px]">
            <InteractiveAvatar
              buttonRef={buttonRef}
              frames={frames}
              expression={expression}
              visible={visible}
              onActivate={activate}
              onPointerEnter={(event) => handlePointerEnter(event.pointerType)}
              onPointerLeave={handlePointerLeave}
            />

            {/* Directional pointer spotlight */}
            {interactive && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: tilt.active ? 1 : 0,
                  background: `radial-gradient(280px circle at ${tilt.hx}% ${tilt.hy}%, rgba(101, 200, 245, 0.18), transparent 65%)`,
                }}
              />
            )}
          </div>

          <figcaption className="flex items-center justify-between border-t border-white/10 bg-[#08090C]/92 px-4 py-2.5 text-[11px] font-medium tracking-wider text-[#A7ADB7]">
            <span>Indonesia · Universitas Gadjah Mada</span>
            <span className="text-[#65C8F5]">QA · DevOps · AI</span>
          </figcaption>
        </figure>
      </div>

      <SpeechBubble
        dialogue={expression.dialogue}
        revealed={revealed}
        anchorRef={outerRef}
        cardRef={figureRef}
      />
    </div>
  );
}
