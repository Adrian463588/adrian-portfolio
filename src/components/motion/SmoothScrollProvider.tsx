"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useMotion } from "@/context/MotionContext";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isClient, qualityMode } = useMotion();
  const pathname = usePathname();
  const progressBarRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const mountedPathRef = useRef<string | null>(null);

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

    if (qualityMode === "reduced") {
      const onScrollTopReduced = () => {
        window.scrollTo({ top: 0, behavior: "auto" });
      };
      updateProgressNative();
      window.addEventListener("scroll", updateProgressNative, { passive: true });
      window.addEventListener("portfolio:scroll-top", onScrollTopReduced);
      return () => {
        window.removeEventListener("scroll", updateProgressNative);
        window.removeEventListener("portfolio:scroll-top", onScrollTopReduced);
      };
    }

    const lenis = new Lenis({
      autoRaf: false,
      lerp: qualityMode === "balanced" ? 0.14 : 0.095,
      wheelMultiplier: 0.95,
      anchors: { offset: -68 },
    });

    const onLenisScroll = (instance: Lenis) => {
      ScrollTrigger.update();
      if (progressBarRef.current) {
        const ratio = Math.min(Math.max(instance.progress || 0, 0), 1);
        progressBarRef.current.style.transform = `scaleX(${ratio})`;
      }
    };

    const onScrollTop = () => {
      lenis.scrollTo(0, { force: true });
    };

    lenis.on("scroll", onLenisScroll);
    window.addEventListener("portfolio:scroll-top", onScrollTop);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    updateProgressNative();

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("portfolio:scroll-top", onScrollTop);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
    };
  }, [isClient, qualityMode]);

  useEffect(() => {
    if (!isClient) return;
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = "scaleX(0)";
    }
    ScrollTrigger.refresh();

    // Non-blocking lightweight route transition veil on route navigation only
    if (mountedPathRef.current === null) {
      mountedPathRef.current = pathname;
      return;
    }
    if (mountedPathRef.current !== pathname) {
      mountedPathRef.current = pathname;
      if (qualityMode !== "reduced" && curtainRef.current) {
        gsap.fromTo(
          curtainRef.current,
          { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 0.92 },
          {
            clipPath: "inset(0% 0% 100% 0%)",
            autoAlpha: 0,
            duration: 0.42,
            ease: "power3.inOut",
            overwrite: "auto",
          }
        );
      }
    }
  }, [pathname, isClient, qualityMode]);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[1.5px] bg-transparent"
      >
        <div
          ref={progressBarRef}
          className="h-full w-full origin-left bg-[#65C8F5] transition-none will-change-transform"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Lightweight non-blocking masked route transition curtain */}
      <div
        ref={curtainRef}
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 z-40 bg-[#08090C] opacity-0"
      />

      {children}
    </>
  );
}
