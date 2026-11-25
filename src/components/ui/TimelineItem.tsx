import Link from "next/link";
import { ArrowUpRight, Building2, MapPin } from "lucide-react";
import type { ExperienceEntry, Project } from "@/types";
import { RollText } from "@/components/motion/RollText";

interface TimelineItemProps {
  entry: ExperienceEntry;
  linkedProjects?: Project[];
  indexLabel?: string;
}

export function TimelineItem({
  entry,
  linkedProjects = [],
  indexLabel,
}: TimelineItemProps) {
  const hasGroupedRoles = Boolean(entry.roles && entry.roles.length > 0);

  return (
    <article className="group/item min-w-0 border-t border-white/10 py-8 transition-colors first:border-t-0 first:pt-0">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-baseline">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-baseline gap-2.5">
            {indexLabel && (
              <span className="font-mono text-xs text-[#00C8F5]">{indexLabel}</span>
            )}
            <h3 className="font-display break-words text-xl font-bold tracking-tight text-[#F1F3F5] sm:text-2xl">
              {hasGroupedRoles ? entry.organization : entry.title}
            </h3>
            {hasGroupedRoles && entry.corporateGroup && (
              <span className="font-mono text-xs text-[#00C8F5]">
                {entry.corporateGroup}
              </span>
            )}
          </div>

          {hasGroupedRoles ? (
            (entry.legalEntity || entry.industry) && (
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#A0A6B0]">
                {entry.legalEntity && (
                  <span className="inline-flex items-center gap-1 text-[#D1D5DB]">
                    <Building2 className="h-3.5 w-3.5 text-[#00C8F5]/80" aria-hidden="true" />
                    {entry.legalEntity}
                  </span>
                )}
                {entry.legalEntity && entry.industry && <span aria-hidden="true">·</span>}
                {entry.industry && <span>{entry.industry}</span>}
              </p>
            )
          ) : (
            <p className="text-sm font-medium text-[#D1D5DB]">{entry.organization}</p>
          )}

          {entry.location && (
            <p className="inline-flex items-center gap-1 text-xs text-[#A0A6B0]">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{entry.location}</span>
            </p>
          )}
        </div>

        <span className="shrink-0 font-mono text-xs tracking-wide text-[#A0A6B0]">
          {entry.dateRange}
        </span>
      </div>

      {entry.summary && (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#D1D5DB]">
          {entry.summary}
        </p>
      )}

      {hasGroupedRoles && entry.roles && (
        <div className="mt-5 grid grid-cols-1 gap-4 border-y border-white/10 py-4 md:grid-cols-2">
          {entry.roles.map((role) => (
            <div key={role.id} className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`font-mono text-[11px] uppercase tracking-wider ${
                    role.employmentType === "freelance"
                      ? "text-[#00C8F5]"
                      : "text-[#A0A6B0]"
                  }`}
                >
                  {role.employmentLabel}
                </span>
                <span className="font-mono text-xs text-[#A0A6B0]">
                  {role.dateRange}
                </span>
              </div>
              <h4 className="font-display break-words text-sm font-semibold text-[#F1F3F5]">
                {role.title}
              </h4>
              {role.summary && (
                <p className="text-xs leading-relaxed text-[#A0A6B0]">{role.summary}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#A0A6B0]">
        {entry.bullets.map((bullet, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <span
              aria-hidden="true"
              className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#00C8F5]"
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {linkedProjects.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#A0A6B0]">
            Enterprise Dossiers:
          </span>
          {linkedProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}/`}
              prefetch={false}
              className="group inline-flex min-h-[36px] items-center gap-1 rounded-full border border-white/15 bg-[#101216]/80 px-3 py-1 text-xs font-medium text-[#F1F3F5] transition-colors hover:border-[#00C8F5]/60 hover:text-[#00C8F5]"
            >
              <span>{project.title.split(" — ")[0]}</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}

      {entry.technologies && entry.technologies.length > 0 && (
        <p className="mt-4 font-mono text-xs leading-relaxed text-[#A0A6B0]">
          {entry.technologies.join(" · ")}
        </p>
      )}

      {(entry.repoUrl || entry.website) && (
        <div className="mt-3 flex flex-wrap gap-5">
          {entry.website && (
            <a
              href={entry.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[36px] items-center gap-1 font-mono text-xs text-[#00C8F5]"
            >
              <RollText>Company Website</RollText>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
          {entry.repoUrl && (
            <a
              href={entry.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[36px] items-center gap-1 font-mono text-xs text-[#00C8F5]"
            >
              <RollText>View repository</RollText>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </div>
      )}
    </article>
  );
}
