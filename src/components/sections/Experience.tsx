"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
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
    <section id="experience" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeader
          eyebrow="Experience"
          title="Professional Experience & Technical Training"
          description="Enterprise software quality engineering, QA/SDET internships, and structured technical training in reverse-chronological order."
          action={
            <div
              role="tablist"
              aria-label="Filter experience category"
              className="inline-flex flex-wrap gap-1 rounded-lg border border-[#27272A] bg-[#18181B] p-1"
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
                    className={`min-h-[38px] rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                      selected
                        ? "bg-[#27272A] text-[#F4F4F5]"
                        : "text-[#A1A1AA] hover:text-[#F4F4F5]"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          }
        />

        <div className="max-w-4xl">
          {filtered.map((entry) => {
            const linkedProjects = (entry.projectIds ?? [])
              .map((slug) => projectMap.get(slug))
              .filter((p): p is Project => Boolean(p));

            return (
              <TimelineItem
                key={entry.id}
                entry={entry}
                linkedProjects={linkedProjects}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
