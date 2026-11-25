import Link from "next/link";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TiltSurface } from "@/components/ui/TiltSurface";
import { projects } from "@/data/projects";
import { getEnterpriseProjects } from "@/lib/projects";
import { RollText } from "@/components/motion/RollText";

export function EnterpriseCaseStudies() {
  const enterprise = getEnterpriseProjects(projects);

  if (enterprise.length === 0) {
    return null;
  }

  return (
    <section
      id="enterprise-work"
      className="border-t border-white/10 bg-[#080808]/75 px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="Enterprise Engineering"
          title="Enterprise Quality Dossiers"
          description="Sanitized case studies from Berijalan Techno Center (Astra Credit Companies Group), documented at an abstracted disclosure boundary."
          action={
            <Link
              href="/projects/?origin=professional"
              prefetch={false}
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-[#151515]/80 px-4 py-2 text-sm font-medium text-[#F1F0EB] transition-colors hover:border-[#4169FF]"
            >
              <RollText>Enterprise Case Studies</RollText>
              <ArrowRight className="h-4 w-4 text-[#7A9BFF]" aria-hidden="true" />
            </Link>
          }
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {enterprise.map((project, index) => (
            <TiltSurface key={project.id} className="h-full">
              <article className="group flex h-full min-w-0 flex-col justify-between border-t-2 border-white/15 bg-[#151515]/45 p-6 backdrop-blur-sm transition-colors hover:border-[#4169FF]">
                <div className="min-w-0 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-[#7A9BFF]">
                      {String(index + 1).padStart(2, "0")} / ENTERPRISE
                    </span>
                    {project.hasCiWorkflow && (
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-300">
                        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        Jenkins CI
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 border-b border-white/10 pb-4">
                    <p className="font-mono text-[11px] tracking-wider text-[#A6A6A6] uppercase">
                      {project.testingType}
                    </p>
                    <h3 className="font-display break-words text-lg font-bold tracking-tight text-[#F1F0EB] sm:text-xl">
                      <Link
                        href={`/projects/${project.slug}/`}
                        prefetch={false}
                        className="transition-colors hover:text-[#7A9BFF]"
                      >
                        {project.title}
                      </Link>
                    </h3>
                    <p className="text-xs text-[#A6A6A6]">{project.businessDomain}</p>
                  </div>

                  <p className="break-words text-sm leading-relaxed text-[#D6D5CF]">
                    {project.summary}
                  </p>
                </div>

                <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-4">
                  <p className="font-mono text-[11px] text-[#A6A6A6]">
                    {project.technologies.slice(0, 4).join(" · ")}
                  </p>
                  <Link
                    href={`/projects/${project.slug}/`}
                    prefetch={false}
                    className="inline-flex min-h-[36px] items-center justify-between text-xs font-semibold tracking-wide text-[#7A9BFF] transition-colors hover:text-[#F1F0EB]"
                  >
                    <span>Read Sanitized Dossier</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </TiltSurface>
          ))}
        </div>
      </div>
    </section>
  );
}
