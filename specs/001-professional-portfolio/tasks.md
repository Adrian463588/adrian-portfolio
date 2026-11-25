# Tasks: Professional 3D Engineering Portfolio Redesign

**Input**: `spec.md`, `plan.md`, `docs/DESIGN_SYSTEM.md`, `docs/PROJECT_DATA_SCHEMA.md`

## Phase A: Setup & Design Prototype (FigCraft)
- [x] **T001** Clean workspace debt: remove untracked Docker files (`Dockerfile`, `docker-compose.yml`, `.dockerignore`), unused starter SVGs in `public/`, and unused postprocessing dependencies (`@react-three/postprocessing`, `postprocessing`, `@react-three/drei`); add `.gemini/` to `.gitignore`.
- [x] **T002** Configure `next.config.ts` (`output: "export"`, `trailingSlash: true`, `images: { unoptimized: true }`) and install `vitest`, `@playwright/test`, `@testing-library/react`, `jsdom` devDependencies + scripts (`typecheck`, `test`, `test:e2e`, `sync:github`).
- [x] **T003** Create `design/tokens.json` and build `design/portfolio.figcraft` via FigCraft MCP (Desktop Home Hero + Selected Work, Mobile Hero, Project Explorer `/projects`), export PNGs to `design/exports/`, and pass visual QA.

## Phase B: GitHub Sync & Static Project Catalog (FR-003, FR-004, FR-007, NFR-005)
- [x] **T004** Write failing unit tests first (`tests/unit/projects.test.ts`, `tests/unit/sync-github.test.ts`) covering schema invariants, slug uniqueness, fork attribution, category filtering, search, sorting, and snapshot fallback on API failure (RED).
- [x] **T005** Implement `src/types/index.ts`, `src/lib/projects.ts`, and `scripts/sync-github.mjs` (`npm run sync:github` with pagination, `private === false` guard, and failure preservation).
- [x] **T006** Execute `npm run sync:github` to populate `src/data/github-repositories.json` from public repositories of `Adrian463588` (78 public repos synced).
- [x] **T007** Collect and convert genuine application screenshots (22 WebP assets) in `public/projects/`.
- [x] **T008** Author `src/data/project-overrides.ts` and `src/data/projects.ts` with verified first-party case studies, Tier 1 (8 Featured), Tier 2 (Catalog), Tier 3 (Experiments & Archive), and explicit `HeartRateMonitor` fork attribution; pass Vitest unit tests (GREEN).

## Phase C: Core Design System & Layout Shell (FR-001, NFR-002, NFR-003)
- [x] **T009** Update `src/app/layout.tsx` (`Geist` & `Geist_Mono`, canonical metadata, Open Graph, Person JSON-LD), `src/app/globals.css`, `src/app/icon.svg`, `src/app/sitemap.ts`, and `src/app/robots.ts`.
- [x] **T010** Refactor `src/components/layout/Navbar.tsx` and `src/components/layout/Footer.tsx`.
- [x] **T011** Refactor `src/components/ui/` primitives (`Badge.tsx`, `SectionHeader.tsx`, `TiltSurface.tsx`, `TimelineItem.tsx`) and remove obsolete files.

## Phase D: Bounded Three.js Hero Sculpture & Homepage Sections (FR-002, FR-008, FR-009)
- [x] **T012** Implement `src/components/three/` (`HeroCanvas.tsx`, `HeroSculpture.tsx`, `HeroFallback.tsx`, `ThreeErrorBoundary.tsx`, `HeroSculptureWidget.tsx`).
- [x] **T013** Rebuild `src/components/sections/Hero.tsx`.
- [x] **T014** Implement `src/components/sections/SelectedWork.tsx` and `src/components/projects/ProjectCard.tsx`.
- [x] **T015** Update `src/data/experience.ts`, `src/data/competencies.ts`, `src/data/certifications.ts`, `src/data/education.ts`, `src/data/leadership.ts` and refactor `Experience.tsx`, `Competencies.tsx`, `Certifications.tsx`, `Education.tsx`, `Leadership.tsx`, `Contact.tsx`, and `src/app/page.tsx`.

## Phase E: Project Explorer & Static Case Studies (FR-004, FR-005, FR-006)
- [x] **T016** Implement `src/components/projects/ProjectExplorer.tsx` and `src/app/projects/page.tsx`.
- [x] **T017** Implement `src/components/projects/CaseStudyDetail.tsx` and `src/app/projects/[slug]/page.tsx` with `generateStaticParams()`.

## Phase F: Verification, Visual QA & Deployment Readiness (NFR-001..NFR-005)
- [x] **T018** Author Playwright + `axe-core` E2E suite in `tests/e2e/portfolio.spec.ts`.
- [x] **T019** Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` (`out/`), and `npm run test:e2e`.
- [x] **T020** Capture before/after screenshots (`docs/evidence/before/`, `docs/evidence/after/`), run Chrome DevTools MCP Lighthouse + Performance Trace, and save `docs/evidence/test-results/SUMMARY.md`.
