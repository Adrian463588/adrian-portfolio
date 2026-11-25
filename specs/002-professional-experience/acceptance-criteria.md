# Acceptance Criteria 002 — Test Cases (`TC-EXP-*`, `TC-ENT-*`, `TC-UI-*`, `TC-BUILD-*`)

## Experience Timeline (`TC-EXP`)
- **TC-EXP-001:** `Berijalan Techno Center` renders once at the top of Professional Experience (`#experience`), showing `PT Cipta Sedaya Digital Indonesia`, `Astra Credit Companies (ACC) Group`, and `Yogyakarta, Indonesia`.
- **TC-EXP-002:** Both roles appear under the Berijalan card with `Software Quality Control Engineer — Freelance` (`Jul 2026 – Oct 2026`) listed above `Software Quality Control Engineer Trainee` (`Mar 2026 – Jul 2026 · Bootcamp / Internship-equivalent`).
- **TC-EXP-003:** Combined role contribution bullets cover `AOL UniPaaS`, `Magic xpa`, `Cypress`, `Jenkins`, React-based legacy modernization QA, STNK alignment validation, and Joint Financing parameter workflows.
- **TC-EXP-004:** Company sorting across all experience blocks matches reverse-chronological order (`Berijalan` > `Qiscus` > `Bitbybit`/`Tokopedia`).
- **TC-EXP-005:** No role in Berijalan claims `Present`, current employment, or unverified metrics/graduation claims.
- **TC-EXP-006:** Berijalan card links cleanly to `/projects/archer-upgrade/`, `/projects/stnk-alignment/`, and `/projects/advanced-joint-finance-parameter/`.
- **TC-EXP-007:** `Experiences` tabs (`Work Experience`, `Bootcamps & Training`, `All`) stay interactive and accurate without duplicating Berijalan into a conflicting standalone card.

## Enterprise Case Studies & Explorer (`TC-ENT`)
- **TC-ENT-001:** Homepage `#enterprise-work` displays `Archer Upgrade`, `STNK Alignment`, and `Advanced Joint Finance Parameter` above `#work` (`Featured Personal Projects`).
- **TC-ENT-002:** Direct static loads on `/projects/archer-upgrade/`, `/projects/stnk-alignment/`, and `/projects/advanced-joint-finance-parameter/` return HTTP 200 and pass `axe-core`.
- **TC-ENT-003:** `npm run sync:github` + dataset merge preserves all 3 enterprise projects without overwrite or ID collision.
- **TC-ENT-004:** Enterprise case study records with `publicDisclosureApproved: false` are excluded by build-time filter helper and never emitted in `projects`, `out/`, or `sitemap.xml`.
- **TC-ENT-005:** `/projects/` Origin filter switches cleanly between `All`, `Professional Work` (`3`), `Personal Projects`, `Academic Projects`, and `Experiments`.
- **TC-ENT-006:** Enterprise project cards & detail headers omit broken GitHub / Live Demo links cleanly when `repositoryUrl` / `demoUrl` are absent.
- **TC-ENT-007:** Competencies section cites `AOL UniPaaS`, `Magic xpa`, `Cypress`, `Jenkins`, and financial domain testing without listing React development as a built engineering stack.
- **TC-ENT-008:** Enterprise cards/details without screenshots do not render fake `<img>` placeholders or GitHub repo dates.
- **TC-ENT-009:** All strings across `out/` pass confidentiality check (no internal employer URLs, SQL dumps, credentials, customer/agreement/invoice IDs, or proprietary metrics).
- **TC-ENT-010:** Exact spellings verified: `Magic xpa`, `AOL UniPaaS`, `Joint Financing`, `Bootcamp / Internship-equivalent`.

## Layout, Navigation, Accessibility & Build (`TC-UI` & `TC-BUILD`)
- **TC-UI-001:** Homepage sections follow exact 11-step sequence (`Navbar` -> `Hero` -> `Experience` -> `EnterpriseCaseStudies` -> `SelectedWork` -> `ProjectExplorer CTA` -> `Competencies` -> `Certifications` -> `Education` -> `About` -> `Contact/Footer`).
- **TC-UI-002:** Zero horizontal overflow across `320px–1920px` viewports on `/`, `/projects/`, and `/projects/archer-upgrade/`.
- **TC-UI-003:** Mobile menu drawer navigation works cleanly with keyboard (`Escape` returns focus) and `>= 44px` hit targets.
- **TC-UI-004:** JSON-LD `Person` metadata reflects updated engineering summary without setting Berijalan as current `worksFor`.
- **TC-BUILD-001..004:** `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` (`out/`), and `npm run test:e2e` exit `0`.
