# Project Data Schema (`src/types/index.ts`)

## 1. Project Categories
- `DevOps & DevSecOps`
- `QA & Test Automation`
- `Backend Engineering`
- `Frontend & Web Development`
- `Android & Mobile Development`
- `AI & Machine Learning`
- `Desktop & Systems Engineering`
- `Data Engineering & Analytics`
- `Cybersecurity`
- `Finance & FinTech`
- `Research & Academic Projects`
- `Experiments`

*(Only categories with >= 1 verified eligible project are rendered in filter controls.)*

## 2. Tiers & Origins
- `tier`: `"featured"` (Tier 1, 8 projects) | `"catalog"` (Tier 2, eligible public repos) | `"archive"` (Tier 3, forks, bootcamps, academic labs, early prototypes)
- `projectOrigin`: `"original"` | `"fork"` | `"bootcamp"` | `"academic"` | `"experiment"`
- `projectStatus`: `"active"` | `"released"` | `"maintained"` | `"completed"` | `"prototype"` | `"archived"`

## 3. `Project` Interface
```ts
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
  repositoryUrl: string;
  demoUrl?: string;
  releaseUrl?: string;
  screenshots: ProjectScreenshot[];
  personalContribution: string;
  upstreamCredit?: string;
  projectStatus: ProjectStatus;
  projectOrigin: ProjectOrigin;
  tier: ProjectTier;
  featured: boolean;
  editorialOrder?: number;
  updatedAt: string;
  license?: string;
  language?: string;
  stars?: number;
  hasCiWorkflow?: boolean;
  sourceReferences: string[];
  // Optional case-study fields (omitted when unavailable — never rendered empty)
  problemStatement?: string;
  proposedSolution?: string;
  architectureSummary?: string;
  implementedFeatures?: string[];
  engineeringChallenges?: string[];
  testingStrategy?: string;
  securityConsiderations?: string;
  resultsAndLimitations?: string;
}
```

## 4. Validation Invariants (`validateProjects`)
- `id` and `slug` are non-empty, URL-safe lowercase (`^[a-z0-9-]+$`), and strictly unique across all projects.
- `repositoryUrl` (when defined) and optional `demoUrl` / `releaseUrl` use valid `https://` URLs. Enterprise engagements (`projectOrigin === "professional"`) omit `repositoryUrl` when no public source repository exists.
- `featured === true` projects must have `tier === "featured"` and a curated `summary`, `personalContribution`, and `sourceReferences.length > 0`.
- `projectOrigin === "fork"` projects must populate `upstreamCredit` or explicitly distinguish personal work from upstream in `personalContribution`.

## 5. V2 Grouped Experience & Enterprise Schema Extensions
- `ExperienceEntry` supports grouped `roles: ExperienceRole[]` (`title`, `employmentType`, `dateRange`, `startDate`, `endDate`, optional `description`), optional `legalEntity`, `corporateGroup`, `industry`, `website`, `summary`, and `projectIds` linking directly to enterprise case studies.
- `EnterpriseProjectRecord` in `src/data/enterprise-projects.ts` requires `publicDisclosureApproved: boolean`, `visibility: "public-sanitized"`, `companyId`, `associatedRoleIds`, `businessDomain`, `testingType`, `testingTools`, `ciTools`, `applicationTechnologies`, and optional `conceptualFlow` diagram steps. Any record with `publicDisclosureApproved !== true` is excluded at build time via `getApprovedEnterpriseProjects`.
