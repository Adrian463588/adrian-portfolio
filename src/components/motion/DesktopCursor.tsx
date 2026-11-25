"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useMotion } from "@/context/MotionContext";

export function DesktopCursor() {
  const { isClient, canHover, qualityMode } = useMotion();
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorLabel, setCursorLabel] = useState<string>("");

  const enabled = isClient && canHover && qualityMode !== "reduced";

  useEffect(() => {
    if (!enabled || !ringRef.current) return;

    const ring = ringRef.current;
    const xTo = gsap.quickTo(ring, "x", { duration: 0.22, ease: "power3.out" });
    const yTo = gsap.quickTo(ring, "y", { duration: 0.22, ease: "power3.out" });
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
      const isWorkMedia = Boolean(target?.closest("[data-cursor='work']"));
      const isInteractive = Boolean(
        target?.closest("a, button, [role='button'], summary")
      );

      setCursorLabel(isWorkMedia ? "VIEW" : "");

      gsap.to(ring, {
        scale: isWorkMedia ? 2.15 : isInteractive ? 1.55 : 1,
        borderColor: isWorkMedia
          ? "rgba(101, 200, 245, 0.85)"
          : isInteractive
            ? "rgba(242, 240, 236, 0.55)"
            : "rgba(101, 200, 245, 0.45)",
        backgroundColor: isWorkMedia ? "rgba(8, 9, 12, 0.65)" : "transparent",
        duration: 0.2,
        overwrite: "auto",
      });
    };

    const handleLeave = () => {
      visible = false;
      setCursorLabel("");
      gsap.to(ring, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("mouseleave", handleLeave, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50 -ml-4 -mt-4 flex h-8 w-8 items-center justify-center rounded-full border border-[#65C8F5]/45 opacity-0 will-change-transform"
    >
      {cursorLabel && (
        <span className="font-mono text-[6px] font-semibold tracking-[0.14em] text-[#F2F0EC]">
          {cursorLabel}
        </span>
      )}
    </div>
  );
}
