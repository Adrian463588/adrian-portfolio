import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_CONFIG } from "@/config/site.config";
import { projects } from "@/data/projects";
import { getProjectBySlug } from "@/lib/projects";
import { canonicalPath, canonicalUrl } from "@/lib/seo";
import {
  buildResourceDetailJsonLd,
  getClusterById,
  getPublishedResources,
  getResourceBySlug,
} from "@/lib/seo-resources";
import { ResourceDetailView } from "@/components/resources/ResourceDetailView";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedResources().map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    return {
      title: "Resource Not Found",
      robots: { index: false, follow: false },
    };
  }

  const fullTitle = `${resource.seoTitle} | ${SITE_CONFIG.name}`;
  return {
    title: resource.seoTitle,
    description: resource.metaDescription,
    alternates: {
      canonical: canonicalPath(`/resources/${resource.slug}/`),
    },
    robots: {
      index: resource.indexable,
      follow: resource.indexable,
    },
    openGraph: {
      title: fullTitle,
      description: resource.metaDescription,
      type: "article",
      locale: SITE_CONFIG.locale,
      siteName: SITE_CONFIG.siteName,
      url: canonicalUrl(`/resources/${resource.slug}/`),
      images: [
        {
          ...SITE_CONFIG.ogImage,
          alt: `${resource.seoTitle} — ${SITE_CONFIG.name}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: resource.metaDescription,
      images: [SITE_CONFIG.ogImage.url],
    },
  };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const resource = getResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  const cluster = getClusterById(resource.clusterId);
  const relatedProjects = resource.relatedProjectSlugs
    .map((pSlug) => getProjectBySlug(projects, pSlug))
    .filter((proj): proj is NonNullable<typeof proj> => Boolean(proj));
  const relatedResources = resource.relatedResourceSlugs
    .map((rSlug) => getResourceBySlug(rSlug))
    .filter((res): res is NonNullable<typeof res> => Boolean(res));
  const structuredData = buildResourceDetailJsonLd(resource);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ResourceDetailView
        resource={resource}
        cluster={cluster}
        relatedProjects={relatedProjects}
        relatedResources={relatedResources}
      />
    </>
  );
}
