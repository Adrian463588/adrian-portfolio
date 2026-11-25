import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { competencies } from "@/data/competencies";
import { projects } from "@/data/projects";

export function Competencies() {
  const projectMap = new Map(projects.map((p) => [p.slug, p]));

  return (
    <section
      id="competencies"
      className="border-t border-white/10 bg-[#08090B]/75 px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="Capabilities"
          title="Technical Matrix"
          description="Core engineering practices backed by enterprise quality engagements and shipped systems."
        />

        <div className="grid grid-cols-1 gap-x-12 gap-y-2 md:grid-cols-2">
          {competencies.map((group, index) => {
            const linkedProjects = group.relatedProjectSlugs
              .map((slug) => projectMap.get(slug))
              .filter((p): p is NonNullable<typeof p> => Boolean(p));

            return (
              <article
                key={group.id}
                className="flex min-w-0 flex-col justify-between border-t border-white/10 py-7"
              >
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-xs text-[#00C8F5]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-lg font-bold tracking-tight text-[#F1F3F5] sm:text-xl">
                      {group.title}
                    </h3>
                  </div>

                  <p className="text-sm leading-relaxed text-[#A0A6B0]">{group.summary}</p>

                  <p className="font-mono text-xs leading-relaxed text-[#D1D5DB]">
                    {group.skills.join(" · ")}
                  </p>
                </div>

                {linkedProjects.length > 0 && (
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[#A0A6B0]">
                      Evidence:
                    </span>
                    {linkedProjects.map((proj) => (
                      <Link
                        key={proj.slug}
                        href={`/projects/${proj.slug}/`}
                        prefetch={false}
                        className="inline-flex min-h-[34px] items-center gap-1 rounded-full border border-white/12 bg-[#101216]/75 px-3 py-1 text-xs font-medium text-[#00C8F5] transition-colors hover:border-[#00C8F5]/60 hover:text-[#F1F3F5]"
                      >
                        <span>{proj.title.split(" — ")[0]}</span>
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
