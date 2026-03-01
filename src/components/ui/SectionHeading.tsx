"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  children: string;
  className?: string;
}

const charVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.03,
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

export function SectionHeading({ children, className }: SectionHeadingProps) {
  const chars = children.split("");

  return (
    <motion.h2
      className={cn(
        "mb-16 text-center text-4xl font-bold md:text-5xl",
        className
      )}
      style={{ fontFamily: "var(--font-orbitron)" }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={charVariants}
          className="inline-block bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent"
          style={{ whiteSpace: char === " " ? "pre" : undefined }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h2>
  );
}
