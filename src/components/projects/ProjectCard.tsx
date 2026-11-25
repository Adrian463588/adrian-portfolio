import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ExternalLink, Github, GitFork, ShieldCheck } from "lucide-react";
import type { Project } from "@/types";
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
    <TiltSurface className="h-full min-w-0" maxTilt={featuredLead ? 2.5 : 3.5}>
      <article className="group flex h-full min-w-0 flex-col justify-between border-t border-white/10 pt-5 transition-colors hover:border-[#65C8F5]/55">
        <div className="min-w-0 space-y-4">
          {leadShot ? (
            <Link
              href={`/projects/${project.slug}/`}
              prefetch={false}
              data-cursor="work"
              className="editorial-image-wrap block overflow-hidden bg-[#15171C]"
            >
              <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-[#101217]">
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
            <Link
              href={`/projects/${project.slug}/`}
              prefetch={false}
              className="block space-y-2 border border-white/10 bg-gradient-to-br from-[#65C8F5]/[0.1] via-[#15171C] to-[#08090C] px-5 py-6 transition-colors hover:border-[#65C8F5]/45"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wider text-[#65C8F5]">
                  {project.organization || "Berijalan Techno Center"}
                </span>
                {project.hasCiWorkflow && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    Jenkins CI
                  </span>
                )}
              </div>
              {project.testingType && (
                <p className="font-display text-sm font-semibold text-[#F2F0EC]">
                  {project.testingType}
                </p>
              )}
              {project.businessDomain && (
                <p className="text-xs text-[#A7ADB7]">{project.businessDomain}</p>
              )}
            </Link>
          ) : (
            <Link
              href={`/projects/${project.slug}/`}
              prefetch={false}
              className="flex aspect-[16/10] flex-col justify-between border border-white/10 bg-[#15171C]/70 px-5 py-5 transition-colors hover:border-white/25"
            >
              <div className="flex items-center justify-between gap-2 text-xs text-[#A7ADB7]">
                <span>{project.language || "Open Source"}</span>
                <span className="font-mono">{project.updatedAt}</span>
              </div>
              <p className="text-sm font-medium text-[#D6D9DF]">
                {project.subtitle || project.category}
              </p>
              <p className="text-xs text-[#65C8F5]">{project.projectOrigin === "fork" ? "Fork · Extended" : "Source Repository"}</p>
            </Link>
          )}

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className="font-medium text-[#65C8F5]">{project.category}</span>
              {project.projectOrigin === "professional" && (
                <span className="text-[#A7ADB7]">· Professional</span>
              )}
              {project.projectOrigin === "fork" && (
                <span className="text-amber-300">· Extended Fork</span>
              )}
            </div>

            <h3 className="font-display break-words text-lg font-bold tracking-tight text-[#F2F0EC] sm:text-xl">
              <Link
                href={`/projects/${project.slug}/`}
                prefetch={false}
                className="break-words transition-colors hover:text-[#65C8F5]"
              >
                {project.title}
              </Link>
            </h3>

            {project.subtitle && (
              <p className="break-words text-xs font-medium text-[#D6D9DF]">
                {project.subtitle}
              </p>
            )}

            <p className="break-words text-sm leading-relaxed text-[#A7ADB7]">
              {project.summary}
            </p>

            {project.projectOrigin === "fork" && project.upstreamCredit && (
              <p className="flex items-start gap-1.5 break-words border-l-2 border-amber-400/60 pl-3 text-xs text-[#A7ADB7]">
                <GitFork className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" aria-hidden="true" />
                <span className="min-w-0 break-words">{project.upstreamCredit}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 space-y-3 border-t border-white/10 pt-3.5">
          <p className="text-xs text-[#A7ADB7]">
            {visibleTech.join(" · ")}
            {extraTechCount > 0 ? ` · +${extraTechCount}` : ""}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
            <Link
              href={`/projects/${project.slug}/`}
              prefetch={false}
              className="link-underline inline-flex min-h-[36px] items-center gap-1 font-semibold text-[#65C8F5] transition-colors hover:text-[#F2F0EC]"
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
                  className="link-underline inline-flex min-h-[36px] items-center gap-1 text-[#F2F0EC] transition-colors hover:text-[#65C8F5]"
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
                  className="link-underline inline-flex min-h-[36px] items-center gap-1 text-[#A7ADB7] transition-colors hover:text-[#F2F0EC]"
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
