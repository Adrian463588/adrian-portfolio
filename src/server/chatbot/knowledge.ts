import rawKnowledge from "../../../knowledge/adrian-knowledge.json";
import type { ChatLanguage, ResolvedLanguage } from "./types";

export interface BilingualText {
  id: string;
  en: string;
}

export interface PresetFaqEntry {
  id: string;
  intents: string[];
  priority: number;
  answer: BilingualText;
  links: Array<{ label: BilingualText; href: string }>;
}

export type AdrianKnowledge = typeof rawKnowledge & {
  presetFaq: PresetFaqEntry[];
};

const knowledge = rawKnowledge as AdrianKnowledge;

const allowedInternalSet = new Set(knowledge.allowlist.internalPaths);
const allowedExternalSet = new Set(knowledge.allowlist.externalUrls);

export function getKnowledge(): AdrianKnowledge {
  return knowledge;
}

export function isAllowlistedUrl(href: string): boolean {
  const normalized = href.trim();
  if (normalized.startsWith("/")) {
    return allowedInternalSet.has(normalized) || normalized === "/";
  }
  return allowedExternalSet.has(normalized);
}

const INDONESIAN_MARKERS =
  /\b(apa|siapa|bagaimana|dimana|di\s+mana|kapan|berapa|kenapa|mengapa|apakah|tolong|jelaskan|ceritakan|saya|aku|anda|kamu|kerjanya|proyeknya|pengalaman|keahlian|pendidikan|sertifikasi|kontak|magang|kuliah|skripsi|umur|tanggal\s+lahir|alamat|nomor|halo|hai|selamat)\b/i;

export function resolveVisitorLanguage(
  message: string,
  preference: ChatLanguage
): ResolvedLanguage {
  if (preference === "id" || preference === "en") {
    return preference;
  }
  return INDONESIAN_MARKERS.test(message) ? "id" : "en";
}
