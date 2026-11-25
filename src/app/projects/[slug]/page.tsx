import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_CONFIG } from "@/config/site.config";
import { projects } from "@/data/projects";
import { getProjectBySlug } from "@/lib/projects";
import {
  buildProjectDetailJsonLd,
  canonicalPath,
  canonicalUrl,
  selectRelatedProjects,
} from "@/lib/seo";
import { getResourcesForProject } from "@/lib/seo-resources";
import { CaseStudyDetail } from "@/components/projects/CaseStudyDetail";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(projects, slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const metaTitle = project.seoTitle || project.title;
  const metaDescription = project.seoDescription || project.summary;
  const fullTitle = `${metaTitle} | ${SITE_CONFIG.name}`;
  const image = project.screenshots[0]
    ? {
        url: project.screenshots[0].src,
        width: project.screenshots[0].width,
        height: project.screenshots[0].height,
        alt: project.screenshots[0].alt,
      }
    : {
        ...SITE_CONFIG.ogImage,
        alt: `${metaTitle} — ${SITE_CONFIG.name}`,
      };

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: {
      canonical: canonicalPath(`/projects/${project.slug}/`),
    },
    openGraph: {
      title: fullTitle,
      description: metaDescription,
      type: "article",
      locale: SITE_CONFIG.locale,
      siteName: SITE_CONFIG.siteName,
      url: canonicalUrl(`/projects/${project.slug}/`),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: metaDescription,
      images: [image],
    },
  };
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(projects, slug);

  if (!project) {
    notFound();
  }

  const structuredData = buildProjectDetailJsonLd(project);
  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const prevItem = currentIndex > 0 ? projects[currentIndex - 1] : undefined;
  const nextItem =
    currentIndex >= 0 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : undefined;
  const related = selectRelatedProjects(projects, project, 3).map((item) => ({
    slug: item.slug,
    title: item.title,
    category: item.category,
  }));
  const relatedResources = getResourcesForProject(project.slug).map((item) => ({
    slug: item.slug,
    title: item.title,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CaseStudyDetail
        project={project}
        prevProject={prevItem ? { slug: prevItem.slug, title: prevItem.title } : undefined}
        nextProject={nextItem ? { slug: nextItem.slug, title: nextItem.title } : undefined}
        relatedProjects={related}
        relatedResources={relatedResources}
      />
    </>
  );
}
