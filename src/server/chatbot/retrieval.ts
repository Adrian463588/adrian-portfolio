import { getKnowledge, isAllowlistedUrl } from "./knowledge";
import type { ChatDetailLevel, ChatHistoryMessage, ResolvedLanguage, VerifiedLink } from "./types";

export type ChatIntent =
  | "greeting"
  | "company_experience"
  | "work_experience"
  | "current_activities"
  | "academic_research"
  | "technical_skills"
  | "projects"
  | "education"
  | "certifications"
  | "contact"
  | "general";

const OWNER_AND_STOP_WORDS = new Set([
  "adrian",
  "syah",
  "abidin",
  "463588",
  "apa",
  "apakah",
  "siapa",
  "mana",
  "dimana",
  "kapan",
  "berapa",
  "kenapa",
  "mengapa",
  "bagaimana",
  "tolong",
  "berikan",
  "sebutkan",
  "jelaskan",
  "ceritakan",
  "kasih",
  "tau",
  "tahu",
  "saja",
  "aja",
  "yang",
  "dan",
  "atau",
  "di",
  "ke",
  "dari",
  "untuk",
  "dengan",
  "pada",
  "tentang",
  "mengenai",
  "pernah",
  "punya",
  "milik",
  "nya",
  "dia",
  "ia",
  "what",
  "who",
  "where",
  "when",
  "why",
  "how",
  "tell",
  "give",
  "list",
  "show",
  "describe",
  "explain",
  "about",
  "does",
  "did",
  "has",
  "have",
  "are",
  "was",
  "were",
  "his",
  "the",
  "and",
  "for",
  "with",
  "all",
  "any",
  "it",
  "its",
  "this",
  "that",
  "chose",
  "choose",
  "use",
  "used",
  "using",
  "build",
  "built",
  "make",
  "made",
]);

const SYNONYMS: Record<string, string[]> = {
  skripsi: ["stress", "detection", "ppg", "ugm", "wear", "smartwatch"],
  thesis: ["stress", "detection", "ppg", "ugm", "wear", "smartwatch"],
  riset: ["research", "stress", "detection", "ppg", "ugm"],
  penelitian: ["research", "stress", "detection", "ppg", "ugm"],
  k8s: ["kubernetes", "hpa", "terraform", "devops", "gke"],
  devops: ["docker", "kubernetes", "terraform", "ansible", "prometheus", "grafana", "jenkins"],
  qa: ["quality", "cypress", "playwright", "selenium", "appium", "testing", "automateplus"],
  magang: ["intern", "qiscus", "tokopedia", "bitbybit", "berijalan"],
  pengalaman: ["experience", "berijalan", "qiscus", "tokopedia", "bitbybit", "freelance"],
  kerja: ["experience", "berijalan", "qiscus", "tokopedia", "bitbybit", "freelance"],
  parfum: ["parfumcreator", "fragrance", "formulation", "kotlin"],
  kopi: ["coffee", "creator", "extraction", "brew"],
  kampus: ["ugm", "universitas", "gadjah", "mada", "kmteti", "night", "login"],
  kuliah: ["education", "ugm", "teknologi", "informasi"],
  sertifikat: ["certification", "aws", "comptia", "alibaba", "ehe"],
};

const FOLLOWUP_HINT_RE =
  /\b(di\s*sana|disana|di\s*situ|itu|tersebut|detailnya|perannya|toolsnya|there|it|its|this|that|that\s+(?:role|company|project|app|tool|stack)|more\s+about\s+that)\b/i;

export function classifyChatIntent(
  message: string,
  history: ChatHistoryMessage[] = []
): ChatIntent {
  const q = message.toLowerCase();

  if (/\b(berijalan|acc\b|astra\s+credit|unipaas|magic\s*xpa|archer|stnk|joint\s*financ|qiscus|tokopedia|tiktok\s*shop|bytedance|bitbybit|favo\s*group|paragon)\b/i.test(q)) {
    return "company_experience";
  }
  if (/\b(sibuk\s*apa|kegiatan\s*(?:sekarang|terkini|saat\s*ini)|aktivitas\s*(?:sekarang|saat\s*ini)|sedang\s*(?:mengerjakan|melakukan)|currently\s+(?:doing|working)|current\s+activit|what\s+is\s+(?:he|adrian)\s+doing\s+now)\b/i.test(q)) {
    return "current_activities";
  }
  if (/\b(skripsi|thesis|penelitian|riset|ppg|stress\s*detection|deteksi\s*stres|biosignal)\b/i.test(q)) {
    return "academic_research";
  }
  if (/\b(pengalaman(?:\s+kerja)?|pernah\s+kerja|kerja\s+di\s*mana|riwayat\s+(?:kerja|karier)|magang|internship|intern|work\s+experience|employment|career\s+history|job\s+history|freelance)\b/i.test(q)) {
    return "work_experience";
  }
  if (/\b(keahlian|kemampuan\s+teknis|tech\s*stack|technical\s*skills?|skills?\b|teknologi|bahasa\s+pemrograman|framework)\b/i.test(q)) {
    return "technical_skills";
  }
  if (/\b(pendidikan|kuliah|lulusan|jurusan|kampus|education|degree|university|ugm|sma)\b/i.test(q)) {
    return "education";
  }
  if (/\b(sertifikasi|sertifikat|certifications?|certificates?|credential|aws\b|comptia|alibaba|ec-council|ehe)\b/i.test(q)) {
    return "certifications";
  }
  if (/\b(kontak|contact|email|linkedin|github|rekrut|hire|hiring|cv\b|resume)\b/i.test(q)) {
    return "contact";
  }
  if (/\b(proyek|projects?|portfolio|aplikasi|quranplus|coffee\s*creator|adzanplus|parfumcreator|automateplus|wrath)\b/i.test(q)) {
    return "projects";
  }

  if (history.length > 0 && FOLLOWUP_HINT_RE.test(q)) {
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].role === "user") {
        const prevIntent = classifyChatIntent(history[i].content, []);
        if (prevIntent !== "general") return prevIntent;
      }
    }
  }

  return "general";
}

function tokenizeWithSynonyms(query: string, history: ChatHistoryMessage[] = []): string[] {
  const combinedSource =
    history.length > 0 && (FOLLOWUP_HINT_RE.test(query) || query.trim().split(/\s+/).length <= 5)
      ? `${query} ${history.slice(-2).map((h) => h.content).join(" ")}`
      : query;

  const baseTokens = combinedSource
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]+/gu, " ")
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !OWNER_AND_STOP_WORDS.has(t));

  const expanded = new Set<string>(baseTokens);
  for (const token of baseTokens) {
    const extra = SYNONYMS[token];
    if (extra) {
      for (const word of extra) expanded.add(word);
    }
  }
  return [...expanded];
}

function containsToken(lowerText: string, token: string): boolean {
  if (token.length <= 3) {
    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(?:^|[^\\p{L}\\p{N}])${escaped}(?:$|[^\\p{L}\\p{N}])`, "u").test(lowerText);
  }
  return lowerText.includes(token);
}

function scoreHaystack(haystack: string, tokens: string[]): number {
  const lower = haystack.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (containsToken(lower, token)) {
      score += token.length >= 5 ? 3 : 2;
    }
  }
  return score;
}

export interface RetrievalContext {
  intent: ChatIntent;
  snippets: string[];
  links: VerifiedLink[];
}

export function retrieveKnowledgeContext(
  message: string,
  lang: ResolvedLanguage,
  history: ChatHistoryMessage[] = []
): RetrievalContext {
  const k = getKnowledge();
  const intent = classifyChatIntent(message, history);
  const tokens = tokenizeWithSynonyms(message, history);

  const candidates: Array<{ score: number; text: string; link?: VerifiedLink }> = [];

  if (intent === "current_activities") {
    candidates.push({
      score: 40,
      text: `Current Focus & Status: ${k.currentActivities.summary}`,
      link: { label: lang === "id" ? "Kontak" : "Contact", href: "/#contact" },
    });
  }

  if (intent === "academic_research") {
    candidates.push({
      score: 40,
      text: `Academic Research (${k.academicResearch.institution}): ${k.academicResearch.project} — ${k.academicResearch.summary}`,
      link: { label: "Android Stress Detection Case Study", href: k.academicResearch.path },
    });
  }

  for (const exp of k.experience) {
    const rolesSummary = (exp.roles ?? [])
      .map(
        (r: { title: string; dateRange: string; bullets?: string[]; technologies?: string[] }) =>
          `${r.title} (${r.dateRange})${r.bullets?.length ? `: ${r.bullets.join(" ")}` : ""}`
      )
      .join("; ");
    const subProjectsSummary = (exp.selectedProjects ?? [])
      .map((sp) => `${sp.title} — ${sp.description}`)
      .join("; ");

    const textParts = [
      `${exp.title} at ${exp.organization}${exp.legalEntity ? ` (${exp.legalEntity})` : ""}, ${exp.dateRange}${exp.location ? ` (${exp.location})` : ""}.`,
      ...(exp.bullets ?? []),
      rolesSummary ? `Roles: ${rolesSummary}.` : "",
      subProjectsSummary ? `Engagements: ${subProjectsSummary}.` : "",
      exp.extraContext ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    let intentBoost = 0;
    if (intent === "work_experience") {
      intentBoost = exp.category === "professional" ? 30 : 4;
    } else if (intent === "company_experience") {
      const matchedName = tokens.some((t) =>
        `${exp.organization} ${subProjectsSummary} ${exp.extraContext ?? ""}`.toLowerCase().includes(t)
      );
      intentBoost = matchedName ? 35 : exp.category === "professional" ? 10 : 0;
    }

    const score = scoreHaystack(textParts, tokens) + intentBoost;
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

  // Strictly skip unrelated project repos when user explicitly asks about work history
  if (intent !== "work_experience") {
    const featuredSet = new Set(k.projects.featuredSlugs);
    for (const proj of k.projects.items) {
      const text = [
        `${proj.title} (${proj.category}): ${proj.summary}`,
        proj.description !== proj.summary ? proj.description : "",
        `Technologies: ${proj.technologies.join(", ")}.`,
        proj.personalContribution ? `Contribution: ${proj.personalContribution}` : "",
        proj.architectureSummary ? `Architecture: ${proj.architectureSummary}` : "",
      ]
        .filter(Boolean)
        .join(" ");

      const titleMatch =
        tokens.length > 0 &&
        tokens.some(
          (t) =>
            !OWNER_AND_STOP_WORDS.has(t) &&
            (containsToken(proj.title.toLowerCase(), t) || containsToken(proj.slug.toLowerCase(), t))
        );
      const featuredBoost =
        intent === "projects"
          ? featuredSet.has(proj.slug)
            ? 24
            : proj.projectOrigin === "original"
              ? 6
              : -2
          : proj.featured
            ? 5
            : 0;

      const score = scoreHaystack(text, tokens) + (titleMatch ? 12 : 0) + featuredBoost;
      if (score > 0 && (intent !== "company_experience" || proj.projectOrigin === "professional" || titleMatch)) {
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
  }

  if (intent === "technical_skills" || intent === "general") {
    for (const group of k.competencies) {
      const text = `${group.title}: ${group.skills.join(", ")}.`;
      const score = scoreHaystack(text, tokens) + (intent === "technical_skills" ? 28 : 0);
      if (score > 0) {
        candidates.push({
          score,
          text,
          link: { label: lang === "id" ? "Proyek" : "Projects", href: "/projects/" },
        });
      }
    }
  }

  for (const edu of k.education) {
    const text = `Education: ${edu.institution} — ${edu.degree} (${edu.period}, ${edu.location}). ${edu.notes ?? ""}`;
    const score = scoreHaystack(text, tokens) + (intent === "education" || intent === "current_activities" ? 22 : 0);
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
    const score = scoreHaystack(text, tokens) + (intent === "certifications" ? 20 : 0);
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

  candidates.sort((a, b) => b.score - a.score);
  const top = candidates.slice(0, 5);

  if (top.length === 0) {
    top.push({
      score: 1,
      text: `${k.profile.name} (${k.profile.jobTitle}): ${k.profile.summary}`,
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
    intent,
    snippets: top.map((c) => c.text),
    links,
  };
}

export function buildLocalFallbackAnswer(
  message: string,
  lang: ResolvedLanguage,
  detail: ChatDetailLevel,
  history: ChatHistoryMessage[] = []
): { text: string; links: VerifiedLink[] } {
  const k = getKnowledge();
  const ctx = retrieveKnowledgeContext(message, lang, history);

  if (ctx.intent === "work_experience") {
    const roles = k.workExperience.slice(0, detail === "detailed" ? 4 : 4);
    const lines = roles.map((exp) => {
      const highlight =
        exp.selectedProjects?.length
          ? exp.selectedProjects.map((p) => p.title).join(", ")
          : (exp.bullets?.[0] ?? "");
      return `- **${exp.organization}** (${exp.title}, ${exp.dateRange}): ${highlight}`;
    });

    if (lang === "id") {
      return {
        text: [
          "Berikut ringkasan pengalaman kerja profesional **Adrian Syah Abidin**:",
          ...lines,
          "Untuk informasi lebih lanjut atau jadwal wawancara, silakan hubungi **adriansyah1230@gmail.com**.",
        ].join("\n"),
        links: [
          { label: "Bagian Pengalaman", href: "/#experience" },
          { label: "LinkedIn", href: k.profile.publicContact.linkedin },
        ],
      };
    }
    return {
      text: [
        "Here is a summary of **Adrian Syah Abidin**'s verified professional experience:",
        ...lines,
        "Feel free to reach out via **adriansyah1230@gmail.com** for recruitment inquiries.",
      ].join("\n"),
      links: [
        { label: "Experience Section", href: "/#experience" },
        { label: "LinkedIn", href: k.profile.publicContact.linkedin },
      ],
    };
  }

  const limit = detail === "detailed" ? 3 : 2;
  const cleanBullets = ctx.snippets.slice(0, limit).map((s) => `- ${s}`);

  if (lang === "id") {
    return {
      text: [
        "Berdasarkan data portofolio terverifikasi Adrian Syah Abidin:",
        ...cleanBullets,
        "Silakan buka tautan di bawah atau hubungi **adriansyah1230@gmail.com** untuk detail tambahan.",
      ].join("\n"),
      links: ctx.links,
    };
  }

  return {
    text: [
      "Based on Adrian Syah Abidin's verified portfolio records:",
      ...cleanBullets,
      "Explore the links below or email **adriansyah1230@gmail.com** for further details.",
    ].join("\n"),
    links: ctx.links,
  };
}
