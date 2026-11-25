"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMotion } from "@/context/MotionContext";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ChoreographedMaskProps {
  children: React.ReactNode;
  variant?: "clip-reveal" | "slide-right" | "stagger-list";
  className?: string;
}

/**
 * Distinct non-uniform GSAP ScrollTrigger section choreography.
 * Never traps elements at opacity 0 — only modulates clip-path or slight transform displacement.
 */
export function ChoreographedBlock({
  children,
  variant = "clip-reveal",
  className,
}: ChoreographedMaskProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { qualityMode } = useMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || qualityMode === "reduced") return;

      if (variant === "clip-reveal") {
        gsap.fromTo(
          el,
          { clipPath: "inset(6% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 0.72,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          }
        );
      } else if (variant === "slide-right") {
        gsap.fromTo(
          el,
          { x: -16 },
          {
            x: 0,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          }
        );
      } else if (variant === "stagger-list") {
        const rows = el.querySelectorAll(":scope > article");
        if (rows.length > 0) {
          gsap.fromTo(
            rows,
            { y: 18 },
            {
              y: 0,
              stagger: 0.08,
              duration: 0.55,
              ease: "power2.out",
              scrollTrigger: {
                trigger: el,
                start: "top 88%",
                once: true,
              },
            }
          );
        }
      }
    },
    { scope: ref, dependencies: [qualityMode, variant], revertOnUpdate: true }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
