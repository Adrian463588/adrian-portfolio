import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { getProjectBySlug } from "@/lib/projects";
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

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/projects/${project.slug}/`,
    },
    openGraph: {
      title: `${project.title} — Adrian Syah Abidin`,
      description: project.summary,
      url: `https://adriansyahabidin.vercel.app/projects/${project.slug}/`,
      images: project.screenshots[0]
        ? [
            {
              url: project.screenshots[0].src,
              width: project.screenshots[0].width,
              height: project.screenshots[0].height,
              alt: project.screenshots[0].alt,
            },
          ]
        : undefined,
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

  const structuredData = project.repositoryUrl
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareSourceCode",
        name: project.title,
        description: project.summary,
        codeRepository: project.repositoryUrl,
        programmingLanguage: project.language || project.technologies[0],
        dateModified: project.updatedAt,
        author: {
          "@type": "Person",
          name: "Adrian Syah Abidin",
        },
      }
    : {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: project.title,
        description: project.summary,
        about: project.businessDomain || project.category,
        keywords: project.technologies.join(", "),
        dateModified: project.updatedAt,
        author: {
          "@type": "Person",
          name: "Adrian Syah Abidin",
        },
      };

  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const prevItem = currentIndex > 0 ? projects[currentIndex - 1] : undefined;
  const nextItem =
    currentIndex >= 0 && currentIndex < projects.length - 1
      ? projects[currentIndex + 1]
      : undefined;

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
      />
    </>
  );
}
