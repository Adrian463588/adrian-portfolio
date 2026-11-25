import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { githubProjects, projects } from "@/data/projects";
import { getFeaturedProjects } from "@/lib/projects";
import { RollText } from "@/components/motion/RollText";
import { MagneticSurface } from "@/components/motion/MagneticSurface";

export function SelectedWork() {
  const featured = getFeaturedProjects(projects);

  return (
    <section
      id="work"
      className="border-t border-white/10 bg-[#08090B]/75 px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px] space-y-14">
        <div>
          <SectionHeader
            eyebrow="Selected Personal Work"
            title="Flagship Open-Source Engineering"
            description={`Eight curated systems spanning QA automation, offline-first Android & AI, DevOps observability, and web software — chosen from ${githubProjects.length} public repositories.`}
            action={
              <Link
                href="/projects/?origin=personal"
                prefetch={false}
                className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-[#101216]/80 px-4 py-2 text-sm font-medium text-[#F1F3F5] transition-colors hover:border-[#00C8F5]/60"
              >
                <RollText>{`Personal Repos (${githubProjects.length})`}</RollText>
                <ArrowRight className="h-4 w-4 text-[#00C8F5]" aria-hidden="true" />
              </Link>
            }
          />

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {featured.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                priorityImage={index < 2}
                featuredLead={index < 2}
              />
            ))}
          </div>
        </div>

        {/* Minimal open strip linking into curated Projects gallery */}
        <div
          id="project-explorer"
          className="flex flex-col justify-between gap-6 border-y border-white/10 py-8 md:flex-row md:items-center"
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <p className="font-mono text-xs tracking-[0.16em] text-[#00C8F5] uppercase">
              Full Catalog
            </p>
            <h2 className="font-display text-xl font-bold tracking-tight text-[#F1F3F5] sm:text-2xl">
              Explore All {projects.length} Documented Projects &amp; Experiments
            </h2>
            <p className="text-sm text-[#A0A6B0]">
              Browse enterprise case studies, open-source engineering tools, and archival academic work in editorial gallery or index view.
            </p>
          </div>
          <MagneticSurface>
            <Link
              href="/projects/"
              prefetch={false}
              className="inline-flex min-h-[46px] shrink-0 items-center gap-2 rounded-full bg-[#F1F3F5] px-6 py-2.5 text-sm font-semibold text-[#08090B] transition-colors hover:bg-[#00C8F5]"
            >
              <span>Open Projects Gallery</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </MagneticSurface>
        </div>
      </div>
    </section>
  );
}
