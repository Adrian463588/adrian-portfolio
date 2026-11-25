import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  ExternalLink,
  Github,
  GitFork,
  Package,
  ShieldCheck,
} from "lucide-react";
import type { Project } from "@/types";
import { getProjectActions } from "@/lib/projects";
import { Badge } from "@/components/ui/Badge";
import { ChoreographedBlock } from "@/components/motion/SectionChoreography";

interface CaseStudyDetailProps {
  project: Project;
  prevProject?: { slug: string; title: string };
  nextProject?: { slug: string; title: string };
}

export function CaseStudyDetail({
  project,
  prevProject,
  nextProject,
}: CaseStudyDetailProps) {
  const isEnterprise = project.projectOrigin === "professional";
  const isEditorialDeep = project.tier === "featured" || isEnterprise;
  const isArchive = project.tier === "archive";
  const actions = getProjectActions(project);

  return (
    <article className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-[1000px] space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#A7ADB7]">
          <Link href="/" prefetch={false} className="link-underline transition-colors hover:text-[#65C8F5]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/projects/" prefetch={false} className="link-underline transition-colors hover:text-[#65C8F5]">
            Projects
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#F2F0EC]">{project.title}</span>
        </nav>

        {/* Header */}
        <header className="space-y-5 border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge label={project.category} variant="accent" />
            {isEnterprise && <Badge label="Enterprise Work" variant="accent" />}
            {project.projectOrigin === "fork" && (
              <Badge label="Extended Fork" variant="warning" />
            )}
            {project.license && <Badge label={project.license} />}
            {project.hasCiWorkflow && (
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {isEnterprise ? "Jenkins CI" : "CI Checks"}
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            <h1 className="font-display break-words text-3xl font-bold tracking-tight text-[#F2F0EC] sm:text-5xl sm:leading-[1.04]">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="break-words text-lg font-medium text-[#D6D9DF]">{project.subtitle}</p>
            )}
            <p className="max-w-3xl break-words text-base leading-relaxed text-[#F2F0EC]/90">
              {project.summary}
            </p>
            {project.description !== project.summary && !isArchive && (
              <p className="max-w-3xl break-words text-sm leading-relaxed text-[#A7ADB7]">
                {project.description}
              </p>
            )}
          </div>

          {(actions.repoUrl || actions.demoUrl || actions.releaseUrl || isEnterprise) && (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {actions.repoUrl && (
                <a
                  href={actions.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="active-press inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#F2F0EC] px-5 py-2.5 text-sm font-semibold text-[#08090C] transition-colors hover:bg-[#65C8F5]"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  <span>Source code</span>
                </a>
              )}

              {actions.demoUrl && (
                <a
                  href={actions.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="active-press inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-[#15171C] px-5 py-2.5 text-sm font-medium text-[#F2F0EC] transition-colors hover:border-[#65C8F5] hover:text-[#65C8F5]"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  <span>Live Demo</span>
                </a>
              )}

              {actions.releaseUrl && (
                <a
                  href={actions.releaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="active-press inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-[#15171C] px-5 py-2.5 text-sm font-medium text-[#F2F0EC] transition-colors hover:border-[#65C8F5] hover:text-[#65C8F5]"
                >
                  <Package className="h-4 w-4" aria-hidden="true" />
                  <span>Release</span>
                </a>
              )}

              {isEnterprise && (
                <Link
                  href="/#experience"
                  prefetch={false}
                  className="active-press inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-[#15171C] px-5 py-2.5 text-sm font-medium text-[#F2F0EC] transition-colors hover:border-[#65C8F5] hover:text-[#65C8F5]"
                >
                  <Briefcase className="h-4 w-4 text-[#65C8F5]" aria-hidden="true" />
                  <span>Associated Experience ({project.organization || "Berijalan"})</span>
                </Link>
              )}
            </div>
          )}

          <p className="font-mono text-xs text-[#A7ADB7]">
            {isEnterprise
              ? "Sanitized public disclosure — internal repositories and employer data omitted"
              : `Updated ${project.updatedAt}`}
            {!isEnterprise && project.language ? ` · ${project.language}` : ""}
          </p>
        </header>

        {/* Enterprise Metadata Summary */}
        {isEnterprise && (
          <section className="grid grid-cols-1 gap-4 border-y border-white/10 py-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#A7ADB7]">
                Organization
              </p>
              <p className="mt-1 text-sm font-medium text-[#F2F0EC]">
                {project.organization}
              </p>
              {project.corporateGroup && (
                <p className="mt-0.5 text-xs text-[#A7ADB7]">{project.corporateGroup}</p>
              )}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#A7ADB7]">
                Domain
              </p>
              <p className="mt-1 text-sm font-medium text-[#F2F0EC]">
                {project.businessDomain}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#A7ADB7]">
                Testing Scope
              </p>
              <p className="mt-1 text-sm font-medium text-[#65C8F5]">{project.testingType}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[#A7ADB7]">
                Platforms Covered
              </p>
              <p className="mt-1 text-sm font-medium text-[#F2F0EC]">
                {project.applicationTechnologies?.join(" · ")}
              </p>
            </div>
          </section>
        )}

        {/* Explicit Fork Attribution */}
        {project.projectOrigin === "fork" && project.upstreamCredit && (
          <section className="border-l-2 border-amber-400/70 bg-amber-500/5 px-5 py-4">
            <div className="flex items-start gap-3">
              <GitFork className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
              <div className="space-y-1">
                <h2 className="font-display text-sm font-semibold text-[#F2F0EC]">
                  Fork Attribution &amp; Contribution Boundary
                </h2>
                <p className="text-sm text-[#D6D9DF]">{project.upstreamCredit}</p>
              </div>
            </div>
          </section>
        )}

        {/* Conceptual Quality Workflow Diagram (Enterprise) */}
        {project.conceptualFlow && project.conceptualFlow.length > 0 && (
          <section className="space-y-4 border-y border-white/10 py-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-bold text-[#F2F0EC]">
                QA Workflow Overview
              </h2>
              <span className="border border-white/10 bg-[#15171C] px-2.5 py-1 text-xs text-[#A7ADB7]">
                Illustrative · Non-Proprietary Diagram
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              {project.conceptualFlow.map((step, index) => (
                <div
                  key={step.label}
                  className="flex flex-col justify-between border-t border-white/15 bg-[#15171C]/55 p-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-[#65C8F5]">
                        0{index + 1}
                      </span>
                      {index < project.conceptualFlow!.length - 1 && (
                        <ArrowRight className="h-3.5 w-3.5 text-[#A7ADB7]" aria-hidden="true" />
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-[#F2F0EC]">{step.label}</h3>
                    <p className="text-xs leading-relaxed text-[#A7ADB7]">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Screenshots Gallery (Featured & Core with real imagery) */}
        {project.screenshots.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-[#F2F0EC]">
              {isEditorialDeep ? "Demo & Screenshots" : "Screenshots"}
            </h2>
            <ChoreographedBlock variant="clip-reveal" className="grid gap-6 md:grid-cols-2">
              {project.screenshots.map((shot) => {
                const isPortrait = shot.height > shot.width;
                return (
                  <figure
                    key={shot.src}
                    className="editorial-image-wrap group overflow-hidden bg-[#15171C]"
                  >
                    <div className="flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-[#08090C]">
                      <Image
                        src={shot.src}
                        alt={shot.alt}
                        width={shot.width}
                        height={shot.height}
                        className={
                          isPortrait
                            ? "h-full w-full object-contain py-3"
                            : "h-full w-full object-cover object-top"
                        }
                      />
                    </div>
                    {shot.caption && (
                      <figcaption className="border-t border-white/10 px-4 py-3 text-xs text-[#A7ADB7]">
                        {shot.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </ChoreographedBlock>
          </section>
        )}

        {/* === PRESENTATION DEPTH 1: ARCHIVE & EXPERIMENTS (Concise View) === */}
        {isArchive ? (
          <section className="space-y-6 border-t border-white/10 pt-8">
            <div className="space-y-2">
              <h2 className="font-display text-base font-bold text-[#F2F0EC]">
                What I Built
              </h2>
              <p className="text-sm leading-relaxed text-[#A7ADB7]">
                {project.personalContribution}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech} label={tech} />
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* Overview: Problem & Approach (only rendered if content exists) */}
            {(project.problemStatement || project.proposedSolution) && (
              <section className="grid gap-8 border-t border-white/10 pt-8 md:grid-cols-2">
                {project.problemStatement && (
                  <div className="space-y-2">
                    <h2 className="font-display text-base font-bold text-[#F2F0EC]">
                      {isEditorialDeep ? "01. Overview & Problem" : "Overview"}
                    </h2>
                    <p className="text-sm leading-relaxed text-[#A7ADB7]">
                      {project.problemStatement}
                    </p>
                  </div>
                )}
                {project.proposedSolution && (
                  <div className="space-y-2">
                    <h2 className="font-display text-base font-bold text-[#F2F0EC]">
                      Approach
                    </h2>
                    <p className="text-sm leading-relaxed text-[#A7ADB7]">
                      {project.proposedSolution}
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* My Contribution & How It Works */}
            <section className="grid gap-8 border-t border-white/10 pt-8 md:grid-cols-2">
              <div className="space-y-2">
                <h2 className="font-display text-base font-bold text-[#F2F0EC]">
                  My Contribution
                </h2>
                <p className="text-sm leading-relaxed text-[#A7ADB7]">
                  {project.personalContribution}
                </p>
                {project.implementedFeatures && project.implementedFeatures.length > 0 && (
                  <ul className="mt-3 space-y-2 text-sm text-[#A7ADB7]">
                    {project.implementedFeatures.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#65C8F5]"
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {(project.architectureSummary || project.engineeringChallenges?.length) && (
                <div className="space-y-3">
                  <h2 className="font-display text-base font-bold text-[#F2F0EC]">
                    How It Works
                  </h2>
                  {project.architectureSummary && (
                    <p className="text-sm leading-relaxed text-[#A7ADB7]">
                      {project.architectureSummary}
                    </p>
                  )}
                  {isEditorialDeep &&
                    project.engineeringChallenges &&
                    project.engineeringChallenges.length > 0 && (
                      <ul className="space-y-2 pt-1 text-sm text-[#A7ADB7]">
                        {project.engineeringChallenges.map((chal, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span
                              aria-hidden="true"
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#65C8F5]"
                            />
                            <span>{chal}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
              )}
            </section>

            {/* Technology Stack */}
            <section className="border-t border-white/10 pt-6">
              <h2 className="mb-3 font-display text-base font-bold text-[#F2F0EC]">
                Technology Stack
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <Badge key={tech} label={tech} />
                ))}
              </div>
            </section>

            {/* Results & Lessons (Testing, Security & Limitations) */}
            {(project.testingStrategy ||
              project.securityConsiderations ||
              project.resultsAndLimitations) && (
              <section className="space-y-5 border-t border-white/10 pt-8">
                <h2 className="font-display text-base font-bold text-[#F2F0EC]">
                  Results, Testing &amp; Limitations
                </h2>
                {project.testingStrategy && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#65C8F5]">
                      Testing
                    </h3>
                    <p className="text-sm leading-relaxed text-[#A7ADB7]">
                      {project.testingStrategy}
                    </p>
                  </div>
                )}
                {project.securityConsiderations && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#65C8F5]">
                      Security &amp; Confidentiality
                    </h3>
                    <p className="text-sm leading-relaxed text-[#A7ADB7]">
                      {project.securityConsiderations}
                    </p>
                  </div>
                )}
                {project.resultsAndLimitations && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#65C8F5]">
                      Release &amp; Known Limitations
                    </h3>
                    <p className="text-sm leading-relaxed text-[#A7ADB7]">
                      {project.resultsAndLimitations}
                    </p>
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {/* Links, Neighbor Navigation & Back Nav */}
        <footer className="space-y-6 border-t border-white/10 pt-8">
          {(prevProject || nextProject) && (
            <div className="grid grid-cols-1 gap-4 border-b border-white/10 pb-6 sm:grid-cols-2">
              {prevProject ? (
                <Link
                  href={`/projects/${prevProject.slug}/`}
                  prefetch={false}
                  className="group border-t border-white/10 pt-4 transition-colors hover:border-[#65C8F5]"
                >
                  <p className="font-mono text-xs text-[#A7ADB7] uppercase">
                    &larr; Previous Work
                  </p>
                  <p className="mt-1 font-display truncate text-sm font-semibold text-[#F2F0EC] group-hover:text-[#65C8F5]">
                    {prevProject.title}
                  </p>
                </Link>
              ) : (
                <div />
              )}
              {nextProject && (
                <Link
                  href={`/projects/${nextProject.slug}/`}
                  prefetch={false}
                  className="group border-t border-white/10 pt-4 text-right transition-colors hover:border-[#65C8F5]"
                >
                  <p className="font-mono text-xs text-[#A7ADB7] uppercase">
                    Next Work &rarr;
                  </p>
                  <p className="mt-1 font-display truncate text-sm font-semibold text-[#F2F0EC] group-hover:text-[#65C8F5]">
                    {nextProject.title}
                  </p>
                </Link>
              )}
            </div>
          )}

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-[#A7ADB7]">
                {isEnterprise ? "Company Website" : "Related Links"}
              </p>
              <div className="flex flex-wrap gap-3">
                {project.sourceReferences.map((url) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline break-all font-mono text-xs text-[#65C8F5]"
                  >
                    {url}
                  </a>
                ))}
              </div>
            </div>

            <Link
              href="/projects/"
              prefetch={false}
              className="active-press inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-white/15 bg-[#15171C] px-5 py-2 text-sm font-medium text-[#F2F0EC] transition-colors hover:border-[#65C8F5] hover:text-[#65C8F5]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>All Projects</span>
            </Link>
          </div>
        </footer>
      </div>
    </article>
  );
}
