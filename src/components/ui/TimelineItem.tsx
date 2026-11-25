import Link from "next/link";
import { ArrowUpRight, Briefcase, Building2, GraduationCap, MapPin } from "lucide-react";
import type { ExperienceEntry, Project } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface TimelineItemProps {
  entry: ExperienceEntry;
  linkedProjects?: Project[];
}

export function TimelineItem({ entry, linkedProjects = [] }: TimelineItemProps) {
  const isWork = entry.category === "professional";
  const hasGroupedRoles = Boolean(entry.roles && entry.roles.length > 0);

  return (
    <article className="relative pl-8 pb-8 last:pb-0">
      <div
        aria-hidden="true"
        className="absolute left-[11px] top-6 bottom-0 w-px bg-[#27272A]"
      />
      <div
        aria-hidden="true"
        className={`absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border ${
          isWork
            ? "border-[#38BDF8]/50 bg-[#18181B] text-[#38BDF8]"
            : "border-[#27272A] bg-[#18181B] text-[#A1A1AA]"
        }`}
      >
        {isWork ? <Briefcase className="h-3 w-3" /> : <GraduationCap className="h-3 w-3" />}
      </div>

      <div className="min-w-0 rounded-xl border border-[#27272A] bg-[#18181B] p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
          <div className="min-w-0 space-y-1">
            {hasGroupedRoles ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="break-words text-base font-semibold text-[#F4F4F5] sm:text-lg">
                    {entry.organization}
                  </h3>
                  {entry.corporateGroup && (
                    <Badge label={entry.corporateGroup} variant="accent" />
                  )}
                </div>
                {(entry.legalEntity || entry.industry) && (
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#D4D4D8]">
                    {entry.legalEntity && (
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-[#A1A1AA]" aria-hidden="true" />
                        {entry.legalEntity}
                      </span>
                    )}
                    {entry.legalEntity && entry.industry && <span aria-hidden="true">·</span>}
                    {entry.industry && <span className="text-[#A1A1AA]">{entry.industry}</span>}
                  </p>
                )}
              </>
            ) : (
              <>
                <h3 className="break-words text-base font-semibold text-[#F4F4F5] sm:text-lg">
                  {entry.title}
                </h3>
                <p className="mt-0.5 text-sm text-[#D4D4D8]">{entry.organization}</p>
              </>
            )}

            {entry.location && (
              <p className="inline-flex items-center gap-1 text-xs text-[#A1A1AA]">
                <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
                <span>{entry.location}</span>
              </p>
            )}
          </div>

          <span className="inline-flex w-fit shrink-0 items-center rounded-md border border-[#27272A] bg-[#09090B] px-2.5 py-1 font-mono text-xs text-[#A1A1AA]">
            {entry.dateRange}
          </span>
        </div>

        {entry.summary && (
          <p className="mt-4 text-sm leading-relaxed text-[#D4D4D8]">{entry.summary}</p>
        )}

        {hasGroupedRoles && entry.roles && (
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {entry.roles.map((role) => (
              <div
                key={role.id}
                className="min-w-0 rounded-lg border border-[#27272A] bg-[#09090B] p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Badge
                    label={role.employmentLabel}
                    variant={role.employmentType === "freelance" ? "accent" : "neutral"}
                  />
                  <span className="font-mono text-xs text-[#A1A1AA]">{role.dateRange}</span>
                </div>
                <h4 className="mt-2 break-words text-sm font-semibold text-[#F4F4F5]">
                  {role.title}
                </h4>
                {role.summary && (
                  <p className="mt-1.5 text-xs leading-relaxed text-[#A1A1AA]">{role.summary}</p>
                )}
              </div>
            ))}
          </div>
        )}

        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#A1A1AA]">
          {entry.bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#38BDF8]/70"
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {linkedProjects.length > 0 && (
          <div className="mt-4 border-t border-[#27272A] pt-4">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA]">
              Related Enterprise Case Studies
            </p>
            <div className="flex flex-wrap gap-2">
              {linkedProjects.map((project) => (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}/`}
                  prefetch={false}
                  className="inline-flex min-h-[36px] items-center gap-1 rounded-md border border-[#27272A] bg-[#09090B] px-3 py-1 text-xs font-medium text-[#38BDF8] transition-colors hover:border-[#38BDF8]/50 hover:text-[#7DD3FC]"
                >
                  <span>{project.title.split(" — ")[0]}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {entry.technologies && entry.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[#27272A] pt-4">
            {entry.technologies.map((tech) => (
              <Badge key={tech} label={tech} />
            ))}
          </div>
        )}

        {(entry.repoUrl || entry.website) && (
          <div className="mt-4 flex flex-wrap gap-4 pt-1">
            {entry.website && (
              <a
                href={entry.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[36px] items-center gap-1.5 font-mono text-xs text-[#38BDF8] hover:underline"
              >
                Company Website
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
            {entry.repoUrl && (
              <a
                href={entry.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[36px] items-center gap-1.5 font-mono text-xs text-[#38BDF8] hover:underline"
              >
                View repository
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
