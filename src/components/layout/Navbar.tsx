"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { RollText } from "@/components/motion/RollText";
import { MagneticSurface } from "@/components/motion/MagneticSurface";
import { useMotion } from "@/context/MotionContext";

const navLinks = [
  { href: "/#work", label: "Work", match: "work", idx: "01" },
  { href: "/projects/", label: "Projects", match: "projects", idx: "02" },
  { href: "/resources/", label: "Resources", match: "resources", idx: "03" },
  { href: "/#experience", label: "Experience", match: "experience", idx: "04" },
  { href: "/#about", label: "About", match: "about", idx: "05" },
  { href: "/#contact", label: "Contact", match: "contact", idx: "06" },
];

export function Navbar() {
  const pathname = usePathname();
  const { qualityMode } = useMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const closeReasonRef = useRef<"escape" | "button" | "link" | null>(null);

  const isProjectsRoute = pathname?.startsWith("/projects");
  const isResourcesRoute = pathname?.startsWith("/resources");

  const closeOverlay = (reason: "escape" | "button" | "link") => {
    closeReasonRef.current = reason;
    setMenuOpen(false);
  };

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      closeBtnRef.current?.focus();

      if (qualityMode !== "reduced" && overlayRef.current) {
        const items = overlayRef.current.querySelectorAll(".overlay-nav-item");
        gsap.fromTo(
          overlayRef.current,
          { clipPath: "inset(0% 0% 100% 0%)", opacity: 0.85 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 0.42,
            ease: "power3.out",
          }
        );
        gsap.fromTo(
          items,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.055,
            duration: 0.45,
            delay: 0.08,
            ease: "power3.out",
          }
        );
      }
    } else {
      document.body.style.overflow = "";
      if (wasOpenRef.current && closeReasonRef.current !== "link") {
        toggleBtnRef.current?.focus();
      }
      closeReasonRef.current = null;
    }
    wasOpenRef.current = menuOpen;

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, qualityMode]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeOverlay("escape");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#08090C]/75 backdrop-blur-md">
        <nav
          aria-label="Primary navigation"
          className="mx-auto flex h-[68px] max-w-[1280px] items-center justify-between px-6"
        >
          <Link
            href="/"
            prefetch={false}
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("portfolio:scroll-top"));
              }
            }}
            className="group inline-flex min-h-[44px] shrink-0 items-baseline whitespace-nowrap font-display text-xl font-bold tracking-[-0.04em] text-[#F2F0EC] transition-colors hover:text-[#65C8F5]"
          >
            <span>Adrian</span>
            <span className="text-[#65C8F5]" aria-hidden="true">
              .
            </span>
            <span className="sr-only"> — Home</span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.slice(0, 6).map((link) => {
              const active =
                (link.match === "projects" && isProjectsRoute) ||
                (link.match === "resources" && isResourcesRoute);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  prefetch={false}
                  aria-current={active ? "page" : undefined}
                  className={`group inline-flex min-h-[40px] items-center whitespace-nowrap px-3 py-2 text-sm font-medium transition-colors ${
                    active ? "text-[#65C8F5]" : "text-[#A7ADB7] hover:text-[#F2F0EC]"
                  }`}
                >
                  <RollText>{link.label}</RollText>
                </Link>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden font-mono text-[11px] tracking-wider text-[#A7ADB7] xl:inline">
              INDONESIA
            </span>

            <MagneticSurface>
              <Link
                href="/#contact"
                prefetch={false}
                className="active-press hidden min-h-[40px] items-center whitespace-nowrap rounded-full bg-[#F2F0EC] px-4 py-1.5 text-sm font-semibold text-[#08090C] transition-colors hover:bg-[#65C8F5] lg:inline-flex"
              >
                Let&apos;s Connect
              </Link>
            </MagneticSurface>

            <button
              ref={toggleBtnRef}
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="active-press inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 rounded-full border border-white/15 bg-[#15171C]/90 px-3 text-xs font-medium text-[#F2F0EC] transition-colors hover:border-[#65C8F5] hover:text-[#65C8F5]"
            >
              {menuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Fullscreen Expressive Navigation Overlay (Desktop & Mobile) */}
      {menuOpen && (
        <div
          id="mobile-nav-drawer"
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Full navigation menu"
          className="fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto bg-[#08090C]/98 px-6 py-8 backdrop-blur-xl"
        >
          <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between border-b border-white/10 pb-5">
            <span className="font-display text-xl font-bold tracking-[-0.04em] text-[#F2F0EC]">
              Adrian<span className="text-[#65C8F5]">.</span>
            </span>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => closeOverlay("button")}
              aria-label="Close navigation overlay"
              className="active-press inline-flex min-h-[44px] min-w-[44px] items-center gap-2 rounded-full border border-white/15 bg-[#15171C] px-4 text-xs font-medium text-[#F2F0EC] transition-colors hover:border-[#65C8F5] hover:text-[#65C8F5]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
              <span>Close</span>
            </button>
          </div>

          <div className="mx-auto my-auto w-full max-w-[1280px] py-8">
            <ul className="divide-y divide-white/10 border-y border-white/10">
              {navLinks.map((link) => {
                const active =
                  (link.match === "projects" && isProjectsRoute) ||
                  (link.match === "resources" && isResourcesRoute);
                return (
                  <li key={link.href} className="overlay-nav-item">
                    <Link
                      href={link.href}
                      prefetch={false}
                      onClick={() => closeOverlay("link")}
                      aria-current={active ? "page" : undefined}
                      className="group flex min-h-[56px] items-center justify-between py-4 transition-colors sm:py-5"
                    >
                      <div className="flex items-baseline gap-4 sm:gap-6">
                        <span className="font-mono text-xs text-[#65C8F5]">{link.idx}</span>
                        <span
                          className={`font-display text-[clamp(1.65rem,4vw,3.25rem)] font-bold tracking-[-0.03em] transition-colors group-hover:text-[#65C8F5] ${
                            active ? "text-[#65C8F5]" : "text-[#F2F0EC]"
                          }`}
                        >
                          {link.label}
                        </span>
                      </div>
                      <ArrowUpRight
                        className="h-5 w-5 text-[#A7ADB7] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#65C8F5]"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5 text-xs text-[#A7ADB7]">
            <a
              href="mailto:adriansyah1230@gmail.com"
              className="link-underline text-sm font-medium text-[#F2F0EC] hover:text-[#65C8F5]"
            >
              adriansyah1230@gmail.com
            </a>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/Adrian463588"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline hover:text-[#F2F0EC]"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline hover:text-[#F2F0EC]"
              >
                LinkedIn
              </a>
              <a
                href="https://medium.com/@adriansyah1230"
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline hover:text-[#F2F0EC]"
              >
                Medium
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
