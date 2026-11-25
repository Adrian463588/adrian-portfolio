import Link from "next/link";
import { Container, Cpu, Layers, Server, ShieldCheck, Smartphone, Terminal } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { competencies } from "@/data/competencies";
import { projects } from "@/data/projects";

const iconMap = {
  ShieldCheck,
  Layers,
  Container,
  Server,
  Smartphone,
  Cpu,
  Terminal,
};

export function Competencies() {
  const projectMap = new Map(projects.map((p) => [p.slug, p]));

  return (
    <section id="competencies" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeader
          eyebrow="Capabilities"
          title="Technical Competencies"
          description="Core engineering domains grounded in shipped repositories and production QA/DevOps workflows."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {competencies.map((group) => {
            const Icon = iconMap[group.icon as keyof typeof iconMap] || Terminal;
            const linkedProjects = group.relatedProjectSlugs
              .map((slug) => projectMap.get(slug))
              .filter((p): p is NonNullable<typeof p> => Boolean(p));

            return (
              <article
                key={group.id}
                className="flex min-w-0 flex-col justify-between rounded-xl border border-[#27272A] bg-[#18181B] p-6"
              >
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#27272A] bg-[#09090B] text-[#38BDF8]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h3 className="text-base font-semibold text-[#F4F4F5]">
                      {group.title}
                    </h3>
                  </div>

                  <p className="text-sm leading-relaxed text-[#A1A1AA]">
                    {group.summary}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <Badge key={skill} label={skill} />
                    ))}
                  </div>
                </div>

                {linkedProjects.length > 0 && (
                  <div className="mt-5 border-t border-[#27272A] pt-4">
                    <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA]">
                      Verified Evidence
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {linkedProjects.map((proj) => (
                        <Link
                          key={proj.slug}
                          href={`/projects/${proj.slug}/`}
                          prefetch={false}
                          className="rounded-md border border-[#27272A] bg-[#09090B] px-2.5 py-1 text-xs font-medium text-[#38BDF8] transition-colors hover:border-[#38BDF8]/50 hover:text-[#7DD3FC]"
                        >
                          {proj.title}
                        </Link>
                      ))}
                    </div>
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
