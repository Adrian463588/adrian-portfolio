"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail } from "lucide-react";
import { MagneticSurface } from "@/components/motion/MagneticSurface";
import { RollText } from "@/components/motion/RollText";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("adriansyah1230@gmail.com");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <section
      id="contact"
      className="border-t border-white/10 bg-[#08090B]/85 px-6 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-[1280px]">
        <div className="max-w-3xl space-y-6">
          <p className="font-mono text-xs tracking-[0.16em] text-[#00C8F5] uppercase">
            Contact
          </p>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] font-bold leading-[1.06] tracking-[-0.03em] text-[#F1F3F5]">
            Let&apos;s Discuss Engineering Roles &amp; Quality Systems.
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-[#A0A6B0] sm:text-base">
            Open to Software Engineering, QA/SDET, DevOps/DevSecOps, Financial Systems Technology,
            and Applied AI roles. Based in Yogyakarta, Indonesia — open to remote and global relocation.
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-2">
            <MagneticSurface>
              <a
                href="mailto:adriansyah1230@gmail.com"
                className="inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#F1F3F5] px-6 py-2.5 text-sm font-semibold text-[#08090B] transition-colors hover:bg-[#00C8F5]"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>adriansyah1230@gmail.com</span>
              </a>
            </MagneticSurface>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-[46px] items-center gap-2 rounded-full border border-white/15 bg-[#101216]/85 px-5 py-2.5 font-mono text-xs font-medium text-[#F1F3F5] transition-colors hover:border-[#00C8F5]/60"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  <span className="text-emerald-300">Copied address</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-[#A0A6B0]" aria-hidden="true" />
                  <span>Copy email</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-8 border-t border-white/10 pt-8 text-sm text-[#A0A6B0]">
          <a
            href="https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-[44px] items-center gap-1.5 transition-colors hover:text-[#F1F3F5]"
          >
            <RollText>LinkedIn</RollText>
            <ArrowUpRight className="h-4 w-4 text-[#00C8F5]" aria-hidden="true" />
          </a>

          <a
            href="https://github.com/Adrian463588"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-[44px] items-center gap-1.5 transition-colors hover:text-[#F1F3F5]"
          >
            <RollText>GitHub (@Adrian463588)</RollText>
            <ArrowUpRight className="h-4 w-4 text-[#00C8F5]" aria-hidden="true" />
          </a>

          <a
            href="https://medium.com/@adriansyah1230"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-[44px] items-center gap-1.5 transition-colors hover:text-[#F1F3F5]"
          >
            <RollText>Medium</RollText>
            <ArrowUpRight className="h-4 w-4 text-[#00C8F5]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
