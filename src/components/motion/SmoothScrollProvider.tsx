"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useMotionCapabilities } from "@/hooks/useMotionCapabilities";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isClient, reducedMotion } = useMotionCapabilities();
  const pathname = usePathname();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!isClient) return;

    const updateProgressNative = () => {
      if (!progressBarRef.current) return;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const ratio = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      progressBarRef.current.style.transform = `scaleX(${ratio})`;
    };

    if (reducedMotion) {
      updateProgressNative();
      window.addEventListener("scroll", updateProgressNative, { passive: true });
      return () => {
        window.removeEventListener("scroll", updateProgressNative);
      };
    }

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.1,
      wheelMultiplier: 0.95,
      anchors: { offset: -68 },
    });
    lenisRef.current = lenis;

    const onLenisScroll = (instance: Lenis) => {
      ScrollTrigger.update();
      if (progressBarRef.current) {
        const ratio = Math.min(Math.max(instance.progress || 0, 0), 1);
        progressBarRef.current.style.transform = `scaleX(${ratio})`;
      }
    };

    lenis.on("scroll", onLenisScroll);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    updateProgressNative();

    return () => {
      gsap.ticker.remove(tick);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isClient, reducedMotion]);

  useEffect(() => {
    if (!isClient) return;
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = "scaleX(0)";
    }
    ScrollTrigger.refresh();
  }, [pathname, isClient]);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[1.5px] bg-transparent"
      >
        <div
          ref={progressBarRef}
          className="h-full w-full origin-left bg-[#4169FF] transition-none will-change-transform"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
      {children}
    </>
  );
}
