import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectExplorer } from "@/components/projects/ProjectExplorer";

const SITE_URL = "https://adriansyahabidin.vercel.app";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore open-source software, test automation frameworks, DevOps setups, Android apps, and experiments by Adrian Syah Abidin.",
  alternates: {
    canonical: "/projects/",
  },
  openGraph: {
    title: "Projects | Adrian Syah Abidin",
    description:
      "Open-source projects across test automation, DevOps infrastructure, backend APIs, Android, and on-device AI.",
    url: `${SITE_URL}/projects/`,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Projects — Adrian Syah Abidin" }],
  },
};

const projectsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/projects/#collection`,
      url: `${SITE_URL}/projects/`,
      name: "Projects | Adrian Syah Abidin",
      description: "Public engineering projects and technical experiments by Adrian Syah Abidin.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Projects", item: `${SITE_URL}/projects/` },
      ],
    },
  ],
};

export default function ProjectsPage() {
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
