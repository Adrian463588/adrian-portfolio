import { describe, expect, it } from "vitest";
import { SITE_CONFIG } from "@/config/site.config";
import { certifications } from "@/data/certifications";
import { projects } from "@/data/projects";
import {
  buildHomeJsonLd,
  buildProjectDetailJsonLd,
  buildProjectsCollectionJsonLd,
  canonicalUrl,
  ENTITY_IDS,
  getLatestModifiedDate,
  selectRelatedProjects,
} from "@/lib/seo";
import { getPublishedResources } from "@/lib/seo-resources";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("SEO config, structured data, sitemap, and robots invariants", () => {
  it("uses explicit production host with verified Search Console token and public profiles", () => {
    expect(SITE_CONFIG.url).toBe("https://adriansyahabidin.vercel.app");
    expect(SITE_CONFIG.locale).toBe("en_US");
    expect(SITE_CONFIG.language).toBe("en");
    expect(SITE_CONFIG.verification.google).toBe(
      "P4O6B5PWmL-5E0i5XRbfkOSaPcop92urgS2lk-IAZ5s"
    );
    expect(Object.values(SITE_CONFIG.profiles)).toEqual([
      "https://github.com/Adrian463588",
      "https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/",
      "https://medium.com/@adriansyah1230",
    ]);
  });

  it("builds valid homepage @graph with WebSite, Person (only issued credentials), and ProfilePage", () => {
    const ld = buildHomeJsonLd(projects, certifications);
    const graph = ld["@graph"] as Array<Record<string, unknown>>;
    expect(graph).toHaveLength(3);

    const website = graph.find((n) => n["@type"] === "WebSite");
    const person = graph.find((n) => n["@type"] === "Person");
    const profilePage = graph.find((n) => n["@type"] === "ProfilePage");

    expect(website?.["@id"]).toBe(ENTITY_IDS.website);
    expect(website?.inLanguage).toBe("en");
    expect(person?.["@id"]).toBe(ENTITY_IDS.person);
    expect(person?.worksFor).toBeUndefined();
    expect(person?.email).toBeUndefined();
    expect(person?.sameAs).toEqual([
      SITE_CONFIG.profiles.github,
      SITE_CONFIG.profiles.linkedin,
      SITE_CONFIG.profiles.medium,
    ]);

    const creds = (person?.hasCredential as Array<{ name: string }>) || [];
    const credNames = creds.map((c) => c.name);
    expect(credNames).toContain("AWS Certified Cloud Practitioner");
    expect(credNames).toContain("CompTIA Security+");
    expect(credNames.some((n) => /Alibaba/i.test(n))).toBe(false);
    expect(credNames.some((n) => /Dicoding/i.test(n))).toBe(false);

    expect(profilePage?.["@id"]).toBe(ENTITY_IDS.profilePage);
    expect(profilePage?.mainEntity).toEqual({ "@id": ENTITY_IDS.person });
    expect(profilePage?.dateModified).toBe(getLatestModifiedDate(projects));
  });

  it("builds unique self-referencing project JSON-LD linked to stable Person & WebSite entities", () => {
    const seenUrls = new Set<string>();
    const seenIds = new Set<string>();
    const collectionLd = buildProjectsCollectionJsonLd(projects);
    expect(JSON.stringify(collectionLd)).toContain(ENTITY_IDS.person);
    expect(JSON.stringify(collectionLd)).toContain(ENTITY_IDS.website);

    for (const project of projects) {
      const url = canonicalUrl(`/projects/${project.slug}/`);
      expect(seenUrls.has(url)).toBe(false);
      seenUrls.add(url);

      const ld = buildProjectDetailJsonLd(project);
      const graph = ld["@graph"] as Array<Record<string, unknown>>;
      const mainNode = graph[0];
      expect(mainNode.url).toBe(url);
      expect(mainNode.author).toEqual({ "@id": ENTITY_IDS.person });
      expect(mainNode.isPartOf).toEqual({ "@id": ENTITY_IDS.website });
      expect(seenIds.has(String(mainNode["@id"]))).toBe(false);
      seenIds.add(String(mainNode["@id"]));

      if (project.repositoryUrl) {
        expect(mainNode["@type"]).toBe("SoftwareSourceCode");
        expect(mainNode.codeRepository).toBe(project.repositoryUrl);
      }

      const related = selectRelatedProjects(projects, project, 3);
      expect(related.every((r) => r.slug !== project.slug && r.projectOrigin !== "professional")).toBe(
        true
      );
    }
  });

  it("generates duplicate-free sitemap.xml entries on production origin and valid robots.txt", () => {
    const entries = sitemap();
    expect(entries).toHaveLength(projects.length + 3 + getPublishedResources().length);

    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const url of urls) {
      expect(url.startsWith("https://adriansyahabidin.vercel.app/")).toBe(true);
      expect(url.endsWith("/")).toBe(true);
      expect(url).not.toMatch(/[#?]|vercel\.app-|-git-|-plum|archer-upgrade|android-wear-stress-assistant/);
    }

    const robotsConfig = robots();
    expect(robotsConfig.sitemap).toBe("https://adriansyahabidin.vercel.app/sitemap.xml");
    expect(robotsConfig.rules).toEqual({ userAgent: "*", allow: "/" });
  });
});
