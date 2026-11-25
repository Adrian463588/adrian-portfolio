import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";

export const metadata: Metadata = {
  title: "All Projects",
  description:
    "A collection of professional work, open-source software, QA automation tools, Android apps, and experiments.",
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
            className="link-underline inline-flex min-h-[38px] items-center gap-1.5 text-xs font-medium text-[#A7ADB7] transition-colors hover:text-[#65C8F5]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to overview</span>
          </Link>

          <div className="max-w-2xl space-y-2.5">
            <h1 className="font-display text-[clamp(2.25rem,5vw,4.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-[#F2F0EC]">
              All projects.
            </h1>
            <p className="text-sm leading-relaxed text-[#A7ADB7] sm:text-base">
              A collection of my work and experiments.
            </p>
          </div>
        </div>

        <ProjectExplorer items={projects} />
      </div>
    </div>
  );
}
