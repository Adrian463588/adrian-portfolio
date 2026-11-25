import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { githubProjects, projects } from "@/data/projects";
import { getFeaturedProjects } from "@/lib/projects";

export function SelectedWork() {
  const featured = getFeaturedProjects(projects);

  return (
    <section id="work" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px] space-y-12">
        <div>
          <SectionHeader
            eyebrow="Personal Projects"
            title="Featured Personal Projects"
            description={`Eight curated open-source systems spanning QA automation, offline-first Android & AI, DevOps observability, and web software — selected from ${githubProjects.length} public repositories.`}
            action={
              <Link
                href="/projects/?origin=personal"
                prefetch={false}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-[#27272A] bg-[#18181B] px-4 py-2 text-sm font-medium text-[#F4F4F5] transition-colors hover:border-[#38BDF8]/50 hover:text-[#38BDF8]"
              >
                Explore personal projects ({githubProjects.length})
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            }
          />

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {featured.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                priorityImage={index < 2}
              />
            ))}
          </div>
        </div>

        {/* Dedicated All Projects Explorer access strip */}
        <div
          id="project-explorer"
          className="flex flex-col justify-between gap-4 rounded-xl border border-[#27272A] bg-[#18181B] p-6 sm:flex-row sm:items-center sm:p-8"
        >
          <div className="max-w-2xl space-y-1.5">
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-[#38BDF8]">
              Complete Catalog
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-[#F4F4F5]">
              All Projects Explorer ({projects.length} Documented Entries)
            </h2>
            <p className="text-sm leading-relaxed text-[#A1A1AA]">
              Search and filter across Enterprise Case Studies, Personal Open-Source Systems,
              Academic Works, and Experiments by domain, origin, or technology stack.
            </p>
          </div>
          <Link
            href="/projects/"
            prefetch={false}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-lg bg-[#F4F4F5] px-5 py-2.5 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#38BDF8]"
          >
            Open Project Explorer
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
