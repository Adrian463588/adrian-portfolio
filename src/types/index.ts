export type ProjectCategory =
  | "DevOps & DevSecOps"
  | "DevOps & CI/CD"
  | "QA & Test Automation"
  | "Financial Systems"
  | "Application Modernization"
  | "Backend Engineering"
  | "Frontend & Web Development"
  | "Android & Mobile Development"
  | "AI & Machine Learning"
  | "Desktop & Systems Engineering"
  | "Data Engineering & Analytics"
  | "Cybersecurity"
  | "Finance & FinTech"
  | "Research & Academic Projects"
  | "Experiments";

export type ProjectTier = "featured" | "catalog" | "archive";
export type ProjectOrigin =
  | "professional"
  | "original"
  | "fork"
  | "bootcamp"
  | "academic"
  | "experiment";
export type EnterpriseVisibility = "public-sanitized" | "confidential";
export type ProjectStatus =
  | "active"
  | "released"
  | "maintained"
  | "completed"
  | "prototype"
  | "archived";

export interface ConceptualFlowStep {
  label: string;
  detail: string;
}

export interface ProjectScreenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  description: string;
  category: ProjectCategory;
  secondaryCategories?: ProjectCategory[];
  technologies: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  releaseUrl?: string;
  screenshots: ProjectScreenshot[];
  personalContribution: string;
  upstreamCredit?: string;
  projectStatus: ProjectStatus;
  projectOrigin: ProjectOrigin;
  visibility?: EnterpriseVisibility;
  publicDisclosureApproved?: boolean;
  companyId?: string;
  associatedRoleIds?: string[];
  organization?: string;
  legalEntity?: string;
  corporateGroup?: string;
  businessDomain?: string;
  testingType?: string;
  testingTools?: string[];
  ciTools?: string[];
  applicationTechnologies?: string[];
  conceptualFlow?: ConceptualFlowStep[];
  tier: ProjectTier;
  featured: boolean;
  editorialOrder?: number;
  updatedAt: string;
  license?: string;
  language?: string;
  stars?: number;
  hasCiWorkflow?: boolean;
  sourceReferences: string[];
  problemStatement?: string;
  proposedSolution?: string;
  architectureSummary?: string;
  implementedFeatures?: string[];
  engineeringChallenges?: string[];
  testingStrategy?: string;
  securityConsiderations?: string;
  resultsAndLimitations?: string;
}

export interface GitHubRepoSnapshot {
  id: number;
  name: string;
  fullName: string;
  htmlUrl: string;
  description: string;
  homepage: string;
  language: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
  license: string | null;
  stars: number;
  defaultBranch: string;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
}

export interface GitHubSnapshotFile {
  username: string;
  syncedAt: string;
  count: number;
  repositories: GitHubRepoSnapshot[];
}

export interface ProjectOverride extends Partial<Omit<Project, "repositoryUrl">> {
  repoName: string;
  exclude?: boolean;
}

export interface ExperienceRole {
  id: string;
  title: string;
  employmentType: "freelance" | "bootcamp" | "internship";
  employmentLabel: string;
  dateRange: string;
  startDate: string;
  endDate: string;
  summary?: string;
}

export interface InformationalProjectEntry {
  id: string;
  title: string;
  scope?: string;
  description: string;
}

export interface ExperienceEntry {
  id: string;
  category: "professional" | "bootcamp" | "training";
  title: string;
  organization: string;
  legalEntity?: string;
  corporateGroup?: string;
  industry?: string;
  website?: string;
  location?: string;
  dateRange: string;
  startDate?: string;
  endDate?: string;
  summary?: string;
  roles?: ExperienceRole[];
  selectedProjects?: InformationalProjectEntry[];
  projectIds?: string[];
  bullets: string[];
  technologies?: string[];
  repoUrl?: string;
}

export interface CompetencyGroup {
  id: string;
  title: string;
  summary?: string;
  icon: string;
  skills: string[];
  relatedProjectSlugs: string[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  category: string;
  kind?: "certification" | "course";
  status: string;
  verificationNote?: string;
  verificationUrl?: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
  location?: string;
  notes?: string;
}

export interface LeadershipEntry {
  organization: string;
  role: string;
  period: string;
  bullets: string[];
}
