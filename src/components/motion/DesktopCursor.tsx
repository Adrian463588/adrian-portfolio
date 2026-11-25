"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useMotion } from "@/context/MotionContext";

export function DesktopCursor() {
  const { isClient, canHover, qualityMode } = useMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const enabled = isClient && canHover && qualityMode !== "reduced";

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    const badge = badgeRef.current;
    if (!enabled || !root || !dot || !badge) return;

    const xTo = gsap.quickTo(root, "x", { duration: 0.2, ease: "power3.out" });
    const yTo = gsap.quickTo(root, "y", { duration: 0.2, ease: "power3.out" });
    let visible = false;
    let activeWork = false;
    let lastX = -1;
    let lastY = -1;

    const hideAll = () => {
      visible = false;
      activeWork = false;
      gsap.to([dot, badge], { opacity: 0, duration: 0.16, overwrite: "auto" });
      gsap.to(badge, { scale: 0.78, duration: 0.16, overwrite: "auto" });
    };

    const handleMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      lastX = event.clientX;
      lastY = event.clientY;
      if (!visible) {
        visible = true;
        gsap.set(root, { x: event.clientX, y: event.clientY });
      } else {
        xTo(event.clientX);
        yTo(event.clientY);
      }

      const target = event.target as HTMLElement | null;
      const inModalOrInput = Boolean(
        target?.closest("[role='dialog'], input, textarea, select")
      );
      if (inModalOrInput) {
        if (visible) {
          gsap.to([dot, badge], { opacity: 0, duration: 0.14, overwrite: "auto" });
        }
        return;
      }

      const isWorkMedia = Boolean(target?.closest("[data-cursor='work']"));
      const isStandardInteractive = Boolean(
        target?.closest("a, button, [role='button'], summary")
      );

      if (isWorkMedia) {
        if (!activeWork) {
          activeWork = true;
          gsap.to(dot, { opacity: 0, scale: 0.6, duration: 0.14, overwrite: "auto" });
          gsap.to(badge, { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out", overwrite: "auto" });
        }
      } else {
        if (activeWork) {
          activeWork = false;
          gsap.to(badge, { opacity: 0, scale: 0.78, duration: 0.14, overwrite: "auto" });
        }
        gsap.to(dot, {
          opacity: isStandardInteractive ? 0 : 0.65,
          scale: isStandardInteractive ? 0.5 : 1,
          duration: 0.16,
          overwrite: "auto",
        });
      }
    };

    const handleScroll = () => {
      if (!activeWork || lastX < 0 || lastY < 0) return;
      const hovered = document.elementFromPoint(lastX, lastY);
      if (!hovered?.closest("[data-cursor='work']")) {
        activeWork = false;
        gsap.to(badge, { opacity: 0, scale: 0.78, duration: 0.14, overwrite: "auto" });
      }
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", hideAll, { passive: true });
    window.addEventListener("blur", hideAll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", hideAll);
      window.removeEventListener("blur", hideAll);
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-50"
    >
      {/* Subtle ambient ring over non-interactive space */}
      <div
        ref={dotRef}
        className="-ml-1.5 -mt-1.5 h-3 w-3 rounded-full border border-[#65C8F5]/55 opacity-0"
      />

      {/* Native-resolution VIEW badge rendered at <=1.0 scale to avoid text blur */}
      <div
        ref={badgeRef}
        data-testid="cursor-view-badge"
        style={{ transform: "scale(0.78)" }}
        className="-ml-7 -mt-7 flex h-14 w-14 items-center justify-center rounded-full border border-[#65C8F5]/85 bg-[#08090C]/92 opacity-0 shadow-[0_8px_24px_rgba(0,0,0,0.55)]"
      >
        <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-[#F2F0EC]">
          VIEW
        </span>
      </div>
    </div>
  );
}
