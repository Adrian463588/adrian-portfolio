"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ExperienceEntry } from "@/types";

interface TimelineItemProps {
  entry: ExperienceEntry;
  index: number;
}

const dotColorMap: Record<string, string> = {
  cyan: "border-cyan-500 shadow-[0_0_10px_#0ff]",
  purple: "border-purple-500 shadow-[0_0_10px_#a855f7]",
  red: "border-red-500 shadow-[0_0_10px_#ef4444]",
  orange: "border-orange-500 shadow-[0_0_10px_#f97316]",
  green: "border-green-500 shadow-[0_0_10px_#22c55e]",
  blue: "border-blue-400 shadow-[0_0_10px_#60a5fa]",
  yellow: "border-yellow-500 shadow-[0_0_10px_#eab308]",
  emerald: "border-emerald-500 shadow-[0_0_10px_#10b981]",
  pink: "border-pink-500 shadow-[0_0_10px_#ec4899]",
  sky: "border-sky-500 shadow-[0_0_10px_#0ea5e9]",
  amber: "border-amber-500 shadow-[0_0_10px_#f59e0b]",
};

const dateColorMap: Record<string, string> = {
  cyan: "text-cyan-400",
  purple: "text-purple-400",
  red: "text-red-400",
  orange: "text-orange-400",
  green: "text-green-400",
  blue: "text-blue-400",
  yellow: "text-yellow-400",
  emerald: "text-emerald-400",
  pink: "text-pink-400",
  sky: "text-sky-400",
  amber: "text-amber-400",
};

const borderColorMap: Record<string, string> = {
  cyan: "border-cyan-500/30 hover:border-cyan-400",
  purple: "border-purple-500/30 hover:border-purple-400",
  red: "border-red-500/30 hover:border-red-400",
  orange: "border-orange-500/30 hover:border-orange-400",
  green: "border-green-500/30 hover:border-green-400",
  blue: "border-blue-400/30 hover:border-blue-300",
  yellow: "border-yellow-500/30 hover:border-yellow-400",
  emerald: "border-emerald-500/30 hover:border-emerald-400",
  pink: "border-pink-500/30 hover:border-pink-400",
  sky: "border-sky-500/30 hover:border-sky-400",
  amber: "border-amber-500/30 hover:border-amber-400",
};

export function TimelineItem({ entry, index }: TimelineItemProps) {
  const isLeft = index % 2 === 0;

  return (
    <div
      className={cn(
        "group relative mb-12",
        isLeft
          ? "md:mr-auto md:w-1/2 md:pr-12"
          : "md:ml-auto md:w-1/2 md:pl-12"
      )}
    >
      {/* Timeline dot with pulse */}
      <motion.div
        className={cn(
          "absolute -left-[29px] top-6 z-10 h-4 w-4 rounded-full border-2 bg-black",
          isLeft ? "md:-right-[9px] md:left-auto" : "md:-left-[7px]",
          dotColorMap[entry.color] || dotColorMap.cyan
        )}
        initial={{ scale: 1 }}
        whileInView={{ scale: [1, 1.5, 1] }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />

      {/* Card */}
      <div
        className={cn(
          "rounded-xl border bg-[rgba(10,10,20,0.7)] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-[12px]",
          "transform transition-all duration-300 group-hover:-translate-y-1",
          borderColorMap[entry.color] || borderColorMap.cyan
        )}
      >
        {/* Header: date, title, org — right-aligned for left cards */}
        <div className={cn(isLeft ? "md:text-right" : "")}>
          <span
            className={cn(
              "text-sm font-bold tracking-widest",
              dateColorMap[entry.color] || dateColorMap.cyan
            )}
          >
            {entry.dateRange.toUpperCase()}
          </span>
          <h3 className="mt-2 text-2xl font-bold">{entry.title}</h3>
          <p className="mb-4 font-semibold text-gray-300">
            {entry.organization}
          </p>
        </div>

        {/*
          Bullet list — ALWAYS left-aligned regardless of card position.
          Uses custom flex layout instead of list-style to guarantee
          consistent marker alignment across all browsers/breakpoints.
        */}
        <div className="space-y-3 text-sm leading-relaxed text-gray-400">
          {entry.bullets.map((bullet, i) => (
            <div key={i} className="flex gap-3">
              <span className="mt-[7px] h-[5px] w-[5px] shrink-0 rounded-full bg-cyan-500/60" />
              <span>{bullet}</span>
            </div>
          ))}
        </div>

        {entry.repoUrl && (
          <a
            href={entry.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-4 inline-block text-sm text-cyan-400 transition-colors hover:text-cyan-300",
              isLeft ? "md:float-right" : ""
            )}
          >
            View Repository →
          </a>
        )}
      </div>
    </div>
  );
}
