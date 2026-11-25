export type PublicationStatus = "draft" | "review" | "published" | "archived";

export type ResourceKind = "guide" | "comparison" | "alternative" | "tool";

export type EvidenceConfidence = "verified" | "partial" | "not-verified";

export interface CompetitorRecord {
  id: string;
  name: string;
  category:
    | "qa-automation"
    | "coffee-software"
    | "islamic-apps"
    | "perfumery-software"
    | "homebrewing-adjacent";
  officialUrl: string;
  repoUrl?: string;
  platforms: string[];
  pricingModel: string;
  offlineCapability: string;
  verifiedStrengths: string[];
  documentedTradeoffs: string[];
  reviewStatus: EvidenceConfidence;
  lastVerified: string;
  sources: string[];
}

export interface TopicCluster {
  id: string;
  name: string;
  summary: string;
  pillarSlug: string;
  projectSlugs: string[];
}

export type SearchIntent = "tool" | "comparison" | "alternative" | "architecture";

export interface KeywordClusterEntry {
  id: string;
  queryTheme: string;
  clusterId: string;
  intent: SearchIntent;
  priority: "P0" | "P1" | "P2";
  targetSlug: string;
  status: PublicationStatus;
}

export interface ResourceComparisonRow {
  criterion: string;
  values: Record<string, string>;
}

export interface ResourceComparisonMatrix {
  columns: Array<{ key: string; label: string; isFirstParty?: boolean }>;
  rows: ResourceComparisonRow[];
}

export interface ResourceSection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  codeSnippet?: {
    caption: string;
    language: string;
    code: string;
  };
}

export interface ResourceFaqItem {
  question: string;
  answer: string;
}

export interface SeoResourceEntry {
  slug: string;
  title: string;
  seoTitle: string;
  metaDescription: string;
  kind: ResourceKind;
  clusterId: string;
  status: PublicationStatus;
  indexable: boolean;
  reviewedAt: string;
  readingTimeMinutes: number;
  directAnswer: string;
  disclosure?: string;
  limitations?: string;
  toolId?: "coffee-extraction-calculator" | "perfume-concentration-calculator";
  comparisonMatrix?: ResourceComparisonMatrix;
  sections: ResourceSection[];
  faq: ResourceFaqItem[];
  relatedProjectSlugs: string[];
  relatedResourceSlugs: string[];
  competitorIds: string[];
  sources: string[];
}

export interface SeoValidationIssue {
  severity: "error" | "warning";
  code: string;
  slug: string;
  message: string;
}

export interface SeoValidationSummary {
  valid: boolean;
  publishedCount: number;
  gatedCount: number;
  issues: SeoValidationIssue[];
}
