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
}

export function CaseStudyDetail({ project }: CaseStudyDetailProps) {
  const isEnterprise = project.projectOrigin === "professional";

  return (
    <article className="px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-[1000px] space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-[#A1A1AA]">
          <Link href="/" prefetch={false} className="transition-colors hover:text-[#38BDF8]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/projects/" prefetch={false} className="transition-colors hover:text-[#38BDF8]">
            Projects
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#F4F4F5]">{project.title}</span>
        </nav>

        {/* Header */}
        <header className="space-y-5 border-b border-[#27272A] pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge label={project.category} variant="accent" />
            <Badge label={`Status: ${project.projectStatus}`} />
            <Badge
              label={isEnterprise ? "Origin: Professional Work" : `Origin: ${project.projectOrigin}`}
              variant={
                isEnterprise
                  ? "accent"
                  : project.projectOrigin === "fork"
                    ? "warning"
                    : "neutral"
              }
            />
            {project.license && <Badge label={`License: ${project.license}`} />}
            {project.hasCiWorkflow && (
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-xs text-emerald-300">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {isEnterprise ? "Jenkins CI Integrated" : "CI Workflow Present"}
              </span>
            )}
          </div>

          <div className="space-y-2">
            <h1 className="break-words text-3xl font-bold tracking-tight text-[#F4F4F5] sm:text-4xl">
              {project.title}
            </h1>
            {project.subtitle && (
              <p className="break-words text-lg font-medium text-[#D4D4D8]">{project.subtitle}</p>
            )}
            <p className="max-w-3xl break-words text-base leading-relaxed text-[#E4E4E7]">
              {project.summary}
            </p>
            {project.description !== project.summary && (
              <p className="max-w-3xl break-words text-sm leading-relaxed text-[#A1A1AA]">
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
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#F4F4F5] px-5 py-2.5 text-sm font-semibold text-[#09090B] transition-colors hover:bg-[#38BDF8]"
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
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#27272A] bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#F4F4F5] transition-colors hover:border-[#38BDF8]/50 hover:text-[#38BDF8]"
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
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#27272A] bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#F4F4F5] transition-colors hover:border-[#38BDF8]/50 hover:text-[#38BDF8]"
                >
                  <Package className="h-4 w-4" aria-hidden="true" />
                  View Release Artifacts
                </a>
              )}

              {isEnterprise && (
                <Link
                  href="/#experience"
                  prefetch={false}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-[#27272A] bg-[#18181B] px-5 py-2.5 text-sm font-medium text-[#F4F4F5] transition-colors hover:border-[#38BDF8]/50 hover:text-[#38BDF8]"
                >
                  <Briefcase className="h-4 w-4 text-[#38BDF8]" aria-hidden="true" />
                  Associated Experience ({project.organization || "Berijalan"})
                </Link>
              )}
            </div>
          )}

          <p className="font-mono text-xs text-[#A1A1AA]">
            {isEnterprise
              ? "Sanitized public portfolio disclosure — proprietary repositories and internal systems omitted"
              : `Last updated: ${project.updatedAt}`}
            {!isEnterprise && project.language ? ` · Primary language: ${project.language}` : ""}
          </p>
        </header>

        {/* Enterprise Metadata & Role Affiliation */}
        {isEnterprise && (
          <section className="grid grid-cols-1 gap-4 rounded-xl border border-[#27272A] bg-[#18181B] p-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA]">
                Organization
              </p>
              <p className="mt-1 text-sm font-medium text-[#F4F4F5]">
                {project.organization}
              </p>
              {project.corporateGroup && (
                <p className="mt-0.5 text-xs text-[#A1A1AA]">{project.corporateGroup}</p>
              )}
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA]">
                Business Domain
              </p>
              <p className="mt-1 text-sm font-medium text-[#F4F4F5]">
                {project.businessDomain}
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA]">
                Testing Approach
              </p>
              <p className="mt-1 text-sm font-medium text-[#38BDF8]">{project.testingType}</p>
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA]">
                Platforms Covered
              </p>
              <p className="mt-1 text-sm font-medium text-[#F4F4F5]">
                {project.applicationTechnologies?.join(" · ")}
              </p>
            </div>
          </section>
        )}

        {/* Conceptual Workflow Diagram (Strictly Illustrative & Sanitized) */}
        {project.conceptualFlow && project.conceptualFlow.length > 0 && (
          <section className="space-y-4 rounded-xl border border-[#27272A] bg-[#18181B] p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-[#F4F4F5]">
                Conceptual Quality Workflow Diagram
              </h2>
              <span className="rounded-md border border-[#27272A] bg-[#09090B] px-2.5 py-1 font-mono text-[11px] text-[#A1A1AA]">
                Illustrative · Non-Proprietary Portfolio Diagram
              </span>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
              {project.conceptualFlow.map((step, index) => (
                <div
                  key={step.label}
                  className="flex flex-col justify-between rounded-lg border border-[#27272A] bg-[#09090B] p-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-semibold text-[#38BDF8]">
                        0{index + 1}
                      </span>
                      {index < project.conceptualFlow!.length - 1 && (
                        <ArrowRight className="h-3.5 w-3.5 text-[#71717A]" aria-hidden="true" />
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-[#F4F4F5]">{step.label}</h3>
                    <p className="text-xs leading-relaxed text-[#A1A1AA]">{step.detail}</p>
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
                <h2 className="text-sm font-semibold text-[#F4F4F5]">
                  Fork Attribution &amp; Contribution Boundary
                </h2>
                <p className="text-sm text-[#D4D4D8]">{project.upstreamCredit}</p>
              </div>
            </div>
          </section>
        )}

        {/* Screenshots Gallery */}
        {project.screenshots.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-[#F4F4F5]">
              Application Screenshots
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {project.screenshots.map((shot) => {
                const isPortrait = shot.height > shot.width;
                return (
                  <figure
                    key={shot.src}
                    className="overflow-hidden rounded-xl border border-[#27272A] bg-[#18181B]"
                  >
                    <div className="flex aspect-[16/10] w-full items-center justify-center bg-[#09090B]">
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
                      <figcaption className="border-t border-[#27272A] px-4 py-3 font-mono text-xs text-[#A1A1AA]">
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
        <section className="rounded-xl border border-[#27272A] bg-[#18181B] p-6">
          <h2 className="mb-3 text-base font-semibold text-[#F4F4F5]">
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
          <section className="grid gap-6 md:grid-cols-2">
            {project.problemStatement && (
              <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-6">
                <h2 className="mb-2 text-base font-semibold text-[#F4F4F5]">
                  Problem Statement
                </h2>
                <p className="text-sm leading-relaxed text-[#A1A1AA]">
                  {project.problemStatement}
                </p>
              </div>
            )}
            {project.proposedSolution && (
              <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-6">
                <h2 className="mb-2 text-base font-semibold text-[#F4F4F5]">
                  Engineering Solution
                </h2>
                <p className="text-sm leading-relaxed text-[#A1A1AA]">
                  {project.proposedSolution}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Personal Contribution & Architecture */}
        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-6">
            <h2 className="mb-2 text-base font-semibold text-[#F4F4F5]">
              Personal Contribution
            </h2>
            <p className="text-sm leading-relaxed text-[#A1A1AA]">
              {project.personalContribution}
            </p>
          </div>

          {project.architectureSummary && (
            <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-6">
              <h2 className="mb-2 text-base font-semibold text-[#F4F4F5]">
                Technical Architecture
              </h2>
              <p className="text-sm leading-relaxed text-[#A1A1AA]">
                {project.architectureSummary}
              </p>
            </div>
          )}
        </section>

        {/* Features & Challenges */}
        {(project.implementedFeatures?.length || project.engineeringChallenges?.length) ? (
          <section className="grid gap-6 md:grid-cols-2">
            {project.implementedFeatures && project.implementedFeatures.length > 0 && (
              <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-6">
                <h2 className="mb-3 text-base font-semibold text-[#F4F4F5]">
                  Implemented Features
                </h2>
                <ul className="space-y-2 text-sm text-[#A1A1AA]">
                  {project.implementedFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#38BDF8]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {project.engineeringChallenges && project.engineeringChallenges.length > 0 && (
              <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-6">
                <h2 className="mb-3 text-base font-semibold text-[#F4F4F5]">
                  Engineering Challenges
                </h2>
                <ul className="space-y-2 text-sm text-[#A1A1AA]">
                  {project.engineeringChallenges.map((chal, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#38BDF8]" />
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
          <section className="space-y-4">
            {project.testingStrategy && (
              <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-6">
                <h2 className="mb-2 text-base font-semibold text-[#F4F4F5]">
                  Testing &amp; Verification Strategy
                </h2>
                <p className="text-sm leading-relaxed text-[#A1A1AA]">
                  {project.testingStrategy}
                </p>
              </div>
            )}
            {project.securityConsiderations && (
              <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-6">
                <h2 className="mb-2 text-base font-semibold text-[#F4F4F5]">
                  Security &amp; Privacy Considerations
                </h2>
                <p className="text-sm leading-relaxed text-[#A1A1AA]">
                  {project.securityConsiderations}
                </p>
              </div>
            )}
            {project.resultsAndLimitations && (
              <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-6">
                <h2 className="mb-2 text-base font-semibold text-[#F4F4F5]">
                  Results &amp; Known Limitations
                </h2>
                <p className="text-sm leading-relaxed text-[#A1A1AA]">
                  {project.resultsAndLimitations}
                </p>
              </div>
            )}
          </section>
        )}

        {/* Source References & Back Nav */}
        <footer className="flex flex-col justify-between gap-4 border-t border-[#27272A] pt-8 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <p className="font-mono text-xs uppercase tracking-wider text-[#A1A1AA]">
              Verified Source References
            </p>
            <div className="flex flex-wrap gap-3">
              {project.sourceReferences.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all font-mono text-xs text-[#38BDF8] hover:underline"
                >
                  {url}
                </a>
              ))}
            </div>
          </div>

          <Link
            href="/projects/"
            prefetch={false}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-lg border border-[#27272A] bg-[#18181B] px-4 py-2 text-sm font-medium text-[#F4F4F5] transition-colors hover:border-[#38BDF8]/50 hover:text-[#38BDF8]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All Projects
          </Link>
        </footer>
      </div>
    </article>
  );
}
