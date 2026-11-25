# Specification 002 — Professional Experience & Enterprise Quality Engineering

## 1. Purpose
Integrate verified enterprise Software Quality Control experience and sanitized professional case studies from **Berijalan Techno Center** (**PT Cipta Sedaya Digital Indonesia**, part of **Astra Credit Companies (ACC) Group**) into `adrian-portfolio` while maintaining static frontend-only delivery, strict confidentiality boundaries, and clean separation between Professional Work and Personal Open-Source Repositories.

## 2. Functional Requirements (`EXP-001` – `EXP-012`)

- **EXP-001 — Professional Experience Group (`Berijalan Techno Center`):**
  Render **Berijalan Techno Center** (`legalEntity: "PT Cipta Sedaya Digital Indonesia"`, `corporateGroup: "Astra Credit Companies (ACC) Group"`, `location: "Yogyakarta, Indonesia"`, `website: "https://berijalan.co.id/"`, `industry: "Financial Services & Enterprise Technology"`) as one grouped company card above prior employers (`Qiscus`, `Tokopedia – ByteDance Group`, `Bitbybit Studio – Favo Group`).
- **EXP-002 — Reverse-Chronological Dual Roles Inside One Company:**
  Inside the Berijalan card, list roles in reverse-chronological order:
  1. `Software Quality Control Engineer — Freelance` (`2026-07` to `2026-10`, display `Jul 2026 – Oct 2026`, `employmentType: "freelance"`).
  2. `Software Quality Control Engineer Trainee — Bootcamp / Internship-equivalent` (`2026-03` to `2026-07`, display `Mar 2026 – Jul 2026`, `employmentType: "bootcamp"`).
  Never relabel Bootcamp to a conventional internship, and never mark either role as current/ongoing (`Present`).
- **EXP-003 — Company Career Progression Without Duplication:**
  Display a shared career-level summary and scoped contribution bullets covering `AOL UniPaaS`, `Magic xpa`, Cypress automated web testing, Jenkins CI integration, React-based legacy modernization QA, STNK alignment validation, and Joint Financing parameter testing, with direct navigation links to the associated Enterprise Case Studies instead of repeating full project write-ups inside timeline cards.
- **EXP-004 — Enterprise Case Studies Catalog Separation (`origin: "professional"`):**
  Store sanitized professional engagements in `src/data/enterprise-projects.ts`, separate from automated `src/data/github-repositories.json` sync so `npm run sync:github` never overwrites or conflicts with enterprise records.
- **EXP-005 — Three Public-Safe Enterprise Case Studies:**
  Expose static routes `/projects/archer-upgrade/`, `/projects/stnk-alignment/`, and `/projects/advanced-joint-finance-parameter/` covering:
  - `Archer Upgrade — Enterprise Collection System Modernization` (Automated Web Testing with Cypress & Jenkins; legacy `AOL UniPaaS` collection modernization into React-based web platform)
  - `STNK Alignment — Vehicle Registration Process Alignment` (Manual Functional Testing across `AOL UniPaaS` & `Magic xpa`)
  - `Advanced Joint Finance Parameter — Financial System Enhancement` (Manual Functional Testing & financial business rule validation in `AOL UniPaaS`)
- **EXP-006 — Build-Time Disclosure Gate (`publicDisclosureApproved`):**
  Every enterprise project record requires explicit `publicDisclosureApproved: boolean`. Only records where `publicDisclosureApproved === true` are included in runtime exports, `generateStaticParams()`, `sitemap.xml`, Search/Explorer indexing, or build output `out/`. Unapproved entries are excluded at build time rather than hidden in CSS/client state.
- **EXP-007 — Confidential Information & Fake-Asset Prevention:**
  Prohibit employer source code, internal Jenkins URLs/configs, UAT/production domains, internal test scripts, DB schemas, SQL, credit/joint-finance calculation parameters, customer/agreement/invoice data, unapproved screenshots, or fabricated performance metrics. When screenshots are omitted, render an editorial typography-first layout plus an explicitly labeled conceptual workflow diagram.
- **EXP-008 — Updated Homepage Information Architecture:**
  Arrange homepage sections strictly as:
  1. Navigation Bar
  2. Hero Section + Interactive 3D Geometry
  3. Professional Experience (`#experience`)
  4. Enterprise Case Studies (`#enterprise-work`)
  5. Featured Personal Projects (`#work`)
  6. Project Explorer Callout (`#project-explorer-cta`)
  7. Technical Competencies (`#competencies`)
  8. Certifications (`#certifications`)
  9. Education (`#education`)
  10. About & Engineering Focus (`#about`, incorporating community/leadership concisely)
  11. Contact & Footer (`#contact`)
- **EXP-009 — Project Explorer Filtering Extensions:**
  Add `Origin` filter controls (`All`, `Professional Work`, `Personal Projects`, `Academic Projects`, `Experiments`) and support expanded categories (`Financial Systems`, `Enterprise Application Modernization`, `DevOps & CI/CD`, plus existing GitHub domains) while keeping Featured Personal Projects separate on the landing page.
- **EXP-010 — Honest Technology & Competency Boundaries:**
  Extend Technical Competencies with enterprise Quality Engineering (`Cypress`, `Manual Functional Testing`, `AOL UniPaaS`, `Magic xpa`, `React-based Web Application Testing`), CI/CD (`Jenkins`, `GitHub Actions`), and Financial Systems Domain Knowledge (`Automotive Financing`, `Joint Financing`, `Collection Workflows`, `STNK Alignment`). Never claim React frontend development or accounting certification solely from QA testing experience.
- **EXP-011 — Positioning, Copy & Metadata Alignment:**
  Apply Option A Hero positioning (`Software Quality Engineer & SDET · Enterprise & Financial Systems`), update `About` narrative and `Person` JSON-LD / SEO metadata without marking Berijalan Techno Center as current employer or asserting unverified graduation claims.
- **EXP-012 — Reusable Case Study Links:**
  Project cards and detail views treat `repositoryUrl` and `demoUrl` as optional; enterprise entries without public URLs render clean explanatory scope context and navigation to related case studies/experience without disabled or broken links.

## 3. Non-Functional & Quality Constraints
- Frontend-only Next.js 16 static export (`output: "export"`, `trailingSlash: true`).
- Zero horizontal overflow `320px–1920px`; WCAG 2.2 AA (`axe-core` zero violations across updated `/` and `/projects/*` routes); minimal motion & static WebGL fallback preserved.
- Exact spelling preserved: `Magic xpa`, `AOL UniPaaS`, `Joint Financing`, `Bootcamp / Internship-equivalent`.
