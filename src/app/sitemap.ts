import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { canonicalUrl, getLatestModifiedDate } from "@/lib/seo";
import { getPublishedResources } from "@/lib/seo-resources";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestModified = new Date(getLatestModifiedDate(projects));
  const publishedResources = getPublishedResources();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: canonicalUrl("/"),
      lastModified: latestModified,
    },
    {
      url: canonicalUrl("/projects/"),
      lastModified: latestModified,
    },
    {
      url: canonicalUrl("/resources/"),
      lastModified: latestModified,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: canonicalUrl(`/projects/${project.slug}/`),
    ...(project.updatedAt ? { lastModified: new Date(project.updatedAt) } : {}),
  }));

  const resourceRoutes: MetadataRoute.Sitemap = publishedResources.map((resource) => ({
    url: canonicalUrl(`/resources/${resource.slug}/`),
    lastModified: new Date(resource.reviewedAt),
  }));

  return [...staticRoutes, ...projectRoutes, ...resourceRoutes];
}
