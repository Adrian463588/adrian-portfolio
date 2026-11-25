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
import { Badge } from "@/components/ui/Badge";

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

  return (
    <article className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-[1000px] space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#A6A6A6]">
          <Link href="/" prefetch={false} className="transition-colors hover:text-[#7A9BFF]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/projects/" prefetch={false} className="transition-colors hover:text-[#7A9BFF]">
            Projects
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#F1F0EB]">{project.title}</span>
        </nav>

        {/* Header */}
        <header className="space-y-5 border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge label={project.category} variant="accent" />
            <Badge label={project.projectStatus} />
            <Badge
              label={
                isEnterprise
                  ? "Professional Work"
                  : project.projectOrigin === "fork"
                    ? "Extended Fork"
                    : project.projectOrigin
              }
              variant={
                isEnterprise
                  ? "accent"
                  : project.projectOrigin === "fork"
                    ? "warning"
                    : "neutral"
              }
            />
            {project.license && <Badge label={project.license} />}
            {project.hasCiWorkflow && (
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {isEnterprise ? "Jenkins CI Integrated" : "CI Workflow Present"}
              </span>
            )}
          </div>

          <div className="space-y-2.5">
            <h1 className="font-display break-words text-3xl font-bold tracking-tight text-[#F1F0EB] sm:text-5xl sm:leading-[1.06]">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="break-words text-lg font-medium text-[#D6D5CF]">{project.subtitle}</p>
            )}
            <p className="max-w-3xl break-words text-base leading-relaxed text-[#F1F0EB]/90">
              {project.summary}
            </p>
            {project.description !== project.summary && (
              <p className="max-w-3xl break-words text-sm leading-relaxed text-[#A6A6A6]">
                {project.description}
              </p>
            )}
          </div>

          {(project.repositoryUrl || project.demoUrl || project.releaseUrl || isEnterprise) && (
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#F1F0EB] px-5 py-2.5 text-sm font-semibold text-[#080808] transition-colors hover:bg-[#7A9BFF]"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  View GitHub Repository
                </a>
              )}

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-[#151515] px-5 py-2.5 text-sm font-medium text-[#F1F0EB] transition-colors hover:border-[#4169FF] hover:text-[#7A9BFF]"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Open Live Demo
                </a>
              )}

              {project.releaseUrl && (
                <a
                  href={project.releaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-[#151515] px-5 py-2.5 text-sm font-medium text-[#F1F0EB] transition-colors hover:border-[#4169FF] hover:text-[#7A9BFF]"
                >
                  <Package className="h-4 w-4" aria-hidden="true" />
                  View Release Artifacts
                </a>
              )}

              {isEnterprise && (
                <Link
                  href="/#experience"
                  prefetch={false}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/15 bg-[#151515] px-5 py-2.5 text-sm font-medium text-[#F1F0EB] transition-colors hover:border-[#4169FF] hover:text-[#7A9BFF]"
                >
                  <Briefcase className="h-4 w-4 text-[#7A9BFF]" aria-hidden="true" />
                  Associated Experience ({project.organization || "Berijalan"})
                </Link>
              )}
            </div>
          )}

          <p className="font-mono text-xs text-[#A6A6A6]">
            {isEnterprise
              ? "Sanitized public portfolio disclosure — proprietary repositories and internal systems omitted"
              : `Last updated: ${project.updatedAt}`}
            {!isEnterprise && project.language ? ` · Primary language: ${project.language}` : ""}
          </p>
        </header>

        {/* Enterprise Metadata & Role Affiliation */}
        {isEnterprise && (
          <section className="grid grid-cols-1 gap-4 border-y border-white/10 py-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#A6A6A6]">
                Organization
              </p>
              <p className="mt-1 text-sm font-medium text-[#F1F0EB]">
                {project.organization}
              </p>
              {project.corporateGroup && (
                <p className="mt-0.5 text-xs text-[#A6A6A6]">{project.corporateGroup}</p>
              )}
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#A6A6A6]">
                Business Domain
              </p>
              <p className="mt-1 text-sm font-medium text-[#F1F0EB]">
                {project.businessDomain}
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#A6A6A6]">
                Testing Approach
              </p>
              <p className="mt-1 text-sm font-medium text-[#7A9BFF]">{project.testingType}</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#A6A6A6]">
                Platforms Covered
              </p>
              <p className="mt-1 text-sm font-medium text-[#F1F0EB]">
                {project.applicationTechnologies?.join(" · ")}
              </p>
            </div>
          </section>
        )}

        {/* Conceptual Workflow Diagram (Strictly Illustrative & Sanitized) */}
        {project.conceptualFlow && project.conceptualFlow.length > 0 && (
          <section className="space-y-4 border-y border-white/10 py-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-display text-base font-bold text-[#F1F0EB]">
                Conceptual Quality Workflow Diagram
              </h2>
              <span className="rounded-md border border-white/10 bg-[#151515] px-2.5 py-1 font-mono text-[11px] text-[#A6A6A6]">
                Illustrative · Non-Proprietary Portfolio Diagram
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              {project.conceptualFlow.map((step, index) => (
                <div
                  key={step.label}
                  className="flex flex-col justify-between rounded-lg border border-white/10 bg-[#151515]/75 p-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-semibold text-[#7A9BFF]">
                        0{index + 1}
                      </span>
                      {index < project.conceptualFlow!.length - 1 && (
                        <ArrowRight className="h-3.5 w-3.5 text-[#A6A6A6]" aria-hidden="true" />
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-[#F1F0EB]">{step.label}</h3>
                    <p className="text-xs leading-relaxed text-[#A6A6A6]">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Explicit Fork Attribution */}
        {project.projectOrigin === "fork" && project.upstreamCredit && (
          <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
            <div className="flex items-start gap-3">
              <GitFork className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" aria-hidden="true" />
              <div className="space-y-1">
                <h2 className="font-display text-sm font-semibold text-[#F1F3F5]">
                  Fork Attribution &amp; Contribution Boundary
                </h2>
                <p className="text-sm text-[#D1D5DB]">{project.upstreamCredit}</p>
              </div>
            </div>
          </section>
        )}

        {/* Screenshots Gallery */}
        {project.screenshots.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-display text-xl font-bold text-[#F1F0EB]">
              Application Screenshots
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {project.screenshots.map((shot) => {
                const isPortrait = shot.height > shot.width;
                return (
                  <figure
                    key={shot.src}
                    className="editorial-image-wrap group overflow-hidden rounded-xl border border-white/10 bg-[#151515]/80"
                  >
                    <div className="flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-[#080808]">
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
                      <figcaption className="border-t border-white/10 px-4 py-3 font-mono text-xs text-[#A6A6A6]">
                        {shot.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              })}
            </div>
          </section>
        )}

        {/* Technology Stack */}
        <section className="border-t border-white/10 pt-6">
          <h2 className="mb-3 font-display text-base font-bold text-[#F1F0EB]">
            Technology Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} label={tech} />
            ))}
          </div>
        </section>

        {/* Problem & Solution */}
        {(project.problemStatement || project.proposedSolution) && (
          <section className="grid gap-8 border-t border-white/10 pt-8 md:grid-cols-2">
            {project.problemStatement && (
              <div className="space-y-2">
                <h2 className="font-display text-base font-bold text-[#F1F0EB]">
                  Problem Statement
                </h2>
                <p className="text-sm leading-relaxed text-[#A6A6A6]">
                  {project.problemStatement}
                </p>
              </div>
            )}
            {project.proposedSolution && (
              <div className="space-y-2">
                <h2 className="font-display text-base font-bold text-[#F1F0EB]">
                  Engineering Solution
                </h2>
                <p className="text-sm leading-relaxed text-[#A6A6A6]">
                  {project.proposedSolution}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Personal Contribution & Architecture */}
        <section className="grid gap-8 border-t border-white/10 pt-8 md:grid-cols-2">
          <div className="space-y-2">
            <h2 className="font-display text-base font-bold text-[#F1F0EB]">
              Personal Contribution
            </h2>
            <p className="text-sm leading-relaxed text-[#A6A6A6]">
              {project.personalContribution}
            </p>
          </div>

          {project.architectureSummary && (
            <div className="space-y-2">
              <h2 className="font-display text-base font-bold text-[#F1F0EB]">
                Technical Architecture
              </h2>
              <p className="text-sm leading-relaxed text-[#A6A6A6]">
                {project.architectureSummary}
              </p>
            </div>
          )}
        </section>

        {/* Features & Challenges */}
        {(project.implementedFeatures?.length || project.engineeringChallenges?.length) ? (
          <section className="grid gap-8 border-t border-white/10 pt-8 md:grid-cols-2">
            {project.implementedFeatures && project.implementedFeatures.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-display text-base font-bold text-[#F1F0EB]">
                  Implemented Features
                </h2>
                <ul className="space-y-2 text-sm text-[#A6A6A6]">
                  {project.implementedFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4169FF]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.engineeringChallenges && project.engineeringChallenges.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-display text-base font-bold text-[#F1F0EB]">
                  Engineering Challenges
                </h2>
                <ul className="space-y-2 text-sm text-[#A6A6A6]">
                  {project.engineeringChallenges.map((chal, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4169FF]" />
                      <span>{chal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        ) : null}

        {/* Testing, Security & Limitations */}
        {(project.testingStrategy || project.securityConsiderations || project.resultsAndLimitations) && (
          <section className="space-y-6 border-t border-white/10 pt-8">
            {project.testingStrategy && (
              <div className="space-y-1.5">
                <h2 className="font-display text-base font-bold text-[#F1F0EB]">
                  Testing &amp; Verification Strategy
                </h2>
                <p className="text-sm leading-relaxed text-[#A6A6A6]">
                  {project.testingStrategy}
                </p>
              </div>
            )}
            {project.securityConsiderations && (
              <div className="space-y-1.5">
                <h2 className="font-display text-base font-bold text-[#F1F0EB]">
                  Security &amp; Privacy Considerations
                </h2>
                <p className="text-sm leading-relaxed text-[#A6A6A6]">
                  {project.securityConsiderations}
                </p>
              </div>
            )}
            {project.resultsAndLimitations && (
              <div className="space-y-1.5">
                <h2 className="font-display text-base font-bold text-[#F1F0EB]">
                  Results &amp; Known Limitations
                </h2>
                <p className="text-sm leading-relaxed text-[#A6A6A6]">
                  {project.resultsAndLimitations}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Source References, Neighbor Navigation & Back Nav */}
        <footer className="space-y-6 border-t border-white/10 pt-8">
          {(prevProject || nextProject) && (
            <div className="grid grid-cols-1 gap-4 border-b border-white/10 pb-6 sm:grid-cols-2">
              {prevProject ? (
                <Link
                  href={`/projects/${prevProject.slug}/`}
                  prefetch={false}
                  className="group rounded-xl border border-white/10 bg-[#151515]/70 p-4 transition-colors hover:border-[#4169FF]"
                >
                  <p className="font-mono text-[11px] text-[#A6A6A6] uppercase">
                    &larr; Previous Work
                  </p>
                  <p className="mt-1 font-display truncate text-sm font-semibold text-[#F1F0EB] group-hover:text-[#7A9BFF]">
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
                  className="group rounded-xl border border-white/10 bg-[#151515]/70 p-4 text-right transition-colors hover:border-[#4169FF]"
                >
                  <p className="font-mono text-[11px] text-[#A6A6A6] uppercase">
                    Next Work &rarr;
                  </p>
                  <p className="mt-1 font-display truncate text-sm font-semibold text-[#F1F0EB] group-hover:text-[#7A9BFF]">
                    {nextProject.title}
                  </p>
                </Link>
              )}
            </div>
          )}

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-1">
              <p className="font-mono text-xs uppercase tracking-wider text-[#A6A6A6]">
                Verified Source References
              </p>
              <div className="flex flex-wrap gap-3">
                {project.sourceReferences.map((url) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all font-mono text-xs text-[#7A9BFF] hover:underline"
                  >
                    {url}
                  </a>
                ))}
              </div>
            </div>

            <Link
              href="/projects/"
              prefetch={false}
              className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-white/15 bg-[#151515] px-5 py-2 text-sm font-medium text-[#F1F0EB] transition-colors hover:border-[#4169FF] hover:text-[#7A9BFF]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All Projects
            </Link>
          </div>
        </footer>
      </div>
    </article>
  );
}
