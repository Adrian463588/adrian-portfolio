"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Copy, Github, Linkedin, Mail } from "lucide-react";
import { HeroSculptureWidget } from "@/components/three/HeroSculptureWidget";

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
      className="px-6 pt-12 pb-16 sm:pt-16 sm:pb-24"
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-12">
        <div className="min-w-0 space-y-6 lg:col-span-7">
          <p className="font-mono text-xs font-medium uppercase tracking-widest text-[#38BDF8] sm:text-[13px]">
            Quality Engineering · DevOps · Backend · Applied AI
          </p>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-[#F4F4F5] sm:text-5xl lg:text-[56px] lg:leading-[1.08]">
              Adrian Syah Abidin
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-[#D4D4D8] sm:text-xl">
              Software Engineer building and validating reliable systems across enterprise financial
              applications, test automation, and modern software delivery.
            </p>
          </div>

          <p className="max-w-xl text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
            Information Technology background at{" "}
            <span className="font-medium text-[#F4F4F5]">Universitas Gadjah Mada (UGM)</span>{" "}
            with software quality engineering experience across{" "}
            <span className="font-medium text-[#F4F4F5]">Berijalan Techno Center (ACC Group)</span>,{" "}
            <span className="font-medium text-[#F4F4F5]">Qiscus</span>,{" "}
            <span className="font-medium text-[#F4F4F5]">Tokopedia (ByteDance)</span>, and{" "}
            <span className="font-medium text-[#F4F4F5]">Bitbybit Studio</span>. AWS &amp; CompTIA certified.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href="#experience"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#F4F4F5] px-5 py-2.5 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#38BDF8]"
            >
              Explore Experience &amp; Work
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>

            <Link
              href="/projects/"
              prefetch={false}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#27272A] bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#F4F4F5] transition-colors hover:border-[#3F3F46] hover:bg-[#202024]"
            >
              Browse All Projects
            </Link>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="inline-flex min-h-[44px] max-w-full items-center gap-2 rounded-lg border border-[#27272A] bg-[#09090B] px-3.5 py-2.5 font-mono text-xs text-[#A1A1AA] transition-colors hover:border-[#3F3F46] hover:text-[#F4F4F5]"
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

          <div className="flex flex-wrap items-center gap-5 pt-2 text-sm text-[#A1A1AA]">
            <a
              href="https://github.com/Adrian463588"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1.5 transition-colors hover:text-[#38BDF8]"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1.5 transition-colors hover:text-[#38BDF8]"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://medium.com/@adriansyah1230"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1.5 transition-colors hover:text-[#38BDF8]"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>Medium</span>
            </a>
            <a
              href="mailto:adriansyah1230@gmail.com"
              className="inline-flex min-h-[44px] items-center gap-1.5 transition-colors hover:text-[#38BDF8]"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span>Email</span>
            </a>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-5">
          <div className="mx-auto aspect-square w-full max-w-[360px] lg:max-w-[440px]">
            <HeroSculptureWidget />
          </div>
        </div>
      </div>
    </section>
  );
}
