# Implementation Plan 006 — Featured Projects & GitHub Portfolio Update

1. **Authentic Flagship Assets:** Download PII-free dark-mode Xiaomi v0.1.5 PNG screenshots (`home` and `history`) from `Adrian463588/android-stress-detection` and convert to local WebP assets under `public/projects/`.
2. **Type & Ordering Contract (`src/types/index.ts`, `src/lib/projects.ts`):**
   - Extend `EnterpriseVisibility` with `"private-summary"` and `Project` with `flagship?: boolean`, `seoTitle?: string`, `seoDescription?: string`.
   - Export `FLAGSHIP_PROJECT_SLUG`, `FEATURED_PROJECT_ORDER`, `getEditorialRank`, and `sortProjectsEditorial` so curated ordering survives `npm run sync:github`.
   - Restrict `getProjectActions()` and `validateProjects()` for `"private-summary"` entries so private links are never exposed.
3. **Catalog Updates (`src/data/curated-projects.ts`, `src/data/project-overrides.ts`, `src/data/projects.ts`, `src/data/competencies.ts`):**
   - Rename `android-wear-stress-assistant` -> `android-stress-detection`, set `flagship: true`, `editorialOrder: 0`, add authentic WebP screenshots and research case study copy with explicit non-medical disclaimer.
   - Pin `quran-plus` (`1`), `coffee-creator` (`2`), `adzan-plus` (`3`), and sanitized private-summary `parfum-creator` (`4`), re-ranking remaining featured entries (`5+`).
   - Merge approved `curatedPrivateProjects` in `src/data/projects.ts` and update `competencies.ts` slug reference.
4. **Presentation & Metadata (`SelectedWork.tsx`, `ProjectCard.tsx`, `CaseStudyDetail.tsx`, `projects/[slug]/page.tsx`):**
   - Render typographic editorial cover for non-screenshot private-summary items cleanly without broken images; expose `Flagship Research` and `Private Repository` markers accurately; wire `seoTitle` / `seoDescription`.
5. **Sync, Test, Audit & Ship:** Refresh GitHub snapshot, update Vitest & Playwright suites, verify build/assets/Lighthouse, commit and push `feat/portfolio-v6-featured-projects`.
