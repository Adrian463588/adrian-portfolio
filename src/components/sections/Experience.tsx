"use client";

import { useMemo, useState } from "react";
import { TimelineItem } from "@/components/ui/TimelineItem";
import { experiences } from "@/data/experience";
import { projects } from "@/data/projects";
import type { Project } from "@/types";

type FilterMode = "professional" | "training" | "all";

export function Experience() {
  const [filter, setFilter] = useState<FilterMode>("professional");

  const projectMap = useMemo(
    () => new Map<string, Project>(projects.map((p) => [p.slug, p])),
    []
  );

  const professionalCount = experiences.filter((e) => e.category === "professional").length;
  const trainingCount = experiences.length - professionalCount;

  const filtered = experiences.filter((e) => {
    if (filter === "professional") return e.category === "professional";
    if (filter === "training") return e.category !== "professional";
    return true;
  });

  const tabs: { id: FilterMode; label: string }[] = [
    { id: "professional", label: `Work Experience (${professionalCount})` },
    { id: "training", label: `Bootcamps & Training (${trainingCount})` },
    { id: "all", label: `All (${experiences.length})` },
  ];

  return (
    <section
      id="experience"
      className="border-t border-white/10 bg-[#08090B]/70 px-6 py-20 backdrop-blur-[2px] sm:py-24"
    >
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="min-w-0 space-y-6 lg:col-span-4">
          <div className="space-y-3 lg:sticky lg:top-24">
            <p className="font-mono text-xs tracking-[0.16em] text-[#00C8F5] uppercase">
              Career Ledger
            </p>
            <h2 className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[#F1F3F5]">
              Professional Experience
            </h2>
            <p className="text-sm leading-relaxed text-[#A0A6B0]">
              Enterprise quality control, test automation, QA internships, and technical training
              ordered reverse-chronologically.
            </p>

            <div
              role="tablist"
              aria-label="Filter experience category"
              className="flex flex-wrap gap-1.5 pt-2"
            >
              {tabs.map((tab) => {
                const selected = filter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setFilter(tab.id)}
                    className={`min-h-[40px] rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                      selected
                        ? "border-[#00C8F5] bg-[#00C8F5]/12 text-[#00C8F5]"
                        : "border-white/15 bg-transparent text-[#A0A6B0] hover:border-white/30 hover:text-[#F1F3F5]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-8">
          {filtered.map((entry, idx) => {
            const linkedProjects = (entry.projectIds ?? [])
              .map((slug) => projectMap.get(slug))
              .filter((p): p is Project => Boolean(p));

            return (
              <TimelineItem
                key={entry.id}
                entry={entry}
                linkedProjects={linkedProjects}
                indexLabel={String(idx + 1).padStart(2, "0")}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
