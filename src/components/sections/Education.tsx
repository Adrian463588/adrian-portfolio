import { MapPin } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { education } from "@/data/education";

export function Education() {
  return (
    <section
      id="education"
      className="border-t border-white/10 bg-[#08090B]/75 px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="Academic"
          title="Education"
          description="Formal engineering and information technology background."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {education.map((edu) => (
            <article key={edu.institution} className="space-y-2 border-t border-white/10 pt-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs text-[#00C8F5]">{edu.period}</span>
                {edu.location && (
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-[#A0A6B0]">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {edu.location}
                  </span>
                )}
              </div>
              <h3 className="font-display text-lg font-bold text-[#F1F3F5] sm:text-xl">
                {edu.institution}
              </h3>
              <p className="text-sm font-medium text-[#D1D5DB]">{edu.degree}</p>
              {edu.notes && (
                <p className="text-sm leading-relaxed text-[#A0A6B0]">{edu.notes}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
