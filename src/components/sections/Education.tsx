import { GraduationCap, MapPin } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { education } from "@/data/education";

export function Education() {
  return (
    <section id="education" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeader
          eyebrow="Academic"
          title="Education"
          description="Formal computer engineering and information technology foundation."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {education.map((edu) => (
            <article
              key={edu.institution}
              className="flex items-start gap-4 rounded-xl border border-[#27272A] bg-[#18181B] p-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#27272A] bg-[#09090B] text-[#38BDF8]">
                <GraduationCap className="h-5 w-5" aria-hidden="true" />
              </div>

              <div className="space-y-1.5">
                <span className="inline-block rounded-md border border-[#27272A] bg-[#09090B] px-2.5 py-0.5 font-mono text-xs text-[#A1A1AA]">
                  {edu.period}
                </span>
                <h3 className="text-base font-semibold text-[#F4F4F5] sm:text-lg">
                  {edu.institution}
                </h3>
                <p className="text-sm font-medium text-[#38BDF8]">{edu.degree}</p>
                {edu.notes && (
                  <p className="text-sm leading-relaxed text-[#A1A1AA]">{edu.notes}</p>
                )}
                {edu.location && (
                  <p className="flex items-center gap-1.5 pt-1 text-xs text-[#A1A1AA]">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{edu.location}</span>
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
