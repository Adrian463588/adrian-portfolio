import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import ts from "typescript";

const rootDir = process.cwd();
const cache = new Map();

/**
 * Loads TypeScript/JSON modules inside `src/` using TypeScript transpilation so
 * `knowledge/adrian-knowledge.json` reuses canonical portfolio datasets without duplication.
 */
function loadTsModule(relOrAbsPath) {
  const fullPath = path.isAbsolute(relOrAbsPath) ? relOrAbsPath : path.join(rootDir, relOrAbsPath);
  const resolved = resolveExistingPath(fullPath);
  if (cache.has(resolved)) return cache.get(resolved);

  if (resolved.endsWith(".json")) {
    const data = JSON.parse(fs.readFileSync(resolved, "utf8"));
    cache.set(resolved, data);
    return data;
  }

  const src = fs.readFileSync(resolved, "utf8");
  const transpiled = ts.transpileModule(src, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      resolveJsonModule: true,
    },
  });

  const mod = { exports: {} };
  cache.set(resolved, mod.exports);

  const localRequire = (specifier) => {
    if (specifier.startsWith("@/")) {
      return loadTsModule(path.join(rootDir, "src", specifier.slice(2)));
    }
    if (specifier.startsWith("./") || specifier.startsWith("../")) {
      return loadTsModule(path.resolve(path.dirname(resolved), specifier));
    }
    return {};
  };

  vm.runInNewContext(
    transpiled.outputText,
    { module: mod, exports: mod.exports, require: localRequire, console, URL, process },
    { filename: resolved }
  );
  cache.set(resolved, mod.exports);
  return mod.exports;
}

function resolveExistingPath(target) {
  const candidates = [
    target,
    `${target}.ts`,
    `${target}.tsx`,
    `${target}.json`,
    path.join(target, "index.ts"),
    path.join(target, "index.tsx"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  throw new Error(`Cannot resolve module: ${target}`);
}

const { SITE_CONFIG, HERO_TAGLINES } = loadTsModule("src/config/site.config.ts");
const { education } = loadTsModule("src/data/education.ts");
const { experiences } = loadTsModule("src/data/experience.ts");
const { competencies } = loadTsModule("src/data/competencies.ts");
const { certifications } = loadTsModule("src/data/certifications.ts");
const { leadership } = loadTsModule("src/data/leadership.ts");
const { projects, githubSyncMeta } = loadTsModule("src/data/projects.ts");
const { getPublishedResources } = loadTsModule("src/lib/seo-resources.ts");

const publishedResources = getPublishedResources();
const featuredProjects = projects.filter((p) => p.featured).slice(0, 6);

// Sanitized public-safe highlights verified from owner ATS CVs (BANKCV_MASUKKANKEGITIGNORE/),
// strictly excluding private phone numbers, street addresses, birthdates, age, IDs, or employer secrets.
const sanitizedCvHighlights = {
  additionalCourses: [
    {
      id: "kominfo-dts-secplus",
      name: "Digital Talent Scholarship — Cybersecurity (Security+)",
      organizer: "Ministry of Communication and Information Technology (Kominfo)",
      period: "Sep 2022 – Oct 2022",
      location: "Remote",
      focus: ["Threat analysis", "Incident response", "Risk mitigation", "Security policies"],
      sourceId: "cv-cybersecurity-2025",
    },
    {
      id: "kominfo-ccna-training",
      name: "CCNA Network Engineer Training",
      organizer: "Ministry of Communication and Information Technology (Kominfo)",
      period: "Jul 2022 – Sep 2022",
      location: "Remote",
      focus: ["Routing", "Switching", "Network protocols (Cisco CCNA 200-301 curriculum; certificate not obtained)"],
      sourceId: "cv-cybersecurity-2025",
    },
    {
      id: "kominfo-cyber-novice-ehe",
      name: "Cyber Novice: Ethical Hacking Essentials",
      organizer: "Ministry of Communication and Information Technology (Kominfo)",
      period: "Mar 2022 – Apr 2022",
      location: "Remote",
      focus: ["Reconnaissance", "Scanning", "Enumeration", "Vulnerability assessment"],
      sourceId: "cv-cybersecurity-2025",
    },
  ],
  verifiedBootcampMetrics: [
    {
      id: "digital-skola-score",
      organization: "Digital Skola DevOps Bootcamp",
      period: "Aug 2025 – Oct 2025",
      summary: "Graduated with a 97.3/100 final score and 96.5/100 technical proficiency across Kubernetes (HA, HPA), Docker, Terraform, Ansible, Jenkins, GitHub Actions, Prometheus, and Grafana.",
      sourceId: "cv-devops-2025",
    },
  ],
  ownerReviewNotes: [
    {
      id: "alibaba-cert-level",
      topic: "Alibaba Cloud certification level",
      observation:
        "DevOps/Backend/Game CVs list both 'Alibaba Cloud Certified Professional' and 'Alibaba Cloud Certified Associate (ACA)', while portfolio certifications.ts lists 'Alibaba Cloud Certified Associate (ACA)' as pending level confirmation.",
      recommendation:
        "Assistant reports Alibaba Cloud ACA with conservative pending-confirmation wording until verified by Adrian.",
    },
    {
      id: "parfumcreator-privacy",
      topic: "ParfumCreator visibility",
      observation:
        "ParfumCreator became public in Sprint V8 and lives at https://github.com/Adrian463588/ParfumCreator (featured slot #5).",
      recommendation: "Always describe ParfumCreator as an open public Android portfolio project.",
    },
  ],
};

const experienceEnrichments = {
  "qiscus-qa": "Worked on client AI Agent QA implementations for Paragon brands including Crystallure, Oh My Glam, and Paragon AI across web widgets and WhatsApp.",
  "bitbybit-qa": "Evaluated omnichannel, CRM, and AI-integrated shopping resilience using X-Ray, Nuclei, and security scanning workflows alongside manual QA.",
};

const normalizedExperience = experiences.map((exp) => ({
  id: exp.id,
  category: exp.category,
  title: exp.title,
  organization: exp.organization,
  legalEntity: exp.legalEntity,
  corporateGroup: exp.corporateGroup,
  location: exp.location,
  dateRange: exp.dateRange,
  startDate: exp.startDate,
  endDate: exp.endDate,
  bullets: exp.bullets,
  extraContext: experienceEnrichments[exp.id],
  technologies: exp.technologies,
  website: exp.website,
  repoUrl: exp.repoUrl,
  roles: exp.roles?.map((r) => ({
    id: r.id,
    title: r.title,
    employmentLabel: r.employmentLabel,
    dateRange: r.dateRange,
    bullets: r.bullets,
    technologies: r.technologies,
  })),
  selectedProjects: exp.selectedProjects,
}));

const normalizedProjects = projects.map((p) => ({
  id: p.id,
  slug: p.slug,
  title: p.title,
  subtitle: p.subtitle,
  summary: p.summary,
  description: p.description,
  category: p.category,
  technologies: p.technologies,
  tier: p.tier,
  featured: p.featured,
  flagship: Boolean(p.flagship),
  projectOrigin: p.projectOrigin,
  projectStatus: p.projectStatus,
  organization: p.organization,
  personalContribution: p.personalContribution,
  problemStatement: p.problemStatement,
  proposedSolution: p.proposedSolution,
  architectureSummary: p.architectureSummary,
  implementedFeatures: p.implementedFeatures,
  testingStrategy: p.testingStrategy,
  resultsAndLimitations: p.resultsAndLimitations,
  caseStudyPath: `/projects/${p.slug}/`,
  repositoryUrl: p.repositoryUrl,
  releaseUrl: p.releaseUrl,
  demoUrl: p.demoUrl,
  updatedAt: p.updatedAt,
}));

const allowedInternalPaths = [
  "/",
  "/#work",
  "/#experience",
  "/#about",
  "/#contact",
  "/projects/",
  "/resources/",
  ...normalizedProjects.map((p) => p.caseStudyPath),
  ...publishedResources.map((r) => `/resources/${r.slug}/`),
];

const allowedExternalUrls = new Set([
  SITE_CONFIG.url,
  SITE_CONFIG.profiles.github,
  SITE_CONFIG.profiles.linkedin,
  SITE_CONFIG.profiles.medium,
  "mailto:adriansyah1230@gmail.com",
  "https://berijalan.co.id/",
  "https://github.com/Adrian463588/ProjectGame",
  ...normalizedProjects.flatMap((p) => [p.repositoryUrl, p.releaseUrl, p.demoUrl].filter(Boolean)),
  ...normalizedExperience.flatMap((e) => [e.website, e.repoUrl].filter(Boolean)),
]);

const presetFaq = [
  {
    id: "greeting",
    intents: ["greeting", "hello", "halo", "hi", "hai", "pagi", "siang", "sore", "malam"],
    priority: 10,
    answer: {
      id: "Halo! Saya **Ask Adrian**, asisten AI portofolio untuk **Adrian Syah Abidin** (Software & QA Automation Engineer). Silakan tanyakan pengalaman kerja (seperti Berijalan, Qiscus, Tokopedia, atau Bitbybit), proyek unggulan, keahlian teknis, atau pendidikannya di UGM.",
      en: "Hello! I'm **Ask Adrian**, an AI portfolio assistant representing **Adrian Syah Abidin** (Software & QA Automation Engineer). Feel free to ask about his experience (Berijalan, Qiscus, Tokopedia, Bitbybit), featured projects, technical stack, or UGM background.",
    },
    links: [
      { label: { id: "Lihat Proyek", en: "View Projects" }, href: "/projects/" },
      { label: { id: "Tentang & Kontak", en: "Contact" }, href: "/#contact" },
    ],
  },
  {
    id: "profile",
    intents: ["siapa adrian", "who is adrian", "tentang adrian", "about adrian", "profil", "introduce", "perkenalan"],
    priority: 9,
    answer: {
      id: "**Adrian Syah Abidin** adalah Software & QA Automation Engineer asal Indonesia dengan latar belakang Teknologi Informasi di Universitas Gadjah Mada (UGM). Ia berpengalaman dalam quality engineering (Cypress, Playwright, Selenium, Appium), sistem finansial enterprise di Berijalan Techno Center (ACC Group), DevOps CI/CD, pengembangan Android Kotlin/Compose, dan riset AI terapan.",
      en: "**Adrian Syah Abidin** is a Software & QA Automation Engineer based in Indonesia with an Information Technology background at Universitas Gadjah Mada (UGM). He combines enterprise quality engineering, CI/CD & DevOps infrastructure, Kotlin/Jetpack Compose Android development, and applied AI systems.",
    },
    links: [
      { label: { id: "About Section", en: "About Section" }, href: "/#about" },
      { label: { id: "LinkedIn", en: "LinkedIn" }, href: SITE_CONFIG.profiles.linkedin },
    ],
  },
  {
    id: "berijalan",
    intents: ["berijalan", "acc", "astra", "unipaas", "magic xpa", "archer", "stnk", "joint finance", "joint financing"],
    priority: 10,
    answer: {
      id: "Di **Berijalan Techno Center** (PT Cipta Sedaya Digital Indonesia / Astra Credit Companies Group), Adrian menjalani peran Trainee (Mar–Jul 2026) lalu Freelance Software Quality Control Engineer (Jul–Okt 2026). Ia mengerjakan:\n- **Archer Upgrade**: Otomasi pengujian Web dengan Cypress & Jenkins CI pada migrasi AOL UniPaaS ke React.\n- **STNK Alignment**: Pengujian fungsional manual lintas modul AOL UniPaaS dan Magic xpa.\n- **Joint Financing Parameter**: Pengujian validasi parameter pembiayaan di AOL UniPaaS.\n*(Detail kode internal, skema DB, dan formula bisnis dijaga kerahasiaannya.)*",
      en: "At **Berijalan Techno Center** (PT Cipta Sedaya Digital Indonesia / Astra Credit Companies Group), Adrian served as a Trainee (Mar–Jul 2026) and Freelance Software Quality Control Engineer (Jul–Oct 2026). Key sanitized engagements include:\n- **Archer Upgrade**: Cypress web test automation & Jenkins CI supporting migration from AOL UniPaaS to React.\n- **STNK Alignment**: Manual functional testing across AOL UniPaaS and Magic xpa modules.\n- **Joint Financing Parameter**: Parameter rule validation in AOL UniPaaS.\n*(Internal schemas, URLs, and proprietary business formulas are excluded per confidentiality boundaries.)*",
    },
    links: [
      { label: { id: "Pengalaman Kerja", en: "Experience" }, href: "/#experience" },
      { label: { id: "Archer Case Study", en: "Archer Case Study" }, href: "/projects/archer-upgrade/" },
    ],
  },
  {
    id: "experience",
    intents: ["pengalaman kerja", "work experience", "career", "karir", "riwayat kerja", "internship", "magang", "qiscus", "tokopedia", "bitbybit"],
    priority: 8,
    answer: {
      id: "Pengalaman profesional utama Adrian:\n- **Berijalan Techno Center (ACC Group)** — Software QC Engineer Freelance (Jul–Okt 2026) & Trainee (Mar–Jul 2026): Cypress, Jenkins CI, AOL UniPaaS, Magic xpa.\n- **Qiscus** — QA Engineer Intern (Jul–Okt 2025, Remote): AI Trainer & QA untuk klien AI Agent (termasuk brand Paragon: Crystallure, Oh My Glam, Paragon AI) di Web & WhatsApp.\n- **Tokopedia – ByteDance Group** — QA Engineer Intern (Feb–Jun 2025): Manual & automated regression Web/Android di Tokopedia & TikTok Shop.\n- **Bitbybit Studio – Favo Group** — QA Engineer Intern (Nov 2024–Jul 2025, Remote): QA & vulnerability assessment (X-Ray, Nuclei).",
      en: "Adrian's core professional roles:\n- **Berijalan Techno Center (ACC Group)** — Freelance Software QC Engineer (Jul–Oct 2026) & Trainee (Mar–Jul 2026): Cypress, Jenkins CI, AOL UniPaaS, Magic xpa.\n- **Qiscus** — QA Engineer Intern (Jul–Oct 2025, Remote): AI Trainer & QA for client AI Agent deployments (web widgets & WhatsApp).\n- **Tokopedia – ByteDance Group** — QA Engineer Intern (Feb–Jun 2025): Web & Android regression testing across Tokopedia & TikTok Shop.\n- **Bitbybit Studio – Favo Group** — QA Engineer Intern (Nov 2024–Jul 2025, Remote): Manual QA and vulnerability checks with X-Ray & Nuclei.",
    },
    links: [
      { label: { id: "Detail Pengalaman", en: "View Experience" }, href: "/#experience" },
      { label: { id: "LinkedIn", en: "LinkedIn" }, href: SITE_CONFIG.profiles.linkedin },
    ],
  },
  {
    id: "qa-automation",
    intents: ["qa automation", "test automation", "sdet", "cypress", "playwright", "selenium", "appium", "quality assurance"],
    priority: 8,
    answer: {
      id: "Di bidang **QA & Test Automation**, Adrian menguasai pengujian Web, Android, API, dan load testing menggunakan **Cypress**, **Playwright**, **Selenium**, **Appium**, **Cucumber (BDD)**, **Postman/Newman**, **JMeter**, serta integrasi pipeline **Jenkins CI** dan **GitHub Actions**. Ia juga membangun **AutomatePlus**, workbench desktop berbasis Rust + Tauri 2 + TypeScript untuk menyusun flow SessionIR dan mengekspor test suite Playwright/Selenium/Appium/k6.",
      en: "In **QA & Test Automation**, Adrian has hands-on experience across Web, Android, API, and performance testing with **Cypress**, **Playwright**, **Selenium**, **Appium**, **Cucumber (BDD)**, **Postman/Newman**, **JMeter**, plus CI integration via **Jenkins** and **GitHub Actions**. He also authored **AutomatePlus**, an offline-first Rust + Tauri 2 + TypeScript workbench generating runnable Playwright, Selenium, Appium, and k6 suites.",
    },
    links: [
      { label: { id: "AutomatePlus Case Study", en: "AutomatePlus Case Study" }, href: "/projects/automate-plus/" },
      { label: { id: "Sumber Daya QA", en: "QA Resources" }, href: "/resources/" },
    ],
  },
  {
    id: "devops",
    intents: ["devops", "docker", "kubernetes", "k8s", "terraform", "ansible", "prometheus", "grafana", "cloud infrastructure", "ci/cd"],
    priority: 8,
    answer: {
      id: "Di bidang **DevOps & Cloud**, Adrian menyelesaikan program DevOps Engineer Digital Skola (Aug–Nov 2025) dengan nilai akhir **97.3/100**. Proyeknya mencakup provisioning GCP via **Terraform** & **Ansible**, orkestrasi **Kubernetes** (High Availability & HPA autoscaling), pipeline **Jenkins** & **GitHub Actions**, serta observability stack **Prometheus**, **Grafana**, dan **Uptime Kuma**.",
      en: "In **DevOps & Cloud Infrastructure**, Adrian completed Digital Skola's DevOps Engineer track (Aug–Nov 2025; final score **97.3/100**), covering **Terraform** & **Ansible** GCP provisioning, **Kubernetes** (HA & HPA autoscaling), **Jenkins** & **GitHub Actions** CI/CD, and **Prometheus/Grafana/Uptime Kuma** observability stacks.",
    },
    links: [
      { label: { id: "Observability Stack", en: "Observability Stack" }, href: "/projects/dual-vm-observability-stack/" },
      { label: { id: "GKE HPA Project", en: "GKE HPA Project" }, href: "/projects/gke-terraform-hpa-autoscaling/" },
    ],
  },
  {
    id: "featured-projects",
    intents: ["proyek unggulan", "featured project", "featured projects", "portfolio project", "proyek apa saja", "what projects"],
    priority: 9,
    answer: {
      id: "6 proyek unggulan di portofolio Adrian:\n1. **Android Stress Detection** (Riset Flagship UGM) — Deteksi stres real-time berbasis PPG smartwatch Wear OS & Android AI.\n2. **QuranPlus** — Aplikasi Android Al-Qur'an offline-first, Hadis 9 kitab, Tahsin, dan on-device RAG.\n3. **Coffee Creator** — Asisten seduh kopi & ekstraksi berbasis ilmu penyeduhan Kotlin.\n4. **AdzanPlus** — Jadwal salat offline-first dengan modul KMP & widget Glance.\n5. **ParfumCreator** — Aplikasi Android formulasi wewangian & kalkulator konsentrasi minyak wangi.\n6. **AutomatePlus** — Workbench otomasi QA multi-platform (Rust, Tauri 2, TypeScript).",
      en: "Adrian's 6 Featured Projects on this portfolio:\n1. **Android Stress Detection** (Flagship UGM Research) — Real-time Wear OS + Android PPG stress detection.\n2. **QuranPlus** — Offline-first Android Quran, 9-collection Hadith, and on-device sqlite-vec RAG.\n3. **Coffee Creator** — Kotlin brewing science & extraction companion.\n4. **AdzanPlus** — Offline prayer schedule with Kotlin Multiplatform astronomy & Glance widgets.\n5. **ParfumCreator** — Android perfumery formulation & concentration calculator.\n6. **AutomatePlus** — Offline-first multi-platform SDET workbench (Rust, Tauri 2, TypeScript).",
    },
    links: [
      { label: { id: "Semua Proyek", en: "Explore All Projects" }, href: "/projects/" },
      { label: { id: "GitHub Adrian", en: "Adrian's GitHub" }, href: SITE_CONFIG.profiles.github },
    ],
  },
  {
    id: "stress-detection",
    intents: ["stress detection", "deteksi stres", "ppg", "skripsi", "thesis", "wear os", "smartwatch", "flagship"],
    priority: 9,
    answer: {
      id: "Proyek riset flagship Adrian adalah **Android Stress Detection** di Universitas Gadjah Mada — sistem deteksi tingkat stres berbasis sinyal *Photoplethysmography* (PPG) dari smartwatch Wear OS ke Android dengan pemrosesan sinyal (HRV/PPG), machine learning/deep learning on-device, serta pipeline kalibrasi.\n*(Data partisipan riset maupun data mentah non-publik dijaga kerahasiaannya.)*",
      en: "Adrian's flagship UGM research project is **Android Stress Detection** — a Wear OS + Android wearable system detecting physiological stress from *Photoplethysmography* (PPG) signals using real-time HRV extraction and on-device ML/DL models.\n*(Participant records and unpublished raw datasets remain confidential.)*",
    },
    links: [
      { label: { id: "Studi Kasus Flagship", en: "Flagship Case Study" }, href: "/projects/android-stress-detection/" },
    ],
  },
  {
    id: "skills",
    intents: ["keahlian teknis", "tech stack", "technical skills", "skill apa", "kemampuan teknis", "bahasa pemrograman"],
    priority: 8,
    answer: {
      id: "Keahlian teknis Adrian terbagi dalam 5 pilar:\n- **Quality Engineering**: Cypress, Playwright, Selenium, Appium, Postman, JMeter, Cucumber (BDD).\n- **DevOps & Security**: Docker, Kubernetes, Terraform, Ansible, Jenkins, GitHub Actions, Prometheus, Grafana, Nuclei.\n- **Backend & FinTech**: Go (Gin), Laravel, PostgreSQL, MySQL, AOL UniPaaS, Magic xpa.\n- **Mobile Engineering**: Kotlin, Jetpack Compose, Material 3, KMP, Room, Hilt, Wear OS.\n- **Applied AI & Systems**: Python, Rust, Tauri 2, ONNX, LiteRT-LM, llama.cpp, sqlite-vec.",
      en: "Adrian's core engineering pillars:\n- **Quality Engineering**: Cypress, Playwright, Selenium, Appium, Postman, JMeter, Cucumber (BDD).\n- **DevOps & Security**: Docker, Kubernetes, Terraform, Ansible, Jenkins, GitHub Actions, Prometheus, Grafana, Nuclei.\n- **Backend & FinTech**: Go (Gin), Laravel, PostgreSQL, MySQL, AOL UniPaaS, Magic xpa.\n- **Mobile Engineering**: Kotlin, Jetpack Compose, Material 3, KMP, Room, Hilt, Wear OS.\n- **Applied AI & Systems**: Python, Rust, Tauri 2, ONNX, LiteRT-LM, llama.cpp, sqlite-vec.",
    },
    links: [
      { label: { id: "Detail Proyek", en: "Browse Projects" }, href: "/projects/" },
    ],
  },
  {
    id: "education",
    intents: ["pendidikan", "education", "kuliah", "ugm", "universitas gadjah mada", "sma", "lulusan", "jurusan"],
    priority: 8,
    answer: {
      id: "Adrian menempuh studi S1 **Teknologi Informasi** (*Information Technology*) di Fakultas Teknik **Universitas Gadjah Mada (UGM)** (2020 – sekarang) dengan fokus riset PPG stress detection Android & smartwatch, serta lulusan **SMA Negeri 3 Yogyakarta** (2017 – 2020). Ia juga aktif di KMTETI FT UGM, Night Login DTETI, dan GDSC UGM.",
      en: "Adrian studies **Information Technology** (*Teknologi Informasi*, FT **Universitas Gadjah Mada**, 2020 – Present), focusing research on PPG-based stress detection across Android and Wear OS, following **SMA Negeri 3 Yogyakarta** (2017 – 2020). On campus he contributed to KMTETI FT UGM, Night Login DTETI, and GDSC UGM.",
    },
    links: [
      { label: { id: "Bagian Education", en: "Education Section" }, href: "/#about" },
    ],
  },
  {
    id: "certifications",
    intents: ["sertifikasi", "certification", "certificate", "sertifikat", "aws", "comptia", "alibaba", "ehe"],
    priority: 8,
    answer: {
      id: "Sertifikasi dan kredensial terverifikasi Adrian:\n- **AWS Certified Cloud Practitioner** (Amazon Web Services)\n- **CompTIA Security+** & **CompTIA Network+**\n- **Ethical Hacking Essentials (EHE)** (EC-Council)\n- **Alibaba Cloud Certified Associate (ACA)** *(status verifikasi level sedang dikonfirmasi)*\n- Pelatihan **Kominfo Digital Talent Scholarship** (Cybersecurity, CCNA 200-301 curriculum, Cyber Novice) dan kursus Dicoding.",
      en: "Adrian's verified certifications and credentials:\n- **AWS Certified Cloud Practitioner** (Amazon Web Services)\n- **CompTIA Security+** & **CompTIA Network+**\n- **Ethical Hacking Essentials (EHE)** (EC-Council)\n- **Alibaba Cloud Certified Associate (ACA)** *(level confirmation pending)*\n- Plus **Kominfo Digital Talent Scholarship** programs and Dicoding ML/Data coursework.",
    },
    links: [
      { label: { id: "Lihat Pengalaman & Sertifikasi", en: "View Certifications" }, href: "/#experience" },
    ],
  },
  {
    id: "career-contact",
    intents: ["hire", "rekrut", "kontak", "contact", "email", "linkedin", "availability", "karier", "minat kerja", "role", "cv", "resume"],
    priority: 9,
    answer: {
      id: "Adrian terbuka untuk peluang **Software Engineering**, **QA / SDET Automation**, dan **DevOps Engineering** (berbasis di Indonesia / remote).\n- Email publik: **adriansyah1230@gmail.com**\n- LinkedIn: **linkedin.com/in/adrian-syah-abidin-0416b81b9**\n- GitHub: **github.com/Adrian463588**\nUntuk CV lengkap sesuai role atau jadwal wawancara, silakan hubungi langsung melalui email atau LinkedIn di atas.",
      en: "Adrian is open to **Software Engineering**, **QA / SDET Automation**, and **DevOps Engineering** roles (Indonesia / remote).\n- Public Email: **adriansyah1230@gmail.com**\n- LinkedIn: **linkedin.com/in/adrian-syah-abidin-0416b81b9**\n- GitHub: **github.com/Adrian463588**\nFeel free to reach out via email or LinkedIn to request a tailored CV or schedule an interview.",
    },
    links: [
      { label: { id: "Bagian Contact", en: "Contact Section" }, href: "/#contact" },
      { label: { id: "Kirim Email", en: "Email Adrian" }, href: "mailto:adriansyah1230@gmail.com" },
    ],
  },
];

const knowledge = {
  schemaVersion: "1.0.0",
  lastUpdated: new Date().toISOString(),
  persona: {
    assistantName: "Ask Adrian",
    ownerName: SITE_CONFIG.name,
    roleDescription: "AI Portfolio Assistant representing Adrian Syah Abidin",
    disclosure: {
      id: "Saya asisten AI portofolio untuk Adrian Syah Abidin, bukan Adrian secara langsung. Jawaban bersumber dari data publik terverifikasi pada portofolio ini.",
      en: "I am Ask Adrian, an AI portfolio assistant representing Adrian Syah Abidin — not Adrian in person. Answers come strictly from verified portfolio and public-safe sources.",
    },
    tone: ["friendly", "professional", "concise", "technically accurate", "honest about limitations"],
  },
  profile: {
    name: SITE_CONFIG.name,
    jobTitle: SITE_CONFIG.jobTitle,
    summary: SITE_CONFIG.description,
    generalLocation: "Yogyakarta / Indonesia",
    alumniOf: SITE_CONFIG.alumniOf,
    careerInterests: [
      "Software Engineering (Backend Go/Laravel, Android Kotlin/Compose)",
      "Quality Engineering & Test Automation (SDET — Cypress, Playwright, Appium, CI)",
      "DevOps & Cloud Infrastructure (Docker, Kubernetes, Terraform, Observability)",
      "Applied AI & On-Device Systems",
    ],
    publicContact: {
      email: "adriansyah1230@gmail.com",
      github: SITE_CONFIG.profiles.github,
      linkedin: SITE_CONFIG.profiles.linkedin,
      medium: SITE_CONFIG.profiles.medium,
      website: SITE_CONFIG.url,
    },
    taglines: HERO_TAGLINES,
  },
  workExperience: normalizedExperience.filter((e) => e.category === "professional"),
  currentActivities: {
    summary:
      "Completing final-stage Information Technology undergraduate studies and wearable PPG stress-detection research at Universitas Gadjah Mada (UGM), building public open-source software across Android/Kotlin, Rust/Tauri 2 QA automation, and DevOps tools, and open to Software Engineering, QA/SDET, or DevOps roles (Berijalan Techno Center freelance engagement concluded in October 2026).",
    focusAreas: [
      "UGM Information Technology & PPG wearable stress-detection research",
      "Open-source Android, KMP, and QA automation engineering (AutomatePlus, QuranPlus, Coffee Creator, AdzanPlus, ParfumCreator)",
      "Open to full-time or freelance Software Engineering, QA/SDET Automation, and DevOps positions",
    ],
  },
  academicResearch: {
    project: "Android Stress Detection",
    institution: "Universitas Gadjah Mada (UGM)",
    slug: "android-stress-detection",
    path: "/projects/android-stress-detection/",
    summary:
      "Wearable Photoplethysmography (PPG) signal processing and channel-independent on-device ONNX inference pipeline across Wear OS (Galaxy Watch) and Android, paired with signal quality gating and local AI counseling. Experimental research prototype only (not a medical diagnostic tool); participant records and raw unpublished subject datasets remain confidential.",
  },
  education,
  leadership,
  experience: normalizedExperience,
  competencies,
  certifications,
  cvEnrichments: sanitizedCvHighlights,
  projects: {
    totalCount: normalizedProjects.length,
    featuredSlugs: featuredProjects.map((p) => p.slug),
    items: normalizedProjects,
  },
  personalProjects: normalizedProjects.filter((p) => p.featured || p.projectOrigin === "original"),
  resources: publishedResources.map((r) => ({
    slug: r.slug,
    title: r.title,
    kind: r.kind,
    summary: r.directAnswer,
    path: `/resources/${r.slug}/`,
  })),
  presetFaq,
  sourceRegistry: {
    githubSync: githubSyncMeta,
    cvSourcesSanitized: [
      "CV ATS Adrian QA - 2025.pdf (phone redacted)",
      "CV ATS Adrian DevOps - 2025.pdf (phone redacted)",
      "CV ATS Adrian BE- 2025.pdf (phone redacted)",
      "CV ATS Adrian Game Programmer - 2025.pdf (phone redacted)",
      "CV ATS CySec Adrian - 2025.pdf (phone redacted)",
    ],
    excludedSensitiveCategories: [
      "Private phone numbers",
      "Residential street addresses",
      "Age and date of birth",
      "Government / national ID numbers (NIK/KTP/Passport)",
      "Unapproved salary or confidential HR terms",
      "Internal Berijalan repository paths, DB schemas, financial calculation ratios, and UAT credentials",
      "Research participant datasets from PPG experiments",
    ],
  },
  allowlist: {
    internalPaths: [...new Set(allowedInternalPaths)],
    externalUrls: [...allowedExternalUrls],
  },
};

fs.mkdirSync(path.join(rootDir, "knowledge"), { recursive: true });
const outFile = path.join(rootDir, "knowledge", "adrian-knowledge.json");
fs.writeFileSync(outFile, JSON.stringify(knowledge, null, 2) + "\n", "utf8");
console.log(
  `Built knowledge/adrian-knowledge.json cleanly: ${knowledge.projects.totalCount} projects, ${knowledge.experience.length} experience groups, ${knowledge.presetFaq.length} preset FAQs.`
);
