# Tasks 004 — Execution Checklist

- [x] Branch `fix/portfolio-v4-functional-seo-refinement` created from `f9ef065`
- [x] Run live external HTTP audit across all 99 unique URLs (`docs/evidence/link-audit-raw.json`)
- [x] Write `specs/004-portfolio-refinement/*`, `docs/CONTENT_GUIDELINES.md`, `docs/SEO_CHECKLIST.md`, `docs/LINK_AUDIT.md`
- [x] Consolidate Berijalan (`berijalan-acc`) into non-interactive `selectedProjects` in Experience & remove `EnterpriseCaseStudies`
- [x] Scope public `/projects/`, `Competencies`, and `sitemap.xml` exclusively to public repositories
- [x] Add centralized `getProjectActions()` & live demo URL verification (`src/lib/projects.ts`)
- [x] Refine Hero, About, Competencies, Projects heading, Navbar drawer focus return, and SmoothScroll curtain idle state
- [x] Generate static `1200x630` `public/og-image.png` & upgrade SEO metadata + JSON-LD across all routes
- [x] Update Vitest + Playwright E2E functional/SEO/accessibility suites (no `force: true`)
- [x] Run full build, lint, typecheck, Vitest, Playwright, Lighthouse, and commit + push branch
