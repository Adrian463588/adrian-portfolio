import { describe, expect, it } from "vitest";
import {
  filterProjects,
  getApprovedEnterpriseProjects,
  getAvailableCategories,
  getFeaturedProjects,
  getProjectActions,
  getProjectBySlug,
  isVerifiedLiveDemoUrl,
  validateProjects,
} from "@/lib/projects";
import { projects } from "@/data/projects";
import { enterpriseProjectsCatalog } from "@/data/enterprise-projects";

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

  it("curates 6 to 8 featured projects in Tier 1", () => {
    const featured = getFeaturedProjects(projects);
    expect(featured.length).toBeGreaterThanOrEqual(6);
    expect(featured.length).toBeLessThanOrEqual(8);
    for (const p of featured) {
      expect(p.tier).toBe("featured");
      expect(p.screenshots.length).toBeGreaterThan(0);
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
    expect(projects.length).toBe(70);
    expect(getProjectBySlug(projects, "archer-upgrade")).toBeUndefined();

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
