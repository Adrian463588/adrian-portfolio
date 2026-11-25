import type { CompetencyGroup } from "@/types";

export const competencies: CompetencyGroup[] = [
  {
    id: "qa-sdet",
    title: "Quality Engineering & Test Automation",
    summary:
      "Manual functional testing, end-to-end Cypress and Playwright test suites, BDD verification, business workflow validation, and regression coverage.",
    icon: "ShieldCheck",
    skills: [
      "Cypress",
      "Manual Functional Testing",
      "Playwright",
      "Selenium",
      "Appium",
      "Cucumber (BDD)",
      "k6 / JMeter",
      "Postman",
    ],
    relatedProjectSlugs: [
      "archer-upgrade",
      "stnk-alignment",
      "automate-plus",
      "demo-evershop-cypress",
    ],
  },
  {
    id: "enterprise-platforms",
    title: "Enterprise Platforms & Modernization QA",
    summary:
      "Functional verification across legacy and enterprise runtime platforms plus parity QA for migrated React-based web applications.",
    icon: "Layers",
    skills: [
      "AOL UniPaaS",
      "Magic xpa",
      "React-based Application Testing",
      "Legacy Modernization QA",
      "UAT & Regression",
      "Defect Triage",
    ],
    relatedProjectSlugs: [
      "archer-upgrade",
      "stnk-alignment",
      "advanced-joint-finance-parameter",
    ],
  },
  {
    id: "devops-sec",
    title: "DevOps, CI/CD & DevSecOps",
    summary:
      "Automated test pipelines in Jenkins and GitHub Actions, Docker/Kubernetes infrastructure, observability stacks, and vulnerability scanning.",
    icon: "Container",
    skills: [
      "Jenkins",
      "GitHub Actions",
      "Docker",
      "Kubernetes",
      "Terraform",
      "Prometheus",
      "Grafana",
      "Gitleaks / Nuclei",
    ],
    relatedProjectSlugs: [
      "archer-upgrade",
      "dual-vm-observability-stack",
      "gke-terraform-hpa-autoscaling",
      "auu-ahh-cafe-menu",
    ],
  },
  {
    id: "fintech-backend",
    title: "Financial Systems & Backend",
    summary:
      "Automotive financing domain testing (Joint Financing, Collection, STNK workflows) alongside Clean Architecture Go and Laravel REST APIs.",
    icon: "Server",
    skills: [
      "Automotive Financing",
      "Joint Financing Workflows",
      "Collection Workflows",
      "STNK Process Validation",
      "Go (Gin / chi)",
      "Laravel (PHP)",
      "PostgreSQL / MySQL",
    ],
    relatedProjectSlugs: [
      "advanced-joint-finance-parameter",
      "stnk-alignment",
      "ledger-scope",
      "go-online-shop",
    ],
  },
  {
    id: "android-mobile",
    title: "Android & Wear OS Engineering",
    summary:
      "Offline-first Jetpack Compose apps, Clean MVVM, KMP domain modules, Room FTS4, Hilt DI, Glance widgets, and Wear OS companions.",
    icon: "Smartphone",
    skills: ["Kotlin", "Jetpack Compose", "Material 3", "Room", "Hilt", "Wear OS", "KMP", "R8 / ProGuard"],
    relatedProjectSlugs: ["quran-plus", "english-prep-ai", "adzan-plus", "signal-booster", "notif-plus"],
  },
  {
    id: "applied-ai",
    title: "Applied AI & Desktop Systems",
    summary:
      "On-device LLM/RAG inference (LiteRT-LM, llama.cpp, sqlite-vec), Rust/Tauri 2 desktop harnesses, Next.js interfaces, and MLflow pipelines.",
    icon: "Cpu",
    skills: ["LiteRT-LM", "ONNX Runtime", "llama.cpp", "Whisper", "Rust / Tauri 2", "Python", "FastAPI"],
    relatedProjectSlugs: ["chat-buddy", "med-bot", "credit-risk-mlops", "video-editor-free"],
  },
];
