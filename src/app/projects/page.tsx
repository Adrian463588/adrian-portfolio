import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SITE_CONFIG } from "@/config/site.config";
import { projects } from "@/data/projects";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";
import { buildProjectsCollectionJsonLd, canonicalPath, canonicalUrl } from "@/lib/seo";

const pageTitle = `${SITE_CONFIG.projectsTitle} | ${SITE_CONFIG.name}`;

export const metadata: Metadata = {
  title: SITE_CONFIG.projectsTitle,
  description: SITE_CONFIG.projectsDescription,
  alternates: {
    canonical: canonicalPath("/projects/"),
  },
  openGraph: {
    title: pageTitle,
    description: SITE_CONFIG.projectsDescription,
    type: "website",
    locale: SITE_CONFIG.locale,
    siteName: SITE_CONFIG.siteName,
    url: canonicalUrl("/projects/"),
    images: [SITE_CONFIG.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: SITE_CONFIG.projectsDescription,
    images: [SITE_CONFIG.ogImage],
  },
};

export default function ProjectsPage() {
  const projectsJsonLd = buildProjectsCollectionJsonLd(projects);

  return (
    <div className="min-h-[calc(100vh-68px)] bg-[#08090C]/82 px-6 py-12 backdrop-blur-[2px] sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsJsonLd) }}
      />
      <div className="mx-auto max-w-[1280px] space-y-10">
        <div className="space-y-4 border-b border-white/10 pb-8">
          <Link
            href="/"
            prefetch={false}
            className="link-underline inline-flex min-h-[38px] items-center gap-1.5 text-xs font-medium text-[#A7ADB7] transition-colors hover:text-[#65C8F5]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to overview</span>
          </Link>

          <div className="max-w-2xl space-y-2.5">
            <h1 className="font-display text-[clamp(2.25rem,5vw,4.25rem)] font-bold leading-[1.02] tracking-[-0.04em] text-[#F2F0EC]">
              Projects.
            </h1>
            <p className="text-sm leading-relaxed text-[#A7ADB7] sm:text-base">
              A collection of my work and experiments.
            </p>
          </div>
        </div>

        <ProjectExplorer items={projects} />
      </div>
    </div>
  );
}
