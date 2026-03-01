"use client";

import { motion } from "framer-motion";
import { Mail, Linkedin, Instagram, Github, BookOpen } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Contact() {
  return (
    <section id="contact" className="mb-20 px-6 py-20">
      <motion.div
        className="mx-auto max-w-3xl rounded-2xl border border-cyan-500/10 bg-[rgba(10,10,20,0.7)] p-10 text-center shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-[12px]"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <h2
          className="mb-6 text-4xl font-bold"
          style={{ fontFamily: "var(--font-orbitron)" }}
        >
          LET&apos;S CONNECT
        </h2>
        <p className="mb-8 text-gray-300">
          I&apos;m actively looking for DevOps, QA/SDET, and Backend roles —
          full-time or internship. Whether you have a position, a project, or
          just want to say hello, I&apos;d love to hear from you. Based in
          Yogyakarta, open to remote and on-site.
        </p>

        <div className="flex flex-col items-center justify-center gap-6 md:flex-row">
          <MagneticButton
            href="mailto:adriansyah1230@gmail.com"
            className="flex items-center gap-3 rounded bg-white px-6 py-3 font-bold text-black transition-all hover:bg-cyan-400"
          >
            <Mail className="h-5 w-5" />
            Email Me
          </MagneticButton>
          <MagneticButton
            href="https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/"
            className="flex items-center gap-3 rounded border border-white px-6 py-3 font-bold transition-all hover:bg-white hover:text-black"
          >
            <Linkedin className="h-5 w-5" />
            LinkedIn
          </MagneticButton>
          <MagneticButton
            href="https://github.com/Adrian463588"
            className="flex items-center gap-3 rounded border border-white px-6 py-3 font-bold transition-all hover:bg-white hover:text-black"
          >
            <Github className="h-5 w-5" />
            GitHub
          </MagneticButton>
          <MagneticButton
            href="https://www.instagram.com/adriansyahabidin/?hl=en"
            className="flex items-center gap-3 rounded border border-white px-6 py-3 font-bold transition-all hover:bg-white hover:text-black"
          >
            <Instagram className="h-5 w-5" />
            Instagram
          </MagneticButton>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8">
          <p className="text-sm text-gray-500">Yogyakarta, Indonesia</p>
          <div className="mt-2 flex items-center justify-center gap-4 text-sm text-gray-500">
            <a
              href="https://medium.com/@adriansyah1230"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 transition-colors hover:text-cyan-400"
            >
              <BookOpen className="h-4 w-4" />
              Blog
            </a>
          </div>
          <p className="mt-2 text-sm text-gray-500">
            &copy; 2025 Adrian Syah Abidin. All systems normal.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
