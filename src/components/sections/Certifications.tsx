import { Award, ExternalLink } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { certifications } from "@/data/certifications";

export function Certifications() {
  return (
    <section id="certifications" className="px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-[1200px]">
        <SectionHeader
          eyebrow="Credentials"
          title="Industry Certifications"
          description="Cloud, cybersecurity, networking, and applied data credentials."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <article
              key={cert.id}
              className="flex flex-col justify-between rounded-xl border border-[#27272A] bg-[#18181B] p-5"
            >
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#27272A] bg-[#09090B] text-[#38BDF8]">
                  <Award className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <Badge label={cert.category} />
                  <h3 className="pt-1 text-sm font-semibold leading-snug text-[#F4F4F5]">
                    {cert.name}
                  </h3>
                  <p className="font-mono text-xs text-[#D4D4D8]">{cert.issuer}</p>
                </div>
              </div>

              <div className="mt-4 border-t border-[#27272A] pt-3">
                {cert.verificationUrl ? (
                  <a
                    href={cert.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs text-[#38BDF8] hover:underline"
                  >
                    Verify credential
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                ) : (
                  <p className="font-mono text-xs text-[#A1A1AA]">{cert.status}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
