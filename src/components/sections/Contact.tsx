"use client";

import { useState } from "react";
import { ArrowUpRight, BookOpen, Check, Copy, Github, Linkedin, Mail } from "lucide-react";

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
    <section id="contact" className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-[1200px] rounded-2xl border border-[#27272A] bg-[#18181B] p-8 sm:p-12">
        <div className="max-w-2xl space-y-4">
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-[#38BDF8]">
            Contact
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-[#F4F4F5] sm:text-4xl">
            Let&apos;s Discuss Engineering Roles &amp; Systems
          </h2>
          <p className="text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
            Open to Software Engineering, QA/SDET, DevOps/DevSecOps, and Applied AI opportunities.
            Based in Yogyakarta, Indonesia — open to remote and international relocation.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="mailto:adriansyah1230@gmail.com"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#F4F4F5] px-5 py-2.5 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#38BDF8]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email adriansyah1230@gmail.com
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#27272A] bg-[#09090B] px-4 py-2.5 text-sm font-medium text-[#F4F4F5] transition-colors hover:border-[#3F3F46]"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  <span className="text-emerald-300">Copied email</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-[#A1A1AA]" aria-hidden="true" />
                  <span>Copy email</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 border-t border-[#27272A] pt-8">
          <a
            href="https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#27272A] bg-[#09090B] px-4 py-2 text-sm text-[#E4E4E7] transition-colors hover:border-[#38BDF8]/50 hover:text-[#38BDF8]"
          >
            <Linkedin className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
            <span>LinkedIn</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#A1A1AA]" aria-hidden="true" />
          </a>

          <a
            href="https://github.com/Adrian463588"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#27272A] bg-[#09090B] px-4 py-2 text-sm text-[#E4E4E7] transition-colors hover:border-[#38BDF8]/50 hover:text-[#38BDF8]"
          >
            <Github className="h-4 w-4 text-[#F4F4F5]" aria-hidden="true" />
            <span>GitHub (@Adrian463588)</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#A1A1AA]" aria-hidden="true" />
          </a>

          <a
            href="https://medium.com/@adriansyah1230"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#27272A] bg-[#09090B] px-4 py-2 text-sm text-[#E4E4E7] transition-colors hover:border-[#38BDF8]/50 hover:text-[#38BDF8]"
          >
            <BookOpen className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
            <span>Medium Blog</span>
            <ArrowUpRight className="h-3.5 w-3.5 text-[#A1A1AA]" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
