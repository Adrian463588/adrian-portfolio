import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink, Info, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { InteractiveCoffeeCalculator } from "@/components/resources/InteractiveCoffeeCalculator";
import { InteractivePerfumeCalculator } from "@/components/resources/InteractivePerfumeCalculator";
import type { Project } from "@/types";
import type { SeoResourceEntry, TopicCluster } from "@/types/seo";

interface ResourceDetailViewProps {
  resource: SeoResourceEntry;
  cluster?: TopicCluster;
  relatedProjects: Project[];
  relatedResources: SeoResourceEntry[];
}

export function ResourceDetailView({
  resource,
  cluster,
  relatedProjects,
  relatedResources,
}: ResourceDetailViewProps) {
  return (
    <article className="min-h-[calc(100vh-68px)] bg-[#08090C]/86 px-6 py-12 backdrop-blur-[2px] sm:py-16">
      <div className="mx-auto max-w-[1000px] space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#A7ADB7]">
          <Link href="/" prefetch={false} className="link-underline transition-colors hover:text-[#65C8F5]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link href="/resources/" prefetch={false} className="link-underline transition-colors hover:text-[#65C8F5]">
            Resources
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#F2F0EC]">{resource.title}</span>
        </nav>

        {/* Header */}
        <header className="space-y-5 border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge label={cluster?.name ?? resource.clusterId} variant="accent" />
            <Badge label={resource.kind.toUpperCase()} />
            <span className="font-mono text-xs text-[#A7ADB7]">
              {resource.readingTimeMinutes} min · Reviewed {resource.reviewedAt.slice(0, 10)}
            </span>
          </div>

          <h1 className="font-display break-words text-3xl font-bold tracking-tight text-[#F2F0EC] sm:text-5xl sm:leading-[1.06]">
            {resource.title}
          </h1>

          {/* Direct AEO Summary Block */}
          <div className="rounded-xl border-l-2 border-[#65C8F5] bg-[#15171C]/90 px-5 py-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#65C8F5]">
              Direct Summary
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-[#F2F0EC] sm:text-base">
              {resource.directAnswer}
            </p>
          </div>

          {(resource.disclosure || resource.limitations) && (
            <div className="space-y-2.5">
              {resource.disclosure && (
                <div className="flex items-start gap-2.5 rounded-xl border border-white/10 bg-[#15171C]/70 px-4 py-3 text-xs leading-relaxed text-[#D6D9DF]">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#65C8F5]" aria-hidden="true" />
                  <p>{resource.disclosure}</p>
                </div>
              )}
              {resource.limitations && (
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs leading-relaxed text-amber-100">
                  <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
                  <p>{resource.limitations}</p>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Interactive Calculator Tool Slot */}
        {resource.toolId === "coffee-extraction-calculator" && <InteractiveCoffeeCalculator />}
        {resource.toolId === "perfume-concentration-calculator" && <InteractivePerfumeCalculator />}

        {/* Comparison Matrix */}
        {resource.comparisonMatrix && (
          <section aria-label="Side-by-side capability comparison" className="space-y-3">
            <h2 className="font-display text-2xl font-bold text-[#F2F0EC]">
              Technical Comparison Matrix
            </h2>
            <div className="overflow-x-auto rounded-2xl border border-white/12 bg-[#15171C]/80">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead className="border-b border-white/10 bg-[#08090C]/90 font-mono text-xs uppercase text-[#A7ADB7]">
                  <tr>
                    {resource.comparisonMatrix.columns.map((col) => (
                      <th
                        key={col.key}
                        className={`px-4 py-3.5 ${col.isFirstParty ? "text-[#65C8F5]" : "text-[#F2F0EC]"}`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {resource.comparisonMatrix.rows.map((row) => (
                    <tr key={row.criterion} className="align-top">
                      <th scope="row" className="px-4 py-3.5 font-medium text-[#F2F0EC]">
                        {row.criterion}
                      </th>
                      {resource.comparisonMatrix!.columns.slice(1).map((col) => (
                        <td key={col.key} className="px-4 py-3.5 text-xs leading-relaxed text-[#D6D9DF] sm:text-sm">
                          {row.values[col.key] ?? "—"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Main Sections */}
        <div className="space-y-8">
          {resource.sections.map((section) => (
            <section key={section.id} id={section.id} className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-[#F2F0EC]">{section.heading}</h2>
              {section.paragraphs.map((paragraph, pIdx) => (
                <p key={pIdx} className="text-base leading-relaxed text-[#D6D9DF]">
                  {paragraph}
                </p>
              ))}
              {section.bullets && section.bullets.length > 0 && (
                <ul className="space-y-2 border-l border-white/15 pl-5 text-sm leading-relaxed text-[#D6D9DF]">
                  {section.bullets.map((bullet, bIdx) => (
                    <li key={bIdx}>{bullet}</li>
                  ))}
                </ul>
              )}
              {section.codeSnippet && (
                <figure className="space-y-2 rounded-xl border border-white/12 bg-[#101217] p-4">
                  <figcaption className="font-mono text-[11px] uppercase tracking-wider text-[#65C8F5]">
                    {section.codeSnippet.caption}
                  </figcaption>
                  <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-[#F2F0EC]">
                    <code>{section.codeSnippet.code}</code>
                  </pre>
                </figure>
              )}
            </section>
          ))}
        </div>

        {/* FAQ */}
        {resource.faq.length > 0 && (
          <section aria-label="Frequently asked technical questions" className="space-y-4 border-t border-white/10 pt-8">
            <h2 className="font-display text-2xl font-bold text-[#F2F0EC]">Technical FAQ</h2>
            <dl className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#15171C]/65">
              {resource.faq.map((item) => (
                <div key={item.question} className="space-y-1.5 px-5 py-4">
                  <dt className="font-display text-base font-semibold text-[#F2F0EC]">
                    {item.question}
                  </dt>
                  <dd className="text-sm leading-relaxed text-[#D6D9DF]">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Verified Sources & Cross-Cluster Navigation */}
        <footer className="space-y-6 border-t border-white/10 pt-8">
          {relatedProjects.length > 0 && (
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-wider text-[#A7ADB7]">
                Connected Portfolio Case Studies
              </p>
              <div className="flex flex-wrap gap-2.5">
                {relatedProjects.map((project) => (
                  <Link
                    key={project.slug}
                    href={`/projects/${project.slug}/`}
                    prefetch={false}
                    className="active-press inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/15 bg-[#15171C] px-4 py-2 text-xs font-medium text-[#F2F0EC] transition-colors hover:border-[#65C8F5] hover:text-[#65C8F5]"
                  >
                    <span>{project.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#65C8F5]" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {relatedResources.length > 0 && (
            <div className="space-y-3">
              <p className="font-mono text-xs uppercase tracking-wider text-[#A7ADB7]">
                Related Engineering Guides &amp; Tools
              </p>
              <div className="flex flex-wrap gap-2.5">
                {relatedResources.map((rel) => (
                  <Link
                    key={rel.slug}
                    href={`/resources/${rel.slug}/`}
                    prefetch={false}
                    className="active-press inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-white/12 bg-[#15171C]/70 px-4 py-2 text-xs font-medium text-[#D6D9DF] transition-colors hover:border-[#65C8F5] hover:text-[#65C8F5]"
                  >
                    <span>{rel.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-[#65C8F5]" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-end">
            <div className="space-y-1.5">
              <p className="font-mono text-xs uppercase tracking-wider text-[#A7ADB7]">
                Verified Primary Sources
              </p>
              <ul className="space-y-1">
                {resource.sources.map((url) => (
                  <li key={url}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline inline-flex items-center gap-1 break-all font-mono text-xs text-[#65C8F5]"
                    >
                      <span>{url}</span>
                      <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/resources/"
              prefetch={false}
              className="active-press inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-white/15 bg-[#15171C] px-5 py-2 text-sm font-medium text-[#F2F0EC] transition-colors hover:border-[#65C8F5] hover:text-[#65C8F5]"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>All Resources</span>
            </Link>
          </div>
        </footer>
      </div>
    </article>
  );
}
