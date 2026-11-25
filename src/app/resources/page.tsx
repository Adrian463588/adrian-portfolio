import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/config/site.config";
import { TOPIC_CLUSTERS } from "@/data/seo/topic-clusters";
import { canonicalPath, canonicalUrl } from "@/lib/seo";
import { buildResourcesHubJsonLd, getPublishedResources } from "@/lib/seo-resources";
import { Badge } from "@/components/ui/Badge";

const RESOURCES_DESCRIPTION =
  "Engineering guides, transparent tool comparisons, and verified browser calculators across QA automation, offline-first Android AI, PPG wearables, specialty coffee math, and perfumery formulas.";

export const metadata: Metadata = {
  title: "Engineering Resources & Tools",
  description: RESOURCES_DESCRIPTION,
  alternates: {
    canonical: canonicalPath("/resources/"),
  },
  openGraph: {
    title: `Engineering Resources & Tools | ${SITE_CONFIG.name}`,
    description: RESOURCES_DESCRIPTION,
    type: "website",
    locale: SITE_CONFIG.locale,
    siteName: SITE_CONFIG.siteName,
    url: canonicalUrl("/resources/"),
    images: [
      {
        ...SITE_CONFIG.ogImage,
        alt: `Engineering Resources & Tools — ${SITE_CONFIG.name}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Engineering Resources & Tools | ${SITE_CONFIG.name}`,
    description: RESOURCES_DESCRIPTION,
    images: [SITE_CONFIG.ogImage.url],
  },
};

export default function ResourcesHubPage() {
  const publishedResources = getPublishedResources();
  const structuredData = buildResourcesHubJsonLd(publishedResources);

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#08090C]/86 px-6 py-14 backdrop-blur-[2px] sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="mx-auto max-w-[1160px] space-y-14">
        <header className="max-w-3xl space-y-4 border-b border-white/10 pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-[#65C8F5]">
            Technical Knowledge &amp; Utilities
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-[#F2F0EC] sm:text-5xl">
            Engineering Resources.
          </h1>
          <p className="text-base leading-relaxed text-[#A7ADB7]">
            Evidence-backed architecture notes, transparent tool comparisons, and deterministic
            calculators distilled from first-party software repositories.
          </p>
        </header>

        <div className="space-y-12">
          {TOPIC_CLUSTERS.map((cluster) => {
            const clusterItems = publishedResources.filter(
              (item) => item.clusterId === cluster.id
            );
            if (clusterItems.length === 0) return null;

            return (
              <section key={cluster.id} aria-labelledby={`cluster-${cluster.id}`} className="space-y-5">
                <div className="space-y-1.5">
                  <h2
                    id={`cluster-${cluster.id}`}
                    className="font-display text-2xl font-bold text-[#F2F0EC]"
                  >
                    {cluster.name}
                  </h2>
                  <p className="max-w-3xl text-sm text-[#A7ADB7]">{cluster.summary}</p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {clusterItems.map((item) => (
                    <article
                      key={item.slug}
                      className="flex flex-col justify-between rounded-2xl border border-white/12 bg-[#15171C]/80 p-6 transition-colors hover:border-[#65C8F5]/60"
                    >
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Badge
                            label={item.kind === "tool" ? "Interactive Tool" : item.kind.toUpperCase()}
                            variant={item.kind === "tool" ? "accent" : "neutral"}
                          />
                          <span className="font-mono text-[11px] text-[#A7ADB7]">
                            {item.readingTimeMinutes} min read
                          </span>
                        </div>

                        <h3 className="font-display text-xl font-bold text-[#F2F0EC]">
                          <Link
                            href={`/resources/${item.slug}/`}
                            prefetch={false}
                            className="transition-colors hover:text-[#65C8F5]"
                          >
                            {item.title}
                          </Link>
                        </h3>

                        <p className="text-sm leading-relaxed text-[#D6D9DF]">{item.directAnswer}</p>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
                        <Link
                          href={`/resources/${item.slug}/`}
                          prefetch={false}
                          className="link-underline inline-flex min-h-[36px] items-center gap-1.5 font-semibold text-[#65C8F5]"
                        >
                          <span>{item.kind === "tool" ? "Open Calculator" : "Read Guide"}</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                        <span className="font-mono text-[11px] text-[#A7ADB7]">
                          {item.reviewedAt.slice(0, 10)}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
