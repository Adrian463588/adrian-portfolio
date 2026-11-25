import { SectionHeader } from "@/components/ui/SectionHeader";
import { ChibiShowcase } from "@/components/avatar/ChibiShowcase";
import { ScrollParallax } from "@/components/motion/ScrollParallax";
import { leadership } from "@/data/leadership";

export function About() {
  return (
    <section
      id="about"
      className="border-t border-white/10 bg-[#08090B]/80 px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="About & Perspective"
          title="Digital Precision, Human Craft"
          description="Connecting enterprise quality engineering with resilient systems, automation, and applied AI."
        />

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <ScrollParallax yOffset={16}>
              <ChibiShowcase />
            </ScrollParallax>
          </div>

          <div className="min-w-0 space-y-8 lg:col-span-7">
            <div className="space-y-4">
              <p className="text-base leading-relaxed text-[#F1F3F5] sm:text-lg">
                I am a technology professional focused on software quality engineering, automated
                testing, enterprise application modernization, and financial business process
                validation.
              </p>
              <p className="text-sm leading-relaxed text-[#A0A6B0] sm:text-base">
                Alongside manual and automated quality control for enterprise automotive financing
                platforms across AOL UniPaaS, Magic xpa, Cypress, and Jenkins CI, my personal
                engineering work spans offline-first Android applications, Rust/Tauri developer
                tooling, Cloud &amp; DevSecOps observability, and local LLM systems built out of
                Yogyakarta.
              </p>
            </div>

            <div className="space-y-4 border-t border-white/10 pt-6">
              <p className="font-mono text-xs tracking-[0.14em] text-[#00C8F5] uppercase">
                Campus &amp; Engineering Communities
              </p>
              <div className="divide-y divide-white/10 border-b border-white/10">
                {leadership.map((org) => (
                  <article key={org.organization} className="py-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-base font-semibold text-[#F1F3F5]">
                        {org.organization}
                      </h3>
                      <span className="font-mono text-xs text-[#A0A6B0]">{org.period}</span>
                    </div>
                    <p className="mt-0.5 text-xs font-medium text-[#00C8F5]">{org.role}</p>
                    {org.bullets.length > 0 && (
                      <ul className="mt-2 space-y-1 text-sm text-[#A0A6B0]">
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
