import type {
  GitHubRepoSnapshot,
  Project,
  ProjectCategory,
  ProjectOverride,
  ProjectTier,
} from "@/types";

export interface ProjectFilterState {
  query: string;
  tier: "all" | ProjectTier;
  origin?: "all" | "professional" | "personal" | "academic" | "experiment";
  category: "all" | ProjectCategory;
  technology: "all" | string;
  sort: "editorial" | "recent";
}

export function getApprovedEnterpriseProjects<T extends { publicDisclosureApproved?: boolean }>(
  items: T[]
): T[] {
  return items.filter((item) => item.publicDisclosureApproved === true);
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export function slugifyRepoName(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isSafeHttpsUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

const BLOCKED_DEMO_HOSTS = [".sslip.io", "adrian-portfolio-plum.vercel.app"];

export function isVerifiedLiveDemoUrl(value?: string, repoUrl?: string): boolean {
  if (!value || !isSafeHttpsUrl(value)) return false;
  if (repoUrl && value.replace(/\/$/, "") === repoUrl.replace(/\/$/, "")) return false;
  try {
    const host = new URL(value).hostname.toLowerCase();
    if (host === "localhost" || host === "127.0.0.1") return false;
    return !BLOCKED_DEMO_HOSTS.some((blocked) => host === blocked || host.endsWith(blocked));
  } catch {
    return false;
  }
}

export const FLAGSHIP_PROJECT_SLUG = "android-stress-detection" as const;

export const FEATURED_PROJECT_ORDER = [
  "android-stress-detection",
  "quran-plus",
  "coffee-creator",
  "adzan-plus",
  "parfum-creator",
] as const;

export function getEditorialRank(project: Project): number {
  const pinnedIndex = FEATURED_PROJECT_ORDER.indexOf(
    project.slug as (typeof FEATURED_PROJECT_ORDER)[number]
  );
  if (pinnedIndex !== -1) {
    return pinnedIndex;
  }
  if (project.editorialOrder !== undefined) {
    return 100 + project.editorialOrder;
  }
  return Number.MAX_SAFE_INTEGER;
}

export function sortProjectsEditorial(items: Project[]): Project[] {
  const tierScore = (t: ProjectTier) => (t === "featured" ? 0 : t === "catalog" ? 1 : 2);
  return [...items].sort((a, b) => {
    const diff = tierScore(a.tier) - tierScore(b.tier);
    if (diff !== 0) return diff;
    const rankDiff = getEditorialRank(a) - getEditorialRank(b);
    if (rankDiff !== 0) return rankDiff;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

export interface ProjectActionLinks {
  detailUrl?: string;
  repoUrl?: string;
  demoUrl?: string;
  releaseUrl?: string;
}

/** Determine strictly verified navigation & external action links for a project. */
export function getProjectActions(project: Project): ProjectActionLinks {
  if (project.projectOrigin === "professional") {
    return {};
  }

  if (project.visibility === "private-summary") {
    return {
      detailUrl: project.slug ? `/projects/${project.slug}/` : undefined,
    };
  }

  const repoUrl =
    project.repositoryUrl && isSafeHttpsUrl(project.repositoryUrl)
      ? project.repositoryUrl
      : undefined;

  return {
    detailUrl: project.slug ? `/projects/${project.slug}/` : undefined,
    repoUrl,
    demoUrl: isVerifiedLiveDemoUrl(project.demoUrl, repoUrl) ? project.demoUrl : undefined,
    releaseUrl:
      project.releaseUrl && isSafeHttpsUrl(project.releaseUrl)
        ? project.releaseUrl
        : undefined,
  };
}

/** Validate unique IDs, slugs, URLs, and fork attribution invariants. */
export function validateProjects(items: Project[]): ValidationResult {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  for (const item of items) {
    if (!item.id || !/^[a-z0-9-]+$/.test(item.id)) {
      errors.push(`Invalid project id: "${item.id}"`);
    } else if (seenIds.has(item.id)) {
      errors.push(`Duplicate id: "${item.id}"`);
    }
    seenIds.add(item.id);

    if (!item.slug || !/^[a-z0-9-]+$/.test(item.slug)) {
      errors.push(`Invalid project slug: "${item.slug}"`);
    } else if (seenSlugs.has(item.slug)) {
      errors.push(`Duplicate slug: "${item.slug}"`);
    }
    seenSlugs.add(item.slug);

    if (item.repositoryUrl && !isSafeHttpsUrl(item.repositoryUrl)) {
      errors.push(`Project "${item.id}" repositoryUrl must use https://`);
    } else if (
      item.projectOrigin !== "professional" &&
      item.visibility !== "private-summary" &&
      !item.repositoryUrl
    ) {
      errors.push(`Project "${item.id}" repositoryUrl must use https://`);
    }
    if (item.projectOrigin === "professional" && item.publicDisclosureApproved !== true) {
      errors.push(`Professional project "${item.id}" must pass publicDisclosureApproved build gate`);
    }
    if (item.visibility === "private-summary") {
      if (item.publicDisclosureApproved !== true) {
        errors.push(`Private-summary project "${item.id}" must pass publicDisclosureApproved build gate`);
      }
      if (item.repositoryUrl || item.demoUrl || item.releaseUrl) {
        errors.push(`Private-summary project "${item.id}" must not expose repositoryUrl, demoUrl, or releaseUrl`);
      }
    }
    if (item.demoUrl && !isSafeHttpsUrl(item.demoUrl)) {
      errors.push(`Project "${item.id}" demoUrl must use https://`);
    }
    if (item.releaseUrl && !isSafeHttpsUrl(item.releaseUrl)) {
      errors.push(`Project "${item.id}" releaseUrl must use https://`);
    }
    if (!item.summary.trim() || !item.personalContribution.trim()) {
      errors.push(`Project "${item.id}" requires non-empty summary and personalContribution`);
    }
    if (item.projectOrigin === "fork" && !item.upstreamCredit) {
      errors.push(`Fork project "${item.id}" must declare upstreamCredit`);
    }
    if (item.visibility !== "private-summary" && item.sourceReferences.length === 0) {
      errors.push(`Project "${item.id}" must include at least one sourceReference`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function inferCategory(repo: GitHubRepoSnapshot): ProjectCategory {
  const haystack = `${repo.name} ${repo.description} ${repo.topics.join(" ")}`.toLowerCase();
  if (/cypress|selenium|appium|qa|e2e|performance-testing|automateplus/.test(haystack)) {
    return "QA & Test Automation";
  }
  if (/terraform|kubernetes|k8s|prometheus|grafana|devops|gitops|githubaction|sanbercode.*devops/.test(haystack)) {
    return "DevOps & DevSecOps";
  }
  if (/creditrisk|ledgerscope|fintech|afortunado/.test(haystack)) {
    return "Finance & FinTech";
  }
  if (/biosignal|stress|mlops|rag|llm|ai|sistempakar|machinelearning/.test(haystack)) {
    return "AI & Machine Learning";
  }
  if (repo.language === "Kotlin" || repo.language === "Dart" || /android|wear|compose/.test(haystack)) {
    return "Android & Mobile Development";
  }
  if (repo.language === "Go" || /api|backend|rails|laravel/.test(haystack)) {
    return "Backend Engineering";
  }
  if (repo.language === "Rust" || /tauri|windows|controller|screensharing/.test(haystack)) {
    return "Desktop & Systems Engineering";
  }
  if (repo.language === "TypeScript" || repo.language === "JavaScript") {
    return "Frontend & Web Development";
  }
  if (repo.fork) return "Experiments";
  return "Research & Academic Projects";
}

function buildDefaultProject(repo: GitHubRepoSnapshot): Project {
  const slug = slugifyRepoName(repo.name);
  const category = inferCategory(repo);
  const isArchiveCandidate =
    repo.fork ||
    repo.archived ||
    /^(sb-go-|railway-101|f-qae|tugas|sanbercode|463588|testing_githubaction|program-shortcut|projek_|cypress-101|login-automation|responsi-|senpro-|nearu|frontend-test|aroundworld|proyekakhir|afortunado|workflow-ci_smsl|eksperimen_sml|sistempakar|shiocalculator|signalintelligence|tactical-logistics|rails-cv-evaluator)/i.test(
      repo.name
    );

  const technologies = Array.from(
    new Set(
      [
        ...(repo.language ? [repo.language] : []),
        ...repo.topics.slice(0, 6).map((t) =>
          t
            .split("-")
            .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
            .join(" ")
        ),
      ].filter(Boolean)
    )
  );

  const summary =
    repo.description.trim() ||
    `Public ${repo.language || "software"} repository maintained under ${repo.fullName}.`;

  return {
    id: slug,
    slug,
    title: repo.name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim(),
    summary,
    description: summary,
    category,
    technologies: technologies.length > 0 ? technologies : ["Software Engineering"],
    repositoryUrl: repo.htmlUrl,
    demoUrl: isVerifiedLiveDemoUrl(repo.homepage, repo.htmlUrl) ? repo.homepage : undefined,
    screenshots: [],
    personalContribution: repo.fork
      ? "Forked repository containing Adrian Syah Abidin's branch modifications and verification experiments."
      : "Original public repository authored and maintained by Adrian Syah Abidin.",
    upstreamCredit: repo.fork ? "Forked from upstream public GitHub repository (see GitHub network graph)." : undefined,
    projectStatus: repo.archived ? "archived" : isArchiveCandidate ? "prototype" : "active",
    projectOrigin: repo.fork ? "fork" : isArchiveCandidate ? "academic" : "original",
    tier: isArchiveCandidate ? "archive" : "catalog",
    featured: false,
    updatedAt: repo.pushedAt.slice(0, 10),
    license: repo.license || undefined,
    language: repo.language || undefined,
    stars: repo.stars,
    sourceReferences: [repo.htmlUrl],
  };
}

/** Merge live GitHub snapshot metadata with curated editorial overrides safely. */
export function mergeGitHubAndOverrides(
  repos: GitHubRepoSnapshot[],
  overrides: Record<string, ProjectOverride>
): Project[] {
  const results: Project[] = [];

  for (const repo of repos) {
    const override = overrides[repo.name];
    if (override?.exclude) continue;

    const base = buildDefaultProject(repo);
    if (!override) {
      results.push(base);
      continue;
    }

    const { repoName: _ignored, exclude: _ignoredExclude, ...rest } = override;
    void _ignored;
    void _ignoredExclude;
    const merged: Project = {
      ...base,
      ...rest,
      id: rest.id || base.id,
      slug: rest.slug || base.slug,
      repositoryUrl: repo.htmlUrl,
      demoUrl: isVerifiedLiveDemoUrl(rest.demoUrl ?? base.demoUrl, repo.htmlUrl)
        ? rest.demoUrl ?? base.demoUrl
        : undefined,
      updatedAt: rest.updatedAt || base.updatedAt,
      license: rest.license ?? base.license,
      language: rest.language ?? base.language,
      stars: repo.stars,
      sourceReferences: Array.from(new Set([...(rest.sourceReferences || []), repo.htmlUrl])),
    };
    results.push(merged);
  }

  return sortProjectsEditorial(results);
}

export function getFeaturedProjects(items: Project[]): Project[] {
  return items
    .filter((p) => p.featured && p.tier === "featured" && p.projectOrigin !== "professional")
    .sort((a, b) => {
      const rankDiff = getEditorialRank(a) - getEditorialRank(b);
      if (rankDiff !== 0) return rankDiff;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
}

export function getEnterpriseProjects(items: Project[]): Project[] {
  return items
    .filter((p) => p.projectOrigin === "professional")
    .sort((a, b) => (a.editorialOrder ?? 999) - (b.editorialOrder ?? 999));
}

export function getProjectBySlug(items: Project[], slug: string): Project | undefined {
  return items.find((p) => p.slug === slug);
}

export function getAvailableCategories(items: Project[]): ProjectCategory[] {
  const counts = new Map<ProjectCategory, number>();
  for (const item of items) {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }
  return Array.from(counts.keys()).sort((a, b) => (counts.get(b) ?? 0) - (counts.get(a) ?? 0));
}

export function getTopTechnologies(items: Project[], limit = 18): string[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    for (const tech of item.technologies) {
      counts.set(tech, (counts.get(tech) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name]) => name);
}

export function filterProjects(items: Project[], state: ProjectFilterState): Project[] {
  const q = state.query.trim().toLowerCase();

  const filtered = items.filter((item) => {
    if (state.tier === "featured" && !item.featured) return false;
    if (state.tier === "catalog" && item.tier === "archive") return false;
    if (state.tier === "archive" && item.tier !== "archive") return false;

    if (state.origin && state.origin !== "all") {
      if (state.origin === "professional" && item.projectOrigin !== "professional") return false;
      if (
        state.origin === "personal" &&
        !["original", "fork", "bootcamp"].includes(item.projectOrigin)
      ) {
        return false;
      }
      if (state.origin === "academic" && item.projectOrigin !== "academic") return false;
      if (state.origin === "experiment" && item.projectOrigin !== "experiment") return false;
    }

    if (state.category !== "all") {
      const matchesCat =
        item.category === state.category ||
        (item.secondaryCategories?.includes(state.category) ?? false);
      if (!matchesCat) return false;
    }

    if (state.technology !== "all") {
      const target = state.technology.toLowerCase();
      if (!item.technologies.some((t) => t.toLowerCase() === target)) return false;
    }

    if (q) {
      const haystack = [
        item.title,
        item.subtitle || "",
        item.summary,
        item.description,
        item.category,
        ...item.technologies,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    return true;
  });

  if (state.sort === "recent") {
    return [...filtered].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  return sortProjectsEditorial(filtered);
}
