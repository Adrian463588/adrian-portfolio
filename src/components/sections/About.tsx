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
          eyebrow="07 / About"
          title="Digital Precision, Human Craft."
          description="Information Technology graduate from Universitas Gadjah Mada (UGM) building reliable software across enterprise financing, QA automation, and applied AI."
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
                My engineering work spans manual and automated quality control at Berijalan Techno
                Center (Astra Credit Companies Group) as well as prior quality engineering and
                software roles at Qiscus, Tokopedia (ByteDance), and Bitbybit Studio.
              </p>
              <p className="text-sm leading-relaxed text-[#A7ADB7] sm:text-base">
                Across AOL UniPaaS, Magic xpa, Cypress, Jenkins CI, offline-first Android
                applications, Rust/Tauri tooling, Cloud &amp; DevSecOps observability, and local LLM
                systems, I focus on verifiable software behavior from interface down to runtime.
              </p>
            </div>

            <div className="space-y-4 border-t border-white/10 pt-6">
              <p className="font-mono text-xs tracking-[0.12em] text-[#65C8F5] uppercase">
                Communities &amp; Leadership
              </p>
              <div className="divide-y divide-white/10 border-b border-white/10">
                {leadership.map((org) => (
                  <article key={org.organization} className="py-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-base font-semibold text-[#F2F0EC]">
                        {org.organization}
                      </h3>
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
