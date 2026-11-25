import type { Project } from "@/types";

export const curatedPrivateProjects: Project[] = [
  {
    id: "parfum-creator",
    slug: "parfum-creator",
    title: "ParfumCreator",
    subtitle: "Private Android Perfumery Formulation & On-Device AI Companion",
    seoTitle: "ParfumCreator — Fragrance Formulation Android Companion",
    summary:
      "Private Android perfumery companion exploring natural and fragrance-oil formulation workflows, calculators, and local on-device RAG.",
    description:
      "Personal Kotlin and Jetpack Compose project exploring structured fragrance formulation calculators, local retrieval-augmented notes, and on-device AI assistance. Maintained in a private repository; only a high-level summary is shared publicly.",
    category: "Android & Mobile Development",
    secondaryCategories: ["AI & Machine Learning"],
    technologies: ["Kotlin", "Jetpack Compose", "Local RAG", "On-Device AI", "Python"],
    screenshots: [],
    personalContribution:
      "Sole author designing the Kotlin mobile interface, formulation calculator workflows, and local retrieval pipeline.",
    projectStatus: "active",
    projectOrigin: "original",
    visibility: "private-summary",
    publicDisclosureApproved: true,
    tier: "featured",
    featured: true,
    editorialOrder: 4,
    updatedAt: "2026-10-18",
    language: "Kotlin",
    sourceReferences: [],
    problemStatement:
      "Independent fragrance formulation requires tracking ingredient ratios, dilution targets, and technical reference notes across physical bench sessions without relying on cloud tools.",
    proposedSolution:
      "Built an offline-capable Android formulation companion uniting ratio calculators, local note retrieval (RAG), and on-device AI assistance inside a private personal codebase.",
    securityConsiderations:
      "Source code, internal formulation data, and unreleased assets remain private and are omitted from this public portfolio.",
    resultsAndLimitations:
      "Private personal project; no public repository, binary release, or live demo is exposed.",
  },
];
