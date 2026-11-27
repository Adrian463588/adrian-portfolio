import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { validateKnowledgePayload } from "../../scripts/validate-knowledge.mjs";
import { matchPresetFaq } from "@/server/chatbot/faq";
import { retrieveKnowledgeContext } from "@/server/chatbot/retrieval";

describe("Ask Adrian knowledge base & bilingual FAQ/retrieval", () => {
  it("builds a schema-valid, PII-free canonical knowledge JSON covering all featured projects and experiences", () => {
    const filePath = path.resolve(process.cwd(), "knowledge/adrian-knowledge.json");
    expect(fs.existsSync(filePath)).toBe(true);
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw);

    const validation = validateKnowledgePayload(parsed, raw);
    expect(validation).toEqual({ valid: true, errors: [] });

    expect(parsed.projects.featuredSlugs).toEqual(
      expect.arrayContaining([
        "android-stress-detection",
        "quran-plus",
        "coffee-creator",
        "adzan-plus",
        "parfum-creator",
      ])
    );
    expect(raw).not.toContain("81215260921");
    expect(raw).not.toContain("PRIVATE OVERVIEW");
  });

  it("matches bilingual FAQ presets deterministically without invoking AI providers", () => {
    const greetId = matchPresetFaq("Halo!", "id");
    expect(greetId?.id).toBe("greeting");
    expect(greetId?.answer).toContain("Ask Adrian");

    const berijalanEn = matchPresetFaq("Tell me about his work at Berijalan ACC", "en");
    expect(berijalanEn?.id).toBe("berijalan");
    expect(berijalanEn?.answer).toContain("Archer Upgrade");
    expect(berijalanEn?.links.some((l) => l.href === "/projects/archer-upgrade/")).toBe(true);

    const parfumOpenEnded = matchPresetFaq(
      "Why did Adrian design ParfumCreator with local on-device RAG and formulation math?",
      "en"
    );
    expect(parfumOpenEnded).toBeNull();
  });

  it("retrieves relevant knowledge snippets for Indonesian & English synonyms and aliases", () => {
    const thesisCtx = retrieveKnowledgeContext("Ceritakan tentang skripsi PPG smartwatch di UGM", "id");
    expect(thesisCtx.snippets.join("\n")).toContain("Android Stress Detection");
    expect(thesisCtx.links.some((l) => l.href === "/projects/android-stress-detection/")).toBe(true);

    const k8sCtx = retrieveKnowledgeContext("What k8s and observability stack projects did he deploy?", "en");
    expect(k8sCtx.snippets.join("\n").toLowerCase()).toMatch(/kubernetes|prometheus|grafana|hpa/);
  });
});
