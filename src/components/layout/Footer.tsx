"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { RollText } from "@/components/motion/RollText";
import { useMotion, type MotionPreference } from "@/context/MotionContext";

export function Footer() {
  const year = new Date().getFullYear();
  const { qualityMode, preference, setPreference, osReducedMotion } = useMotion();

  const handleBackToTop = () => {
    window.dispatchEvent(new CustomEvent("portfolio:scroll-top"));
  };

  const modes: { id: MotionPreference; label: string }[] = [
    { id: "cinematic", label: "Cinematic" },
    { id: "balanced", label: "Balanced" },
    { id: "reduced", label: "Reduced" },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#08090C]/90 px-6 py-10 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-8 text-sm text-[#A7ADB7] lg:flex-row lg:items-center">
        <div className="space-y-1">
          <p className="font-display font-semibold tracking-tight text-[#F2F0EC]">
            &copy; {year} Adrian Syah Abidin
          </p>
          <p className="text-xs text-[#A7ADB7]">
            Indonesia
          </p>
        </div>

        <nav aria-label="Footer links" className="flex flex-wrap items-center gap-6 text-sm">
          <Link href="/projects/" prefetch={false} className="group transition-colors">
            <RollText>Projects</RollText>
          </Link>
          <a
            href="https://github.com/Adrian463588"
            target="_blank"
            rel="noopener noreferrer"
            className="group transition-colors"
          >
            <RollText>GitHub</RollText>
          </a>
          <a
            href="https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/"
            target="_blank"
            rel="noopener noreferrer"
            className="group transition-colors"
          >
            <RollText>LinkedIn</RollText>
          </a>
          <a href="mailto:adriansyah1230@gmail.com" className="group transition-colors">
            <RollText>Email</RollText>
          </a>
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          {!osReducedMotion && (
            <div
              role="group"
              aria-label="Rendering quality mode"
              className="inline-flex items-center rounded-full border border-white/10 bg-[#15171C]/90 p-0.5 text-xs"
            >
              {modes.map((m) => {
                const active =
                  preference === m.id || (preference === "auto" && qualityMode === m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setPreference(m.id)}
                    className={`min-h-[32px] rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                      active
                        ? "bg-[#65C8F5]/18 text-[#65C8F5]"
                        : "text-[#A7ADB7] hover:text-[#F2F0EC]"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          )}

          <button
            type="button"
            onClick={handleBackToTop}
            className="active-press inline-flex min-h-[38px] items-center gap-1.5 rounded-full border border-white/15 bg-[#15171C]/80 px-3.5 py-1.5 text-xs font-medium text-[#F2F0EC] transition-colors hover:border-[#65C8F5] hover:text-[#65C8F5]"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
