"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  Linkedin,
  Mail,
  Instagram,
  Github,
  BookOpen,
  ChevronDown,
} from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const socialLinks = [
  {
    href: "https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/",
    label: "LinkedIn",
    icon: Linkedin,
    external: true,
  },
  {
    href: "https://github.com/Adrian463588",
    label: "GitHub",
    icon: Github,
    external: true,
  },
  {
    href: "mailto:adriansyah1230@gmail.com",
    label: "Email",
    icon: Mail,
    external: false,
  },
  {
    href: "https://medium.com/@adriansyah1230",
    label: "Blog",
    icon: BookOpen,
    external: true,
  },
  {
    href: "https://www.instagram.com/adriansyahabidin/?hl=en",
    label: "Instagram",
    icon: Instagram,
    external: true,
  },
];

export function Hero() {
  const { scrollY } = useScroll();
  const chevronOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center justify-center px-6 pt-20"
    >
      <div className="grid w-full max-w-5xl items-center gap-12 md:grid-cols-2">
        <motion.div
          className="z-10 space-y-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-block rounded-full border border-cyan-500/50 bg-cyan-900/20 px-3 py-1 text-sm uppercase tracking-widest text-cyan-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Open to 2025 Full-Time & Internship Roles
          </motion.div>

          <motion.h1
            className="text-5xl font-bold leading-tight md:text-7xl"
            style={{ fontFamily: "var(--font-orbitron)" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            ADRIAN
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              SYAH ABIDIN
            </span>
          </motion.h1>

          <motion.p
            className="text-xl font-light text-gray-300 md:text-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            DevOps · QA/SDET · Backend Engineer
          </motion.p>

          <motion.p
            className="max-w-lg leading-relaxed text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Final-year Information Technology student at Universitas Gadjah Mada
            with hands-on experience at ByteDance (Tokopedia), Qiscus, and
            Bitbybit. I&apos;ve tested products used by millions, automated
            CI/CD pipelines, and built backend APIs from scratch — and I&apos;m
            just getting started. AWS and CompTIA certified.
          </motion.p>

          <motion.div
            className="flex gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <MagneticButton
              href="#contact"
              className="rounded bg-cyan-600 px-8 py-3 font-bold text-white transition-all duration-300 hover:bg-cyan-500 hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
            >
              CONTACT ME
            </MagneticButton>
            <MagneticButton
              href="#experience"
              className="rounded border border-cyan-500 px-8 py-3 font-bold text-cyan-400 transition-all duration-300 hover:bg-cyan-500/10"
            >
              VIEW WORK
            </MagneticButton>
          </motion.div>

          <motion.div
            className="flex gap-4 pt-4 text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="transition-colors hover:text-cyan-400 focus-visible:text-cyan-400"
                aria-label={link.label}
                whileHover={{
                  y: -3,
                  transition: { type: "spring", stiffness: 400, damping: 10 },
                }}
              >
                <link.icon className="h-5 w-5" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* 3D Canvas area — filled by the Scene component in layout */}
        <div className="hidden h-[500px] md:block" />
      </div>

      {/* Chevron fades on scroll (B14) */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
        style={{ opacity: chevronOpacity }}
      >
        <ChevronDown className="h-8 w-8 text-cyan-500" />
      </motion.div>
    </section>
  );
}
