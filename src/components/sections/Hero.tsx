"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight, QrCode } from "lucide-react";
import { MagneticSurface } from "@/components/motion/MagneticSurface";
import { RollText } from "@/components/motion/RollText";
import { TypewriterText } from "@/components/motion/TypewriterText";
import { ProfileShareDialog } from "@/components/profile/ProfileShareDialog";
import { useMotion } from "@/context/MotionContext";
import { useDoubleTap } from "@/hooks/useDoubleTap";

gsap.registerPlugin(useGSAP);

export function Hero() {
  const scopeRef = useRef<HTMLElement>(null);
  const shareTriggerRef = useRef<HTMLButtonElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const lastTouchOpenAtRef = useRef(0);
  const [shareOpen, setShareOpen] = useState(false);
  const { qualityMode, canHover, isClient } = useMotion();

  const openShareDialog = useCallback((returnTo?: HTMLElement | null) => {
    restoreFocusRef.current = returnTo ?? shareTriggerRef.current;
    setShareOpen(true);
  }, []);

  const closeShareDialog = useCallback(() => {
    setShareOpen(false);
    const target = restoreFocusRef.current ?? shareTriggerRef.current;
    window.requestAnimationFrame(() => {
      target?.focus();
    });
  }, []);

  const { pointerHandlers: nameDoubleTapHandlers } = useDoubleTap(
    () => {
      lastTouchOpenAtRef.current = Date.now();
      openShareDialog(shareTriggerRef.current);
    },
    { maxIntervalMs: 350 }
  );

  const shareTooltip =
    isClient && !canHover
      ? "Double-tap to share profile"
      : "Double-click to share profile";

  useGSAP(
    () => {
      if (qualityMode === "reduced") return;
      const targets = scopeRef.current?.querySelectorAll(".hero-entrance");
      if (!targets || targets.length === 0) return;
      gsap.fromTo(
        targets,
        { y: 14 },
        {
          y: 0,
          stagger: 0.06,
          duration: 0.65,
          ease: "power3.out",
          clearProps: "transform",
        }
      );
    },
    { scope: scopeRef, dependencies: [qualityMode] }
  );

  return (
    <section
      ref={scopeRef}
      id="hero"
      className="relative flex min-h-[calc(100svh-68px)] items-center px-6 py-16 sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="max-w-3xl space-y-8">
          <div className="hero-entrance flex flex-wrap items-center gap-2.5">
            <p className="text-sm font-medium tracking-wide text-[#65C8F5]">
              Software &amp; QA Automation Engineer
            </p>
            <div className="group/share relative inline-flex items-center">
              <button
                ref={shareTriggerRef}
                type="button"
                onClick={() => openShareDialog(shareTriggerRef.current)}
                aria-label="Share Adrian Syah Abidin profile"
                aria-haspopup="dialog"
                aria-expanded={shareOpen}
                aria-controls="profile-share-dialog"
                title={shareTooltip}
                className="inline-flex h-11 w-11 -my-1 items-center justify-center rounded-full border border-white/12 bg-[#15171C]/65 text-[#A7ADB7] transition-colors hover:border-[#65C8F5] hover:text-[#65C8F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65C8F5] sm:-my-2.5"
              >
                <QrCode className="h-4 w-4" aria-hidden="true" />
              </button>
              <span
                role="tooltip"
                className="pointer-events-none invisible absolute left-full top-1/2 z-30 ml-2 hidden -translate-y-1/2 whitespace-nowrap rounded-md border border-white/12 bg-[#15171C] px-2.5 py-1 text-[11px] font-normal text-[#F2F0EC] opacity-0 transition-opacity duration-150 group-hover/share:visible group-hover/share:opacity-100 group-focus-within/share:visible group-focus-within/share:opacity-100 sm:block"
              >
                {shareTooltip}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h1
              onMouseDown={(e) => {
                if (e.detail > 1) {
                  e.preventDefault();
                }
              }}
              onDoubleClick={() => {
                if (Date.now() - lastTouchOpenAtRef.current < 500) {
                  return;
                }
                if (typeof window !== "undefined") {
                  window.getSelection()?.removeAllRanges();
                }
                openShareDialog(shareTriggerRef.current);
              }}
              {...nameDoubleTapHandlers}
              className="touch-manipulation font-display text-[clamp(3rem,6.8vw,6.2rem)] font-bold leading-[0.98] tracking-[-0.045em] text-[#F2F0EC]"
            >
              Adrian Syah Abidin
            </h1>
            <TypewriterText className="hero-entrance" />
            <p className="hero-entrance max-w-2xl text-sm leading-relaxed text-[#A7ADB7] sm:text-base">
              Experience in quality engineering, test automation, and enterprise financial systems.
              Building personal projects across DevOps, software development, and applied AI.
            </p>
          </div>

          <div className="hero-entrance flex flex-wrap items-center gap-3.5 pt-2">
            <MagneticSurface>
              <a
                href="#work"
                className="active-press inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#F2F0EC] px-6 py-2.5 text-sm font-semibold text-[#08090C] transition-colors hover:bg-[#65C8F5]"
              >
                <span>View My Work</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </MagneticSurface>

            <MagneticSurface strength={0.16}>
              <a
                href="#contact"
                className="active-press group inline-flex min-h-[46px] items-center gap-2 rounded-full border border-white/15 bg-[#15171C]/85 px-6 py-2.5 text-sm font-medium text-[#F2F0EC] backdrop-blur-sm transition-colors hover:border-[#65C8F5]"
              >
                <RollText>Get in Touch</RollText>
              </a>
            </MagneticSurface>
          </div>

          <div className="hero-entrance flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-sm text-[#A7ADB7] sm:gap-x-7">
            <Link
              href="/projects/"
              prefetch={false}
              className="link-underline group inline-flex min-h-[44px] items-center gap-1 text-[#65C8F5] transition-colors hover:text-[#F2F0EC]"
            >
              <RollText>All Projects</RollText>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <a
              href="https://github.com/Adrian463588"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline group inline-flex min-h-[44px] items-center gap-1 transition-colors hover:text-[#F2F0EC]"
            >
              <RollText>GitHub</RollText>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline group inline-flex min-h-[44px] items-center gap-1 transition-colors hover:text-[#F2F0EC]"
            >
              <RollText>LinkedIn</RollText>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            </a>
            <a
              href="https://medium.com/@adriansyah1230"
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline group inline-flex min-h-[44px] items-center gap-1 transition-colors hover:text-[#F2F0EC]"
            >
              <RollText>Medium</RollText>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      <ProfileShareDialog isOpen={shareOpen} onClose={closeShareDialog} />
    </section>
  );
}
