import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A selection of professional work, personal projects, and experiments across QA automation, enterprise systems, DevOps, Android, and applied AI.",
  alternates: {
    canonical: "/projects/",
  },
};

export default function ProjectsPage() {
  return (
    <div className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-[1280px] space-y-10">
        <div className="space-y-4 border-b border-white/10 pb-8">
          <Link
            href="/"
            prefetch={false}
            className="inline-flex min-h-[38px] items-center gap-1.5 font-mono text-xs text-[#A6A6A6] transition-colors hover:text-[#7A9BFF]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to overview
          </Link>

          <div className="max-w-2xl space-y-2.5">
            <h1 className="font-display text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em] text-[#F1F0EB]">
              Projects
            </h1>
            <p className="text-sm leading-relaxed text-[#A6A6A6] sm:text-base">
              A selection of professional work, personal projects, and experiments.
            </p>
          </div>
        </div>

        <ProjectExplorer items={projects} />
      </div>
    </div>
  );
}
