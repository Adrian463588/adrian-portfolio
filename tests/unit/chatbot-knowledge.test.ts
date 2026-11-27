import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { validateKnowledgePayload } from "../../scripts/validate-knowledge.mjs";
import { matchPresetFaq } from "@/server/chatbot/faq";
import {
  buildLocalFallbackAnswer,
  classifyChatIntent,
  retrieveKnowledgeContext,
} from "@/server/chatbot/retrieval";

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
    expect(raw).not.toMatch(/\(\+62\)|\+62[\s-]*8\d{7,}|08\d{8,}/);
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

  it("classifies work_experience & bilingual intents accurately without polluting answers with owner-named GitHub repos", () => {
    expect(classifyChatIntent("berikan apa saja pengalaman adrian ?")).toBe("work_experience");
    expect(classifyChatIntent("Adrian pernah kerja di mana?")).toBe("work_experience");
    expect(classifyChatIntent("Adrian sekarang sibuk apa?")).toBe("current_activities");
    expect(classifyChatIntent("Apa pengalaman Adrian di Berijalan?")).toBe("company_experience");
    expect(classifyChatIntent("Apa penelitian skripsinya?")).toBe("academic_research");
    expect(classifyChatIntent("Apa saja proyek Adrian?")).toBe("projects");
    expect(classifyChatIntent("What are Adrian's technical skills?")).toBe("technical_skills");

    // Open-ended Indonesian work question must invoke AI path when online (not bypass to brief canned greeting)
    expect(matchPresetFaq("berikan apa saja pengalaman adrian ?", "id")).toBeNull();

    // Retrieved work experience context must exclude Eksperimen SML / sb-go repos & raw pipe metadata
    const workCtx = retrieveKnowledgeContext("berikan apa saja pengalaman adrian ?", "id");
    const joined = workCtx.snippets.join("\n");
    expect(joined).toContain("Berijalan Techno Center");
    expect(joined).toContain("Qiscus");
    expect(joined).toContain("Tokopedia");
    expect(joined).not.toMatch(/Eksperimen SML|sb-go-batch|Summary:|Description:/i);

    // Local fallback answer reads naturally cleanly without exposing raw metadata pipes
    const naturalFallback = buildLocalFallbackAnswer("berikan apa saja pengalaman adrian ?", "id", "concise");
    expect(naturalFallback.text).toContain("Berijalan");
    expect(naturalFallback.text).not.toMatch(/Project:\s|Summary:\s|\|\sDescription:/i);

    // Follow-up question incorporates recent conversation context
    const followUp = retrieveKnowledgeContext("Di sana peran dan fokus QA-nya apa?", "id", [
      { role: "user", content: "Apa pengalaman Adrian di Berijalan?" },
      { role: "assistant", content: "Di Berijalan Techno Center, Adrian mengerjakan QA Automation." },
    ]);
    expect(followUp.snippets.join("\n")).toContain("Berijalan Techno Center");

    // Pronoun follow-up ("for it") pulls project entity from history and ranks AutomatePlus first
    const tauriFollowUp = retrieveKnowledgeContext("Why did he choose Tauri 2 for it?", "en", [
      { role: "user", content: "Tell me about AutomatePlus." },
      { role: "assistant", content: "AutomatePlus is a local-first desktop app built with Rust and Tauri 2." },
    ]);
    expect(tauriFollowUp.intent).toBe("projects");
    expect(tauriFollowUp.links[0]?.href).toBe("/projects/automate-plus/");
  });
});
