import type { TopicCluster } from "@/types/seo";

export const TOPIC_CLUSTERS: TopicCluster[] = [
  {
    id: "qa-devops-automation",
    name: "QA Test Automation & Multi-Framework Engineering",
    summary:
      "End-to-end browser testing trade-offs, local SessionIR multi-framework code generation, Jenkins CI/CD gates, and deterministic load testing.",
    pillarSlug: "playwright-vs-cypress-cicd-tradeoffs",
    projectSlugs: [
      "automate-plus",
      "demo-evershop-cypress",
      "saucedemo-cypress-bdd-jenkins",
      "notes-app-performance-ci",
      "dual-vm-observability-stack",
    ],
  },
  {
    id: "biosignal-mobile-ai",
    name: "On-Device PPG Biosignal ML & Wear OS Architecture",
    summary:
      "Wearable green/IR photoplethysmography sensing, ECG-grounded research validation, XGBoost feature extraction, and strict non-diagnostic AI boundaries.",
    pillarSlug: "ppg-watch-stress-detection-android-architecture",
    projectSlugs: [
      "android-stress-detection",
      "biosignal-stress-pipeline",
      "heart-rate-monitor",
      "wear-quick-notes",
    ],
  },
  {
    id: "offline-first-android",
    name: "Offline-First Android & Local RAG Architecture",
    summary:
      "Local-first Kotlin Multiplatform and Jetpack Compose utilities backed by SQLite FTS5, sqlite-vec, and LiteRT-LM without telemetry or subscription gates.",
    pillarSlug: "quran-plus-vs-quran-com-muslim-pro-tarteel",
    projectSlugs: [
      "quran-plus",
      "adzan-plus",
      "notif-plus",
      "signal-booster",
    ],
  },
  {
    id: "specialty-coffee-science",
    name: "Specialty Coffee Extraction Math & Android Logging",
    summary:
      "Mass-balance extraction yield equations, Hamilton-Hare pour step scaling, optical refractometry conversions, and offline coffee tracker ecosystems.",
    pillarSlug: "coffee-brew-ratio-extraction-calculator",
    projectSlugs: ["coffee-creator"],
  },
  {
    id: "perfumery-formulation",
    name: "Perfumery Dilution, Mass Balance & Concentration",
    summary:
      "Density-aware gram conversion, carrier vs fragrance material mass ratios, concentration tier thresholds, and heuristic note balance limits.",
    pillarSlug: "perfume-concentration-dilution-calculator",
    projectSlugs: ["parfum-creator"],
  },
];
