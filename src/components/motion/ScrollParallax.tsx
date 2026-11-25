"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMotion } from "@/context/MotionContext";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ScrollParallaxProps {
  children: React.ReactNode;
  yOffset?: number;
  className?: string;
}

/** GPU-composited GSAP ScrollTrigger vertical parallax respecting adaptive motion quality. */
export function ScrollParallax({
  children,
  yOffset = 22,
  className,
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { qualityMode } = useMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || qualityMode === "reduced") return;
      const scale = qualityMode === "balanced" ? 0.5 : 1;
      gsap.fromTo(
        el,
        { y: yOffset * scale },
        {
          y: -yOffset * 0.5 * scale,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.65,
          },
        }
      );
    },
    { scope: ref, dependencies: [qualityMode, yOffset], revertOnUpdate: true }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
