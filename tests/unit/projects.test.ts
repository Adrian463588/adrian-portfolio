import { describe, expect, it } from "vitest";
import {
  FEATURED_PROJECT_ORDER,
  filterProjects,
  getApprovedEnterpriseProjects,
  getAvailableCategories,
  getFeaturedProjects,
  getProjectActions,
  getProjectBySlug,
  isVerifiedLiveDemoUrl,
  mergeGitHubAndOverrides,
  validateProjects,
} from "@/lib/projects";
import { competencies } from "@/data/competencies";
import githubSnapshot from "@/data/github-repositories.json";
import { projectOverrides } from "@/data/project-overrides";
import { projects } from "@/data/projects";
import { enterpriseProjectsCatalog } from "@/data/enterprise-projects";
import type { GitHubSnapshotFile } from "@/types";

describe("projects catalog & domain logic", () => {
  it("contains valid, unique ids, slugs, and https URLs", () => {
    const result = validateProjects(projects);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects duplicate ids, duplicate slugs, and invalid urls", () => {
    const sample = projects.slice(0, 2);
    const duplicated = [
      sample[0],
      { ...sample[1], id: sample[0].id, slug: sample[0].slug, repositoryUrl: "http://insecure.local" },
    ];
    const result = validateProjects(duplicated);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => /duplicate id/i.test(e))).toBe(true);
    expect(result.errors.some((e) => /duplicate slug/i.test(e))).toBe(true);
    expect(result.errors.some((e) => /https/i.test(e))).toBe(true);
  });

  it("pins Android Stress Detection as flagship followed by exact featured order and integrates public ParfumCreator", () => {
    const featured = getFeaturedProjects(projects);
    expect(featured.length).toBeGreaterThanOrEqual(5);
    expect(featured.slice(0, 5).map((p) => p.slug)).toEqual([...FEATURED_PROJECT_ORDER]);
    expect(featured[0].flagship).toBe(true);

    for (const p of featured) {
      expect(p.tier).toBe("featured");
      expect(p.screenshots.length).toBeGreaterThan(0);
    }

    const parfumMatches = projects.filter((p) => p.slug === "parfum-creator");
    expect(parfumMatches).toHaveLength(1);
    const parfum = parfumMatches[0];
    expect(parfum.visibility).not.toBe("private-summary");
    expect(parfum.repositoryUrl).toBe("https://github.com/Adrian463588/ParfumCreator");
    expect(parfum.screenshots.length).toBe(4);
    expect(getProjectActions(parfum)).toEqual({
      detailUrl: "/projects/parfum-creator/",
      repoUrl: "https://github.com/Adrian463588/ParfumCreator",
      releaseUrl: "https://github.com/Adrian463588/ParfumCreator/releases/tag/v1.3.1",
    });
  });

  it("preserves explicit featured ordering across randomized GitHub sync snapshots", () => {
    const snapshot = githubSnapshot as GitHubSnapshotFile;
    const reversed = [...snapshot.repositories]
      .reverse()
      .map((repo, idx) => ({
        ...repo,
        stars: idx * 5,
        pushedAt: `2020-01-${String((idx % 28) + 1).padStart(2, "0")}T00:00:00Z`,
      }));
    const remerged = mergeGitHubAndOverrides(reversed, projectOverrides);
    const featuredPublicSlugs = getFeaturedProjects(remerged)
      .slice(0, 5)
      .map((p) => p.slug);
    expect(featuredPublicSlugs).toEqual([...FEATURED_PROJECT_ORDER]);
  });

  it("resolves every competency relatedProjectSlugs target cleanly", () => {
    for (const group of competencies) {
      for (const slug of group.relatedProjectSlugs) {
        expect(
          getProjectBySlug(projects, slug),
          `Competency "${group.id}" references missing slug "${slug}"`
        ).toBeDefined();
      }
    }
  });

  it("distinguishes fork contributions explicitly (HeartRateMonitor)", () => {
    const hrm = getProjectBySlug(projects, "heart-rate-monitor");
    expect(hrm).toBeDefined();
    expect(hrm?.projectOrigin).toBe("fork");
    expect(hrm?.upstreamCredit).toBeTruthy();
    expect(hrm?.personalContribution.length).toBeGreaterThan(20);
  });

  it("filters by query, category, technology, tier, and sorts cleanly", () => {
    const qaMatches = filterProjects(projects, {
      query: "cypress",
      tier: "all",
      category: "all",
      technology: "all",
      sort: "recent",
    });
    expect(qaMatches.length).toBeGreaterThan(0);
    expect(
      qaMatches.every(
        (p) =>
          p.title.toLowerCase().includes("cypress") ||
          p.summary.toLowerCase().includes("cypress") ||
          p.description.toLowerCase().includes("cypress") ||
          p.technologies.some((t) => t.toLowerCase().includes("cypress"))
      )
    ).toBe(true);

    const archiveOnly = filterProjects(projects, {
      tier: "archive",
      query: "",
      category: "all",
      technology: "all",
      sort: "editorial",
    });
    expect(archiveOnly.length).toBeGreaterThan(0);
    expect(archiveOnly.every((p) => p.tier === "archive")).toBe(true);

    const empty = filterProjects(projects, {
      query: "nonexistent-xyz-999",
      tier: "all",
      category: "all",
      technology: "all",
      sort: "editorial",
    });
    expect(empty).toEqual([]);
  });

  it("only returns categories that have at least one verified project", () => {
    const cats = getAvailableCategories(projects);
    expect(cats.length).toBeGreaterThan(0);
    for (const cat of cats) {
      expect(projects.some((p) => p.category === cat)).toBe(true);
    }
  });

  it("keeps internal Berijalan enterprise cases out of the public projects catalog and strips dead ephemeral demos", () => {
    expect(projects.every((p) => p.projectOrigin !== "professional")).toBe(true);
    expect(projects.length).toBe(71);
    expect(getProjectBySlug(projects, "archer-upgrade")).toBeUndefined();
    expect(getProjectBySlug(projects, "android-wear-stress-assistant")).toBeUndefined();
    expect(getProjectBySlug(projects, "android-stress-detection")).toBeDefined();

    const techno = getProjectBySlug(projects, "techno-loyalty-program");
    expect(techno).toBeDefined();
    expect(techno?.demoUrl).toBeUndefined();
    expect(getProjectActions(techno!).demoUrl).toBeUndefined();

    const hsk = getProjectBySlug(projects, "hsk1-vocabulary-master");
    expect(getProjectActions(hsk!).demoUrl).toBe("https://hsk1vocab.edgeone.dev/");
    expect(isVerifiedLiveDemoUrl("https://tmp.34.128.73.127.sslip.io/")).toBe(false);

    const enterpriseActions = getProjectActions(enterpriseProjectsCatalog[0]);
    expect(enterpriseActions).toEqual({});
  });

  it("strictly filters unapproved enterprise items at build time via publicDisclosureApproved", () => {
    const sampleUnapproved = [
      ...enterpriseProjectsCatalog,
      {
        ...enterpriseProjectsCatalog[0],
        id: "internal-secret-project",
        slug: "internal-secret-project",
        title: "Internal Secret Project",
        publicDisclosureApproved: false,
      },
    ];
    const filtered = getApprovedEnterpriseProjects(sampleUnapproved);
    expect(filtered.some((p) => p.id === "internal-secret-project")).toBe(false);
    expect(filtered).toHaveLength(3);
  });
});
