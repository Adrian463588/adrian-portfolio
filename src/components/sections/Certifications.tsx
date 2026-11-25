import { ExternalLink } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { certifications } from "@/data/certifications";

export function Certifications() {
  return (
    <section
      id="certifications"
      className="border-t border-white/10 bg-[#080808]/75 px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          eyebrow="Credentials"
          title="Industry Certifications"
          description="Verified cloud infrastructure, cybersecurity, networking, and data credentials."
        />

        <div className="divide-y divide-white/10 border-y border-white/10">
          {certifications.map((cert) => (
            <article
              key={cert.id}
              className="grid grid-cols-1 gap-2 py-5 transition-colors hover:bg-white/[0.02] md:grid-cols-12 md:items-center md:gap-4"
            >
              <p className="font-mono text-xs tracking-wider text-[#7A9BFF] uppercase md:col-span-3">
                {cert.category}
              </p>

              <div className="md:col-span-5">
                <h3 className="font-display text-base font-semibold text-[#F1F0EB]">
                  {cert.name}
                </h3>
                <p className="text-xs text-[#A6A6A6]">{cert.issuer}</p>
              </div>

              <div className="md:col-span-4 md:text-right">
                {cert.verificationUrl ? (
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[36px] items-center gap-1.5 font-mono text-xs text-[#7A9BFF] hover:underline"
                  >
                    <span>Verify credential</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <p className="font-mono text-xs text-[#A6A6A6]">{cert.status}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
