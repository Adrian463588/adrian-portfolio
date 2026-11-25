import Link from "next/link";
import { ArrowUpRight, ExternalLink, Github, GitFork } from "lucide-react";
import type { Project } from "@/types";
import { getProjectActions } from "@/lib/projects";
import { ResilientImage } from "@/components/ui/ResilientImage";
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
  const actions = getProjectActions(project);

  return (
    <TiltSurface className="h-full min-w-0" maxTilt={featuredLead ? 2.5 : 3.5}>
      <article className="group flex h-full min-w-0 flex-col justify-between border-t border-white/10 pt-5 transition-colors hover:border-[#65C8F5]/55">
        <div className="min-w-0 space-y-4">
          {leadShot ? (
            <Link
              href={actions.detailUrl ?? "/projects/"}
              prefetch={false}
              data-cursor="work"
              className="editorial-image-wrap block overflow-hidden bg-[#15171C]"
            >
              <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-[#101217]">
                <ResilientImage
                  src={leadShot.src}
                  alt={leadShot.alt}
                  width={leadShot.width}
                  height={leadShot.height}
                  priority={priorityImage}
                  loading="eager"
                  fallbackTitle={project.title}
                  fallbackCategory={project.category}
                  className={
                    isPortrait
                      ? "h-full w-full object-contain py-3"
                      : "h-full w-full object-cover object-top"
                  }
                />
              </div>
            </Link>
          ) : (
            <Link
              href={actions.detailUrl ?? "/projects/"}
              prefetch={false}
              data-cursor="work"
              className="flex aspect-[16/10] flex-col justify-between border border-white/10 bg-[#15171C]/70 px-5 py-5 transition-colors hover:border-white/25"
            >
              <div className="flex items-center justify-between gap-2 text-xs text-[#A7ADB7]">
                <span>{project.language || "Open Source"}</span>
                <span className="font-mono">
                  {project.visibility === "private-summary" ? "PRIVATE" : project.updatedAt}
                </span>
              </div>
              <p className="text-sm font-medium text-[#D6D9DF]">
                {project.subtitle || project.category}
              </p>
              <p className="text-xs text-[#65C8F5]">
                {project.visibility === "private-summary"
                  ? "Private Repository · Overview"
                  : project.projectOrigin === "fork"
                    ? "Fork · Extended"
                    : "Source Repository"}
              </p>
            </Link>
          )}

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <span className="font-medium text-[#65C8F5]">{project.category}</span>
              {project.flagship && <span className="text-[#D6D9DF]">· Flagship Research</span>}
              {project.visibility === "private-summary" && (
                <span className="text-[#A7ADB7]">· Private</span>
              )}
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
            {actions.detailUrl ? (
              <Link
                href={actions.detailUrl}
                prefetch={false}
                className="link-underline inline-flex min-h-[36px] items-center gap-1 font-semibold text-[#65C8F5] transition-colors hover:text-[#F2F0EC]"
              >
                <span>Case Study</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-4">
              {actions.demoUrl && (
                <a
                  href={actions.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-underline inline-flex min-h-[36px] items-center gap-1 text-[#F2F0EC] transition-colors hover:text-[#65C8F5]"
                  aria-label={`Live demo for ${project.title}`}
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Live Demo</span>
                </a>
              )}
              {actions.repoUrl && (
                <a
                  href={actions.repoUrl}
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
