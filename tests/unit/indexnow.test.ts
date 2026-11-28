import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { SITE_CONFIG } from "@/config/site.config";
import {
  buildIndexNowPayload,
  chunkUrls,
  normalizeAndFilterUrls,
  parseSitemapUrls,
  shouldTriggerIndexNowForFiles,
} from "../../scripts/submit-indexnow.mjs";

describe("IndexNow verification & submission helpers", () => {
  it("stores the public IndexNow verification file matching SITE_CONFIG.verification.indexNow", () => {
    const key = SITE_CONFIG.verification.indexNow;
    expect(key).toBe("66f0d196e94c432d91b2984a9156e7fa");

    const filePath = path.resolve(process.cwd(), "public", `${key}.txt`);
    expect(fs.existsSync(filePath)).toBe(true);
    expect(fs.readFileSync(filePath, "utf8").trim()).toBe(key);
  });

  it("parses <loc> entries from sitemap.xml cleanly", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>https://adriansyahabidin.vercel.app/</loc></url>
        <url><loc>https://adriansyahabidin.vercel.app/projects/?tab=all&amp;v=1</loc></url>
      </urlset>`;
    expect(parseSitemapUrls(xml)).toEqual([
      "https://adriansyahabidin.vercel.app/",
      "https://adriansyahabidin.vercel.app/projects/?tab=all&v=1",
    ]);
  });

  it("normalizes relative paths, strips fragments, filters foreign hosts, and deduplicates URLs", () => {
    const urls = normalizeAndFilterUrls([
      "/",
      "https://adriansyahabidin.vercel.app/",
      "/projects/quran-plus/#overview",
      "https://adriansyahabidin.vercel.app/projects/quran-plus/",
      "https://evil.example.com/phish",
      "http://adriansyahabidin.vercel.app/insecure",
      "javascript:alert(1)",
      "/deleted-page/",
    ]);

    expect(urls).toEqual([
      "https://adriansyahabidin.vercel.app/",
      "https://adriansyahabidin.vercel.app/projects/quran-plus/",
      "https://adriansyahabidin.vercel.app/deleted-page/",
    ]);
  });

  it("chunks URL lists into batches of at most 10,000 URLs and builds valid IndexNow payloads", () => {
    const many = Array.from({ length: 10005 }, (_, i) => `https://adriansyahabidin.vercel.app/p/${i}/`);
    const batches = chunkUrls(many, 10000);
    expect(batches).toHaveLength(2);
    expect(batches[0]).toHaveLength(10000);
    expect(batches[1]).toHaveLength(5);

    const payload = buildIndexNowPayload({
      key: "66f0d196e94c432d91b2984a9156e7fa",
      urlList: batches[1],
    });
    expect(payload).toEqual({
      host: "adriansyahabidin.vercel.app",
      key: "66f0d196e94c432d91b2984a9156e7fa",
      keyLocation: "https://adriansyahabidin.vercel.app/66f0d196e94c432d91b2984a9156e7fa.txt",
      urlList: batches[1],
    });
  });

  it("triggers CI IndexNow submission only when public site/content files change", () => {
    expect(
      shouldTriggerIndexNowForFiles([
        "README.md",
        "docs/notes.md",
        "tests/unit/seo.test.ts",
        ".github/workflows/indexnow.yml",
      ])
    ).toBe(false);

    expect(
      shouldTriggerIndexNowForFiles(["public/66f0d196e94c432d91b2984a9156e7fa.txt"])
    ).toBe(true);

    expect(
      shouldTriggerIndexNowForFiles(["src/data/project-overrides.ts", "tests/unit/projects.test.ts"])
    ).toBe(true);
  });
});
