import Link from "next/link";
import { ArrowRight, ArrowUpRight, ShieldCheck } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ChoreographedBlock } from "@/components/motion/SectionChoreography";
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
      className="border-t border-white/10 bg-[#08090C]/78 px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          title="Enterprise Work."
          description="Sanitized software testing case studies from Berijalan Techno Center (Astra Credit Companies Group)."
          action={
            <Link
              href="/projects/?origin=professional"
              prefetch={false}
              className="active-press group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-[#15171C]/85 px-4 py-2 text-sm font-medium text-[#F2F0EC] transition-colors hover:border-[#65C8F5]"
            >
              <RollText>Professional work</RollText>
              <ArrowRight className="h-4 w-4 text-[#65C8F5]" aria-hidden="true" />
            </Link>
          }
        />

        {/* Open architectural rows replacing boxed card grids */}
        <ChoreographedBlock
          variant="slide-right"
          className="divide-y divide-white/10 border-y border-white/10"
        >
          {enterprise.map((project, index) => (
            <article
              key={project.id}
              className="group grid grid-cols-1 gap-6 py-8 transition-colors hover:bg-white/[0.015] lg:grid-cols-12 lg:items-start lg:gap-8"
            >
              <div className="space-y-2 lg:col-span-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-[#65C8F5]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {project.hasCiWorkflow && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-300">
                      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                      Jenkins CI
                    </span>
                  )}
                </div>

                <h3 className="font-display break-words text-xl font-bold tracking-tight text-[#F2F0EC] sm:text-2xl">
                  <Link
                    href={`/projects/${project.slug}/`}
                    prefetch={false}
                    className="transition-colors hover:text-[#65C8F5]"
                  >
                    {project.title}
                  </Link>
                </h3>

                <p className="text-xs font-medium text-[#65C8F5]">{project.testingType}</p>
                <p className="text-xs text-[#A7ADB7]">{project.businessDomain}</p>
              </div>

              <div className="min-w-0 space-y-3 lg:col-span-5">
                <p className="break-words text-sm leading-relaxed text-[#D6D9DF] sm:text-base">
                  {project.summary}
                </p>
                <p className="text-xs text-[#A7ADB7]">
                  {project.technologies.slice(0, 4).join(" · ")}
                </p>
              </div>

              <div className="flex items-center lg:col-span-3 lg:justify-end">
                <Link
                  href={`/projects/${project.slug}/`}
                  prefetch={false}
                  className="link-underline inline-flex min-h-[40px] items-center gap-1.5 text-sm font-semibold text-[#65C8F5] transition-colors hover:text-[#F2F0EC]"
                >
                  <span>Read Case Study</span>
                  <ArrowUpRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </article>
          ))}
        </ChoreographedBlock>
      </div>
    </section>
  );
}
