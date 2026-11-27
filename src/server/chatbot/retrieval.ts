import { getKnowledge, isAllowlistedUrl } from "./knowledge";
import type { ChatDetailLevel, ResolvedLanguage, VerifiedLink } from "./types";

const SYNONYMS: Record<string, string[]> = {
  skripsi: ["stress", "detection", "ppg", "ugm", "wear", "smartwatch"],
  thesis: ["stress", "detection", "ppg", "ugm", "wear", "smartwatch"],
  riset: ["research", "stress", "detection", "ppg", "ugm"],
  k8s: ["kubernetes", "hpa", "terraform", "devops", "gke"],
  devops: ["docker", "kubernetes", "terraform", "ansible", "prometheus", "grafana", "jenkins"],
  qa: ["quality", "cypress", "playwright", "selenium", "appium", "testing", "automateplus"],
  magang: ["intern", "qiscus", "tokopedia", "bitbybit", "berijalan"],
  kerja: ["experience", "berijalan", "qiscus", "tokopedia", "bitbybit", "freelance"],
  parfum: ["parfumcreator", "fragrance", "formulation", "kotlin"],
  kopi: ["coffee", "creator", "extraction", "brew"],
  kampus: ["ugm", "universitas", "gadjah", "mada", "kmteti", "night", "login"],
  kuliah: ["education", "ugm", "teknologi", "informasi"],
  sertifikat: ["certification", "aws", "comptia", "alibaba", "ehe"],
};

function tokenizeWithSynonyms(query: string): string[] {
  const baseTokens = query
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]+/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  const expanded = new Set<string>(baseTokens);
  for (const token of baseTokens) {
    const extra = SYNONYMS[token];
    if (extra) {
      for (const word of extra) expanded.add(word);
    }
  }
  return [...expanded];
}

function scoreHaystack(haystack: string, tokens: string[]): number {
  const lower = haystack.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (lower.includes(token)) {
      score += token.length >= 5 ? 3 : 2;
    }
  }
  return score;
}

export interface RetrievalContext {
  snippets: string[];
  links: VerifiedLink[];
}

export function retrieveKnowledgeContext(
  message: string,
  lang: ResolvedLanguage
): RetrievalContext {
  const k = getKnowledge();
  const tokens = tokenizeWithSynonyms(message);

  const candidates: Array<{ score: number; text: string; link?: VerifiedLink }> = [];

  for (const exp of k.experience) {
    const textParts = [
      `Experience: ${exp.title} at ${exp.organization}${exp.legalEntity ? ` (${exp.legalEntity})` : ""} — ${exp.dateRange}.`,
      ...(exp.bullets ?? []),
      ...(exp.roles ?? []).map((r: { title: string; dateRange: string; bullets?: string[]; technologies?: string[] }) => `Role ${r.title} (${r.dateRange}): ${(r.bullets ?? []).join(" ")} ${(r.technologies ?? []).join(" ")}`),
      ...(exp.selectedProjects ?? []).map((sp) => `Project ${sp.title}: ${sp.description}`),
      exp.extraContext ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    const score = scoreHaystack(textParts, tokens) + (exp.category === "professional" ? 2 : 0);
    if (score > 0) {
      candidates.push({
        score,
        text: textParts,
        link: {
          label: lang === "id" ? `Pengalaman (${exp.organization})` : `Experience (${exp.organization})`,
          href: "/#experience",
        },
      });
    }
  }

  for (const proj of k.projects.items) {
    const text = [
      `Project: ${proj.title} (${proj.category}, ${proj.projectOrigin}, ${proj.projectStatus})`,
      `Summary: ${proj.summary}`,
      `Description: ${proj.description}`,
      `Tech: ${proj.technologies.join(", ")}`,
      proj.architectureSummary ? `Architecture: ${proj.architectureSummary}` : "",
      proj.personalContribution ? `Contribution: ${proj.personalContribution}` : "",
      proj.caseStudyPath ? `Case Study URL: ${proj.caseStudyPath}` : "",
      proj.repositoryUrl ? `GitHub URL: ${proj.repositoryUrl}` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    const titleBoost = tokens.some((t) => proj.title.toLowerCase().includes(t) || proj.slug.includes(t)) ? 8 : 0;
    const score = scoreHaystack(text, tokens) + (proj.featured ? 2 : 0) + titleBoost;
    if (score > 0) {
      candidates.push({
        score,
        text,
        link: {
          label: `${proj.title} Case Study`,
          href: proj.caseStudyPath,
        },
      });
    }
  }

  for (const edu of k.education) {
    const text = `Education: ${edu.institution} — ${edu.degree} (${edu.period}, ${edu.location}). ${edu.notes ?? ""}`;
    const score = scoreHaystack(text, tokens);
    if (score > 0) {
      candidates.push({
        score,
        text,
        link: { label: lang === "id" ? "Pendidikan & Tentang" : "Education & About", href: "/#about" },
      });
    }
  }

  for (const cert of k.certifications) {
    const text = `Certification/Course: ${cert.name} (${cert.issuer}) — ${cert.status} [${cert.category}]`;
    const score = scoreHaystack(text, tokens);
    if (score > 0) {
      candidates.push({
        score,
        text,
        link: { label: lang === "id" ? "Sertifikasi" : "Certifications", href: "/#experience" },
      });
    }
  }

  for (const metric of k.cvEnrichments.verifiedBootcampMetrics) {
    const text = `${metric.organization} (${metric.period}): ${metric.summary}`;
    const score = scoreHaystack(text, tokens);
    if (score > 0) candidates.push({ score, text });
  }

  for (const course of k.cvEnrichments.additionalCourses) {
    const text = `Coursework: ${course.name} — ${course.organizer} (${course.period}): ${course.focus.join(", ")}`;
    const score = scoreHaystack(text, tokens);
    if (score > 0) candidates.push({ score, text });
  }

  candidates.sort((a, b) => b.score - a.score);
  const top = candidates.slice(0, 5);

  // Fallback baseline profile snippet when query uses uncommon phrasing
  if (top.length === 0) {
    top.push({
      score: 1,
      text: `Profile: ${k.profile.name}, ${k.profile.jobTitle}. ${k.profile.summary} Education: ${k.education[0]?.institution} (${k.education[0]?.degree}).`,
      link: { label: lang === "id" ? "Jelajahi Proyek" : "Explore Projects", href: "/projects/" },
    });
  }

  const seenHrefs = new Set<string>();
  const links: VerifiedLink[] = [];
  for (const item of top) {
    if (item.link && isAllowlistedUrl(item.link.href) && !seenHrefs.has(item.link.href)) {
      seenHrefs.add(item.link.href);
      links.push(item.link);
    }
    if (links.length >= 3) break;
  }

  return {
    snippets: top.map((c) => c.text),
    links,
  };
}

export function buildLocalFallbackAnswer(
  message: string,
  lang: ResolvedLanguage,
  detail: ChatDetailLevel
): { text: string; links: VerifiedLink[] } {
  const ctx = retrieveKnowledgeContext(message, lang);
  const limit = detail === "detailed" ? 3 : 2;
  const excerptLines = ctx.snippets.slice(0, limit).map((s) => `- ${s.slice(0, 260)}`);

  if (lang === "id") {
    return {
      text: [
        "Layanan AI eksternal sedang tidak tersedia, berikut informasi terverifikasi dari basis pengetahuan portofolio Adrian:",
        ...excerptLines,
        "Jika ada detail di luar cakupan data portofolio, silakan hubungi **adriansyah1230@gmail.com**.",
      ].join("\n"),
      links: ctx.links,
    };
  }

  return {
    text: [
      "External AI providers are currently unavailable, so here is grounded information from Adrian's verified portfolio knowledge:",
      ...excerptLines,
      "For details beyond published portfolio records, please contact **adriansyah1230@gmail.com**.",
    ].join("\n"),
    links: ctx.links,
  };
}
