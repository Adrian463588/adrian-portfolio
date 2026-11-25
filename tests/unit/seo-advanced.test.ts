import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { projects } from "@/data/projects";
import { COMPETITORS } from "@/data/seo/competitors";
import { SEO_RESOURCES } from "@/data/seo/resources";
import { TOPIC_CLUSTERS } from "@/data/seo/topic-clusters";
import {
  calculateCoffeeBrewRatio,
  calculateCoffeeExtractionYield,
  calculatePerfumeDilution,
  scaleBrewSteps,
  solveTargetBatchMass,
} from "@/lib/calculators";
import {
  buildResourceDetailJsonLd,
  buildResourcesHubJsonLd,
  getPublishedResources,
  getResourceBySlug,
  getResourcesForProject,
  validateSeoCatalog,
} from "@/lib/seo-resources";

describe("V10 Advanced SEO catalog validation & anti-spam gate", () => {
  it("passes validation cleanly across all resources, competitors, clusters, and project references", () => {
    const summary = validateSeoCatalog({
      resources: SEO_RESOURCES,
      competitors: COMPETITORS,
      clusters: TOPIC_CLUSTERS,
      projects,
    });
    expect(summary.issues).toEqual([]);
    expect(summary.valid).toBe(true);
    expect(summary.publishedCount).toBe(7);
    expect(summary.gatedCount).toBe(2);
  });

  it("blocks draft and non-indexable pages from getPublishedResources, getResourceBySlug, and sitemap.xml", () => {
    const published = getPublishedResources();
    const publishedSlugs = published.map((r) => r.slug);
    expect(publishedSlugs).not.toContain("adzan-plus-vs-al-azan-offline-prayer");
    expect(publishedSlugs).not.toContain("parfum-creator-vs-perfumers-world-comparison");

    expect(getResourceBySlug("adzan-plus-vs-al-azan-offline-prayer")).toBeUndefined();
    expect(getResourceBySlug("parfum-creator-vs-perfumers-world-comparison")).toBeUndefined();

    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://adriansyahabidin.vercel.app/resources/");
    expect(urls).toContain(
      "https://adriansyahabidin.vercel.app/resources/coffee-brew-ratio-extraction-calculator/"
    );
    expect(urls.some((u) => u.includes("adzan-plus-vs-al-azan-offline-prayer"))).toBe(false);
    expect(urls.some((u) => u.includes("parfum-creator-vs-perfumers-world-comparison"))).toBe(false);
  });

  it("enforces bidirectional linking between project detail pages and engineering resources", () => {
    const coffeeLinks = getResourcesForProject("coffee-creator");
    expect(coffeeLinks.length).toBeGreaterThanOrEqual(2);

    const stressLinks = getResourcesForProject("android-stress-detection");
    expect(stressLinks.some((r) => r.slug === "ppg-watch-stress-detection-android-architecture")).toBe(
      true
    );
  });

  it("flags synthetic draft marked indexable or comparison missing disclosure", () => {
    const badResult = validateSeoCatalog({
      resources: [
        {
          ...SEO_RESOURCES[2],
          slug: "synthetic-invalid-comparison",
          status: "draft",
          indexable: true,
          disclosure: undefined,
        },
      ],
      projects,
    });
    expect(badResult.valid).toBe(false);
    expect(badResult.issues.some((i) => i.code === "UNPUBLISHED_MARKED_INDEXABLE")).toBe(true);
  });

  it("emits linked @graph JSON-LD with #person and #website IDs for resource hub & detail pages", () => {
    const hubJson = JSON.stringify(buildResourcesHubJsonLd());
    expect(hubJson).toContain('"@type":"CollectionPage"');
    expect(hubJson).toContain("https://adriansyahabidin.vercel.app/#person");
    expect(hubJson).toContain("https://adriansyahabidin.vercel.app/#website");

    const calc = getResourceBySlug("coffee-brew-ratio-extraction-calculator")!;
    const detailGraph = buildResourceDetailJsonLd(calc);
    const types = detailGraph["@graph"].map((n) => n["@type"]);
    expect(types).toContain("WebApplication");
    expect(types).toContain("BreadcrumbList");
    expect(types).toContain("FAQPage");
  });
});

describe("Verified domain calculators ported from Coffee Creator & ParfumCreator", () => {
  it("computes coffee brew ratios and cup-only EY% matching CoffeeScienceEngine invariants", () => {
    const ratio = calculateCoffeeBrewRatio(15, 250);
    expect(ratio).toEqual({
      ratioDenominator: 16.67,
      ratioString: "1:16.67",
      doseGrams: 15,
      waterGrams: 250,
    });

    const ey = calculateCoffeeExtractionYield({
      doseGrams: 15,
      beverageMassGrams: 218,
      measuredTdsPercent: 1.38,
      brewMethod: "Percolation",
    });
    expect("error" in ey).toBe(false);
    if (!("error" in ey)) {
      expect(ey.extractionYieldPercent).toBe(20.06);
      expect(ey.balanceBand).toBe("Balanced Target Range (18%–22%)");
    }

    const impossible = calculateCoffeeExtractionYield({
      doseGrams: 10,
      beverageMassGrams: 500,
      measuredTdsPercent: 5,
    });
    expect("error" in impossible).toBe(true);
  });

  it("scales pour steps via Hamilton-Hare apportionment summing exactly to target water", () => {
    const scaled = scaleBrewSteps(
      [
        { label: "Bloom", targetWaterGrams: 50 },
        { label: "Pour 1", targetWaterGrams: 70 },
        { label: "Pour 2", targetWaterGrams: 70 },
        { label: "Pour 3", targetWaterGrams: 60 },
      ],
      250,
      333.3,
      0.1
    );
    expect(Array.isArray(scaled)).toBe(true);
    if (Array.isArray(scaled)) {
      expect(scaled[scaled.length - 1].cumulativeMassGrams).toBe(333.3);
    }
  });

  it("computes perfume concentration band, heuristic SPL, and target batch split matching ParfumCreator", () => {
    const edp = calculatePerfumeDilution({
      fragranceGrams: 5.4,
      solventGrams: 24.6,
      topShare: 20,
      middleShare: 45,
      baseShare: 35,
    });
    expect("error" in edp).toBe(false);
    if (!("error" in edp)) {
      expect(edp.concentrationPct).toBe(18);
      expect(edp.concentrationType).toBe("Eau de Parfum (EDP)");
      // ((0.35 * 1.5) + (0.45 * 1.0) + (0.20 * 0.5)) / 3.0 = 1.075 / 3 = 0.35833 -> * 18 = 6.45
      expect(edp.splScore).toBe(6.45);
      expect(edp.splLabel).toBe("Subtle");
    }

    const batch = solveTargetBatchMass({ targetTotalGrams: 50, targetConcentrationPct: 22 });
    expect(batch).toEqual({ fragranceGrams: 11, solventGrams: 39 });
  });
});
