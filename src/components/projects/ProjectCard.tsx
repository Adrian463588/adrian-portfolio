import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Github, GitFork, ShieldCheck } from "lucide-react";
import type { Project } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { TiltSurface } from "@/components/ui/TiltSurface";

interface ProjectCardProps {
  project: Project;
  priorityImage?: boolean;
  featuredLead?: boolean;
}

export function ProjectCard({
  project,
  priorityImage = false,
  featuredLead = false,
}: ProjectCardProps) {
  const leadShot = project.screenshots[0];
  const isPortrait = leadShot ? leadShot.height > leadShot.width : false;
  const visibleTech = project.technologies.slice(0, 3);
  const extraTechCount = project.technologies.length - visibleTech.length;

  return (
    <TiltSurface className="h-full min-w-0 rounded-xl" maxTilt={featuredLead ? 3 : 4}>
      <article className="group flex h-full min-w-0 flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#151515]/55 backdrop-blur-sm transition-colors hover:border-white/25 hover:bg-[#151515]/85">
        <div className="min-w-0">
          {leadShot ? (
            <Link
              href={`/projects/${project.slug}/`}
              prefetch={false}
              data-cursor="work"
              className="editorial-image-wrap block overflow-hidden border-b border-white/10 bg-[#080808]"
            >
              <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-[#101012]">
                <Image
                  src={leadShot.src}
                  alt={leadShot.alt}
                  width={leadShot.width}
                  height={leadShot.height}
                  priority={priorityImage}
                  className={
                    isPortrait
                      ? "h-full w-full object-contain py-3"
                      : "h-full w-full object-cover object-top"
                  }
                />
              </div>
            </Link>
          ) : project.projectOrigin === "professional" ? (
            <div className="space-y-1.5 border-b border-white/10 bg-gradient-to-br from-[#4169FF]/[0.12] via-[#151515] to-[#080808] px-5 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#7A9BFF]">
                  {project.organization || "Enterprise Engagement"}
                </span>
                {project.hasCiWorkflow && (
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    CI Integrated
                  </span>
                )}
              </div>
              {project.testingType && (
                <p className="font-mono text-xs text-[#F1F0EB]">{project.testingType}</p>
              )}
              {project.businessDomain && (
                <p className="text-xs text-[#A6A6A6]">{project.businessDomain}</p>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-between border-b border-white/10 bg-[#080808]/60 px-5 py-3">
              <span className="font-mono text-xs text-[#A6A6A6]">
                {project.language || "Repository"} · {project.updatedAt}
              </span>
              {project.hasCiWorkflow && (
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-300">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  CI Verified
                </span>
              )}
            </div>
          )}

          <div className="p-5 sm:p-6">
            <div className="mb-2.5 flex flex-wrap items-center gap-2">
              <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#7A9BFF]">
                {project.category}
              </span>
              {project.projectOrigin === "professional" && (
                <Badge label="Professional Work" variant="accent" />
              )}
              {project.projectOrigin === "fork" && (
                <Badge label="Fork · Extended" variant="warning" />
              )}
              {project.projectStatus === "released" && (
                <Badge label="Released" variant="success" />
              )}
            </div>

            <h3 className="font-display break-words text-lg font-bold tracking-tight text-[#F1F0EB] sm:text-xl">
              <Link
                href={`/projects/${project.slug}/`}
                prefetch={false}
                className="break-words transition-colors hover:text-[#7A9BFF]"
              >
                {project.title}
              </Link>
            </h3>

            {project.subtitle && (
              <p className="mt-1 break-words text-xs font-medium text-[#D6D5CF]">
                {project.subtitle}
              </p>
            )}

            <p className="mt-3 break-words text-sm leading-relaxed text-[#A6A6A6]">
              {project.summary}
            </p>

            {project.projectOrigin === "fork" && project.upstreamCredit && (
              <p className="mt-3 flex items-start gap-1.5 break-words border-l-2 border-amber-400/60 pl-3 text-xs text-[#A6A6A6]">
                <GitFork className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden="true" />
                <span className="min-w-0 break-words">{project.upstreamCredit}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mx-5 mb-5 space-y-3 border-t border-white/10 pt-4 sm:mx-6 sm:mb-6">
          <p className="font-mono text-xs text-[#A6A6A6]">
            {visibleTech.join(" · ")}
            {extraTechCount > 0 ? ` · +${extraTechCount}` : ""}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
            <Link
              href={`/projects/${project.slug}/`}
              prefetch={false}
              className="inline-flex min-h-[36px] items-center gap-1 font-semibold text-[#7A9BFF] transition-colors hover:text-[#F1F0EB]"
            >
              <span>Case Study</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
            </Link>

            <div className="flex items-center gap-4">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[36px] items-center gap-1 text-[#F1F0EB] transition-colors hover:text-[#7A9BFF]"
                  aria-label={`Live demo for ${project.title}`}
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Live Demo</span>
                </a>
              )}
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[36px] items-center gap-1 text-[#A6A6A6] transition-colors hover:text-[#F1F0EB]"
                  aria-label={`GitHub source code for ${project.title}`}
                >
                  <Github className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </TiltSurface>
  );
}
