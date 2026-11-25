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
      className="relative flex min-h-[calc(100svh-68px)] items-center px-6 py-16 sm:py-24"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="max-w-3xl space-y-8">
          <p className="font-mono text-xs tracking-[0.2em] text-[#7A9BFF] uppercase sm:text-[13px]">
            Software Engineer · Quality Engineering · Systems
          </p>

          <div className="space-y-5">
            <h1 className="font-display text-[clamp(3rem,6.8vw,6rem)] font-bold leading-[0.98] tracking-[-0.045em] text-[#F1F0EB]">
              Adrian Syah Abidin
            </h1>
            <p className="max-w-2xl text-[clamp(1.15rem,2.1vw,1.55rem)] leading-snug text-[#D6D5CF]">
              Engineering{" "}
              <span className="border-b-2 border-[#4169FF] pb-0.5 text-[#F1F0EB]">
                reliable software
              </span>{" "}
              across enterprise financing quality control, automation, and applied AI.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <MagneticSurface>
              <a
                href="#work"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#F1F0EB] px-6 py-2.5 text-sm font-semibold text-[#080808] transition-colors hover:bg-[#7A9BFF]"
              >
                <span>Explore Work</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </MagneticSurface>

            <MagneticSurface strength={0.16}>
              <Link
                href="/projects/"
                prefetch={false}
                className="group inline-flex min-h-[46px] items-center gap-2 rounded-full border border-white/15 bg-[#151515]/80 px-6 py-2.5 text-sm font-medium text-[#F1F0EB] backdrop-blur-sm transition-colors hover:border-[#4169FF]"
              >
                <RollText>All Projects</RollText>
              </Link>
            </MagneticSurface>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex min-h-[46px] max-w-full items-center gap-2 rounded-full border border-white/10 bg-[#080808]/75 px-4 py-2 font-mono text-xs text-[#A6A6A6] backdrop-blur-sm transition-colors hover:border-white/25 hover:text-[#F1F0EB]"
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

          <div className="flex flex-wrap items-center gap-7 border-t border-white/10 pt-6 text-sm text-[#A6A6A6]">
            <a
              href="https://github.com/Adrian463588"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[44px] items-center gap-1 transition-colors hover:text-[#F1F0EB]"
            >
              <RollText>GitHub</RollText>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            </a>
            <a
              href="https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[44px] items-center gap-1 transition-colors hover:text-[#F1F0EB]"
            >
              <RollText>LinkedIn</RollText>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            </a>
            <a
              href="https://medium.com/@adriansyah1230"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[44px] items-center gap-1 transition-colors hover:text-[#F1F0EB]"
            >
              <RollText>Medium</RollText>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
            </a>
            <a
              href="#about"
              className="group inline-flex min-h-[44px] items-center gap-1 text-[#7A9BFF] transition-colors hover:text-[#F1F0EB]"
            >
              <RollText>About &amp; Studio</RollText>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
