"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CursorSpotlight() {
  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);
  const springConfig = { damping: 20, stiffness: 180 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const isTouch =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isTouch || prefersReduced) {
      setIsVisible(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Primary spotlight — 500px radial cyan-to-blue */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[55] h-[500px] w-[500px] rounded-full"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(0,255,255,0.08) 0%, rgba(0,80,255,0.04) 35%, transparent 65%)",
        }}
        aria-hidden="true"
      />
      {/* Secondary bright dot — 8px, tighter spring for trailing feel */}
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[56] h-2 w-2 rounded-full bg-cyan-400/50"
        style={{
          x: useSpring(cursorX, { damping: 35, stiffness: 500 }),
          y: useSpring(cursorY, { damping: 35, stiffness: 500 }),
          translateX: "-50%",
          translateY: "-50%",
        }}
        aria-hidden="true"
      />
    </>
  );
}
