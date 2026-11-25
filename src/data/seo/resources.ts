import type { SeoResourceEntry } from "@/types/seo";

export const SEO_RESOURCES: SeoResourceEntry[] = [
  {
    slug: "coffee-brew-ratio-extraction-calculator",
    title: "Coffee Brew Ratio, Extraction Yield & Recipe Scaler",
    seoTitle: "Coffee Brew Ratio & Extraction Yield Calculator",
    metaDescription:
      "Free offline-capable coffee brew ratio, mass-balance extraction yield (EY%), and Hamilton-Hare pour-step scaler based on Coffee Creator math.",
    kind: "tool",
    clusterId: "specialty-coffee-science",
    status: "published",
    indexable: true,
    reviewedAt: "2026-11-26T00:00:00Z",
    readingTimeMinutes: 6,
    directAnswer:
      "Brew ratio equals water mass divided by dry dose (1:W/D), while cup-only Extraction Yield (EY%) equals (Measured Beverage Mass x Measured TDS%) / Dry Dose. For multi-pour V60 recipes, Hamilton-Hare largest-remainder rounding keeps scaled pour steps equal to the exact target water mass.",
    disclosure:
      "First-party engineering reference: equations below mirror CoffeeScienceEngine in the open Coffee Creator Android project.",
    limitations:
      "Cup-only mass balance assumes coffee-derived dissolved solids without milk, sugar, or syrups. Total immersion methods retain dissolved solids in spent grounds, so cup EY% omits retained solubles.",
    toolId: "coffee-extraction-calculator",
    sections: [
      {
        id: "mass-balance-math",
        heading: "1. Cup-Only Mass Balance & TDS Measurement Discipline",
        paragraphs: [
          "Brewers often multiply initial pour water by refractometer Total Dissolved Solids (TDS%) when estimating Extraction Yield, which inflates results because coffee grounds absorb roughly 1.8x to 2.2x their dry mass in liquid.",
          "In CoffeeScienceEngine, percolation extraction yield requires measured beverage weight inside the server rather than inferred kettle water. Every step uses explicit unit guards (mass in grams, concentration in % w/w) and rejects physically impossible results exceeding 100% of dose mass.",
        ],
        bullets: [
          "Brew Ratio = Water Mass (g) / Coffee Dose (g), reported cleanly as 1:R.",
          "Extraction Yield (%) = (Beverage Mass (g) x Measured TDS (%)) / Dose (g).",
          "Upper physical guard rejects inputs where dissolved coffee solids exceed dry dose weight.",
        ],
      },
      {
        id: "hamilton-hare-scaling",
        heading: "2. Why Pour Steps Use Hamilton-Hare Apportionment",
        paragraphs: [
          "Naive per-step rounding when scaling a 250 g pour-over recipe up to 420 g frequently leaves a 0.2 g to 0.5 g cumulative mismatch between individual pour steps and the final target mass.",
          "Applying the Hamilton-Hare largest-remainder method at a 0.1 g quantum allocates fractional remainders to the largest remainders first, preserving monotonic cumulative pour checkpoints on a digital scale.",
        ],
        codeSnippet: {
          caption: "Ported invariant from CoffeeScienceEngine.scaleRecipeSteps",
          language: "kotlin",
          code: "val totalQuantums = targetWater.divide(quantum, 0, RoundingMode.HALF_UP).toInt()\nval deficit = (totalQuantums - allocated).coerceIn(0, items.size)\n// Assign +1 quantum to steps with largest fractional remainders",
        },
      },
    ],
    faq: [
      {
        question: "Why must beverage weight be measured instead of brew water weight?",
        answer:
          "Spent coffee grounds retain water during percolation. Multiplying kettle water by TDS overestimates dissolved mass in the cup.",
      },
      {
        question: "Does this calculator infer extraction yield without a refractometer?",
        answer:
          "No. Without a measured TDS reading, brew ratio calculation remains valid while Extraction Yield requires an explicit optical or oven-dried TDS input.",
      },
      {
        question: "Where does this math run on mobile?",
        answer:
          "Coffee Creator executes the identical BigDecimal engine offline on Android alongside Bluetooth scale timers and CVA sensory sheets.",
      },
    ],
    relatedProjectSlugs: ["coffee-creator"],
    relatedResourceSlugs: ["beanconqueror-and-filtru-alternatives-android"],
    competitorIds: ["beanconqueror", "filtru"],
    sources: [
      "https://github.com/Adrian463588/coffee-creator/blob/main/app/src/main/java/com/coffeecreator/app/core/engine/CoffeeScienceEngine.kt",
      "https://beanconqueror.com",
    ],
  },
  {
    slug: "perfume-concentration-dilution-calculator",
    title: "Perfume Concentration & Dilution Batch Calculator",
    seoTitle: "Perfume Concentration & Batch Dilution Calculator",
    metaDescription:
      "Calculate fragrance oil percentage, EDP/EDT/Extrait concentration bands, target batch weights, and top/heart/base note ratios based on ParfumCreator.",
    kind: "tool",
    clusterId: "perfumery-formulation",
    status: "published",
    indexable: true,
    reviewedAt: "2026-11-26T00:00:00Z",
    readingTimeMinutes: 5,
    directAnswer:
      "Fragrance concentration equals (Non-Solvent Fragrance Oil Mass / Total Formula Weight) x 100%. Standard classification brackets treat >=20% as Parfum Extrait, 15%–20% as Eau de Parfum (EDP), 8%–15% as Eau de Toilette (EDT), 4%–8% as Eau de Cologne (EDC), and <4% as Eau Fraiche.",
    disclosure:
      "First-party engineering reference: equations mirror FormulaCalculationEngine and NativeSecurityBridge in ParfumCreator.",
    limitations:
      "The Scent Profile Level (SPL) metric is an unvalidated structural weight heuristic and does not predict real skin sillage, projection, longevity, or IFRA Category 4 dermal safety limits.",
    toolId: "perfume-concentration-calculator",
    sections: [
      {
        id: "solvent-classification",
        heading: "1. Distinguishing Carrier Solvents From Aromatic Mass",
        paragraphs: [
          "Accurate concentration percentage requires excluding clean carrier solvents (such as ethanol, dipropylene glycol, triethyl citrate, IPM, MCT oil, and distilled water) from the aromatic numerator while keeping them in total solution mass.",
          "In ParfumCreator, diluted aromatic specialties whose exact internal diluent percentage is unknown are intentionally kept in the aromatic mass rather than fabricated, preventing misleading IFRA or yield numbers.",
        ],
        bullets: [
          "Parfum Extrait: >= 20% fragrance oil by weight.",
          "Eau de Parfum (EDP): 15.0% to < 20.0% by weight.",
          "Eau de Toilette (EDT): 8.0% to < 15.0% by weight.",
          "Eau de Cologne (EDC): 4.0% to < 8.0% by weight.",
        ],
      },
      {
        id: "heuristic-spl-boundaries",
        heading: "2. Heuristic Note Balance & Safety Disclaimers",
        paragraphs: [
          "ParfumCreator computes a structural balance score weighting Top notes at 0.5, Middle/Heart notes at 1.0, and Base notes at 1.5 relative to overall concentration. This gives formulators an immediate sanity check when top-heavy citrus accords shift toward amber or woody anchors.",
          "Because vapor pressure, fixative interactions, skin chemistry, and IFRA restricted substances depend on CAS-level molecular data rather than macro note labels, every output treats SPL strictly as a comparative drafting aid.",
        ],
        codeSnippet: {
          caption: "Heuristic note balance implemented in NativeSecurityBridge",
          language: "kotlin",
          code: "val noteWeightFactor = ((normBase * 1.5) + (normMid * 1.0) + (normTop * 0.5)) / 3.0\nval spl = (concentrationPct * noteWeightFactor).coerceIn(0.0, 100.0)",
        },
      },
    ],
    faq: [
      {
        question: "Why convert mL to grams using specific gravity before scaling?",
        answer:
          "Essential oils, resins, and perfumer alcohol differ in density. Weighing ingredients directly in grams avoids volume contraction and density drift across batches.",
      },
      {
        question: "Does this calculator verify IFRA Category 4 compliance?",
        answer:
          "No. You must check CAS-level restricted constituent limits against official IFRA Amendments for every raw oil and specialty base before skin application or sale.",
      },
    ],
    relatedProjectSlugs: ["parfum-creator"],
    relatedResourceSlugs: ["coffee-brew-ratio-extraction-calculator"],
    competitorIds: ["perfumersworld"],
    sources: [
      "https://github.com/Adrian463588/ParfumCreator/blob/main/app/src/main/kotlin/com/parfumecreator/domain/engine/FormulaCalculationEngine.kt",
      "https://github.com/Adrian463588/ParfumCreator/blob/main/app/src/main/kotlin/com/parfumecreator/domain/model/Enums.kt",
    ],
  },
  {
    slug: "automate-plus-vs-selenium-ide-katalon",
    title: "AutomatePlus vs Selenium IDE vs Katalon Studio",
    seoTitle: "AutomatePlus vs Selenium IDE & Katalon Studio",
    metaDescription:
      "Architectural comparison of local code-exporting QA recorders: AutomatePlus SessionIR vs open-source Selenium IDE and commercial Katalon Studio.",
    kind: "comparison",
    clusterId: "qa-devops-automation",
    status: "published",
    indexable: true,
    reviewedAt: "2026-11-26T00:00:00Z",
    readingTimeMinutes: 7,
    directAnswer:
      "Selenium IDE suits quick W3C browser extensions exporting raw WebDriver scripts, Katalon provides an all-in-one commercial IDE spanning Web/Mobile/API under proprietary projects, and AutomatePlus (currently v1.7.1 portable preview) compiles a local SessionIR into clean Web, Android, and API suites using Tauri 2 and Rust without cloud lock-in.",
    disclosure:
      "Disclosure: Adrian Syah Abidin authored AutomatePlus. Claims below distinguish shipped code-export capabilities from disabled preview features.",
    limitations:
      "AutomatePlus v1.7.1 is a portable Windows x64 preview (requires WebView2 Runtime). Unverified live recording/execution runtime bridges remain explicitly gated as disabled or Blocked rather than claimed production-ready.",
    comparisonMatrix: {
      columns: [
        { key: "criterion", label: "Capability" },
        { key: "automateplus", label: "AutomatePlus (v1.7.1 Preview)", isFirstParty: true },
        { key: "selenium-ide", label: "Selenium IDE" },
        { key: "katalon", label: "Katalon Studio / Platform" },
      ],
      rows: [
        {
          criterion: "Architecture & Runtime",
          values: {
            automateplus: "Windows desktop (Tauri 2 + Rust + TypeScript), zero telemetry or cloud control plane",
            "selenium-ide": "Browser extension (Chrome, Firefox, Edge)",
            katalon: "Commercial desktop IDE + optional TestOps SaaS analytics",
          },
        },
        {
          criterion: "Exported Code Targets",
          values: {
            automateplus: "SessionIR compiles into 27 Web (Playwright/Cypress/Selenium/Puppeteer/Robot), Android (Appium/Espresso/Maestro/Robolectric), and API (HTTP/k6) targets",
            "selenium-ide": "C# NUnit, Java JUnit, JS Mocha, Python pytest, Ruby RSpec",
            katalon: "Internal Groovy/Java Manual + Script dual-view inside Katalon project format",
          },
        },
        {
          criterion: "Vendor Lock-In",
          values: {
            automateplus: "None for exported code; standalone Git-friendly project output",
            "selenium-ide": "None; outputs standard Selenium WebDriver calls",
            katalon: "Moderate-high; tied to Katalon runtime & licensing for enterprise CI scale",
          },
        },
        {
          criterion: "Maturity & Production Caveat",
          values: {
            automateplus: "Preview build; code generation tested while live device execution bridges remain gated",
            "selenium-ide": "Mature W3C extension; Web-only scope",
            katalon: "Established enterprise suite across Web, Mobile, API, and Desktop",
          },
        },
      ],
    },
    sections: [
      {
        id: "ir-vs-raw-recording",
        heading: "1. Intermediate Representation (SessionIR) vs Raw Recording",
        paragraphs: [
          "Browser recorders like Selenium IDE excel at rapid click-and-type capture, yet raw WebDriver scripts suffer from selector fragility and remain locked to single-platform browser flows. When QA teams later introduce mobile regression or API stress tests, they maintain separate toolchains.",
          "AutomatePlus models actions as a neutral SessionIR graph first, then passes the verified structure through TypeScript generator packages spanning Playwright, Cypress, Appium, Maestro, HTTP clients, and k6 stress scenarios.",
        ],
        bullets: [
          "Prefer Selenium IDE when you want a zero-install browser extension to draft WebDriver snippets in seconds.",
          "Prefer Katalon Studio when non-coding manual testers need a managed commercial SaaS suite spanning TestOps and device clouds.",
          "Explore AutomatePlus to evaluate local Rust/Tauri SessionIR synthesis outputting idiomatic code across Web, Android, and API repositories.",
        ],
      },
      {
        id: "truthful-boundaries",
        heading: "2. Explicit Preview Limitations in AutomatePlus v1.7.1",
        paragraphs: [
          "Engineering credibility depends on stating what does not work yet alongside what ships cleanly. In AutomatePlus v1.7.1, the contract schemas, capability matrix parsers, and multi-target generators execute under local Vitest contracts, whereas unverified runtime device recorders remain marked Blocked in the UI rather than faked.",
        ],
      },
    ],
    faq: [
      {
        question: "Can AutomatePlus replace Playwright Codegen today?",
        answer:
          "Playwright Codegen remains the fastest production CLI when your team writes exclusively Playwright suites. AutomatePlus focuses on generating multi-stack scaffolds (Web, Android, API, k6) from one shared SessionIR definition.",
      },
      {
        question: "Does Katalon allow completely free commercial CI scaling?",
        answer:
          "While Katalon has free tiers, distributed CI orchestration and TestOps analytics are gated behind paid enterprise licensing per Katalon documentation.",
      },
    ],
    relatedProjectSlugs: ["automate-plus", "demo-evershop-cypress", "saucedemo-cypress-bdd-jenkins"],
    relatedResourceSlugs: ["playwright-vs-cypress-cicd-tradeoffs"],
    competitorIds: ["selenium-ide", "katalon", "playwright", "cypress"],
    sources: [
      "https://github.com/Adrian463588/AutomatePlus",
      "https://www.selenium.dev/selenium-ide/",
      "https://katalon.com",
      "https://playwright.dev",
    ],
  },
  {
    slug: "playwright-vs-cypress-cicd-tradeoffs",
    title: "Playwright vs Cypress in CI/CD & Cross-Origin E2E",
    seoTitle: "Playwright vs Cypress: CI/CD & Cross-Origin Trade-Offs",
    metaDescription:
      "Evidence-based engineering comparison of Playwright and Cypress for parallel CI workers, cross-origin flows, language support, and Jenkins/GitHub Actions pipelines.",
    kind: "comparison",
    clusterId: "qa-devops-automation",
    status: "published",
    indexable: true,
    reviewedAt: "2026-11-26T00:00:00Z",
    readingTimeMinutes: 6,
    directAnswer:
      "Choose Playwright for free cross-machine parallel sharding, WebKit coverage, multi-tab or multi-origin workflows, and multi-language teams (JS/TS, Python, Java, .NET). Choose Cypress when tight in-browser time-travel component debugging inside a single JS/TS frontend repository outweighs multi-tab or paid cloud parallelization limits.",
    disclosure:
      "Independent engineering evaluation comparing third-party frameworks from official Playwright and Cypress documentation alongside live repository pipelines.",
    comparisonMatrix: {
      columns: [
        { key: "dimension", label: "Engineering Dimension" },
        { key: "playwright", label: "Playwright" },
        { key: "cypress", label: "Cypress" },
      ],
      rows: [
        {
          criterion: "Execution Boundary",
          values: {
            playwright: "Out-of-process via DevTools/WebSocket protocols",
            cypress: "In-process inside the browser event loop",
          },
        },
        {
          criterion: "Supported Languages",
          values: {
            playwright: "TypeScript, JavaScript, Python, Java, .NET",
            cypress: "JavaScript and TypeScript only",
          },
        },
        {
          criterion: "Multi-Tab & Cross-Origin",
          values: {
            playwright: "Native multi-tab contexts & cross-origin pages",
            cypress: "Single-tab core; cross-origin requires explicit cy.origin() blocks",
          },
        },
        {
          criterion: "CI Parallel Sharding Cost",
          values: {
            playwright: "Built-in free worker scaling & --shard splitting",
            cypress: "Open-source single-node core; cloud parallel orchestration via Cypress Cloud",
          },
        },
        {
          criterion: "Diagnostic Replay",
          values: {
            playwright: "Trace Viewer (DOM snapshot + network + console timeline)",
            cypress: "In-runner Command Log with live state time-travel",
          },
        },
      ],
    },
    sections: [
      {
        id: "in-process-vs-out-of-process",
        heading: "1. Why Execution Boundaries Decide Flake Patterns",
        paragraphs: [
          "Cypress runs directly alongside application code inside the browser, giving frontend developers synchronous DOM inspection and straightforward XHR interception via cy.intercept(). That design becomes restrictive when payment gateways or OAuth logins open secondary tabs or external origins.",
          "Playwright communicates from outside the browser across isolated BrowserContexts. Each test receives clean cookies, localStorage, and multi-window capabilities with negligible context startup cost—why modern Next.js portfolios and static verification harnesses pair cleanly with Playwright + axe-core.",
        ],
      },
      {
        id: "jenkins-and-bdd-practice",
        heading: "2. Practical Selection in Enterprise & Portfolio Pipelines",
        paragraphs: [
          "For BDD-heavy TypeScript teams integrating Cucumber reports directly into Jenkins pipelines, Cypress remains clean and readable when test flows stay inside one primary domain—as implemented in this portfolio's EverShop and SauceDemo Cypress frameworks.",
          "Once pipelines expand across static audits, multi-viewport matrices (320px to 1920px), WebGL canvas fallback tests, and parallel CI workers without SaaS dashboard cost, Playwright eliminates structural bottlenecks.",
        ],
      },
    ],
    faq: [
      {
        question: "Can Playwright and Cypress both run in headless CI containers?",
        answer:
          "Yes. Both support Docker/Linux CI execution in Jenkins and GitHub Actions; Playwright additionally bundles Chromium, Firefox, and WebKit binaries consistently.",
      },
      {
        question: "Does Playwright auto-wait assertions like Cypress?",
        answer:
          "Yes. Playwright web-first assertions retry actionability checks (attached, visible, stable, enabled) automatically before throwing timeout errors.",
      },
    ],
    relatedProjectSlugs: ["demo-evershop-cypress", "saucedemo-cypress-bdd-jenkins", "automate-plus"],
    relatedResourceSlugs: ["automate-plus-vs-selenium-ide-katalon"],
    competitorIds: ["playwright", "cypress"],
    sources: [
      "https://playwright.dev",
      "https://docs.cypress.io",
      "https://github.com/Adrian463588/demo-evershop-cypress",
    ],
  },
  {
    slug: "beanconqueror-and-filtru-alternatives-android",
    title: "Beanconqueror vs Filtru vs Coffee Creator on Android",
    seoTitle: "Beanconqueror & Filtru Alternatives for Android",
    metaDescription:
      "Comparison of offline coffee brewing trackers: Beanconqueror open-source scale logging, Filtru Apple-centric UX, Brewfather disambiguation, and Coffee Creator Android AI.",
    kind: "alternative",
    clusterId: "specialty-coffee-science",
    status: "published",
    indexable: true,
    reviewedAt: "2026-11-26T00:00:00Z",
    readingTimeMinutes: 6,
    directAnswer:
      "Beanconqueror leads for open-source multi-brand Bluetooth scale telemetry across Android and iOS, Filtru shines for Apple Live Activities and watch haptics, and Coffee Creator serves Android 8+ users wanting native Material 3 timers, SCA CVA cupping forms, offline OCR bag extraction, and precision mass-balance calculators—while Brewfather serves beer homebrewing, not filter coffee.",
    disclosure:
      "Disclosure: Adrian Syah Abidin built Coffee Creator. Comparisons cite verified public websites and repositories.",
    comparisonMatrix: {
      columns: [
        { key: "aspect", label: "Criteria" },
        { key: "beanconqueror", label: "Beanconqueror" },
        { key: "filtru", label: "Filtru Coffee" },
        { key: "coffee-creator", label: "Coffee Creator (v1.14.7)", isFirstParty: true },
      ],
      rows: [
        {
          criterion: "License & Storage",
          values: {
            beanconqueror: "Free open-source, 100% local storage",
            filtru: "Commercial freemium (Filtru Pro)",
            "coffee-creator": "Public Android source repository, 100% offline local DB + ObjectBox vectors",
          },
        },
        {
          criterion: "Primary Platform Focus",
          values: {
            beanconqueror: "Cross-platform Android + iOS",
            filtru: "iOS / Apple Watch flagship UX",
            "coffee-creator": "Native Android (Kotlin, Jetpack Compose, Material 3, API 26–35)",
          },
        },
        {
          criterion: "Bluetooth Scales",
          values: {
            beanconqueror: "Extensive hardware matrix (Decent, Acaia, Felicita, Skale2, pressensor)",
            filtru: "Acaia, Timemore, Felicita, DiFluid scales",
            "coffee-creator": "Manual haptic/alarm pour timers + BLE scale abstraction layer",
          },
        },
        {
          criterion: "Sensory & On-Device AI",
          values: {
            beanconqueror: "30+ structured parameters & roast/water logs",
            filtru: "Step timers & tasting notes",
            "coffee-creator": "SCA CVA cupping evaluation forms, offline Tesseract bag OCR, local Gemma 4 RAG",
          },
        },
      ],
    },
    sections: [
      {
        id: "choosing-right-tracker",
        heading: "1. Choosing Between Scale Telemetry, iOS Polish, and Android CVA Tools",
        paragraphs: [
          "When searching for Android alternatives to Filtru, many baristas evaluate Beanconqueror first because it is open source, ad-free, and supports real-time pressure/flow graphs from wide Bluetooth scale hardware.",
          "Meanwhile, brewers comparing apps sometimes stumble onto Brewfather; per official documentation at brewfather.app, Brewfather targets grain mash pH, IBU bitterness, and beer fermentation rather than filter coffee percolation or CVA sensory evaluation.",
        ],
      },
      {
        id: "where-coffee-creator-fits",
        heading: "2. Where Coffee Creator Fits",
        paragraphs: [
          "Coffee Creator focuses specifically on Android tactile ergonomics (direct alarm-grade haptics tested on Galaxy S20 Ultra), deterministic BigDecimal extraction math, SCA CVA cupping scoring, and local OCR bag capture without uploading bean history to cloud servers.",
        ],
      },
    ],
    faq: [
      {
        question: "Does Brewfather replace Beanconqueror or Filtru for pour-over coffee?",
        answer:
          "No. Brewfather is dedicated craft beer and cider brewing software covering IBU, SRM, and hydrometer telemetry rather than coffee dialing.",
      },
      {
        question: "Can I try Coffee Creator extraction math without installing an APK?",
        answer:
          "Yes. Use our online Coffee Brew Ratio & Extraction Yield Calculator running the same CoffeeScienceEngine formulas in your browser.",
      },
    ],
    relatedProjectSlugs: ["coffee-creator"],
    relatedResourceSlugs: ["coffee-brew-ratio-extraction-calculator"],
    competitorIds: ["beanconqueror", "filtru", "brewfather"],
    sources: [
      "https://beanconqueror.com",
      "https://github.com/graphefruit/Beanconqueror",
      "https://getfiltru.com",
      "https://brewfather.app",
      "https://github.com/Adrian463588/coffee-creator",
    ],
  },
  {
    slug: "quran-plus-vs-quran-com-muslim-pro-tarteel",
    title: "QuranPlus vs Quran.com, Muslim Pro & Tarteel",
    seoTitle: "QuranPlus vs Quran.com, Muslim Pro & Tarteel",
    metaDescription:
      "Comparison of Android Quran study apps: Quran for Android open-source reader, Tarteel AI recitation check, Muslim Pro lifestyle suite, and offline QuranPlus RAG.",
    kind: "alternative",
    clusterId: "offline-first-android",
    status: "published",
    indexable: true,
    reviewedAt: "2026-11-26T00:00:00Z",
    readingTimeMinutes: 6,
    directAnswer:
      "Quran for Android (Quran.com) leads as an open-source, ad-free mushaf reader; Tarteel specializes in cloud AI recitation mistake detection; Muslim Pro provides an all-in-one freemium lifestyle suite with streaming; and QuranPlus unifies 30-Juz word-by-word reading, 9-kitab Hadith FTS5 search, and local on-device RAG Q&A cleanly offline.",
    disclosure:
      "Disclosure: Adrian Syah Abidin authored QuranPlus. Features reflect official documentation verified as of 2026-11-26.",
    comparisonMatrix: {
      columns: [
        { key: "feature", label: "Capability" },
        { key: "quranplus", label: "QuranPlus (v1.0.13)", isFirstParty: true },
        { key: "quran-com", label: "Quran.com (Android)" },
        { key: "tarteel", label: "Tarteel" },
        { key: "muslim-pro", label: "Muslim Pro" },
      ],
      rows: [
        {
          criterion: "Monetization / Ads",
          values: {
            quranplus: "Free open-source APK, zero ads",
            "quran-com": "Free GPL-3.0 open-source, zero ads",
            tarteel: "Freemium AI subscription",
            "muslim-pro": "Ad-supported free tier + Premium subscription",
          },
        },
        {
          criterion: "Offline Corpus Scope",
          values: {
            quranplus: "30 Juz (6,236 ayah), 77k+ word-by-word entries, Kemenag tajwid, 9-kitab Hadith",
            "quran-com": "Downloadable Madani mushaf images, multi-language tafsir, audio",
            tarteel: "Adaptive mushaf & memorization tracking",
            "muslim-pro": "Quran translations (40+ languages), prayer times, Qalbox streaming",
          },
        },
        {
          criterion: "AI Architecture",
          values: {
            quranplus: "On-device LiteRT-LM + ONNX + sqlite-vec local RAG citation",
            "quran-com": "No bundled LLM Q&A",
            tarteel: "AI voice search & live tashkeel/word memorization detection",
            "muslim-pro": "Standard search & content recommendation",
          },
        },
      ],
    },
    sections: [
      {
        id: "matching-study-goal",
        heading: "1. Picking the Right App by Study Workflow",
        paragraphs: [
          "Users comparing Android Quran apps often ask for different strengths: lightweight mushaf page reading without distractions, active memorization audio feedback, or broad prayer and streaming features.",
          "Quran for Android remains unmatched for community-backed multi-language tafsir downloads and GPL transparency. Tarteel targets hifz memorizers needing word-level mistake detection while reciting aloud. Muslim Pro wraps prayer alerts, media streaming, and global onboarding behind a mainstream consumer suite.",
        ],
      },
      {
        id: "local-rag-and-hadith",
        heading: "2. Offline Word-by-Word + 9-Kitab Hadith + Local RAG in QuranPlus",
        paragraphs: [
          "QuranPlus approaches the Android 12+ offline-first boundary differently: bundling Kemenag RI-aligned color Tajwid rendered natively with Jetpack Compose AnnotatedString, SQLite FTS5 indexing across Arabic and Indonesian translation text, plus on-device sqlite-vec embeddings for grounded reference lookup without external telemetry.",
        ],
      },
    ],
    faq: [
      {
        question: "Does QuranPlus replace Tarteel's live audio recitation checker?",
        answer:
          "No. QuranPlus prioritizes local text search, word-by-word Tajwid study, 9-kitab Hadith reference, and local RAG rather than live voice mistake detection during recitation.",
      },
      {
        question: "Does QuranPlus send questions to cloud LLMs by default?",
        answer:
          "No. QuranPlus is built around on-device LiteRT-LM and sqlite-vec vector lookup so text queries stay on the phone.",
      },
    ],
    relatedProjectSlugs: ["quran-plus", "adzan-plus"],
    relatedResourceSlugs: ["ppg-watch-stress-detection-android-architecture"],
    competitorIds: ["quran-com-android", "muslim-pro", "tarteel"],
    sources: [
      "https://github.com/Adrian463588/QuranPlus",
      "https://github.com/quran/quran_android",
      "https://www.tarteel.ai",
      "https://www.muslimpro.com",
    ],
  },
  {
    slug: "ppg-watch-stress-detection-android-architecture",
    title: "Wear OS PPG Stress Detection Architecture on Android",
    seoTitle: "Wear OS PPG Stress Detection Android Architecture",
    metaDescription:
      "Technical architecture breakdown of single-channel Green/IR PPG inference on Galaxy Watch and Android versus ECG research validation, plus non-diagnostic AI guardrails.",
    kind: "guide",
    clusterId: "biosignal-mobile-ai",
    status: "published",
    indexable: true,
    reviewedAt: "2026-11-26T00:00:00Z",
    readingTimeMinutes: 7,
    directAnswer:
      "In the Android Stress Detection architecture, a Wear OS watch streams single-channel Green and IR PPG waveforms to an Android phone for local feature extraction and inference (run 20260916T132736Z), while ECG serves strictly as offline research ground-truth validation inside the training pipeline—never as an app runtime input.",
    limitations:
      "Outputs are explicitly non-diagnostic decision-support indicators for engineering evaluation only—not clinical diagnosis, medical advice, or lie detection.",
    sections: [
      {
        id: "sensor-separation",
        heading: "1. Separating Watch Acquisition, Phone Inference & ECG Ground Truth",
        paragraphs: [
          "Consumer smartwatches measure photoplethysmography (PPG) through optical LEDs rather than continuous clinical ECG leads. Confusing research-lab ECG features with watch deployment leads to unrunnable mobile models.",
          "Our paired repositories split responsibilities cleanly: the offline biosignal training pipeline aligns PPG channels against ECG reference labels during cross-validation, while the production Android and Wear OS apps evaluate Green and IR PPG channels separately (keeping Red strictly diagnostic).",
        ],
        bullets: [
          "Watch companion (Wear OS v0.1.1): interfaces with Samsung Health Sensor SDK locally without bundling proprietary AARs inside public Git history.",
          "Phone core (v0.1.5): runs signal quality checks, local model inference locked to run 20260916T132736Z, history storage, and offline Verbatim+ speech via Sherpa-ONNX v1.13.4.",
          "Automated DevSecOps gates (Gitleaks + checksum verification) enforce zero exposed participant metadata or unsigned binary misuse before publication.",
        ],
      },
      {
        id: "decision-support-contract",
        heading: "2. Why Non-Diagnostic Disclaimers Are Architectural Requirements",
        paragraphs: [
          "Optical wrist PPG degrades under motion artifacts, ambient light leaks, strap looseness, and skin perfusion shifts. Surfacing calibrated signal-quality warnings and explicit non-clinical copy protects end users from misinterpreting autonomic arousal heuristics as medical diagnoses.",
        ],
      },
    ],
    faq: [
      {
        question: "Does the Android phone app require live ECG chest straps?",
        answer:
          "No. ECG was used solely as validation reference during offline model training; phone inference operates on single-channel PPG streams from the watch.",
      },
      {
        question: "Why is Samsung Health Sensor SDK not committed directly to Git?",
        answer:
          "Distributor licensing prohibits redistributing vendor proprietary SDK AAR artifacts in public version control; Gradle resolves verified local/upstream checksums cleanly during build.",
      },
    ],
    relatedProjectSlugs: ["android-stress-detection", "biosignal-stress-pipeline", "heart-rate-monitor"],
    relatedResourceSlugs: ["quran-plus-vs-quran-com-muslim-pro-tarteel"],
    competitorIds: [],
    sources: [
      "https://github.com/Adrian463588/android-stress-detection",
      "https://github.com/Adrian463588/biosignal-stress-pipeline",
    ],
  },
  // Intentionally gated review/draft records proving exclusion from sitemap & static HTML output
  {
    slug: "adzan-plus-vs-al-azan-offline-prayer",
    title: "AdzanPlus vs Al-Azan Offline Prayer Timing Architecture",
    seoTitle: "AdzanPlus vs Al-Azan Prayer App Comparison",
    metaDescription:
      "Pending comparative audit of AdzanPlus Kotlin Multiplatform astronomy engine versus Al-Azan no-internet-permission architecture.",
    kind: "alternative",
    clusterId: "offline-first-android",
    status: "review",
    indexable: false,
    reviewedAt: "2026-11-26T00:00:00Z",
    readingTimeMinutes: 4,
    directAnswer: "Pending full feature parity verification across notification scheduling and calculation methods.",
    disclosure: "Draft comparison pending complete verification; excluded from production indexing.",
    sections: [
      {
        id: "draft-pending",
        heading: "Pending Editorial Verification",
        paragraphs: ["This entry remains gated in review status until direct benchmark and code checks conclude."],
      },
    ],
    faq: [],
    relatedProjectSlugs: ["adzan-plus"],
    relatedResourceSlugs: [],
    competitorIds: ["al-azan-compose"],
    sources: ["https://github.com/meypod/al-azan-compose", "https://github.com/Adrian463588/AdzanPlus"],
  },
  {
    slug: "parfum-creator-vs-perfumers-world-comparison",
    title: "ParfumCreator vs PerfumersWorld Software Workflow",
    seoTitle: "ParfumCreator vs PerfumersWorld Comparison",
    metaDescription:
      "Pending comparison of ParfumCreator offline Android C++ formulation engine against PerfumersWorld commercial workbook suites.",
    kind: "comparison",
    clusterId: "perfumery-formulation",
    status: "draft",
    indexable: false,
    reviewedAt: "2026-11-26T00:00:00Z",
    readingTimeMinutes: 4,
    directAnswer: "Pending independent verification of commercial PerfumersWorld licensing tiers and desktop exports.",
    disclosure: "Draft comparison blocked from publication until commercial specs are verified.",
    sections: [
      {
        id: "draft-pending",
        heading: "Draft Status Notice",
        paragraphs: ["Unverified commercial tiers are never published without primary source confirmation."],
      },
    ],
    faq: [],
    relatedProjectSlugs: ["parfum-creator"],
    relatedResourceSlugs: [],
    competitorIds: ["perfumersworld"],
    sources: ["https://www.perfumersworld.com", "https://github.com/Adrian463588/ParfumCreator"],
  },
];
