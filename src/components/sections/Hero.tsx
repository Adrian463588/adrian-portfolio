"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import { MagneticSurface } from "@/components/motion/MagneticSurface";
import { RollText } from "@/components/motion/RollText";
import { useMotion } from "@/context/MotionContext";

gsap.registerPlugin(useGSAP);

export function Hero() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const scopeRef = useRef<HTMLElement>(null);
  const { qualityMode } = useMotion();

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

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("adriansyah1230@gmail.com");
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      // Clipboard API unavailable in restricted contexts
    }
  };

  return (
    <section
      ref={scopeRef}
      id="hero"
      className="relative flex min-h-[calc(100svh-68px)] items-center px-6 py-16 sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="max-w-3xl space-y-8">
          <p className="hero-entrance text-sm font-medium tracking-wide text-[#65C8F5]">
            Software Engineer · Quality Engineering · DevOps · Applied AI
          </p>

          <div className="space-y-5">
            <h1 className="font-display text-[clamp(3rem,6.8vw,6.2rem)] font-bold leading-[0.98] tracking-[-0.045em] text-[#F2F0EC]">
              Adrian Syah Abidin
            </h1>
            <p className="hero-entrance max-w-2xl text-[clamp(1.15rem,2.1vw,1.55rem)] leading-snug text-[#D6D9DF]">
              Engineering{" "}
              <span className="border-b-2 border-[#65C8F5] pb-0.5 text-[#F2F0EC]">
                reliable systems
              </span>{" "}
              across enterprise automotive financing quality control, automation, and applied AI.
            </p>
          </div>

          <div className="hero-entrance flex flex-wrap items-center gap-3.5 pt-2">
            <MagneticSurface>
              <a
                href="#work"
                className="active-press inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#F2F0EC] px-6 py-2.5 text-sm font-semibold text-[#08090C] transition-colors hover:bg-[#65C8F5]"
              >
                <span>Explore Work</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </MagneticSurface>

            <MagneticSurface strength={0.16}>
              <Link
                href="/projects/"
                prefetch={false}
                className="active-press group inline-flex min-h-[46px] items-center gap-2 rounded-full border border-white/15 bg-[#15171C]/85 px-6 py-2.5 text-sm font-medium text-[#F2F0EC] backdrop-blur-sm transition-colors hover:border-[#65C8F5]"
              >
                <RollText>All Projects</RollText>
              </Link>
            </MagneticSurface>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="active-press inline-flex min-h-[46px] max-w-full items-center gap-2 rounded-full border border-white/10 bg-[#08090C]/75 px-4 py-2 text-xs text-[#A7ADB7] backdrop-blur-sm transition-colors hover:border-white/25 hover:text-[#F2F0EC]"
            >
              {copiedEmail ? (
                <>
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
                  <span className="truncate text-emerald-300">Email copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate font-mono">adriansyah1230@gmail.com</span>
                </>
              )}
            </button>
          </div>

          <div className="hero-entrance flex flex-wrap items-center gap-7 border-t border-white/10 pt-6 text-sm text-[#A7ADB7]">
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
            <a
              href="#experience"
              className="link-underline group inline-flex min-h-[44px] items-center gap-1 text-[#65C8F5] transition-colors hover:text-[#F2F0EC]"
            >
              <RollText>Experience</RollText>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
