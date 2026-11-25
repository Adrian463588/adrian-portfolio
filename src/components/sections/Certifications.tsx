import { ExternalLink } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { certifications } from "@/data/certifications";

export function Certifications() {
  const professionalCerts = certifications.filter((c) => c.kind !== "course");
  const courses = certifications.filter((c) => c.kind === "course");

  return (
    <section
      id="certifications"
      className="border-t border-white/10 bg-[#08090C]/78 px-6 py-20 sm:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <SectionHeader
          title="Certifications."
          description="Professional certifications and completed technical coursework."
        />

        <div className="space-y-12">
          <div className="space-y-3">
            <h3 className="text-xs font-medium uppercase tracking-wider text-[#65C8F5]">
              Professional Certifications
            </h3>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {professionalCerts.map((cert) => (
                <article
                  key={cert.id}
                  className="grid grid-cols-1 gap-2 py-5 transition-colors hover:bg-white/[0.02] md:grid-cols-12 md:items-center md:gap-4"
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-[#A7ADB7] md:col-span-3">
                    {cert.category}
                  </p>

                  <div className="md:col-span-5">
                    <h4 className="font-display text-base font-semibold text-[#F2F0EC]">
                      {cert.name}
                    </h4>
                    <p className="text-xs text-[#A7ADB7]">{cert.issuer}</p>
                  </div>

                  <div className="md:col-span-4 md:text-right">
                    {cert.verificationUrl ? (
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline inline-flex min-h-[36px] items-center gap-1.5 text-xs font-medium text-[#65C8F5]"
                      >
                        <span>Verify credential</span>
                        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <p className="text-xs text-[#A7ADB7]">{cert.status}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {courses.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-medium uppercase tracking-wider text-[#A7ADB7]">
                Courses &amp; Training
              </h3>
              <div className="divide-y divide-white/10 border-y border-white/10">
                {courses.map((course) => (
                  <article
                    key={course.id}
                    className="grid grid-cols-1 gap-2 py-4 transition-colors hover:bg-white/[0.02] md:grid-cols-12 md:items-center md:gap-4"
                  >
                    <p className="text-xs uppercase tracking-wider text-[#A7ADB7] md:col-span-3">
                      {course.category}
                    </p>
                    <div className="md:col-span-5">
                      <h4 className="font-display text-sm font-semibold text-[#F2F0EC]">
                        {course.name}
                      </h4>
                      <p className="text-xs text-[#A7ADB7]">{course.issuer}</p>
                    </div>
                    <div className="md:col-span-4 md:text-right">
                      <p className="text-xs text-[#A7ADB7]">{course.status}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
