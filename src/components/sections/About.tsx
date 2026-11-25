import { SectionHeader } from "@/components/ui/SectionHeader";
import { ChibiShowcase } from "@/components/avatar/ChibiShowcase";
import { ScrollParallax } from "@/components/motion/ScrollParallax";
import { leadership } from "@/data/leadership";

export function About() {
  return (
    <section
      id="about"
      className="border-t border-white/10 bg-[#08090C]/82 px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          title="About Me."
          description="Beyond the code."
        />

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ScrollParallax yOffset={16}>
              <ChibiShowcase />
            </ScrollParallax>
          </div>

          <div className="min-w-0 space-y-8 lg:col-span-7">
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-[#F2F0EC] sm:text-lg">
                I&apos;m a software engineer with an Information Technology background at
                Universitas Gadjah Mada. My experience includes manual and automated testing,
                enterprise financial applications, and CI integration using Cypress and Jenkins.
              </p>
              <p className="text-sm leading-relaxed text-[#A7ADB7] sm:text-base">
                Outside professional work, I build software projects across backend systems,
                DevOps infrastructure, Android apps, and on-device AI tools.
              </p>
            </div>

            <div className="space-y-4 border-t border-white/10 pt-6">
              <h3 className="text-xs font-medium uppercase tracking-wider text-[#65C8F5]">
                Campus Communities
              </h3>
              <div className="divide-y divide-white/10 border-b border-white/10">
                {leadership.map((org) => (
                  <article key={org.organization} className="py-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-display text-base font-semibold text-[#F2F0EC]">
                        {org.organization}
                      </h4>
                      <span className="font-mono text-xs text-[#A7ADB7]">{org.period}</span>
                    </div>
                    <p className="mt-0.5 text-xs font-medium text-[#65C8F5]">{org.role}</p>
                    {org.bullets.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm text-[#A7ADB7]">
                        {org.bullets.map((bullet, idx) => (
                          <li key={idx}>· {bullet}</li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
