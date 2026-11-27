import fs from "node:fs";
import path from "node:path";

const filePath = path.join(process.cwd(), "knowledge", "adrian-knowledge.json");

export function validateKnowledgePayload(data, rawText) {
  const errors = [];

  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Knowledge JSON must be an object"] };
  }

  for (const key of [
    "schemaVersion",
    "lastUpdated",
    "persona",
    "profile",
    "education",
    "experience",
    "competencies",
    "certifications",
    "projects",
    "presetFaq",
    "allowlist",
  ]) {
    if (!(key in data)) {
      errors.push(`Missing top-level field: ${key}`);
    }
  }

  if (!Array.isArray(data.projects?.featuredSlugs) || data.projects.featuredSlugs.length < 5) {
    errors.push("Expected featured project slugs in knowledge JSON");
  }
  if (!Array.isArray(data.presetFaq) || data.presetFaq.length < 10) {
    errors.push("Expected at least 10 preset bilingual FAQs");
  }

  // Strict PII & secret leakage checks across serialized knowledge JSON
  const bannedPatterns = [
    { name: "phone_number_id", regex: /\(\+62\)|\+62[\s-]*8\d{7,}|08\d{8,}/ },
    { name: "groq_api_key", regex: /\bgsk_[A-Za-z0-9_-]{12,}/ },
    { name: "gemini_api_key", regex: /\b(?:AIzaSy|AQ\.Ab)[A-Za-z0-9_-]{12,}/ },
    { name: "openrouter_api_key", regex: /\bsk-or-v1-[A-Za-z0-9_-]{12,}/ },
    { name: "vercel_token", regex: /\bvck_[A-Za-z0-9_-]{12,}/ },
    { name: "birthdate_or_nik_value", regex: /"(?:birthDate|dateOfBirth|dob|nik|ktp|age|homeAddress|streetAddress)"\s*:/i },
  ];

  for (const check of bannedPatterns) {
    if (check.regex.test(rawText)) {
      errors.push(`Sensitive pattern detected (${check.name}) inside knowledge JSON`);
    }
  }

  // Validate allowlisted links have valid format
  for (const url of data.allowlist?.externalUrls ?? []) {
    if (!(url.startsWith("https://") || url.startsWith("mailto:"))) {
      errors.push(`Disallowed external URL protocol in allowlist: ${url}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

if (import.meta.url === `file:///${process.argv[1].replaceAll("\\", "/")}`) {
  if (!fs.existsSync(filePath)) {
    console.error("knowledge/adrian-knowledge.json does not exist. Run npm run knowledge:build first.");
    process.exit(1);
  }
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);
  const result = validateKnowledgePayload(parsed, raw);
  if (!result.valid) {
    console.error("Knowledge validation FAILED:\n" + result.errors.map((e) => ` - ${e}`).join("\n"));
    process.exit(1);
  }
  console.log(
    `Knowledge validation PASSED: schema v${parsed.schemaVersion}, ${parsed.projects.totalCount} projects, ${parsed.presetFaq.length} bilingual FAQs, 0 PII patterns.`
  );
}
