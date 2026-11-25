import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Github, GitFork, ShieldCheck } from "lucide-react";
import type { Project } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { TiltSurface } from "@/components/ui/TiltSurface";

interface ProjectCardProps {
  project: Project;
  priorityImage?: boolean;
}

export function ProjectCard({ project, priorityImage = false }: ProjectCardProps) {
  const leadShot = project.screenshots[0];
  const isPortrait = leadShot ? leadShot.height > leadShot.width : false;
  const visibleTech = project.technologies.slice(0, 4);
  const extraTechCount = project.technologies.length - visibleTech.length;

  return (
    <TiltSurface className="h-full min-w-0 rounded-xl">
      <article className="group flex h-full min-w-0 flex-col justify-between rounded-xl border border-[#27272A] bg-[#18181B] p-5 transition-colors hover:border-[#3F3F46] hover:bg-[#1C1C20]">
        <div className="min-w-0">
          {leadShot ? (
            <Link
              href={`/projects/${project.slug}/`}
              prefetch={false}
              className="mb-4 block overflow-hidden rounded-lg border border-[#27272A] bg-[#09090B]"
            >
              <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-[#0B0B0E]">
                <Image
                  src={leadShot.src}
                  alt={leadShot.alt}
                  width={leadShot.width}
                  height={leadShot.height}
                  priority={priorityImage}
                  className={
                    isPortrait
                      ? "h-full w-full object-contain py-2 transition-transform duration-300 group-hover:scale-[1.02]"
                      : "h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                  }
                />
              </div>
            </Link>
          ) : project.projectOrigin === "professional" ? (
            <div className="mb-4 space-y-1.5 rounded-lg border border-[#27272A] bg-[#09090B] px-3.5 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#38BDF8]">
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
                <p className="font-mono text-xs text-[#E4E4E7]">{project.testingType}</p>
              )}
              {project.businessDomain && (
                <p className="text-xs text-[#A1A1AA]">{project.businessDomain}</p>
              )}
            </div>
          ) : (
            <div className="mb-4 flex items-center justify-between rounded-lg border border-[#27272A] bg-[#09090B] px-3.5 py-2.5">
              <span className="font-mono text-xs text-[#A1A1AA]">
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

          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-[#38BDF8]">
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

          <h3 className="break-words text-lg font-semibold tracking-tight text-[#F4F4F5]">
            <Link
              href={`/projects/${project.slug}/`}
              prefetch={false}
              className="break-words transition-colors hover:text-[#38BDF8]"
            >
              {project.title}
            </Link>
          </h3>

          {project.subtitle && (
            <p className="mt-0.5 break-words text-xs font-medium text-[#D4D4D8]">
              {project.subtitle}
            </p>
          )}

          <p className="mt-3 break-words text-sm leading-relaxed text-[#A1A1AA]">
            {project.summary}
          </p>

          {project.projectOrigin === "fork" && project.upstreamCredit && (
            <p className="mt-2.5 flex items-start gap-1.5 break-words rounded-md border border-[#27272A] bg-[#09090B] px-2.5 py-1.5 text-xs text-[#A1A1AA]">
              <GitFork className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden="true" />
              <span className="min-w-0 break-words">{project.upstreamCredit}</span>
            </p>
          )}
        </div>

        <div className="mt-5 space-y-4 border-t border-[#27272A] pt-4">
          <div className="flex flex-wrap gap-1.5">
            {visibleTech.map((tech) => (
              <Badge key={tech} label={tech} />
            ))}
            {extraTechCount > 0 && (
              <Badge label={`+${extraTechCount}`} variant="neutral" />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
            <Link
              href={`/projects/${project.slug}/`}
              prefetch={false}
              className="inline-flex min-h-[36px] items-center gap-1 rounded-md text-[#38BDF8] transition-colors hover:text-[#7DD3FC]"
            >
              Case Study
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>

            <div className="flex items-center gap-3">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[36px] items-center gap-1 text-[#E4E4E7] transition-colors hover:text-[#38BDF8]"
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
                  className="inline-flex min-h-[36px] items-center gap-1 text-[#A1A1AA] transition-colors hover:text-[#F4F4F5]"
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
