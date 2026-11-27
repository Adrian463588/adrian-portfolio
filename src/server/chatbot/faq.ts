import { getKnowledge } from "./knowledge";
import type { ResolvedLanguage, VerifiedLink } from "./types";

export interface FaqMatchResult {
  id: string;
  answer: string;
  links: VerifiedLink[];
}

const DEEP_TECHNICAL_QUERY_RE =
  /\b(why\s+did|how\s+does|how\s+did|compare|comparison|difference|vs\b|versus|architect(?:ure)?|formula|equation|algorithm|mengapa|kenapa|bagaimana\s+cara|jelaskan\s+detail|perbandingan|perbedaan|dibanding)\b/i;

const SHORT_GREETING_RE =
  /^(?:halo+|hello+|hai+|hi|hey|selamat\s+(?:pagi|siang|sore|malam)|good\s+(?:morning|afternoon|evening)|assalamualaikum)(?:[\s,!.]*(?:ask\s+adrian|adrian|ai))?[\s!?.]*$/i;

function normalizeQuery(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s/-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchPresetFaq(
  message: string,
  lang: ResolvedLanguage
): FaqMatchResult | null {
  const normalized = normalizeQuery(message);
  if (!normalized) return null;

  const knowledge = getKnowledge();

  if (SHORT_GREETING_RE.test(message.trim())) {
    const greeting = knowledge.presetFaq.find((f) => f.id === "greeting");
    if (greeting) {
      return {
        id: greeting.id,
        answer: greeting.answer[lang],
        links: greeting.links.map((l) => ({ label: l.label[lang], href: l.href })),
      };
    }
  }

  // Deep comparative/technical questions should flow to retrieval + AI orchestrator.
  if (DEEP_TECHNICAL_QUERY_RE.test(message) && normalized.split(" ").length >= 6) {
    return null;
  }

  // Reject vague greetings combined with extra questions; avoid matching greeting inside longer text.
  let bestScore = 0;
  let bestEntry: (typeof knowledge.presetFaq)[number] | null = null;

  for (const faq of knowledge.presetFaq) {
    if (faq.id === "greeting") continue;
    let matches = 0;
    for (const phrase of faq.intents) {
      const pNorm = normalizeQuery(phrase);
      if (normalized.includes(pNorm)) {
        matches += pNorm.includes(" ") ? 3 : 2;
      }
    }
    if (matches > 0) {
      const score = matches * 10 + faq.priority;
      if (score > bestScore) {
        bestScore = score;
        bestEntry = faq;
      }
    }
  }

  if (!bestEntry || bestScore < 28) {
    return null;
  }

  return {
    id: bestEntry.id,
    answer: bestEntry.answer[lang],
    links: bestEntry.links.map((l) => ({ label: l.label[lang], href: l.href })),
  };
}
