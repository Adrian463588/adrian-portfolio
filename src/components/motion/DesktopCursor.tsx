"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useMotionCapabilities } from "@/hooks/useMotionCapabilities";

export function DesktopCursor() {
  const { isClient, canHover, reducedMotion } = useMotionCapabilities();
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isClient || !canHover || reducedMotion || !ringRef.current) return;

    const ring = ringRef.current;
    const xTo = gsap.quickTo(ring, "x", { duration: 0.24, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.24, ease: "power3.out" });
    let visible = false;

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (!visible) {
        visible = true;
        gsap.set(ring, { x: event.clientX, y: event.clientY });
        gsap.to(ring, { opacity: 1, duration: 0.2 });
      } else {
        xTo(event.clientX);
        yTo(event.clientY);
      }

      const target = event.target as HTMLElement | null;
      const isInteractive = Boolean(
        target?.closest("a, button, [role='button'], summary, [data-cursor='work']")
      );
      gsap.to(ring, {
        scale: isInteractive ? 1.55 : 1,
        borderColor: isInteractive
          ? "rgba(241, 240, 235, 0.55)"
          : "rgba(65, 105, 255, 0.45)",
        duration: 0.2,
        overwrite: "auto",
      });
    };

    const handleLeave = () => {
      visible = false;
      gsap.to(ring, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [isClient, canHover, reducedMotion]);

  if (!isClient || !canHover || reducedMotion) {
    return null;
  }

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 -ml-4 -mt-4 h-8 w-8 rounded-full border border-[#4169FF]/45 opacity-0 will-change-transform"
    />
  );
}
