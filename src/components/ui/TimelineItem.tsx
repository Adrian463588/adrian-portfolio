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
              <span className="font-mono text-xs text-[#65C8F5]">{indexLabel}</span>
            )}
            <h3 className="font-display break-words text-xl font-bold tracking-tight text-[#F2F0EC] sm:text-2xl">
              {hasGroupedRoles ? entry.organization : entry.title}
            </h3>
            {hasGroupedRoles && entry.corporateGroup && (
              <span className="text-xs font-medium text-[#65C8F5]">
                {entry.corporateGroup}
              </span>
            )}
          </div>

          {hasGroupedRoles ? (
            (entry.legalEntity || entry.industry) && (
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#A7ADB7]">
                {entry.legalEntity && (
                  <span className="inline-flex items-center gap-1 text-[#D6D9DF]">
                    <Building2 className="h-3.5 w-3.5 text-[#65C8F5]" aria-hidden="true" />
                    {entry.legalEntity}
                  </span>
                )}
                {entry.legalEntity && entry.industry && <span aria-hidden="true">·</span>}
                {entry.industry && <span>{entry.industry}</span>}
              </p>
            )
          ) : (
            <p className="text-sm font-medium text-[#D6D9DF]">{entry.organization}</p>
          )}

          {entry.location && (
            <p className="inline-flex items-center gap-1 text-xs text-[#A7ADB7]">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden="true" />
              <span>{entry.location}</span>
            </p>
          )}
        </div>

        <span className="shrink-0 font-mono text-xs tracking-wide text-[#A7ADB7]">
          {entry.dateRange}
        </span>
      </div>

      {entry.summary && (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#D6D9DF]">
          {entry.summary}
        </p>
      )}

      {hasGroupedRoles && entry.roles && (
        <div className="mt-5 grid grid-cols-1 gap-4 border-y border-white/10 py-4 md:grid-cols-2">
          {entry.roles.map((role) => (
            <div key={role.id} className="min-w-0 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`text-[11px] font-medium uppercase tracking-wider ${
                    role.employmentType === "freelance"
                      ? "text-[#65C8F5]"
                      : "text-[#A7ADB7]"
                  }`}
                >
                  {role.employmentLabel}
                </span>
                <span className="font-mono text-xs text-[#A7ADB7]">
                  {role.dateRange}
                </span>
              </div>
              <h4 className="font-display break-words text-sm font-semibold text-[#F2F0EC]">
                {role.title}
              </h4>
              {role.summary && (
                <p className="text-xs leading-relaxed text-[#A7ADB7]">{role.summary}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#A7ADB7]">
        {entry.bullets.map((bullet, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <span
              aria-hidden="true"
              className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-[#65C8F5]"
            />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {linkedProjects.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-[#A7ADB7]">Case studies:</span>
          {linkedProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}/`}
              prefetch={false}
              className="active-press group inline-flex min-h-[36px] items-center gap-1 rounded-full border border-white/15 bg-[#15171C]/80 px-3 py-1 text-xs font-medium text-[#F2F0EC] transition-colors hover:border-[#65C8F5] hover:text-[#65C8F5]"
            >
              <span>{project.title.split(" — ")[0]}</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          ))}
        </div>
      )}

      {entry.technologies && entry.technologies.length > 0 && (
        <p className="mt-4 text-xs leading-relaxed text-[#A7ADB7]">
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
              className="link-underline group inline-flex min-h-[36px] items-center gap-1 text-xs font-medium text-[#65C8F5]"
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
              className="link-underline group inline-flex min-h-[36px] items-center gap-1 text-xs font-medium text-[#65C8F5]"
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
