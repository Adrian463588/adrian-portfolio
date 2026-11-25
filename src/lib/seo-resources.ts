import { SITE_CONFIG } from "@/config/site.config";
import { COMPETITORS } from "@/data/seo/competitors";
import { KEYWORD_MAP } from "@/data/seo/keyword-map";
import { SEO_RESOURCES } from "@/data/seo/resources";
import { TOPIC_CLUSTERS } from "@/data/seo/topic-clusters";
import { ENTITY_IDS, absoluteAssetUrl, canonicalUrl } from "@/lib/seo";
import type { Project } from "@/types";
import type {
  CompetitorRecord,
  SeoResourceEntry,
  SeoValidationIssue,
  SeoValidationSummary,
  TopicCluster,
} from "@/types/seo";

const MIN_WORDS_PER_PUBLISHED_PAGE = 200;

export function isResourcePublished(entry: SeoResourceEntry): boolean {
  return entry.status === "published" && entry.indexable === true;
}

export function getPublishedResources(
  entries: SeoResourceEntry[] = SEO_RESOURCES
): SeoResourceEntry[] {
  return entries.filter(isResourcePublished);
}

export function getResourceBySlug(
  slug: string,
  entries: SeoResourceEntry[] = SEO_RESOURCES
): SeoResourceEntry | undefined {
  return getPublishedResources(entries).find((item) => item.slug === slug);
}

export function getResourcesForProject(
  projectSlug: string,
  entries: SeoResourceEntry[] = SEO_RESOURCES
): SeoResourceEntry[] {
  return getPublishedResources(entries).filter((item) =>
    item.relatedProjectSlugs.includes(projectSlug)
  );
}

export function getResourcesByCluster(
  clusterId: string,
  entries: SeoResourceEntry[] = SEO_RESOURCES
): SeoResourceEntry[] {
  return getPublishedResources(entries).filter((item) => item.clusterId === clusterId);
}

export function getClusterById(
  clusterId: string,
  clusters: TopicCluster[] = TOPIC_CLUSTERS
): TopicCluster | undefined {
  return clusters.find((cluster) => cluster.id === clusterId);
}

export function countResourceWords(entry: SeoResourceEntry): number {
  const parts = [
    entry.directAnswer,
    entry.disclosure ?? "",
    entry.limitations ?? "",
    ...entry.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.bullets ?? [])]),
    ...entry.faq.flatMap((item) => [item.question, item.answer]),
  ];
  return parts
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function validateSeoCatalog(params: {
  resources?: SeoResourceEntry[];
  competitors?: CompetitorRecord[];
  clusters?: TopicCluster[];
  projects: Project[];
}): SeoValidationSummary {
  const resources = params.resources ?? SEO_RESOURCES;
  const competitors = params.competitors ?? COMPETITORS;
  const clusters = params.clusters ?? TOPIC_CLUSTERS;
  const projects = params.projects;

  const issues: SeoValidationIssue[] = [];
  const seenSlugs = new Set<string>();
  const seenSeoTitles = new Set<string>();
  const projectSlugs = new Set(projects.map((p) => p.slug));
  const competitorIds = new Set(competitors.map((c) => c.id));
  const clusterIds = new Set(clusters.map((c) => c.id));

  for (const kw of KEYWORD_MAP) {
    if (!resources.some((r) => r.slug === kw.targetSlug)) {
      issues.push({
        severity: "error",
        code: "ORPHAN_KEYWORD_TARGET",
        slug: kw.targetSlug,
        message: `Keyword entry "${kw.id}" references missing resource slug "${kw.targetSlug}".`,
      });
    }
  }

  for (const cluster of clusters) {
    for (const pSlug of cluster.projectSlugs) {
      if (!projectSlugs.has(pSlug)) {
        issues.push({
          severity: "error",
          code: "INVALID_CLUSTER_PROJECT",
          slug: cluster.id,
          message: `Topic cluster "${cluster.id}" references unknown project slug "${pSlug}".`,
        });
      }
    }
  }

  for (const entry of resources) {
    if (seenSlugs.has(entry.slug)) {
      issues.push({
        severity: "error",
        code: "DUPLICATE_SLUG",
        slug: entry.slug,
        message: `Duplicate resource slug "${entry.slug}".`,
      });
    }
    seenSlugs.add(entry.slug);

    if (projectSlugs.has(entry.slug)) {
      issues.push({
        severity: "error",
        code: "PROJECT_SLUG_COLLISION",
        slug: entry.slug,
        message: `Resource slug "${entry.slug}" collides with a project slug.`,
      });
    }

    if (!clusterIds.has(entry.clusterId)) {
      issues.push({
        severity: "error",
        code: "UNKNOWN_CLUSTER",
        slug: entry.slug,
        message: `Resource references unknown cluster "${entry.clusterId}".`,
      });
    }

    for (const projSlug of entry.relatedProjectSlugs) {
      if (!projectSlugs.has(projSlug)) {
        issues.push({
          severity: "error",
          code: "UNKNOWN_PROJECT_SLUG",
          slug: entry.slug,
          message: `Resource references unknown project "${projSlug}".`,
        });
      }
    }

    for (const compId of entry.competitorIds) {
      if (!competitorIds.has(compId)) {
        issues.push({
          severity: "error",
          code: "UNKNOWN_COMPETITOR_ID",
          slug: entry.slug,
          message: `Resource references unknown competitor "${compId}".`,
        });
      }
    }

    if (entry.status !== "published" && entry.indexable) {
      issues.push({
        severity: "error",
        code: "UNPUBLISHED_MARKED_INDEXABLE",
        slug: entry.slug,
        message: `Non-published resource "${entry.slug}" (${entry.status}) must have indexable: false.`,
      });
    }

    if (!isResourcePublished(entry)) {
      continue;
    }

    if (!entry.seoTitle.trim() || entry.seoTitle.length > 72) {
      issues.push({
        severity: "error",
        code: "INVALID_SEO_TITLE",
        slug: entry.slug,
        message: `Published resource seoTitle must be 1..72 chars (got ${entry.seoTitle.length}).`,
      });
    }

    if (seenSeoTitles.has(entry.seoTitle.toLowerCase())) {
      issues.push({
        severity: "error",
        code: "DUPLICATE_SEO_TITLE",
        slug: entry.slug,
        message: `Duplicate seoTitle "${entry.seoTitle}".`,
      });
    }
    seenSeoTitles.add(entry.seoTitle.toLowerCase());

    if (entry.metaDescription.length < 50 || entry.metaDescription.length > 170) {
      issues.push({
        severity: "error",
        code: "INVALID_META_DESCRIPTION",
        slug: entry.slug,
        message: `Published metaDescription must be 50..170 chars (got ${entry.metaDescription.length}).`,
      });
    }

    if (!entry.directAnswer || entry.directAnswer.length < 40) {
      issues.push({
        severity: "error",
        code: "MISSING_DIRECT_ANSWER",
        slug: entry.slug,
        message: `Published resource requires a concise directAnswer block.`,
      });
    }

    const words = countResourceWords(entry);
    if (words < MIN_WORDS_PER_PUBLISHED_PAGE) {
      issues.push({
        severity: "error",
        code: "THIN_CONTENT",
        slug: entry.slug,
        message: `Published resource contains ${words} words (< ${MIN_WORDS_PER_PUBLISHED_PAGE} minimum).`,
      });
    }

    if (entry.sources.length === 0 || entry.sources.some((s) => !s.startsWith("https://"))) {
      issues.push({
        severity: "error",
        code: "MISSING_HTTPS_SOURCES",
        slug: entry.slug,
        message: `Published resource must provide >=1 verified https:// source URL.`,
      });
    }

    if (Number.isNaN(Date.parse(entry.reviewedAt))) {
      issues.push({
        severity: "error",
        code: "INVALID_REVIEW_DATE",
        slug: entry.slug,
        message: `Published resource requires valid ISO reviewedAt timestamp.`,
      });
    }

    if (
      (entry.kind === "comparison" || entry.kind === "alternative") &&
      entry.comparisonMatrix?.columns.some((c) => c.isFirstParty) &&
      !entry.disclosure
    ) {
      issues.push({
        severity: "error",
        code: "MISSING_AFFILIATION_DISCLOSURE",
        slug: entry.slug,
        message: `First-party comparison/alternative requires an explicit affiliation disclosure.`,
      });
    }

    if (entry.kind === "tool" && !entry.limitations) {
      issues.push({
        severity: "error",
        code: "MISSING_TOOL_LIMITATIONS",
        slug: entry.slug,
        message: `Interactive tool page requires explicit methodology limitations / disclaimers.`,
      });
    }
  }

  const publishedCount = resources.filter(isResourcePublished).length;
  return {
    valid: issues.every((issue) => issue.severity !== "error"),
    publishedCount,
    gatedCount: resources.length - publishedCount,
    issues,
  };
}

export function buildResourcesHubJsonLd(entries: SeoResourceEntry[] = getPublishedResources()) {
  const hubUrl = canonicalUrl("/resources/");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${hubUrl}#collection`,
        url: hubUrl,
        name: `Engineering Resources & Tools | ${SITE_CONFIG.name}`,
        description:
          "Engineering guides, transparent tool comparisons, and verified browser calculators spanning QA automation, offline-first Android, coffee extraction math, and perfumery formulas.",
        isPartOf: { "@id": ENTITY_IDS.website },
        about: { "@id": ENTITY_IDS.person },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: entries.length,
          itemListElement: entries.map((entry, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            name: entry.title,
            url: canonicalUrl(`/resources/${entry.slug}/`),
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
          { "@type": "ListItem", position: 2, name: "Resources", item: hubUrl },
        ],
      },
    ],
  };
}

export function buildResourceDetailJsonLd(entry: SeoResourceEntry) {
  const pageUrl = canonicalUrl(`/resources/${entry.slug}/`);
  const cluster = getClusterById(entry.clusterId);
  const graph: Array<Record<string, unknown>> = [
    {
      "@type": entry.kind === "tool" ? "WebApplication" : "TechArticle",
      "@id": `${pageUrl}#primary`,
      url: pageUrl,
      name: entry.title,
      headline: entry.title,
      description: entry.metaDescription,
      inLanguage: SITE_CONFIG.language,
      dateModified: entry.reviewedAt,
      author: { "@id": ENTITY_IDS.person },
      publisher: { "@id": ENTITY_IDS.person },
      isPartOf: { "@id": ENTITY_IDS.website },
      image: absoluteAssetUrl(SITE_CONFIG.ogImage.url),
      ...(entry.kind === "tool"
        ? {
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any Web Browser",
          }
        : {
            articleSection: cluster?.name ?? entry.clusterId,
          }),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
        { "@type": "ListItem", position: 2, name: "Resources", item: canonicalUrl("/resources/") },
        { "@type": "ListItem", position: 3, name: entry.title, item: pageUrl },
      ],
    },
  ];

  if (entry.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: entry.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
