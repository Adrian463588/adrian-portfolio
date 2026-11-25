"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { RollText } from "@/components/motion/RollText";
import { MagneticSurface } from "@/components/motion/MagneticSurface";

const navLinks = [
  { href: "/#work", label: "Work", match: "work" },
  { href: "/#experience", label: "Experience", match: "experience" },
  { href: "/#enterprise-work", label: "Enterprise", match: "enterprise-work" },
  { href: "/projects/", label: "Projects", match: "projects" },
  { href: "/#about", label: "About", match: "about" },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const isProjectsRoute = pathname?.startsWith("/projects");

  useEffect(() => {
    if (wasOpenRef.current && !mobileOpen) {
      toggleBtnRef.current?.focus();
    }
    wasOpenRef.current = mobileOpen;
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080808]/75 backdrop-blur-md">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-6"
      >
        <Link
          href="/"
          prefetch={false}
          className="group inline-flex min-h-[44px] shrink-0 items-center gap-2.5 whitespace-nowrap font-display text-sm font-bold tracking-[0.06em] text-[#F1F0EB] uppercase transition-colors hover:text-[#7A9BFF]"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-[#4169FF]" aria-hidden="true" />
          <span>ADRIAN.</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = link.match === "projects" && isProjectsRoute;
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={false}
                aria-current={active ? "page" : undefined}
                className={`group inline-flex min-h-[40px] items-center whitespace-nowrap px-3.5 py-2 text-sm font-medium transition-colors ${
                  active ? "text-[#7A9BFF]" : "text-[#A6A6A6] hover:text-[#F1F0EB]"
                }`}
              >
                <RollText>{link.label}</RollText>
              </Link>
            );
          })}
        </div>

        <div className="hidden shrink-0 items-center gap-5 lg:flex">
          <span className="font-mono text-[11px] tracking-wider text-[#A6A6A6]">
            YOGYA · GMT+7
          </span>
          <MagneticSurface>
            <Link
              href="/#contact"
              prefetch={false}
              className="group inline-flex min-h-[40px] items-center whitespace-nowrap rounded-full bg-[#F1F0EB] px-4 py-1.5 text-sm font-semibold text-[#080808] transition-colors hover:bg-[#7A9BFF]"
            >
              Let&apos;s Connect
            </Link>
          </MagneticSurface>
        </div>

        <button
          ref={toggleBtnRef}
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-white/15 bg-[#151515] text-[#F1F0EB] transition-colors hover:border-[#4169FF] lg:hidden"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div
          id="mobile-nav-drawer"
          className="border-t border-white/10 bg-[#080808]/95 px-6 py-4 backdrop-blur-lg lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => {
              const active = link.match === "projects" && isProjectsRoute;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-[44px] items-center justify-between border-b border-white/5 py-2.5 text-sm font-medium transition-colors ${
                    active ? "text-[#7A9BFF]" : "text-[#F1F0EB]"
                  }`}
                >
                  <span>{link.label}</span>
                  <span aria-hidden="true" className="font-mono text-xs text-[#A6A6A6]">
                    &rarr;
                  </span>
                </Link>
              );
            })}
            <Link
              href="/#contact"
              prefetch={false}
              onClick={() => setMobileOpen(false)}
              className="mt-4 flex min-h-[44px] items-center justify-center rounded-full bg-[#F1F0EB] px-4 py-2.5 text-sm font-semibold text-[#080808]"
            >
              Let&apos;s Connect
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
