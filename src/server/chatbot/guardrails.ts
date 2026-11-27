import { isAllowlistedUrl } from "./knowledge";
import type { ResolvedLanguage } from "./types";

export interface GuardrailResult {
  blocked: boolean;
  category?: "pii" | "secrets" | "injection";
  reply: string;
}

const PII_RULES: RegExp[] = [
  /\b(?:nomor\s*(?:telepon|telp|hp|handphone|wa|whatsapp|kontak)|no\.?\s*(?:hp|wa|telp)|phone\s*number|mobile\s*number|whatsapp\s*number|call\s*(?:adrian|him))\b/i,
  /(?:\+62|08\d{7,})/,
  /\b(?:alamat\s*(?:rumah|lengkap|tinggal|pribadi|kos)|rumah\s*di\s*mana|home\s*address|street\s*address|residential\s*address|exact\s*address)\b/i,
  /\b(?:umur|usia|berapa\s*tahun|how\s*old|tanggal\s*lahir|tgl\s*lahir|tahun\s*lahir|date\s*of\s*birth|\bdob\b|birthday|born\s*(?:on|in))\b/i,
  /\b(?:nik|no\.?\s*ktp|nomor\s*ktp|ktp|npwp|passport\s*number|sim\s*number|national\s*id|ssn)\b/i,
  /\b(?:gaji|penghasilan|salary|compensation|take[\s-]?home\s*pay)\b/i,
];

const SECRETS_AND_CONFIDENTIAL_RULES: RegExp[] = [
  /\b(?:groq_api_key|gemini_api_key|openrouter_api_key|vercel_token|upstash_redis|api[_\s]?key|secret[_\s]?key|access[_\s]?token|process\.env|environment\s*variables?)\b/i,
  /\b(?:system\s*prompt|developer\s*prompt|hidden\s*instructions?)\b/i,
  /\b(?:database\s*schema|db\s*schema|sql\s*(?:dump|table|query)|uat\s*(?:url|endpoint|credential)|internal\s*(?:repo|repository|url)\s*berijalan|joint\s*financing\s*formula)\b/i,
  /\b(?:participant\s*(?:data|record|records)|data\s*(?:partisipan|responden)|raw\s*ppg\s*subject)\b/i,
];

const INJECTION_RULES: RegExp[] = [
  /\bignore\s+(?:all\s+)?(?:previous|prior|above)\s+instructions?\b/i,
  /\babaikan\s+(?:semua\s+)?instruksi\s+sebelumnya\b/i,
  /\bdisregard\s+(?:your|the)\s+(?:rules|system|guardrails)\b/i,
  /\bpretend\s+to\s+be\s+(?:developer|system|admin)\b/i,
  /\bjailbreak|dan\s+mode\b/i,
];

export function detectPromptInjection(message: string): boolean {
  return INJECTION_RULES.some((pattern) => pattern.test(message));
}

function buildRefusalMessage(
  category: "pii" | "secrets" | "injection",
  lang: ResolvedLanguage
): string {
  if (lang === "id") {
    if (category === "pii") {
      return "Maaf, demi privasi dan keamanan data pribadi, saya tidak dapat membagikan nomor telepon/WhatsApp, alamat rumah lengkap, umur/usia, tanggal lahir, NIK/identitas, atau informasi privat Adrian. Untuk komunikasi profesional, silakan hubungi melalui email publik **adriansyah1230@gmail.com** atau **LinkedIn**.";
    }
    return "Maaf, saya tidak dapat menampilkan kredensial API, variabel environment, instruksi internal sistem, data internal perusahaan, maupun data privat yang tidak disetujui untuk publikasi. Silakan hubungi **adriansyah1230@gmail.com** jika ada pertanyaan profesional resmi.";
  }

  if (category === "pii") {
    return "Sorry — to protect personal privacy, I cannot share Adrian's private phone/WhatsApp number, street/home address, age, date of birth, government ID numbers, or unapproved CV details. For professional inquiries, please reach out via **adriansyah1230@gmail.com** or **LinkedIn**.";
  }
  return "Sorry, I cannot disclose API keys, environment variables, internal system prompts, confidential employer schemas/URLs, or non-public data. Please contact **adriansyah1230@gmail.com** for authorized professional inquiries.";
}

export function checkSensitiveGuardrail(
  message: string,
  lang: ResolvedLanguage
): GuardrailResult {
  if (PII_RULES.some((re) => re.test(message))) {
    return { blocked: true, category: "pii", reply: buildRefusalMessage("pii", lang) };
  }
  if (SECRETS_AND_CONFIDENTIAL_RULES.some((re) => re.test(message))) {
    return { blocked: true, category: "secrets", reply: buildRefusalMessage("secrets", lang) };
  }
  if (detectPromptInjection(message)) {
    return { blocked: true, category: "injection", reply: buildRefusalMessage("injection", lang) };
  }
  return { blocked: false, reply: "" };
}

const SECRET_AND_PII_REDACTIONS: RegExp[] = [
  /\bgsk_[A-Za-z0-9_-]{12,}/g,
  /\b(?:AIzaSy|AQ\.Ab)[A-Za-z0-9_-]{12,}/g,
  /\bsk-or-v1-[A-Za-z0-9_-]{12,}/g,
  /\bvck_[A-Za-z0-9_-]{12,}/g,
  /(?:\(\+62\)|\+62)[\s-]?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,5}/g,
];

/**
 * Removes model reasoning tags, redacts any leaked key/phone patterns, and
 * strips non-allowlisted URLs before sending text back to the client.
 */
export function sanitizeAssistantOutput(rawText: string): { text: string; redacted: boolean } {
  let redacted = false;
  let cleaned = rawText.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

  for (const regex of SECRET_AND_PII_REDACTIONS) {
    cleaned = cleaned.replace(regex, () => {
      redacted = true;
      return "[REDACTED]";
    });
  }

  // Filter Markdown links [label](url)
  cleaned = cleaned.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g, (full, label, href) => {
    if (isAllowlistedUrl(href)) return full;
    redacted = true;
    return label;
  });

  // Filter bare external URLs outside Markdown link syntax
  cleaned = cleaned.replace(/(^|[\s(])(https?:\/\/[^\s)<>]+)/g, (full, prefix, url) => {
    const cleanUrl = url.replace(/[.,;!?]+$/, "");
    if (isAllowlistedUrl(cleanUrl)) return full;
    redacted = true;
    return `${prefix}[link removed]`;
  });

  return { text: cleaned, redacted };
}

/**
 * Redacts secrets/PII inside individual streamed chunks without trimming spaces.
 */
export function redactStreamingChunk(delta: string): string {
  let out = delta;
  for (const regex of SECRET_AND_PII_REDACTIONS) {
    out = out.replace(regex, "[REDACTED]");
  }
  return out;
}
