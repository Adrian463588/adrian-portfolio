import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, ExternalLink, Github } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projects } from "@/data/projects";
import { getFeaturedProjects, getProjectActions } from "@/lib/projects";
import { RollText } from "@/components/motion/RollText";
import { MagneticSurface } from "@/components/motion/MagneticSurface";
import { ScrollParallax } from "@/components/motion/ScrollParallax";
import { ChoreographedBlock } from "@/components/motion/SectionChoreography";
import type { Project } from "@/types";

function EditorialMedia({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const leadShot = project.screenshots[0];
  const { detailUrl } = getProjectActions(project);
  if (!leadShot || !detailUrl) return null;
  const isPortrait = leadShot.height > leadShot.width;

  return (
    <Link
      href={detailUrl}
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
          priority={priority}
          loading={priority ? undefined : "eager"}
          className={
            isPortrait
              ? "h-full w-full object-contain py-3"
              : "h-full w-full object-cover object-top"
          }
        />
      </div>
    </Link>
  );
}

function EditorialMetaLinks({ project }: { project: Project }) {
  const { detailUrl, demoUrl, repoUrl } = getProjectActions(project);
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4 text-xs font-medium">
      {detailUrl ? (
        <Link
          href={detailUrl}
          prefetch={false}
          className="link-underline inline-flex min-h-[36px] items-center gap-1 font-semibold text-[#65C8F5] transition-colors hover:text-[#F2F0EC]"
        >
          <span>Case Study</span>
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </Link>
      ) : (
        <span />
      )}

      <div className="flex items-center gap-4">
        {demoUrl && (
          <a
            href={demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline inline-flex min-h-[36px] items-center gap-1 text-[#F2F0EC] transition-colors hover:text-[#65C8F5]"
            aria-label={`Live demo for ${project.title}`}
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Live Demo</span>
          </a>
        )}
        {repoUrl && (
          <a
            href={repoUrl}
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
  );
}

export function SelectedWork() {
  const featured = getFeaturedProjects(projects).slice(0, 6);
  const lead = featured[0];
  const asymmetricPair = featured.slice(1, 3);
  const secondaryWorks = featured.slice(3);

  return (
    <section
      id="work"
      className="border-t border-white/10 bg-[#08090C]/78 px-6 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-[1280px] space-y-20">
        <div>
          <SectionHeader
            eyebrow="2020 — 2026"
            title="Selected Work."
            description="Selected software projects across test automation, infrastructure, mobile engineering, and applied AI."
            action={
              <Link
                href="/projects/"
                prefetch={false}
                className="active-press group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-[#15171C]/85 px-4 py-2 text-sm font-medium text-[#F2F0EC] transition-colors hover:border-[#65C8F5]"
              >
                <RollText>All Projects</RollText>
                <ArrowUpRight className="h-4 w-4 text-[#65C8F5]" aria-hidden="true" />
              </Link>
            }
          />

          <div className="space-y-20">
            {/* 01 Asymmetric Lead Editorial Spread */}
            {lead && (
              <ChoreographedBlock variant="clip-reveal">
                <article className="group grid grid-cols-1 items-center gap-8 border-b border-white/10 pb-16 lg:grid-cols-12 lg:gap-12">
                  <div className="lg:col-span-7">
                    <ScrollParallax yOffset={14}>
                      <EditorialMedia project={lead} priority />
                    </ScrollParallax>
                  </div>

                  <div className="min-w-0 space-y-5 lg:col-span-5">
                    <div className="flex items-center gap-3 text-xs font-medium text-[#65C8F5]">
                      <span className="font-mono">01</span>
                      <span className="text-white/25">/</span>
                      <span>{lead.category}</span>
                    </div>

                    <h3 className="font-display break-words text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.08] tracking-[-0.03em] text-[#F2F0EC]">
                      <Link
                        href={`/projects/${lead.slug}/`}
                        prefetch={false}
                        className="transition-colors hover:text-[#65C8F5]"
                      >
                        {lead.title}
                      </Link>
                    </h3>

                    {lead.subtitle && (
                      <p className="text-sm font-medium text-[#D6D9DF]">{lead.subtitle}</p>
                    )}

                    <p className="text-sm leading-relaxed text-[#A7ADB7] sm:text-base">
                      {lead.summary}
                    </p>

                    <p className="text-xs text-[#A7ADB7]">
                      {lead.technologies.slice(0, 4).join(" · ")}
                    </p>

                    <EditorialMetaLinks project={lead} />
                  </div>
                </article>
              </ChoreographedBlock>
            )}

            {/* 02-03 Staggered Asymmetric Split */}
            {asymmetricPair.length > 0 && (
              <ChoreographedBlock
                variant="clip-reveal"
                className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12"
              >
                {asymmetricPair.map((project, idx) => (
                  <article
                    key={project.id}
                    className={`group min-w-0 space-y-5 ${
                      idx === 0 ? "lg:col-span-7" : "lg:col-span-5 lg:mt-16"
                    }`}
                  >
                    <EditorialMedia project={project} priority={idx === 0} />

                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-3 text-xs font-medium text-[#65C8F5]">
                        <span className="font-mono">{String(idx + 2).padStart(2, "0")}</span>
                        <span className="text-white/25">/</span>
                        <span>{project.category}</span>
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

                      <p className="text-sm leading-relaxed text-[#A7ADB7]">{project.summary}</p>

                      <p className="text-xs text-[#A7ADB7]">
                        {project.technologies.slice(0, 3).join(" · ")}
                      </p>

                      <EditorialMetaLinks project={project} />
                    </div>
                  </article>
                ))}
              </ChoreographedBlock>
            )}

            {/* 04-06 Borderless Visual Gallery */}
            {secondaryWorks.length > 0 && (
              <div className="grid grid-cols-1 gap-x-8 gap-y-12 border-t border-white/10 pt-14 md:grid-cols-3">
                {secondaryWorks.map((project, idx) => (
                  <article
                    key={project.id}
                    className="group flex min-w-0 flex-col justify-between space-y-5"
                  >
                    <div className="space-y-4">
                      <EditorialMedia project={project} />

                      <div className="space-y-2.5 pt-1">
                        <div className="flex items-center gap-3 text-xs font-medium text-[#65C8F5]">
                          <span className="font-mono">{String(idx + 4).padStart(2, "0")}</span>
                          <span className="text-white/25">/</span>
                          <span>{project.category}</span>
                        </div>

                        <h3 className="font-display break-words text-lg font-bold tracking-tight text-[#F2F0EC] sm:text-xl">
                          <Link
                            href={`/projects/${project.slug}/`}
                            prefetch={false}
                            className="transition-colors hover:text-[#65C8F5]"
                          >
                            {project.title}
                          </Link>
                        </h3>

                        <p className="text-sm leading-relaxed text-[#A7ADB7]">
                          {project.summary}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs text-[#A7ADB7]">
                        {project.technologies.slice(0, 3).join(" · ")}
                      </p>
                      <EditorialMetaLinks project={project} />
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Clean open CTA band into Projects archive */}
        <div
          id="project-explorer"
          className="flex flex-col justify-between gap-6 border-y border-white/10 py-9 md:flex-row md:items-center"
        >
          <div className="min-w-0 flex-1 space-y-1.5">
            <h2 className="font-display text-xl font-bold tracking-tight text-[#F2F0EC] sm:text-2xl">
              All Projects.
            </h2>
            <p className="text-sm text-[#A7ADB7]">
              Explore public repositories across test automation, infrastructure, mobile apps, and AI tools.
            </p>
          </div>
          <MagneticSurface>
            <Link
              href="/projects/"
              prefetch={false}
              className="active-press inline-flex min-h-[46px] shrink-0 items-center gap-2 rounded-full bg-[#F2F0EC] px-6 py-2.5 text-sm font-semibold text-[#08090C] transition-colors hover:bg-[#65C8F5]"
            >
              <span>Explore All Projects</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </MagneticSurface>
        </div>
      </div>
    </section>
  );
}
