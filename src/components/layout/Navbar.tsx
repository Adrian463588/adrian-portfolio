"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "/#experience", label: "Experience", match: "experience" },
  { href: "/#enterprise-work", label: "Enterprise", match: "enterprise-work" },
  { href: "/#work", label: "Work", match: "work" },
  { href: "/projects/", label: "Projects", match: "projects" },
  { href: "/#competencies", label: "Competencies", match: "competencies" },
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
    <header className="sticky top-0 z-50 w-full px-4 pt-4 sm:px-6">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-[1200px] items-center justify-between rounded-xl border border-[#27272A] bg-[#09090B]/85 px-4 py-2.5 backdrop-blur-md"
      >
        <Link
          href="/"
          prefetch={false}
          className="inline-flex min-h-[44px] shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-2 text-sm font-semibold tracking-tight text-[#F4F4F5] transition-colors hover:text-[#38BDF8]"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-[#27272A] bg-[#18181B] font-mono text-xs font-bold text-[#38BDF8]">
            AS
          </span>
          <span>Adrian Syah Abidin</span>
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
                className={`inline-flex min-h-[40px] items-center whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#18181B] text-[#38BDF8]"
                    : "text-[#A1A1AA] hover:bg-[#18181B]/70 hover:text-[#F4F4F5]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="hidden shrink-0 items-center lg:flex">
          <a
            href="mailto:adriansyah1230@gmail.com"
            className="inline-flex min-h-[40px] items-center whitespace-nowrap rounded-lg bg-[#F4F4F5] px-4 py-2 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#38BDF8]"
          >
            Get in Touch
          </a>
        </div>

        <button
          ref={toggleBtnRef}
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-drawer"
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[#27272A] bg-[#18181B] text-[#F4F4F5] transition-colors hover:border-[#3F3F46] lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </nav>

      {mobileOpen && (
        <div
          id="mobile-nav-drawer"
          className="mx-auto mt-2 max-w-[1200px] rounded-xl border border-[#27272A] bg-[#18181B] p-3 shadow-2xl lg:hidden"
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
                  className={`flex min-h-[44px] items-center rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#202024] text-[#38BDF8]"
                      : "text-[#F4F4F5] hover:bg-[#202024]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <a
              href="mailto:adriansyah1230@gmail.com"
              onClick={() => setMobileOpen(false)}
              className="mt-2 flex min-h-[44px] items-center justify-center rounded-lg bg-[#F4F4F5] px-4 py-2.5 text-sm font-semibold text-[#09090B]"
            >
              Get in Touch
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
