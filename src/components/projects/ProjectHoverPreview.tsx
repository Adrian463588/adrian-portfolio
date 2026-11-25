"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Project } from "@/types";
import { ResilientImage } from "@/components/ui/ResilientImage";
import { useMotion } from "@/context/MotionContext";

interface ProjectHoverPreviewProps {
  project: Project | null;
  pointerX: number;
  pointerY: number;
}

/**
 * Floating interpolated desktop hover preview for Index view rows.
 * Stays mounted in DOM while active-hover is enabled so gsap.quickTo refs initialize reliably.
 */
export function ProjectHoverPreview({
  project,
  pointerX,
  pointerY,
}: ProjectHoverPreviewProps) {
  const { canHover, qualityMode } = useMotion();
  const frameRef = useRef<HTMLDivElement>(null);
  const xToRef = useRef<gsap.QuickToFunc | null>(null);
  const yToRef = useRef<gsap.QuickToFunc | null>(null);

  const enabled = canHover && qualityMode !== "reduced";

  useEffect(() => {
    if (!enabled || !frameRef.current) return;
    const frame = frameRef.current;
    xToRef.current = gsap.quickTo(frame, "x", { duration: 0.24, ease: "power3.out" });
    yToRef.current = gsap.quickTo(frame, "y", { duration: 0.24, ease: "power3.out" });
    return () => {
      xToRef.current = null;
      yToRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !frameRef.current || !xToRef.current || !yToRef.current) return;
    if (project) {
      const targetX = Math.min(pointerX + 24, window.innerWidth - 336);
      const targetY = Math.max(80, Math.min(pointerY - 64, window.innerHeight - 230));
      xToRef.current(targetX);
      yToRef.current(targetY);
      gsap.to(frameRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.2,
        ease: "power2.out",
        overwrite: "auto",
      });
    } else {
      gsap.to(frameRef.current, {
        opacity: 0,
        scale: 0.94,
        duration: 0.16,
        ease: "power2.in",
        overwrite: "auto",
      });
    }
  }, [enabled, project, pointerX, pointerY]);

  if (!enabled) {
    return null;
  }

  const shot = project?.screenshots[0];

  return (
    <div
      ref={frameRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-40 hidden w-80 overflow-hidden border border-white/20 bg-[#15171C] shadow-2xl will-change-transform lg:block"
      style={{ opacity: 0 }}
    >
      {project && (
        shot ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#08090C]">
            <ResilientImage
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              loading="eager"
              fallbackTitle={project.title}
              fallbackCategory={project.category}
              className="h-full w-full object-cover object-top"
            />
          </div>
        ) : (
          <div className="space-y-2 bg-gradient-to-br from-[#65C8F5]/14 via-[#15171C] to-[#08090C] p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#65C8F5]">
              {project.projectOrigin === "professional" ? "Enterprise Dossier" : project.category}
            </p>
            <p className="font-display text-base font-bold text-[#F2F0EC]">{project.title}</p>
            <p className="line-clamp-2 text-xs text-[#A7ADB7]">{project.summary}</p>
          </div>
        )
      )}
    </div>
  );
}
