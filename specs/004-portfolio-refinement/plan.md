# Plan 004 — Implementation Phases

1. **Types & Data Layer (`src/types/index.ts`, `src/data/experience.ts`, `src/data/competencies.ts`, `src/data/projects.ts`):**
   - Add `InformationalProjectEntry` & `selectedProjects` to `ExperienceEntry`.
   - Consolidate *Archer Upgrade*, *STNK Alignment*, *Advanced Joint Finance Parameter* cleanly inside `berijalan-acc` (`selectedProjects`), drop clickable `projectIds` from `berijalan-acc`.
   - Keep public `projects` export in `src/data/projects.ts` scoped exclusively to `githubProjects` (`70` verified public repositories), retaining `getApprovedEnterpriseProjects` unit test coverage over `enterpriseProjectsCatalog`.
   - Point `competencies.ts` `relatedProjectSlugs` strictly at public GitHub slugs (`automate-plus`, `demo-evershop-cypress`, `saucedemo-cypress-bdd-jenkins`, `ledger-scope`, `credit-risk-mlops`, `go-online-shop`).
2. **Action Eligibility & Link Sanitization (`src/lib/projects.ts`, `src/data/project-overrides.ts`):**
   - Add `isVerifiedLiveDemoUrl()` & `getProjectActions(project)` in `src/lib/projects.ts`.
   - Filter out ephemeral `.sslip.io` / dead URLs in `buildDefaultProject()` and `mergeGitHubAndOverrides()`.
   - Consume `getProjectActions()` inside `SelectedWork.tsx`, `ProjectCard.tsx`, and `CaseStudyDetail.tsx`.
3. **UI Components & Routes:**
   - Remove `<EnterpriseCaseStudies />` from `src/app/page.tsx` and delete `src/components/sections/EnterpriseCaseStudies.tsx`.
   - Update `TimelineItem.tsx` to render `entry.selectedProjects` as non-interactive informational blocks (no links/buttons/hover cursor).
   - Refine `Hero.tsx`, `About.tsx`, `Competencies.tsx`, `SelectedWork.tsx`, `Navbar.tsx` (fix close focus reason + accessible focus handling), `SmoothScrollProvider.tsx` (`invisible` curtain when idle), and `src/app/projects/page.tsx` (`Projects.`).
4. **Technical SEO & OG Asset (`public/og-image.png`, `layout.tsx`, `page.tsx`, `projects/page.tsx`, `projects/[slug]/page.tsx`, `sitemap.ts`):**
   - Render crisp `1200x630` Obsidian & Arctic preview `public/og-image.png`.
   - Update titles, descriptions, canonicals, JSON-LD (`ProfilePage`, `BreadcrumbList`, `SoftwareSourceCode`/`CreativeWork`), remove `keywords`.
5. **QA & Verification:**
   - Update Vitest (`tests/unit/experience.test.ts`, `tests/unit/projects.test.ts`).
   - Expand Playwright + `axe-core` E2E (`tests/e2e/portfolio.spec.ts`) testing EVERY real click without `force: true`, Berijalan non-interactivity, removed enterprise route exclusion, SEO tags/JSON-LD/sitemap/robots/OG image, mobile drawer navigation, and multi-viewport zero overflow.
   - Run full lint, typecheck, unit tests, static build, `out/` secret scan, external HTTP link verification, Playwright E2E, Chrome DevTools Lighthouse & Performance Trace, and screenshot inspection, then commit and push `fix/portfolio-v4-functional-seo-refinement`.
