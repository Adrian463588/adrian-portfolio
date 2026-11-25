# Spec 008 — ParfumCreator Public Repository & Project Showcase Integration

## Root Cause (Phase 0 Audit)
In V6, `Adrian463588/ParfumCreator` was a private GitHub repository (`isPrivate: true`), so it was omitted from `src/data/github-repositories.json` and placed in `src/data/curated-projects.ts` with `visibility: "private-summary"`, `screenshots: []`, `repositoryUrl: undefined`, and `sourceReferences: []`. This caused `SelectedWork.tsx`, `ProjectCard.tsx`, `CaseStudyDetail.tsx`, and `getProjectActions()` to suppress the `GitHub` CTA, render the typographic private placeholder (`PRIVATE REPOSITORY`, `PRIVATE OVERVIEW · SOURCE OMITTED`), and display stale private copy even after the repository became public on GitHub.

## Public Verification (Phase 2)
- Unauthenticated `GET https://api.github.com/repos/Adrian463588/ParfumCreator` -> HTTP `200`, `private: false`, `visibility: "public"`, `default_branch: "main"`, `language: "Kotlin"`, `pushed_at: "2026-11-25T10:32:21Z"`.
- Unauthenticated `HEAD https://github.com/Adrian463588/ParfumCreator` -> HTTP `200`.
- Public release verified: `v1.3.1` (`https://github.com/Adrian463588/ParfumCreator/releases/tag/v1.3.1`).
- 7 authentic `v1.3.1` application screenshots verified in `docs/screenshots/` on `main`.

## Requirements
| ID | Requirement | Verification |
|----|-------------|--------------|
| PC-001 | Verify `Adrian463588/ParfumCreator` public visibility without authentication | Unauthenticated REST & HEAD HTTP `200` checks |
| PC-002 | Synchronize latest repository metadata into `src/data/github-repositories.json` via `npm run sync:github` | `ParfumCreator` present in snapshot, no duplicate entries |
| PC-003 | Remove stale private-repository wording (`PRIVATE REPOSITORY`, `PRIVATE OVERVIEW`, `SOURCE OMITTED`, `Private Android Perfumery`) for `ParfumCreator` | Playwright + DOM text checks on `/` & `/projects/parfum-creator/` |
| PC-004 | Recover & optimize authentic `ParfumCreator` screenshots locally under `public/projects/parfum-creator-*.webp` | `npm run validate:assets` + Playwright `naturalWidth > 0` decode checks |
| PC-005 | Preserve exact featured project priority with `ParfumCreator` pinned at slot `05` (`FEATURED_PROJECT_ORDER`) | Vitest ordering test + Playwright `#work` headings order |
| PC-006 | Restore verified public `GitHub` and `Release` links (`https://github.com/Adrian463588/ParfumCreator` & `v1.3.1`) without exposing dead `Live Demo` links | `getProjectActions` unit test + Playwright link href checks |
| PC-007 | Update `/projects/parfum-creator/` case study strictly from inspected README/repository architecture, features, security, and formulation limitations | Playwright detail route assertions |
| PC-008 | Update SEO `<title>`, `<meta description>`, OG metadata, canonical URL, JSON-LD `SoftwareSourceCode`, and `sitemap.xml` | Playwright metadata & sitemap HTTP `200` checks |
| PC-009 | Validate static export assets across `public/` & `out/` | `npm run build` + `npm run validate:assets` |
| PC-010 | Pass full regression suite (`lint`, `typecheck`, `vitest`, Playwright E2E + `axe-core`, visual captures) | Full verification run |
