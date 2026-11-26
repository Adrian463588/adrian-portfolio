import { SITE_CONFIG } from "@/config/site.config";
import type { CertificationEntry, Project } from "@/types";

export function canonicalPath(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  const trimmed = pathname.replace(/^\/+|\/+$/g, "");
  return `/${trimmed}/`;
}

export function canonicalUrl(pathname: string): string {
  return `${SITE_CONFIG.url}${canonicalPath(pathname)}`;
}

export function absoluteAssetUrl(assetPath: string): string {
  if (assetPath.startsWith("https://")) return assetPath;
  const normalized = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  return `${SITE_CONFIG.url}${normalized}`;
}

export const ENTITY_IDS = {
  person: `${SITE_CONFIG.url}/#person`,
  website: `${SITE_CONFIG.url}/#website`,
  profilePage: `${SITE_CONFIG.url}/#profilepage`,
} as const;

export function getLatestModifiedDate(items: Project[]): string {
  let latest = "";
  for (const item of items) {
    if (item.updatedAt && item.updatedAt > latest) {
      latest = item.updatedAt;
    }
  }
  return latest || "2026-11-25";
}

function getIssuedCredentials(items: CertificationEntry[]) {
  return items
    .filter(
      (cert) =>
        cert.kind !== "course" &&
        /^issued\s+(certification|credential)$/i.test(cert.status.trim())
    )
    .map((cert) => ({
      "@type": "EducationalOccupationalCredential",
      name: cert.name,
      credentialCategory: cert.category,
      recognizedBy: {
        "@type": "Organization",
        name: cert.issuer,
      },
    }));
}

export function buildHomeJsonLd(
  allProjects: Project[],
  certificationList: CertificationEntry[]
) {
  const credentials = getIssuedCredentials(certificationList);
  const dateModified = getLatestModifiedDate(allProjects);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": ENTITY_IDS.website,
        url: canonicalUrl("/"),
        name: SITE_CONFIG.name,
        alternateName: [...SITE_CONFIG.alternateNames],
        description: SITE_CONFIG.description,
        inLanguage: SITE_CONFIG.language,
        publisher: { "@id": ENTITY_IDS.person },
      },
      {
        "@type": "Person",
        "@id": ENTITY_IDS.person,
        name: SITE_CONFIG.name,
        url: canonicalUrl("/"),
        image: absoluteAssetUrl(SITE_CONFIG.portraitImage),
        jobTitle: SITE_CONFIG.jobTitle,
        description: SITE_CONFIG.description,
        address: {
          "@type": "PostalAddress",
          addressCountry: SITE_CONFIG.countryCode,
        },
        alumniOf: {
          "@type": "CollegeOrUniversity",
          name: SITE_CONFIG.alumniOf,
        },
        sameAs: [
          SITE_CONFIG.profiles.github,
          SITE_CONFIG.profiles.linkedin,
          SITE_CONFIG.profiles.medium,
        ],
        ...(credentials.length > 0 ? { hasCredential: credentials } : {}),
        knowsAbout: [...SITE_CONFIG.knowsAbout],
      },
      {
        "@type": "ProfilePage",
        "@id": ENTITY_IDS.profilePage,
        url: canonicalUrl("/"),
        name: SITE_CONFIG.titleDefault,
        inLanguage: SITE_CONFIG.language,
        dateModified,
        isPartOf: { "@id": ENTITY_IDS.website },
        mainEntity: { "@id": ENTITY_IDS.person },
      },
    ],
  };
}

export function buildProjectsCollectionJsonLd(items: Project[]) {
  const pageUrl = canonicalUrl("/projects/");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#collection`,
        url: pageUrl,
        name: `${SITE_CONFIG.projectsTitle} | ${SITE_CONFIG.name}`,
        description: SITE_CONFIG.projectsDescription,
        inLanguage: SITE_CONFIG.language,
        dateModified: getLatestModifiedDate(items),
        isPartOf: { "@id": ENTITY_IDS.website },
        author: { "@id": ENTITY_IDS.person },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
          { "@type": "ListItem", position: 2, name: "Projects", item: pageUrl },
        ],
      },
    ],
  };
}

export function buildProjectDetailJsonLd(project: Project) {
  const pageUrl = canonicalUrl(`/projects/${project.slug}/`);
  const leadShot = project.screenshots[0];
  const imageUrl = leadShot
    ? absoluteAssetUrl(leadShot.src)
    : absoluteAssetUrl(SITE_CONFIG.ogImage.url);

  const projectNode = project.repositoryUrl
    ? {
        "@type": "SoftwareSourceCode",
        "@id": `${pageUrl}#software`,
        url: pageUrl,
        name: project.title,
        description: project.seoDescription || project.summary,
        codeRepository: project.repositoryUrl,
        programmingLanguage: project.language || project.technologies[0],
        image: imageUrl,
        ...(project.license ? { license: project.license } : {}),
        dateModified: project.updatedAt,
        isPartOf: { "@id": ENTITY_IDS.website },
        author: { "@id": ENTITY_IDS.person },
      }
    : {
        "@type": "CreativeWork",
        "@id": `${pageUrl}#work`,
        url: pageUrl,
        name: project.title,
        description: project.seoDescription || project.summary,
        about: project.businessDomain || project.category,
        image: imageUrl,
        dateModified: project.updatedAt,
        isPartOf: { "@id": ENTITY_IDS.website },
        author: { "@id": ENTITY_IDS.person },
      };

  return {
    "@context": "https://schema.org",
    "@graph": [
      projectNode,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: canonicalUrl("/") },
          {
            "@type": "ListItem",
            position: 2,
            name: "Projects",
            item: canonicalUrl("/projects/"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: project.title,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export function selectRelatedProjects(
  allProjects: Project[],
  current: Project,
  limit = 3
): Project[] {
  return allProjects
    .filter(
      (candidate) =>
        candidate.slug !== current.slug &&
        candidate.projectOrigin !== "professional" &&
        candidate.tier !== "archive" &&
        (candidate.category === current.category ||
          candidate.secondaryCategories?.includes(current.category) ||
          current.secondaryCategories?.includes(candidate.category))
    )
    .slice(0, limit);
}
