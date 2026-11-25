import type { ProjectOverride } from "@/types";

export const projectOverrides: Record<string, ProjectOverride> = {
  // === TIER 1: FEATURED PROJECTS ===
  AutomatePlus: {
    repoName: "AutomatePlus",
    id: "automate-plus",
    slug: "automate-plus",
    title: "AutomatePlus",
    subtitle: "Offline-First Multi-Platform SDET Workbench",
    summary:
      "Local Windows automation workbench built with Rust, Tauri 2, and TypeScript to compose SessionIR flows and export Web, Android, and API test suites.",
    description:
      "Desktop engineering workbench for SDETs that compiles structured SessionIR actions, locators, and assertions into runnable Playwright, Selenium, Appium, and k6 projects without cloud lock-in or telemetry.",
    category: "QA & Test Automation",
    secondaryCategories: ["Desktop & Systems Engineering"],
    technologies: ["Rust", "Tauri 2", "TypeScript", "Playwright", "Appium", "Selenium", "k6"],
    releaseUrl: "https://github.com/Adrian463588/AutomatePlus/releases/tag/v1.7.1",
    screenshots: [
      {
        src: "/projects/automate-plus-workbench.webp",
        alt: "AutomatePlus desktop workbench showing Web navigation SessionIR and generated Playwright TypeScript test code",
        width: 1200,
        height: 750,
        caption: "Workbench editor translating SessionIR steps into Playwright TypeScript tests",
      },
      {
        src: "/projects/automate-plus-runtime.webp",
        alt: "AutomatePlus runtime preflight and execution status view",
        width: 1200,
        height: 750,
        caption: "Local runtime diagnostics and evidence-driven execution flow",
      },
    ],
    personalContribution:
      "Sole author and systems architect: designed SessionIR schema, Rust/Tauri 2 native host bridge, TypeScript code generators, SHA-256 verified portable Windows ZIP packaging, and automated test suite.",
    projectStatus: "released",
    projectOrigin: "original",
    tier: "featured",
    featured: true,
    editorialOrder: 5,
    problemStatement:
      "QA teams often maintain separate, fragile scripts across browser, Android device farm, and API load-testing tools with hidden cloud dependencies.",
    proposedSolution:
      "Unified test authoring around an offline-first SessionIR intermediate representation in a Tauri 2 + Rust desktop host that exports deterministic framework-specific code and validates local runtime prerequisites.",
    architectureSummary:
      "Native Rust/Tauri 2 control plane managing workspace filesystem isolation and runtime checks, paired with a React/TypeScript renderer and deterministic framework code generators.",
    implementedFeatures: [
      "SessionIR workspace & session authoring for Web, Android, and API test flows",
      "Multi-framework code generation (Playwright TypeScript, Selenium, Appium, k6)",
      "Local runtime preflight gates preventing silent false-pass execution",
      "Portable Windows x64 v1.7.1 release verified with SHA256SUMS.txt",
    ],
    engineeringChallenges: [
      "Separating native host execution capabilities from browser preview constraints",
      "Enforcing explicit Blocked/Disabled states when target runtimes or device drivers are absent",
    ],
    testingStrategy:
      "Unit and integration suites validating SessionIR schema transforms, code generator output parity, and preflight state transitions.",
    securityConsiderations:
      "Zero cloud telemetry, zero background downloads, and SHA-256 release verification.",
    resultsAndLimitations:
      "Published v1.7.1 portable preview (AutomatePlus-v1.7.1-windows-x64.zip). Requires Windows 10/11 x64 and WebView2 Runtime; unsigned preview binary.",
    sourceReferences: [
      "https://github.com/Adrian463588/AutomatePlus",
      "https://github.com/Adrian463588/AutomatePlus/releases/tag/v1.7.1",
    ],
  },

  QuranPlus: {
    repoName: "QuranPlus",
    id: "quran-plus",
    slug: "quran-plus",
    title: "QuranPlus",
    subtitle: "Offline-First Android Quran, Hadith & On-Device RAG Companion",
    seoTitle: "QuranPlus — Offline Quran & AI Android App",
    summary:
      "Offline-first Android app combining complete 30 Juz Quran reading, 9-kitab Hadith search, Tahsin drills, and on-device sqlite-vec RAG.",
    description:
      "Offline-first Android application delivering complete 114-surah Quran text, word-by-word reading tools, Hadith search across 9 collections, Tahsin drills, Dzikir & Hizib, and local semantic AI retrieval without network dependency.",
    category: "Android & Mobile Development",
    secondaryCategories: ["AI & Machine Learning"],
    technologies: ["Kotlin", "Jetpack Compose", "Material 3", "LiteRT-LM", "ONNX Runtime", "sqlite-vec", "Room"],
    releaseUrl: "https://github.com/Adrian463588/QuranPlus/releases/tag/v1.0.13",
    hasCiWorkflow: true,
    screenshots: [
      {
        src: "/projects/quran-plus-home.webp",
        alt: "QuranPlus Android main surah list captured on Samsung Galaxy S20 Ultra",
        width: 1200,
        height: 2666,
        caption: "Al-Qur'an Al-Karim home navigation verified on physical device",
      },
      {
        src: "/projects/quran-plus-ai.webp",
        alt: "QuranPlus Tanya AI on-device RAG screen",
        width: 1200,
        height: 2666,
        caption: "On-device RAG assistant grounded in local vector embeddings",
      },
    ],
    personalContribution:
      "Sole developer: engineered Clean MVVM architecture, Jetpack Compose adaptive phone/tablet UI, local Room + sqlite-vec retrieval pipeline, LiteRT-LM/ONNX inference integration, and regression CI.",
    projectStatus: "released",
    projectOrigin: "original",
    tier: "featured",
    featured: true,
    editorialOrder: 1,
    problemStatement:
      "Islamic reference apps commonly rely on cloud APIs for semantic search and Q&A, failing offline and risking ungrounded LLM hallucinations on religious texts.",
    proposedSolution:
      "Bundled verified text corpora with local vector indexing (sqlite-vec) and on-device LiteRT-LM/ONNX inference so retrieval and citations run privately on the handset.",
    architectureSummary:
      "Multi-module Gradle Kotlin project (app, shared, data, specs, openspec) following MVVM + unidirectional state flow with Room storage and embedded vector retrieval.",
    implementedFeatures: [
      "Complete 30 Juz (114 surahs, 6,236 ayat) with Kemenag RI Indonesian metadata, waqaf & gharib guides",
      "9-kitab Hadith browser, Tahsin makharij quizzes, and Dzikir & Hizib reader",
      "On-device Tanya AI powered by sqlite-vec RAG and LiteRT-LM",
      "Responsive phone and Galaxy Tab S7 tablet layouts verified in CI regression suite",
    ],
    testingStrategy:
      "GitHub Actions regression.yml checks alongside physical-device visual verification captures on Samsung Galaxy S20 Ultra and Tab S7.",
    resultsAndLimitations:
      "Released v1.0.13 APK via GitHub Releases; on-device LLM inference depends on device RAM and Android API 32+.",
    sourceReferences: [
      "https://github.com/Adrian463588/QuranPlus",
      "https://github.com/Adrian463588/QuranPlus/releases/tag/v1.0.13",
    ],
  },

  EnglishPrepAI: {
    repoName: "EnglishPrepAI",
    id: "english-prep-ai",
    slug: "english-prep-ai",
    title: "EnglishPrepAI",
    subtitle: "Offline TOEFL ITP, TOEFL iBT (2026) & IELTS Academic Prep",
    summary:
      "Offline Android application for TOEFL ITP, TOEFL iBT (2026), and IELTS Academic preparation using Room FTS4, Media3, Gemma 4, and Whisper ONNX.",
    description:
      "Native Kotlin & Jetpack Compose preparation platform implementing explicit structural rules for TOEFL ITP Level 1, post-2026 TOEFL iBT, and IELTS Academic without requiring INTERNET permission.",
    category: "Android & Mobile Development",
    secondaryCategories: ["AI & Machine Learning", "DevOps & DevSecOps"],
    technologies: ["Kotlin", "Jetpack Compose", "Room FTS4", "Media3", "Gemma 4", "Whisper ONNX", "R8/ProGuard"],
    releaseUrl: "https://github.com/Adrian463588/EnglishPrepAI/releases/tag/v1.2.0",
    hasCiWorkflow: true,
    screenshots: [
      {
        src: "/projects/english-prep-home.webp",
        alt: "EnglishPrepAI Android home dashboard",
        width: 1080,
        height: 2400,
        caption: "Offline preparation dashboard across exam tracks",
      },
      {
        src: "/projects/english-prep-exams.webp",
        alt: "EnglishPrepAI exam switcher separating TOEFL ITP, TOEFL iBT 2026, and IELTS Academic",
        width: 1080,
        height: 2400,
        caption: "Explicit exam track isolation and format rules",
      },
    ],
    personalContribution:
      "Designed domain separation across three standardized exam formats, built Room FTS4 indexing + Media3 listening playback, integrated Gemma 4 & Whisper ONNX pipelines, and hardened R8/ProGuard & DevSecOps CI.",
    projectStatus: "released",
    projectOrigin: "original",
    tier: "featured",
    featured: true,
    editorialOrder: 8,
    problemStatement:
      "Most exam prep apps conflate TOEFL ITP, TOEFL iBT, and IELTS scoring/question formats and fail in offline study environments.",
    proposedSolution:
      "Built an offline-only Android app with zero INTERNET permission, format-specific scoring modules, local full-text search, and on-device speech/writing evaluation.",
    architectureSummary:
      "Clean MVVM with Material 3 UI, Room FTS4 offline curriculum packs, Media3 audio engine, LiteRT-LM Gemma 4 + Whisper ONNX local scoring, and GitHub Actions android-devsecops.yml.",
    implementedFeatures: [
      "Isolated TOEFL ITP Level 1 (310–677), TOEFL iBT 2026 (1–6 bands), and IELTS Academic (0–9 bands)",
      "Offline Whisper ONNX speaking transcription and local Gemma 4 feedback",
      "R8 minification and resource shrinking configured for release builds",
    ],
    securityConsiderations:
      "Zero INTERNET permission in manifest and DevSecOps workflow validation in CI.",
    resultsAndLimitations:
      "Published v1.2.0 universal APK (SHA-256 checksum documented); local AI feedback is positioned as study simulation rather than official ETS/IDP grading.",
    sourceReferences: [
      "https://github.com/Adrian463588/EnglishPrepAI",
      "https://github.com/Adrian463588/EnglishPrepAI/releases/tag/v1.2.0",
    ],
  },

  ChatBuddy: {
    repoName: "ChatBuddy",
    id: "chat-buddy",
    slug: "chat-buddy",
    title: "ChatBuddy",
    subtitle: "Offline AI Travel Companion (Voice Translation, OCR & Local LLM)",
    summary:
      "100% offline Android travel assistant combining two-way live voice translation (Silero VAD + Whisper), CameraX live OCR overlay, sqlite-vec RAG, and llama.cpp.",
    description:
      "On-device multimodal AI assistant built in Kotlin & Jetpack Compose to handle cross-language conversation, sign/menu OCR translation, and travel RAG retrieval without mobile data.",
    category: "AI & Machine Learning",
    secondaryCategories: ["Android & Mobile Development"],
    technologies: ["Kotlin", "Jetpack Compose", "llama.cpp", "Whisper", "Silero VAD", "CameraX", "sqlite-vec"],
    releaseUrl: "https://github.com/Adrian463588/ChatBuddy/releases/tag/v0.2.0",
    hasCiWorkflow: true,
    screenshots: [
      {
        src: "/projects/chat-buddy-listening.webp",
        alt: "ChatBuddy live voice translation listening mode powered by Silero neural VAD",
        width: 1080,
        height: 2400,
        caption: "Two-way speech capture with Silero neural voice activity detection",
      },
      {
        src: "/projects/chat-buddy-history.webp",
        alt: "ChatBuddy bilingual conversation history screen",
        width: 1080,
        height: 2400,
        caption: "Turn-by-turn translated dialogue view captured on Galaxy S20 Ultra",
      },
    ],
    personalContribution:
      "Architected Clean MVVM Android layers, integrated Silero VAD + Whisper ASR + offline TTS pipeline, CameraX OCR overlay, MiniLM embeddings with sqlite-vec, and llama.cpp native inference.",
    projectStatus: "released",
    projectOrigin: "original",
    tier: "featured",
    featured: true,
    editorialOrder: 7,
    problemStatement:
      "International travelers frequently lose reliable connectivity while needing real-time bilingual voice translation and text recognition.",
    proposedSolution:
      "Stacked quantized local speech, embedding, OCR, and LLM runtimes behind an offline-first Jetpack Compose interface.",
    testingStrategy:
      "GitHub Actions android.yml verification and on-device smoke validation on Samsung Galaxy S20 Ultra (SM-G988B).",
    resultsAndLimitations:
      "Released v0.2.0 APK; requires downloading or provisioning local model packs onto device storage prior to offline inference.",
    sourceReferences: [
      "https://github.com/Adrian463588/ChatBuddy",
      "https://github.com/Adrian463588/ChatBuddy/releases/tag/v0.2.0",
    ],
  },

  MedBot: {
    repoName: "MedBot",
    id: "med-bot",
    slug: "med-bot",
    title: "MedBot",
    subtitle: "Offline Android Health Assistant",
    summary:
      "Local-first Android health assistant built with Kotlin, Jetpack Compose, LiteRT-LM model integrity verification, SAF storage, and clinical safety boundaries.",
    description:
      "Multi-agent triage and local medical knowledge companion running LiteRT-LM (AUTO/GPU/CPU) strictly on-device with fail-closed model state handling and Storage Access Framework isolation.",
    category: "AI & Machine Learning",
    secondaryCategories: ["Android & Mobile Development", "Cybersecurity"],
    technologies: ["Kotlin", "Jetpack Compose", "LiteRT-LM", "WorkManager", "SAF", "RAG"],
    hasCiWorkflow: true,
    screenshots: [
      {
        src: "/projects/med-bot-preview.webp",
        alt: "MedBot Android medical assistant interface preview",
        width: 1200,
        height: 2666,
        caption: "Local-first multi-specialist routing and evidence-gated response UI",
      },
    ],
    personalContribution:
      "Designed multi-specialist triage prompt orchestration, built SHA-256 verified LiteRT-LM model manager over Android SAF, and enforced fail-closed clinical safety boundaries.",
    projectStatus: "active",
    projectOrigin: "original",
    tier: "featured",
    featured: true,
    editorialOrder: 9,
    problemStatement:
      "Cloud health chatbots introduce privacy exposure for patient queries and risk unverified advice when offline or ungrounded.",
    proposedSolution:
      "Kept all inference and document retrieval local via SAF-stored .litertlm models verified by exact byte size and SHA-256 checksum before execution.",
    securityConsiderations:
      "Zero external telemetry, zero cloud transmission of user history/photos, fail-closed model verification states (MODEL_UNAVAILABLE, VERIFYING, READY_TO_LOAD, FAILED).",
    testingStrategy:
      "Automated verification pipeline via .github/workflows/android-verification.yml.",
    resultsAndLimitations:
      "Informational health companion only; explicitly bounded against autonomous clinical diagnosis.",
    sourceReferences: ["https://github.com/Adrian463588/MedBot"],
  },

  AdzanPlus: {
    repoName: "AdzanPlus",
    id: "adzan-plus",
    slug: "adzan-plus",
    title: "AdzanPlus",
    subtitle: "Offline-First Prayer Times, Astronomy & Glance Widget Suite",
    seoTitle: "AdzanPlus — Prayer Times & Adhan Reminders",
    summary:
      "Offline-first Android prayer schedule app using shared Kotlin Multiplatform astronomy modules, Qibla compass, Dhuha timing, and Jetpack Glance widgets.",
    description:
      "MIT-licensed Kotlin & Jetpack Compose prayer reminder suite powered by shared multiplatform astronomical calculation modules (core-astronomy, core-prayer) with zero server dependency.",
    category: "Android & Mobile Development",
    technologies: ["Kotlin", "Jetpack Compose", "Kotlin Multiplatform", "Clean Architecture", "Jetpack Glance"],
    releaseUrl: "https://github.com/Adrian463588/AdzanPlus/releases/tag/v2.2.1",
    screenshots: [
      {
        src: "/projects/adzan-plus-home.webp",
        alt: "AdzanPlus home screen displaying offline prayer schedule and Dhuha calculation",
        width: 1200,
        height: 2666,
        caption: "Material 3 prayer schedule view computed on-device",
      },
    ],
    personalContribution:
      "Built shared core-astronomy and core-prayer calculation modules, Material 3 UI, Jetpack Glance home widgets, haptic reminders, and anti-leakage security checks.",
    projectStatus: "released",
    projectOrigin: "original",
    tier: "featured",
    featured: true,
    editorialOrder: 3,
    implementedFeatures: [
      "Real-time on-device solar/astronomical hisab calculations including Dhuha",
      "Precision Qibla compass and configurable pre-adhan heads-up alerts (5–30 min)",
      "Jetpack Glance AppWidgets and shared KMP domain logic",
    ],
    sourceReferences: [
      "https://github.com/Adrian463588/AdzanPlus",
      "https://github.com/Adrian463588/AdzanPlus/releases/tag/v2.2.1",
    ],
  },

  Task5ManageDashboardMonitoring: {
    repoName: "Task5ManageDashboardMonitoring",
    id: "dual-vm-observability-stack",
    slug: "dual-vm-observability-stack",
    title: "Dual-VM Monitoring & Alerting Stack",
    subtitle: "Prometheus, Grafana, Uptime Kuma & Terraform Infrastructure",
    summary:
      "Infrastructure monitoring and alerting using Prometheus, Grafana, Terraform, and Docker Compose.",
    description:
      "Automated infrastructure and monitoring stack separating target Nginx/Node Exporter hosts from a dedicated observability VM using Terraform, Docker Compose, and Bash provisioning.",
    category: "DevOps & DevSecOps",
    technologies: ["Terraform", "Docker Compose", "Prometheus", "Grafana", "Alertmanager", "Uptime Kuma", "Nginx"],
    screenshots: [
      {
        src: "/projects/task5-grafana.webp",
        alt: "Grafana Node Exporter Full dashboard tracking CPU, memory, swap, network, and disk metrics",
        width: 1200,
        height: 507,
        caption: "Live Grafana Node Exporter dashboard scraping target-vm",
      },
      {
        src: "/projects/task5-kuma.webp",
        alt: "Uptime Kuma HTTP availability dashboard monitoring target endpoints",
        width: 1200,
        height: 533,
        caption: "Uptime Kuma HTTP status probes and incident checks",
      },
    ],
    personalContribution:
      "Authored Terraform provisioning modules, Docker Compose monitoring topology, Prometheus alert rules, Alertmanager Discord webhook routing, and deployment documentation.",
    projectStatus: "completed",
    projectOrigin: "original",
    tier: "featured",
    featured: true,
    editorialOrder: 6,
    problemStatement:
      "Co-locating monitoring tools on the same VM as the application causes observability blind spots whenever the target host faces resource exhaustion.",
    proposedSolution:
      "Separated target-vm (Nginx + Node Exporter) and monitoring-vm (Prometheus + Grafana + Alertmanager + Uptime Kuma) so outages trigger alerts independently.",
    sourceReferences: ["https://github.com/Adrian463588/Task5ManageDashboardMonitoring"],
  },

  hsk1vocab: {
    repoName: "hsk1vocab",
    id: "hsk1-vocabulary-master",
    slug: "hsk1-vocabulary-master",
    title: "HSK 1 Vocabulary Master",
    subtitle: "Minimalist Web App — \"Ink & Paper\" Edition",
    summary:
      "High-contrast Next.js + TypeScript Mandarin HSK Level 1 learning app with accent-insensitive search, 3D flip flashcards, and live EdgeOne deployment.",
    description:
      "Interactive study companion for HSK Level 1 Chinese vocabulary built with an editorial Ink & Paper aesthetic, debounced search across Hanzi/Pinyin/English, and responsive flashcard study mode.",
    category: "Frontend & Web Development",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    demoUrl: "https://hsk1vocab.edgeone.dev/",
    screenshots: [
      {
        src: "/projects/hsk1-vocab-live.webp",
        alt: "HSK 1 Vocabulary Master live web application showing editorial typography and study card",
        width: 1200,
        height: 750,
        caption: "Live deployment captured at hsk1vocab.edgeone.dev",
      },
    ],
    personalContribution:
      "Solo developer: designed Ink & Paper design tokens, accent-insensitive Pinyin search matcher, 3D flashcard interactions, and EdgeOne static deployment.",
    projectStatus: "released",
    projectOrigin: "original",
    tier: "featured",
    featured: true,
    editorialOrder: 10,
    sourceReferences: [
      "https://github.com/Adrian463588/hsk1vocab",
      "https://hsk1vocab.edgeone.dev/",
    ],
  },

  // === TIER 2: SUBSTANTIVE CATALOG PROJECTS ===
  "auu-ahh-cafe-menu": {
    repoName: "auu-ahh-cafe-menu",
    id: "auu-ahh-cafe-menu",
    slug: "auu-ahh-cafe-menu",
    title: "AUU AHH Cafe — DevSecOps & SRE Portfolio",
    subtitle: "Hardened Next.js CI/CD, Secret Scanning & Operations Runbooks",
    summary:
      "Next.js 16 + TypeScript static application demonstrating hardened GitHub Actions CI with Gitleaks, dependency auditing, SHA-pinned actions, Playwright/axe gates, and SRE runbooks.",
    description:
      "Reference DevSecOps repository combining strict supply-chain controls (SHA-pinned workflows, read-only permissions, Gitleaks history scanning) with automated browser accessibility and static artifact integrity.",
    category: "DevOps & DevSecOps",
    secondaryCategories: ["Frontend & Web Development", "Cybersecurity"],
    technologies: ["Next.js 16", "TypeScript", "GitHub Actions", "Gitleaks", "Playwright", "axe-core"],
    hasCiWorkflow: true,
    screenshots: [],
    personalContribution:
      "Built the static menu application alongside hardened CI security gates, supply-chain checksum checks, Playwright/axe tests, and SRE runbooks.",
    projectStatus: "active",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/auu-ahh-cafe-menu"],
  },

  CreditRiskPrediction: {
    repoName: "CreditRiskPrediction",
    id: "credit-risk-mlops",
    slug: "credit-risk-mlops",
    title: "Credit Risk MLOps System",
    subtitle: "End-to-End Loan Default Prediction & Monitoring Pipeline",
    summary:
      "Full MLOps lifecycle for creditworthiness and loan default prediction combining MLflow tracking, DagsHub, FastAPI serving, Docker, Prometheus, Grafana, and GitHub Actions.",
    description:
      "Production-structured machine learning operations pipeline implementing automated preprocessing CI, experiment tracking (MLflow), containerized FastAPI inference, and Prometheus/Grafana observability.",
    category: "Finance & FinTech",
    secondaryCategories: ["AI & Machine Learning", "DevOps & DevSecOps"],
    technologies: ["Python", "MLflow", "FastAPI", "Docker", "Prometheus", "Grafana", "GitHub Actions"],
    hasCiWorkflow: true,
    screenshots: [],
    personalContribution:
      "Built preprocessing pipelines, MLflow tracking integration, FastAPI inference service, Docker Hub image publishing, secret detection hook (detect_secrets.py), and CI/CD workflows.",
    projectStatus: "completed",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/CreditRiskPrediction"],
  },

  LedgerScope: {
    repoName: "LedgerScope",
    id: "ledger-scope",
    slug: "ledger-scope",
    title: "LedgerScope",
    subtitle: "Accounting, Financial Analysis & Audit Fieldwork Platform",
    summary:
      "Full-stack bookkeeping, quarterly close, double-entry financial statement, and audit working-paper platform built with Laravel 12, PostgreSQL, React, TypeScript, and CI quality gates.",
    description:
      "Multi-role financial and audit workspace separating accounting, analysis, audit fieldwork (RCM, working papers, review notes), and client evidence portals with strict RBAC and bcmath monetary precision.",
    category: "Finance & FinTech",
    secondaryCategories: ["Backend Engineering", "Frontend & Web Development"],
    technologies: ["Laravel", "PHP", "PostgreSQL", "React", "TypeScript", "Vite", "Cypress", "Vitest"],
    hasCiWorkflow: true,
    screenshots: [],
    personalContribution:
      "Architected Laravel Sanctum RBAC backend with PHPStan/PHPUnit/Pint gates, double-entry accounting models, React/TypeScript frontend, and separate backend/frontend GitHub Actions CI.",
    projectStatus: "active",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/LedgerScope"],
  },

  DemoEvershopCypress: {
    repoName: "DemoEvershopCypress",
    id: "demo-evershop-cypress",
    slug: "demo-evershop-cypress",
    title: "EverShop Cypress Automation Suite",
    subtitle: "E2E Page Object Model Framework with Allure & Jenkins/GH Actions",
    summary:
      "End-to-end Cypress v13 automation framework for EverShop e-commerce using Page Object Model, custom commands, Allure & Mochawesome reporting, and dual Jenkins/GitHub Actions CI.",
    description:
      "Modular QA automation suite covering auth, product search, and guest/authenticated checkout journeys with nightly scheduled runs and pre-commit quality hooks.",
    category: "QA & Test Automation",
    technologies: ["Cypress", "JavaScript", "Page Object Model", "Allure", "Jenkins", "GitHub Actions"],
    hasCiWorkflow: true,
    screenshots: [],
    personalContribution:
      "Implemented POM selectors, custom Cypress commands, auth/checkout/product specs, Jenkinsfile pipeline, and nightly CI schedules.",
    projectStatus: "active",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/DemoEvershopCypress"],
  },

  SauceDemoJerkins: {
    repoName: "SauceDemoJerkins",
    id: "saucedemo-cypress-bdd-jenkins",
    slug: "saucedemo-cypress-bdd-jenkins",
    title: "SauceDemo BDD & Jenkins Suite",
    subtitle: "TypeScript Cypress + Cucumber Gherkin Automation Framework",
    summary:
      "TypeScript Cypress E2E framework combining Cucumber BDD .feature specs, strict Page Object Model, JSON fixtures, Mochawesome/Allure reports, and Jenkins CI.",
    description:
      "Structured BDD and classic Cypress test suite automating SauceDemo flows with CI/CD pipeline definitions in both Jenkinsfile and GitHub Actions.",
    category: "QA & Test Automation",
    technologies: ["Cypress", "TypeScript", "Cucumber (BDD)", "Jenkins", "GitHub Actions", "Allure"],
    hasCiWorkflow: true,
    screenshots: [],
    personalContribution:
      "Authored TypeScript POM page classes, Gherkin feature definitions, step bindings, and Jenkins + GitHub Actions execution pipelines.",
    projectStatus: "completed",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/SauceDemoJerkins"],
  },

  "TMDB-QA-Testing": {
    repoName: "TMDB-QA-Testing",
    id: "tmdb-qa-testing",
    slug: "tmdb-qa-testing",
    title: "TMDB QA Automation & Manual Test Suite",
    subtitle: "13 Manual Test Cases, Bug Reports & Cypress Gherkin Automation",
    summary:
      "Combined manual QA audit (13 test cases identifying 5 localization and favorites bugs) and Cypress Gherkin BDD automation targeting themoviedb.org.",
    description:
      "Structured QA engineering portfolio artifact linking test plans, defect documentation, and automated Cypress scenarios for authentication, localization switching, and favorites management.",
    category: "QA & Test Automation",
    technologies: ["Cypress", "Cucumber (BDD)", "JavaScript", "Manual QA", "Bug Reporting"],
    screenshots: [
      {
        src: "/projects/tmdb-qa-evidence.webp",
        alt: "TMDB QA testing report and defect documentation evidence",
        width: 1200,
        height: 627,
        caption: "Documented test cases and defect evidence for TMDB flows",
      },
    ],
    personalContribution:
      "Executed 13 structured manual test cases, logged 5 reproducible bugs across language switching and favorites management, and automated core regression scenarios in Cypress.",
    projectStatus: "completed",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/TMDB-QA-Testing"],
  },

  Task12ManageKubernetesAutoscallingKubernetes: {
    repoName: "Task12ManageKubernetesAutoscallingKubernetes",
    id: "gke-terraform-hpa-autoscaling",
    slug: "gke-terraform-hpa-autoscaling",
    title: "GKE Terraform & Memory HPA Autoscaling",
    subtitle: "Automated Kubernetes Cluster Provisioning & Horizontal Pod Autoscaler",
    summary:
      "Infrastructure-as-Code pipeline provisioning Google Kubernetes Engine (GKE) via Terraform and validating memory-driven HPA replica scaling (2–5 pods at 75% target).",
    description:
      "Google Kubernetes Engine autoscaling setup using Terraform cluster provisioning, Metrics Server scripts, Nginx workload manifests, and synthetic memory stress verification.",
    category: "DevOps & DevSecOps",
    technologies: ["Terraform", "Kubernetes", "GKE", "HPA", "Shell", "Nginx"],
    screenshots: [
      {
        src: "/projects/task12-k8s-hpa.webp",
        alt: "Kubernetes Horizontal Pod Autoscaler scaling verification output under memory stress",
        width: 830,
        height: 231,
        caption: "Observed Kubernetes HPA scale-up validation from normal load to stress load",
      },
    ],
    personalContribution:
      "Wrote Terraform cluster/node-pool configs, Kubernetes deployment/service/HPA YAML manifests, Metrics Server bootstrapper, and scale-up/cooldown verification captures.",
    projectStatus: "completed",
    projectOrigin: "original",
    tier: "featured",
    featured: true,
    editorialOrder: 11,
    sourceReferences: ["https://github.com/Adrian463588/Task12ManageKubernetesAutoscallingKubernetes"],
  },

  "notes-app-performance-testing": {
    repoName: "notes-app-performance-testing",
    id: "notes-app-performance-ci",
    slug: "notes-app-performance-ci",
    title: "Express Notes App CI & k6 Performance Gates",
    subtitle: "ESLint, Jest Coverage, SonarQube & k6 Smoke Pipeline",
    summary:
      "Express.js REST service wired with a 4-stage GitHub Actions quality gate enforcing zero ESLint warnings, Jest unit coverage, SonarQube analysis, and k6 latency thresholds.",
    description:
      "DevOps CI/CD quality-gate reference implementing automated lint, unit testing, static analysis, and k6 load testing (p95 < 400ms, < 1% error rate threshold).",
    category: "DevOps & DevSecOps",
    secondaryCategories: ["QA & Test Automation", "Backend Engineering"],
    technologies: ["Node.js", "Express", "Jest", "ESLint", "SonarQube", "k6", "GitHub Actions"],
    hasCiWorkflow: true,
    screenshots: [],
    personalContribution:
      "Implemented Express REST service, Jest tests, SonarQube properties, k6 load-test scripts, and GitHub Actions workflow.",
    projectStatus: "completed",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/notes-app-performance-testing"],
  },

  VideoEditorFree: {
    repoName: "VideoEditorFree",
    id: "video-editor-free",
    slug: "video-editor-free",
    title: "VideoEditorFree",
    subtitle: "Offline-First Rust, Tauri 2 & React Desktop Video Editor",
    summary:
      "Windows desktop non-linear video editor backed by an integer-tick Rust timeline IR, CPU color/LUT effects, FFmpeg pipeline, local Whisper subtitles, and Piper TTS.",
    description:
      "Desktop systems application keeping canonical timeline state in Rust crates while exposing a typed React/TypeScript UI for multi-track editing, deterministic audio ducking, and atomic project saves.",
    category: "Desktop & Systems Engineering",
    secondaryCategories: ["AI & Machine Learning"],
    technologies: ["Rust", "Tauri 2", "React", "TypeScript", "FFmpeg", "Whisper", "Piper TTS"],
    releaseUrl: "https://github.com/Adrian463588/VideoEditorFree/releases/tag/v0.1.0",
    hasCiWorkflow: true,
    screenshots: [],
    personalContribution:
      "Engineered Rust integer-tick timeline IR, FFmpeg/ffprobe command verification, .vdeproj atomic persistence, CPU video filters/LUTs, and React/TypeScript host projection.",
    projectStatus: "released",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/VideoEditorFree"],
  },

  ScreenSharingWindowsInput: {
    repoName: "ScreenSharingWindowsInput",
    id: "tab-sign-screen-sharing",
    slug: "tab-sign-screen-sharing",
    title: "TabSign — ScreenSharing & S-Pen Input",
    subtitle: "Low-Latency Windows Mirroring, W3C Pointer Injection & scrcpy",
    summary:
      "Bidirectional Windows–Android tablet bridge streaming live screens over binary WebSockets so Samsung S-Pen stylus strokes map to Win32 SendInput digital signatures.",
    description:
      "FastAPI + WebSockets + Win32 SendInput systems tool enabling natural stylus signing on web PDFs/forms alongside automated scrcpy Android-to-Windows mirroring.",
    category: "Desktop & Systems Engineering",
    technologies: ["Python", "FastAPI", "WebSockets", "Win32 API", "scrcpy", "W3C Pointer Events"],
    releaseUrl: "https://github.com/Adrian463588/ScreenSharingWindowsInput/releases/tag/v1.5.0",
    screenshots: [],
    personalContribution:
      "Built screen capture streamer, Win32 SendInput pointer injector with palm rejection and click deadzone filter, scrcpy lifecycle manager, and v1.5.0 release.",
    projectStatus: "released",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/ScreenSharingWindowsInput"],
  },

  PPTController: {
    repoName: "PPTController",
    id: "ppt-controller",
    slug: "ppt-controller",
    title: "PPTController",
    subtitle: "WebSocket & Android ADB Wireless Presentation Remote + Laser",
    summary:
      "MIT-licensed FastAPI + WebSocket wireless slide presenter and laser pointer controller supporting PowerPoint, Canva, Google Slides, and physical volume-button navigation.",
    description:
      "Sub-15ms LAN presentation remote pairing a Python FastAPI desktop server and transparent screen laser overlay with an Android companion APK (PPTRemote.apk).",
    category: "Desktop & Systems Engineering",
    secondaryCategories: ["Android & Mobile Development"],
    technologies: ["Python", "FastAPI", "WebSockets", "Android ADB", "Kotlin"],
    releaseUrl: "https://github.com/Adrian463588/PPTController/releases/tag/v1.3.3",
    screenshots: [],
    personalContribution:
      "Built FastAPI WebSocket server, desktop laser overlay, anti-double-jump key debouncing, and companion Android remote APK.",
    projectStatus: "released",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/PPTController"],
  },

  GoOnlineShop: {
    repoName: "GoOnlineShop",
    id: "go-online-shop",
    slug: "go-online-shop",
    title: "Go Online Shop Backend Service",
    subtitle: "Clean Architecture Marketplace REST API (Go + Gin + MySQL)",
    summary:
      "E-commerce REST API built with Go, Gin, GORM, and MySQL implementing JWT + admin RBAC middleware, auto-created stores, product uploads, and transactional stock updates.",
    description:
      "Layered Go backend separating HTTP handlers, repository persistence, domain entities, and JWT/role middleware alongside Postman test collections.",
    category: "Backend Engineering",
    technologies: ["Go", "Gin", "GORM", "MySQL", "JWT", "REST API"],
    screenshots: [],
    personalContribution:
      "Sole developer: structured Clean Architecture packages, JWT/admin middlewares, transactional order/stock deduction logic, and Postman environment collections.",
    projectStatus: "completed",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/GoOnlineShop"],
  },

  ForumAPI: {
    repoName: "ForumAPI",
    id: "forum-api",
    slug: "forum-api",
    title: "ForumAPI",
    subtitle: "Clean Architecture Express 5 + PostgreSQL + Vitest CI/CD",
    summary:
      "Thread & comment REST API built with Express 5, PostgreSQL (pg + node-pg-migrate), JWT/bcrypt auth, Nginx reverse proxy config, Vitest/Supertest suite, and GitHub Actions CI/CD.",
    description:
      "Production-oriented Node.js backend implementing dependency injection container boundaries, automated DB migrations, Supertest integration tests, and CI/CD pipelines.",
    category: "Backend Engineering",
    secondaryCategories: ["DevOps & DevSecOps"],
    technologies: ["Node.js", "Express 5", "PostgreSQL", "Vitest", "Supertest", "Nginx", "GitHub Actions"],
    hasCiWorkflow: true,
    screenshots: [],
    personalContribution:
      "Implemented Clean Architecture layers, database migrations, Vitest unit/integration tests, Nginx config, and ci.yml / cd.yml workflows.",
    projectStatus: "completed",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/ForumAPI"],
  },

  "go-cv-ai-evaluator": {
    repoName: "go-cv-ai-evaluator",
    id: "go-cv-ai-evaluator",
    slug: "go-cv-ai-evaluator",
    title: "Go CV AI Evaluator",
    subtitle: "Async Goroutine Worker Pool, Embedded Vector RAG & Ollama",
    summary:
      "Golang + Gin backend evaluating candidate CVs and project reports asynchronously via Goroutine worker pools, chromem-go vector retrieval, Ollama (gemma3:4b), and MySQL.",
    description:
      "Backend AI service parsing uploaded PDF/Markdown documents via UniPDF, indexing ground-truth rubrics in embedded ChromaDB, and running async scoring jobs without external Redis queues.",
    category: "Backend Engineering",
    secondaryCategories: ["AI & Machine Learning"],
    technologies: ["Go", "Gin", "MySQL", "GORM", "Ollama", "chromem-go", "Goroutines"],
    screenshots: [],
    personalContribution:
      "Implemented async worker pool orchestration, PDF ingestion, vector search RAG pipeline over chromem-go, and REST endpoints (/upload, /evaluate, /result/{id}).",
    projectStatus: "completed",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/go-cv-ai-evaluator"],
  },

  BookShelfAPI: {
    repoName: "BookShelfAPI",
    id: "bookshelf-api",
    slug: "bookshelf-api",
    title: "Bookshelf API",
    subtitle: "5-Layer Clean Architecture Node.js / Hapi.js REST Service",
    summary:
      "Clean Architecture RESTful book collection API built with Node.js and Hapi.js, complete with query filtering, strict validation, ESLint Google style, and Postman test collection.",
    description:
      "Layered backend API implementing CRUD endpoints, read-state filtering (name, reading, finished), and structured error handling.",
    category: "Backend Engineering",
    technologies: ["Node.js", "Hapi.js", "REST API", "ESLint", "Postman"],
    screenshots: [],
    personalContribution:
      "Implemented 5-layer Clean Architecture routing, validation, query filters, and full Postman automated assertions.",
    projectStatus: "completed",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/BookShelfAPI"],
  },

  "finalproject-sb-go-70-Adrian": {
    repoName: "finalproject-sb-go-70-Adrian",
    id: "go-notes-restful-api",
    slug: "go-notes-restful-api",
    title: "Golang Notes RESTful API",
    subtitle: "Sanbercode Go Backend Capstone (Gin + JWT + PostgreSQL)",
    summary:
      "RESTful API service built with Go, Gin, PostgreSQL, SQL migrations, and JWT authentication middleware for user accounts and note management.",
    description:
      "Backend capstone implementing user registration/login, protected JWT endpoints, database migrations, and CRUD note operations.",
    category: "Backend Engineering",
    technologies: ["Go", "Gin", "PostgreSQL", "JWT", "REST API"],
    screenshots: [],
    personalContribution:
      "Sole developer: designed auth/note handlers, JWT middleware, PostgreSQL schema migrations, and Postman verification flows.",
    projectStatus: "completed",
    projectOrigin: "bootcamp",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/finalproject-sb-go-70-Adrian"],
  },

  "biosignal-stress-pipeline": {
    repoName: "biosignal-stress-pipeline",
    id: "biosignal-stress-pipeline",
    slug: "biosignal-stress-pipeline",
    title: "Biosignal Stress Modeling Pipeline",
    subtitle: "ECG-PPG Peak Detection, HRV/PRV Agreement & Gated ONNX Export",
    summary:
      "Reproducible Python research pipeline for biosignal preprocessing, ECG vs PPG peak alignment, HRV/PRV agreement analysis, and gated ONNX stress model export.",
    description:
      "Modular signal-processing and ML verification codebase producing quantized ONNX artifacts for wearable/mobile inference while enforcing strict dataset/identity isolation in version control.",
    category: "AI & Machine Learning",
    secondaryCategories: ["Research & Academic Projects", "Data Engineering & Analytics"],
    technologies: ["Python", "ONNX", "Signal Processing", "SciPy", "pytest", "Ruff", "GitHub Actions"],
    hasCiWorkflow: true,
    screenshots: [],
    personalContribution:
      "Built preprocessing modules, HRV/PRV statistical alignment pipelines, gated ONNX model validation checks, pytest/ruff CI gates, and zero-PII repository guardrails.",
    projectStatus: "active",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    securityConsiderations:
      "Repository deliberately excludes raw participant recordings, identity mappings, and trained weight dumps; enforces .githooks and CI checks.",
    sourceReferences: ["https://github.com/Adrian463588/biosignal-stress-pipeline"],
  },

  "android-stress-detection": {
    repoName: "android-stress-detection",
    id: "android-stress-detection",
    slug: "android-stress-detection",
    title: "Android Stress Detection",
    subtitle: "Wearable PPG Signal Processing, On-Device ONNX Inference & Decision Support",
    seoTitle: "Android Stress Detection — PPG & Wear OS Research",
    summary:
      "Wearable PPG signal processing and on-device ONNX stress detection across Android and Galaxy Watch, paired with local AI counseling and signal quality gating.",
    description:
      "Dual-module Kotlin, Jetpack Compose, and Wear OS research prototype recording multi-channel PPG from Samsung Galaxy Watch and running channel-independent ONNX Runtime inference locally on Android, with explicit abstain logic when signal quality is insufficient.",
    category: "Research & Academic Projects",
    secondaryCategories: ["AI & Machine Learning", "Android & Mobile Development", "Cybersecurity"],
    technologies: [
      "Kotlin",
      "Jetpack Compose",
      "Wear OS",
      "PPG Signal Processing",
      "ONNX Runtime",
      "LiteRT-LM",
      "Sherpa-ONNX",
      "Room",
    ],
    hasCiWorkflow: true,
    screenshots: [
      {
        src: "/projects/android-stress-detection-home.webp",
        alt: "Android Stress Detection Home screen displaying separate Green and IR SQA results and cleaned PPG core waveform on Xiaomi v0.1.5",
        width: 1080,
        height: 2401,
        caption: "Live Stress Monitoring Home UI showing separate Green/IR SQA results and cleaned PPG core waveform on Xiaomi v0.1.5",
      },
      {
        src: "/projects/android-stress-detection-history.webp",
        alt: "Android Stress Detection Session History calendar screen on Xiaomi v0.1.5",
        width: 1080,
        height: 2401,
        caption: "Session History calendar view on Android v0.1.5",
      },
    ],
    personalContribution:
      "Built the multi-module Phone and Wear OS Kotlin apps, on-device signal gating and ONNX Runtime wrappers, local RAG AI+ counselor, Verbatim+ audio features, R8 hardening, and CI publication-safety scans.",
    projectStatus: "active",
    projectOrigin: "original",
    tier: "featured",
    featured: true,
    flagship: true,
    editorialOrder: 0,
    problemStatement:
      "Wearable PPG recordings suffer from motion artifacts, cadence jitter, and transport gaps, while streaming physiological signals to cloud backends introduces acute privacy risks.",
    proposedSolution:
      "Split raw Galaxy Watch PPG acquisition from Android-side validation, SQA/MADC gating, and channel-independent Green/IR ONNX Runtime inference so the app abstains with INSUFFICIENT_SIGNAL rather than fabricating predictions.",
    architectureSummary:
      "Four-module Gradle architecture (app, wear, shared, inference) using MVVM + unidirectional Flow, Google Play Services Wear Data Layer, Room persistence, local Gemma/LiteRT-LM counseling, and Sherpa-ONNX speech components.",
    implementedFeatures: [
      "Samsung Galaxy Watch PPG recording over Wear Data Layer with independent Green and IR channel evaluation",
      "On-device signal quality assessment (SQA/MADC), 240s anchor core windowing, and strict abstain handling on insufficient signal",
      "Local ONNX Runtime inference locked to validated biosignal pipeline contracts (ECG used only as offline research validation reference)",
      "Five-tab Jetpack Compose interface (Home, History, Verbatim+, AI+ local RAG counselor, Profile) with R8 release hardening and SHA-256 asset verification",
    ],
    engineeringChallenges: [
      "Preventing silent false outputs under PPG motion noise, cadence jitter, or transport gaps by enforcing fail-closed abstain states",
      "Enforcing publication-safety and zero-PII guardrails across Git history while managing large native ML runtimes",
    ],
    testingStrategy:
      "868 JVM unit tests passing across app (796), inference (34), and shared (38) modules on v0.1.5, alongside ktlint, detekt, production lint, Gitleaks full-history scan, and physical Xiaomi device UI smoke verification.",
    securityConsiderations:
      "OWASP MASVS hardening, R8 minification on release builds, SHA-256 verification for Sherpa-ONNX binary artifacts, and automated CI scanning across reachable Git history to prevent secret or participant identity exposure.",
    resultsAndLimitations:
      "This project is an experimental research prototype for stress monitoring and decision support, not a medical diagnostic tool. Phone v0.1.5 and Watch v0.1.1 are internal debug previews; full-channel Watch acceptance remains partial due to diagnostic Red timestamp conflicts, and AI+ local corpus/web citations are not clinically validated.",
    sourceReferences: [
      "https://github.com/Adrian463588/android-stress-detection",
      "https://github.com/Adrian463588/biosignal-stress-pipeline",
    ],
  },

  "coffee-creator": {
    repoName: "coffee-creator",
    id: "coffee-creator",
    slug: "coffee-creator",
    title: "Coffee Creator",
    subtitle: "Offline-First Tactile Android Coffee Laboratory",
    seoTitle: "Coffee Creator — Coffee Brewing Android App",
    summary:
      "Offline-first Kotlin and Jetpack Compose coffee brewing companion with extraction calculators, haptic pour-over timer, CVA cupping forms, and local RAG.",
    description:
      "Material 3 offline-first Android app adopting a tactile industrial UI with Room persistence, benchmark modules, OpenSpec specs, and physical-device test captures.",
    category: "Android & Mobile Development",
    technologies: ["Kotlin", "Jetpack Compose", "Material 3", "Room", "Haptics", "Local RAG"],
    releaseUrl: "https://github.com/Adrian463588/coffee-creator/releases/tag/v1.14.7",
    hasCiWorkflow: true,
    screenshots: [
      {
        src: "/projects/coffee-creator-home.webp",
        alt: "Coffee Creator home screen captured on Samsung Galaxy S20 Ultra",
        width: 1080,
        height: 2400,
        caption: "Tactile Industrial UI home dashboard verified on physical device",
      },
    ],
    personalContribution:
      "Developed coffee science formulas, Room database schema, direct hardware haptic timer cues, CVA sensory evaluation screens, and v1.14.7 release artifacts.",
    projectStatus: "released",
    projectOrigin: "original",
    tier: "featured",
    featured: true,
    editorialOrder: 2,
    sourceReferences: [
      "https://github.com/Adrian463588/coffee-creator",
      "https://github.com/Adrian463588/coffee-creator/releases/tag/v1.14.7",
    ],
  },

  SignalBooster: {
    repoName: "SignalBooster",
    id: "signal-booster",
    slug: "signal-booster",
    title: "SignalBooster",
    subtitle: "Android Connectivity Diagnostics, QoE Probe & Privacy Resilience",
    summary:
      "Android connectivity diagnostics app for monitoring network quality and signal performance.",
    description:
      "Local-first network diagnostics suite offering live QoE probes, crowd-band analysis, Shizuku capability inspection, and DevSecOps CI checks.",
    category: "Android & Mobile Development",
    secondaryCategories: ["Cybersecurity"],
    technologies: ["Kotlin", "Jetpack Compose", "Hilt", "Shizuku", "DevSecOps CI"],
    hasCiWorkflow: true,
    screenshots: [
      {
        src: "/projects/signal-booster-dashboard.webp",
        alt: "SignalBooster Live QoE dashboard showing connectivity metrics",
        width: 1200,
        height: 2667,
        caption: "Live QoE connectivity diagnostics dashboard",
      },
    ],
    personalContribution:
      "Implemented Clean Architecture layers, Hilt DI, telephony/Wi-Fi telemetry probes, and DevSecOps Git hooks & GitHub Actions CI.",
    projectStatus: "active",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/SignalBooster"],
  },

  NotifPlus: {
    repoName: "NotifPlus",
    id: "notif-plus",
    slug: "notif-plus",
    title: "NotifPlus",
    subtitle: "Zero-Internet Privacy-First Notification History Archiver",
    summary:
      "Offline Android app for saving and organizing notification history locally.",
    description:
      "Privacy-respecting local notification logger and media archiver enforcing zero-internet manifest guarantees and automated DevSecOps scanning.",
    category: "Android & Mobile Development",
    secondaryCategories: ["Cybersecurity"],
    technologies: ["Kotlin", "Jetpack Compose", "Room", "Hilt", "Material 3", "DevSecOps"],
    hasCiWorkflow: true,
    screenshots: [
      {
        src: "/projects/notif-plus-preview.webp",
        alt: "NotifPlus local notification archive preview",
        width: 1200,
        height: 2666,
        caption: "Offline notification history timeline and search interface",
      },
    ],
    personalContribution:
      "Built NotificationListenerService persistence in Room, per-app filter rules, Hilt DI graph, and DevSecOps security workflow.",
    projectStatus: "active",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/NotifPlus"],
  },

  plsqllearn: {
    repoName: "plsqllearn",
    id: "plsql-learn",
    slug: "plsql-learn",
    title: "PL/SQL Learn",
    subtitle: "Interactive Oracle PL/SQL Practice & Code Challenge Platform",
    summary:
      "Database-free Next.js + TypeScript learning platform offering 289+ Oracle PL/SQL exercises (230 MCQ + 59 code challenges), structured lessons, and Recharts progress tracking.",
    description:
      "Offline-capable browser study environment storing progress and achievements in localStorage with CodeMirror SQL editing and live EdgeOne deployment.",
    category: "Frontend & Web Development",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "CodeMirror", "Recharts"],
    demoUrl: "https://plsqllearn.edgeone.dev/",
    screenshots: [
      {
        src: "/projects/plsql-learn-live.webp",
        alt: "PL/SQL Learn live web platform interface",
        width: 1200,
        height: 750,
        caption: "Live deployment captured at plsqllearn.edgeone.dev",
      },
    ],
    personalContribution:
      "Solo developer: authored 289+ practice exercises across 12 PL/SQL topics, CodeMirror interactive challenge view, and client-side progress analytics.",
    projectStatus: "released",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: [
      "https://github.com/Adrian463588/plsqllearn",
      "https://plsqllearn.edgeone.dev/",
    ],
  },

  TechnoLoyaltyProgram: {
    repoName: "TechnoLoyaltyProgram",
    id: "techno-loyalty-program",
    slug: "techno-loyalty-program",
    title: "Employee Loyalty Program Platform",
    subtitle: "Token & Reward Management Monorepo (Next.js, Express, Prisma, PostgreSQL)",
    summary:
      "Role-based employee loyalty platform built for managing shift tokens, audit logs, and reward redemptions across Optel and Techno divisions.",
    description:
      "Full-stack monorepo pairing a Next.js + NextAuth frontend with an Express + Prisma + PostgreSQL API, Cypress E2E test suite, and deployment CI.",
    category: "Frontend & Web Development",
    secondaryCategories: ["Backend Engineering", "QA & Test Automation"],
    technologies: ["Next.js", "TypeScript", "Express", "Prisma", "PostgreSQL", "Cypress"],
    hasCiWorkflow: true,
    screenshots: [],
    personalContribution:
      "Built Next.js frontend workflows, Express/Prisma API endpoints, TSV/XLSX template import handling, and Cypress test coverage.",
    projectStatus: "completed",
    projectOrigin: "bootcamp",
    tier: "catalog",
    featured: false,
    resultsAndLimitations:
      "Temporary sslip.io preview endpoint from development is no longer active; source repository and architecture specs remain public.",
    sourceReferences: ["https://github.com/Adrian463588/TechnoLoyaltyProgram"],
  },

  SistemPOS: {
    repoName: "SistemPOS",
    id: "sistem-pos-analytics",
    slug: "sistem-pos-analytics",
    title: "Sistem POS & Sales Analytics Dashboard",
    subtitle: "Multi-Branch F&B Analytics with Row-Level Access Control",
    summary:
      "Centralized F&B sales monitoring dashboard built with React 19, TypeScript, Recharts, Express, and SQLite3 enforcing token-scoped C-Level/Regional/Branch row-level access.",
    description:
      "Monorepo analytics dashboard visualizing multi-branch sales targets, geographic contribution, and store maturity metrics.",
    category: "Data Engineering & Analytics",
    secondaryCategories: ["Frontend & Web Development", "Backend Engineering"],
    technologies: ["React 19", "TypeScript", "Tailwind CSS", "Recharts", "Express", "SQLite", "JWT"],
    screenshots: [],
    personalContribution:
      "Built Vite/React analytics views, Express JWT row-level query isolation, and automatic database seeding.",
    projectStatus: "completed",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/SistemPOS"],
  },

  ZNLKostPutri: {
    repoName: "ZNLKostPutri",
    id: "znl-kost-putri",
    slug: "znl-kost-putri",
    title: "ZNL Kost Putri Landing Page",
    subtitle: "Next.js 16 + shadcn/ui + Vitest Production Property Showcase",
    summary:
      "Fast, responsive Next.js 16 landing page for residential housing in Yogyakarta built with React 19, Tailwind CSS v4, shadcn/ui, Biome, Vitest, and CI.",
    description:
      "Conversion-focused web showcase highlighting room galleries, facility specs, map integration, and direct WhatsApp inquiry links.",
    category: "Frontend & Web Development",
    technologies: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS", "shadcn/ui", "Vitest"],
    demoUrl: "https://znlkostputri.edgeone.dev/",
    hasCiWorkflow: true,
    screenshots: [
      {
        src: "/projects/znl-kost-live.webp",
        alt: "ZNL Kost Putri live web showcase",
        width: 1200,
        height: 750,
        caption: "Live deployment captured at znlkostputri.edgeone.dev",
      },
    ],
    personalContribution:
      "Designed and implemented modular Next.js App Router architecture, Biome + ESLint quality checks, Vitest tests, and CI deployment.",
    projectStatus: "released",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: [
      "https://github.com/Adrian463588/ZNLKostPutri",
      "https://znlkostputri.edgeone.dev/",
    ],
  },

  "FortuneTeller-": {
    repoName: "FortuneTeller-",
    id: "mystical-fortune-teller",
    slug: "mystical-fortune-teller",
    title: "Mystical Fortune Teller",
    subtitle: "Deterministic Multi-Tradition Divination Engine",
    summary:
      "Stateless Next.js + TypeScript web app unifying Western Zodiac, Shio, BaZi, Javanese Primbon, and Feng Shui Kua calculations via a deterministic seeded RNG.",
    description:
      "Zero-database client-side engine deriving reproducible compatibility profiles from pure mathematical calendar transforms and deterministic seeds.",
    category: "Frontend & Web Development",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    demoUrl: "https://fortuneteller.edgeone.dev/",
    screenshots: [
      {
        src: "/projects/fortune-teller-live.webp",
        alt: "Mystical Fortune Teller live web application",
        width: 1200,
        height: 750,
        caption: "Live deployment captured at fortuneteller.edgeone.dev",
      },
    ],
    personalContribution:
      "Solo developer: implemented deterministic seeded RNG, calendar conversion math across five cultural systems, and responsive animated UI.",
    projectStatus: "released",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: [
      "https://github.com/Adrian463588/FortuneTeller-",
      "https://fortuneteller.edgeone.dev/",
    ],
  },

  CollectQuestionaireBFMSRQ: {
    repoName: "CollectQuestionaireBFMSRQ",
    id: "collect-bfm-srq",
    slug: "collect-bfm-srq",
    title: "CollectBFMSRQ Scoring System",
    subtitle: "Next.js + Go + PostgreSQL Automated Instrument Scoring",
    summary:
      "Full-stack Go + Next.js web application automating IPIP-BFM-50 and SRQ-29 questionnaire administration, real-time scoring, and CSV research export.",
    description:
      "Decoupled Next.js App Router frontend and Go PostgreSQL API automating structured psychometric scoring without exposing live study datasets.",
    category: "Data Engineering & Analytics",
    secondaryCategories: ["Backend Engineering", "Research & Academic Projects"],
    technologies: ["Next.js", "TypeScript", "Go", "PostgreSQL", "Framer Motion"],
    screenshots: [],
    personalContribution:
      "Built responsive questionnaire flows, automated scoring formulas, Go REST API handlers, and CSV export endpoints.",
    projectStatus: "completed",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/CollectQuestionaireBFMSRQ"],
  },

  CollectDataPPGECGWEB: {
    repoName: "CollectDataPPGECGWEB",
    id: "experiment-controller-web",
    slug: "experiment-controller-web",
    title: "Experiment Controller Web",
    subtitle: "Next.js + Go (chi/pgx) + PostgreSQL Synchronization Platform",
    summary:
      "Full-stack orchestration web app synchronizing timed protocol phases and millisecond-precision WIB (UTC+7) event markers into PostgreSQL.",
    description:
      "Next.js App Router frontend proxied to a Go chi + pgx backend for deterministic protocol pacing and timestamp logging.",
    category: "Research & Academic Projects",
    secondaryCategories: ["Backend Engineering", "Data Engineering & Analytics"],
    technologies: ["Next.js", "TypeScript", "Go", "chi", "pgx", "PostgreSQL"],
    screenshots: [],
    personalContribution:
      "Built Next.js timing UI, /api-proxy integration, Go chi API routes, SQL migrations, and Makefile orchestration.",
    projectStatus: "completed",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/CollectDataPPGECGWEB"],
  },

  wearquicknotes: {
    repoName: "wearquicknotes",
    id: "wear-quick-notes",
    slug: "wear-quick-notes",
    title: "Wear Quick Notes",
    subtitle: "Voice-First Wear OS Note-Taking App (Compose + Hilt)",
    summary:
      "MIT-licensed Wear OS smartwatch app written in Kotlin, Jetpack Compose for Wear, MVVM Clean Architecture, and Hilt supporting quick voice note capture.",
    description:
      "Minimalist smartwatch note companion tailored for compact round displays and hands-free dictation.",
    category: "Android & Mobile Development",
    technologies: ["Kotlin", "Wear OS", "Jetpack Compose", "Hilt", "MVVM"],
    screenshots: [
      {
        src: "/projects/wear-quick-notes.webp",
        alt: "Wear Quick Notes smartwatch screen preview",
        width: 437,
        height: 478,
        caption: "Wear OS smartwatch UI layout",
      },
    ],
    personalContribution:
      "Built Wear OS Compose screens, voice input flow, Hilt DI wiring, and MVVM state management.",
    projectStatus: "completed",
    projectOrigin: "original",
    tier: "catalog",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/wearquicknotes"],
  },

  // === TIER 3: FORKS, EXPERIMENTS, ACADEMIC & ARCHIVE ===
  HeartRateMonitor: {
    repoName: "HeartRateMonitor",
    id: "heart-rate-monitor",
    slug: "heart-rate-monitor",
    title: "HeartRateMonitor (Extended Fork)",
    subtitle: "Android Phone + Galaxy Watch ECG/PPG & Accelerometer Acquisition",
    summary:
      "Forked and substantially extended multi-module (:mobile, :wear, :shared) Wear OS + Android biosignal platform adding Watch accelerometer capture, Polar ECG fixes, and SAF CSV export.",
    description:
      "Fork of aditydcp/sample-wear-phone-app expanded with synchronized Watch acceleration streams, Polar H10 ECG/HR/RR lifecycle & clock repairs, ordered session controls, and DevSecOps CI history checks.",
    category: "Research & Academic Projects",
    secondaryCategories: ["Android & Mobile Development"],
    technologies: ["Kotlin", "Wear OS", "BLE", "Polar H10", "Samsung Health SDK", "GitHub Actions"],
    releaseUrl: "https://github.com/Adrian463588/HeartRateMonitor/releases/tag/v1.3.1",
    hasCiWorkflow: true,
    screenshots: [],
    upstreamCredit:
      "Forked from aditydcp/sample-wear-phone-app (base phone/watch ECG & PPG sample project).",
    personalContribution:
      "Added Galaxy Watch native accelerometer recording, fixed Polar H10 startup/cancellation/clock alignment, implemented ordered phone-watch session controls & timeouts, built SAF CSV export, and added DevSecOps merge/secret CI guards.",
    projectStatus: "released",
    projectOrigin: "fork",
    tier: "archive",
    featured: false,
    resultsAndLimitations:
      "Debug releases v1.3.0 and v1.3.1 published for internal research workflows; upstream credit preserved.",
    sourceReferences: [
      "https://github.com/Adrian463588/HeartRateMonitor",
      "https://github.com/Adrian463588/HeartRateMonitor/releases/tag/v1.3.1",
    ],
  },

  ProjectGame: {
    repoName: "ProjectGame",
    id: "project-game",
    slug: "project-game",
    title: "Wrath of the Disasters",
    subtitle: "Unity C# 2D Side-Scrolling Action Capstone",
    summary:
      "2D side-scrolling action platformer built in Unity (C#) by Kelompok UbiLembut (UGM), featuring multi-stage elemental enemies, weapon upgrades, and physics collision systems.",
    description:
      "Academic OOP & game programming project set in Kota Gunung Kidal where players battle elemental disaster monsters across progressive stages.",
    category: "Research & Academic Projects",
    technologies: ["Unity", "C#", "Git"],
    demoUrl: "https://youtu.be/XGk-1T3N3SU",
    screenshots: [],
    personalContribution:
      "Co-developer (Kelompok UbiLembut, UGM): implemented player movement/shooting controllers, stage progression, enemy/boss mechanics, and Unity build packaging.",
    projectStatus: "completed",
    projectOrigin: "academic",
    tier: "archive",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/ProjectGame"],
  },

  ProjectBlockChain: {
    repoName: "ProjectBlockChain",
    id: "simple-hotel-booking-solidity",
    slug: "simple-hotel-booking-solidity",
    title: "SimpleHotelBooking Smart Contract",
    subtitle: "Solidity Smart Contract Prototype",
    summary:
      "Educational Ethereum smart contract (SimpleHotelBooking.sol) modeling on-chain hotel room reservation, Ether escrow, cancellation, and balance inspection.",
    category: "Experiments",
    technologies: ["Solidity", "Ethereum", "Smart Contracts"],
    screenshots: [],
    personalContribution:
      "Authored Solidity reservation, cancellation, and balance verification contract logic with documented security limitations.",
    projectStatus: "prototype",
    projectOrigin: "academic",
    tier: "archive",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/ProjectBlockChain"],
  },

  "tugas-project-digital-skola-devops": {
    repoName: "tugas-project-digital-skola-devops",
    id: "digital-skola-devops-fork",
    slug: "digital-skola-devops-fork",
    title: "Digital Skola DevOps CI Fork",
    subtitle: "Containerized Python App & GitHub Actions Lab (Fork)",
    summary:
      "Bootcamp DevOps fork of maliqpotter/tugas-project-digital-skola-devops exercising Dockerfile builds, pytest execution, and GitHub Actions CI workflows.",
    category: "DevOps & DevSecOps",
    technologies: ["Docker", "Python", "pytest", "GitHub Actions"],
    hasCiWorkflow: true,
    upstreamCredit: "Forked from maliqpotter/tugas-project-digital-skola-devops for Digital Skola DevOps lab.",
    personalContribution:
      "Configured CI test/build exercises and containerization tasks within the forked bootcamp workspace.",
    projectStatus: "completed",
    projectOrigin: "fork",
    tier: "archive",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/tugas-project-digital-skola-devops"],
  },

  nearu: {
    repoName: "nearu",
    id: "nearu-gdsc-fork",
    slug: "nearu-gdsc-fork",
    title: "NearU — Google Solution Challenge (Fork)",
    subtitle: "Flutter App by 4teen Team GDSC UGM",
    summary:
      "Fork of dedewanta/nearu, a Flutter mobile submission built by the 4teen Team from GDSC UGM for the Google Solution Challenge.",
    category: "Android & Mobile Development",
    technologies: ["Flutter", "Dart"],
    upstreamCredit: "Forked from dedewanta/nearu (4teen Team GDSC UGM).",
    personalContribution:
      "Collaborated as part of the GDSC UGM team repository fork for Google Solution Challenge.",
    projectStatus: "archived",
    projectOrigin: "fork",
    tier: "archive",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/nearu"],
  },

  "responsi-studi-kasus-1": {
    repoName: "responsi-studi-kasus-1",
    id: "responsi-studi-kasus-1",
    slug: "responsi-studi-kasus-1",
    title: "Responsi Studi Kasus 1 (Fork)",
    subtitle: "UGM Software Engineering Practicum Exercise",
    summary:
      "Forked practicum repository from senpro2023/responsi-studi-kasus-1 containing Python string algorithm exercises.",
    category: "Research & Academic Projects",
    technologies: ["Python"],
    upstreamCredit: "Forked from senpro2023/responsi-studi-kasus-1.",
    personalContribution: "Completed practicum exercise fork submission.",
    projectStatus: "archived",
    projectOrigin: "fork",
    tier: "archive",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/responsi-studi-kasus-1"],
  },

  "senpro-github-action": {
    repoName: "senpro-github-action",
    id: "senpro-github-action",
    slug: "senpro-github-action",
    title: "Senpro GitHub Action Lab (Fork)",
    subtitle: "DTETI FT UGM CI Workflow Practicum",
    summary:
      "Forked from senpro2023/senpro-github-action practicing automated GitHub Actions pipelines for a Next.js practicum project.",
    category: "DevOps & DevSecOps",
    technologies: ["Next.js", "GitHub Actions"],
    hasCiWorkflow: true,
    upstreamCredit: "Forked from senpro2023/senpro-github-action (DTETI FT UGM).",
    personalContribution: "Completed CI workflow configuration exercises on the practicum fork.",
    projectStatus: "archived",
    projectOrigin: "fork",
    tier: "archive",
    featured: false,
    sourceReferences: ["https://github.com/Adrian463588/senpro-github-action"],
  },

  // Exclude self-portfolio, profile README repo, and empty .gitignore-only stubs
  "adrian-portfolio": { repoName: "adrian-portfolio", exclude: true },
  Adrian463588: { repoName: "Adrian463588", exclude: true },
  "OpenMusic-API-v1": { repoName: "OpenMusic-API-v1", exclude: true },
  nusaguardai: { repoName: "nusaguardai", exclude: true },
  "AND-101": { repoName: "AND-101", exclude: true },
  Projek_PBO_BookLoan: { repoName: "Projek_PBO_BookLoan", exclude: true },
  "Super-Bird-Game": { repoName: "Super-Bird-Game", exclude: true },
  "railway-101-sb-test": { repoName: "railway-101-sb-test", exclude: true },
};
