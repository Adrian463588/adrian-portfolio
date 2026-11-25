import { Users } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { leadership } from "@/data/leadership";

export function About() {
  return (
    <section id="about" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px] space-y-8">
        <SectionHeader
          eyebrow="About"
          title="Engineering Perspective & Community"
          description="Connecting enterprise quality engineering with systems, automation, and applied AI."
        />

        <div className="rounded-xl border border-[#27272A] bg-[#18181B] p-6 sm:p-8">
          <p className="max-w-3xl text-sm leading-relaxed text-[#E4E4E7] sm:text-base">
            I am a technology professional with experience in software quality engineering, automated
            testing, enterprise application modernization, and financial business process validation.
            My professional experience includes manual and automated testing for enterprise automotive
            financing systems, while my personal engineering projects span software development,
            infrastructure, and applied AI.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {leadership.map((org) => (
            <article
              key={org.organization}
              className="flex min-w-0 flex-col justify-between rounded-xl border border-[#27272A] bg-[#18181B] p-6"
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#27272A] bg-[#09090B] text-[#38BDF8]">
                    <Users className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <span className="rounded-md border border-[#27272A] bg-[#09090B] px-2.5 py-0.5 font-mono text-xs text-[#A1A1AA]">
                    {org.period}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-[#F4F4F5]">
                  {org.organization}
                </h3>
                <p className="mt-0.5 text-sm text-[#38BDF8]">{org.role}</p>

                {org.bullets.length > 0 && (
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#A1A1AA]">
                    {org.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#38BDF8]/70"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
