import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { enterpriseProjects, githubProjects, githubSyncMeta, projects } from "@/data/projects";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";

export const metadata: Metadata = {
  title: "Project Explorer",
  description:
    "Searchable engineering catalog across QA/SDET, DevOps & DevSecOps, Backend APIs, Android, Applied AI, Desktop Systems, and FinTech repositories.",
  alternates: {
    canonical: "/projects/",
  },
};

export default function ProjectsPage() {
  const syncedDate = githubSyncMeta.syncedAt.slice(0, 10);

  return (
    <div className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-[1200px] space-y-10">
        <div className="space-y-4 border-b border-[#27272A] pb-8">
          <Link
            href="/"
            prefetch={false}
            className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-medium text-[#A1A1AA] transition-colors hover:text-[#38BDF8]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to overview
          </Link>

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl space-y-2">
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-[#38BDF8]">
                Repository Catalog
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl">
                Engineering Project Explorer
              </h1>
              <p className="text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
                Complete curated inventory of {projects.length} documented engagements ({enterpriseProjects.length} enterprise
                quality case studies + {githubProjects.length} public repositories from{" "}
                <span className="font-mono text-[#E4E4E7]">@{githubSyncMeta.username}</span>) across
                Professional Work, Featured Personal Systems, Core Projects, and Experiments.
              </p>
            </div>
            <p className="font-mono text-xs text-[#A1A1AA]">
              Static snapshot synced {syncedDate}
            </p>
          </div>
        </div>

        <ProjectExplorer items={projects} />
      </div>
    </div>
  );
}
