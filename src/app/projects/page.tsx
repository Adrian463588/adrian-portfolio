import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { enterpriseProjects, githubProjects, githubSyncMeta, projects } from "@/data/projects";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";

export const metadata: Metadata = {
  title: "Projects & Experiments",
  description:
    "Curated editorial gallery of software engineering works, enterprise quality case studies, QA/SDET tools, DevOps infrastructure, Android, and applied AI systems.",
  alternates: {
    canonical: "/projects/",
  },
};

export default function ProjectsPage() {
  const syncedDate = githubSyncMeta.syncedAt.slice(0, 10);

  return (
    <div className="px-6 py-10 sm:py-14">
      <div className="mx-auto max-w-[1280px] space-y-8">
        <div className="space-y-4 border-b border-white/10 pb-6">
          <Link
            href="/"
            prefetch={false}
            className="inline-flex min-h-[38px] items-center gap-1.5 font-mono text-xs text-[#A0A6B0] transition-colors hover:text-[#00C8F5]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to overview
          </Link>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl space-y-2">
              <h1 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.04] tracking-[-0.03em] text-[#F1F3F5]">
                Projects &amp; Experiments.
              </h1>
              <p className="text-sm leading-relaxed text-[#A0A6B0] sm:text-base">
                {projects.length} verified systems ({enterpriseProjects.length} enterprise dossiers
                + {githubProjects.length} public repositories) spanning QA automation, DevOps,
                Android, and applied AI.
              </p>
            </div>
            <p className="font-mono text-xs text-[#A0A6B0]">
              Synced {syncedDate} · 2020–2026
            </p>
          </div>
        </div>

        <ProjectExplorer items={projects} />
      </div>
    </div>
  );
}
