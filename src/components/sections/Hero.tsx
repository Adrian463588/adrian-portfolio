"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import { MagneticSurface } from "@/components/motion/MagneticSurface";
import { RollText } from "@/components/motion/RollText";

export function Hero() {
  const [copiedEmail, setCopiedEmail] = useState(false);

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
      id="hero"
      className="relative flex min-h-[calc(100svh-68px)] items-center px-6 py-14 sm:py-20"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="max-w-3xl space-y-7">
          <p className="font-mono text-xs tracking-[0.18em] text-[#00C8F5] uppercase sm:text-[13px]">
            Software Engineer · DevOps · QA / SDET · Applied AI
          </p>

          <div className="space-y-4">
            <h1 className="font-display text-[clamp(2.65rem,6vw,5.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-[#F1F3F5]">
              Adrian Syah Abidin
            </h1>
            <p className="max-w-2xl text-[clamp(1.125rem,2vw,1.5rem)] leading-snug text-[#E2E6EC]">
              Engineering{" "}
              <span className="border-b-2 border-[#00C8F5]/75 pb-0.5 text-[#F1F3F5]">
                reliable systems
              </span>{" "}
              across enterprise automotive financing QA, automated testing, and applied AI.
            </p>
          </div>

          <p className="max-w-2xl text-sm leading-relaxed text-[#A0A6B0] sm:text-base">
            Information Technology background at Universitas Gadjah Mada (UGM) with quality
            engineering and systems delivery across Berijalan Techno Center (ACC Group), Qiscus,
            Tokopedia (ByteDance), and Bitbybit Studio.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <MagneticSurface>
              <a
                href="#work"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#F1F3F5] px-6 py-2.5 text-sm font-semibold text-[#08090B] transition-colors hover:bg-[#00C8F5]"
              >
                <span>Explore Selected Work</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </MagneticSurface>

            <MagneticSurface strength={0.16}>
              <Link
                href="/projects/"
                prefetch={false}
                className="group inline-flex min-h-[46px] items-center gap-2 rounded-full border border-white/15 bg-[#101216]/85 px-6 py-2.5 text-sm font-medium text-[#F1F3F5] backdrop-blur-sm transition-colors hover:border-[#00C8F5]/60"
              >
                <RollText>All 73 Projects</RollText>
              </Link>
            </MagneticSurface>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex min-h-[46px] max-w-full items-center gap-2 rounded-full border border-white/10 bg-[#08090B]/70 px-4 py-2 font-mono text-xs text-[#A0A6B0] backdrop-blur-sm transition-colors hover:border-white/25 hover:text-[#F1F3F5]"
            >
              {copiedEmail ? (
                <>
                  <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
                  <span className="truncate text-emerald-300">Email copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="truncate">adriansyah1230@gmail.com</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-6 border-t border-white/10 pt-6 text-sm text-[#A0A6B0]">
            <a
              href="https://github.com/Adrian463588"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[44px] items-center gap-1 transition-colors hover:text-[#F1F3F5]"
            >
              <RollText>GitHub</RollText>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[44px] items-center gap-1 transition-colors hover:text-[#F1F3F5]"
            >
              <RollText>LinkedIn</RollText>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            </a>
            <a
              href="https://medium.com/@adriansyah1230"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[44px] items-center gap-1 transition-colors hover:text-[#F1F3F5]"
            >
              <RollText>Medium</RollText>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            </a>
            <a
              href="#about"
              className="group inline-flex min-h-[44px] items-center gap-1 text-[#00C8F5] transition-colors"
            >
              <RollText>Profile &amp; Chibi Studio</RollText>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
