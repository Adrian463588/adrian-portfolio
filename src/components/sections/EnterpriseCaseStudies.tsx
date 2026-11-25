import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/data/projects";
import { getEnterpriseProjects } from "@/lib/projects";

export function EnterpriseCaseStudies() {
  const enterprise = getEnterpriseProjects(projects);

  if (enterprise.length === 0) {
    return null;
  }

  return (
    <section id="enterprise-work" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeader
          eyebrow="Enterprise Case Studies"
          title="Enterprise Automotive Financing Quality Engagements"
          description="Sanitized quality engineering case studies from Berijalan Techno Center (Astra Credit Companies Group), published independently from open-source repositories without exposing confidential internal artifacts."
          action={
            <Link
              href="/projects/?origin=professional"
              prefetch={false}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-[#27272A] bg-[#18181B] px-4 py-2 text-sm font-medium text-[#F4F4F5] transition-colors hover:border-[#38BDF8]/50 hover:text-[#38BDF8]"
            >
              Filter Enterprise Work ({enterprise.length})
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {enterprise.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
