# Plan 010 — Advanced SEO Engineering Implementation

## Architecture
1. **Strategy & Policy Docs (`docs/seo/advanced/`)**: Document verified competitors, intent-grouped keyword targets, cluster topology, quality gates, and CLI commands.
2. **Typed Data Layer (`src/data/seo/`)**:
   - `competitors.ts` — Verified external software records (`Beanconqueror`, `Filtru`, `Brewfather` classified accurately as beer/homebrew software, `Quran.com`, `Muslim Pro`, `Tarteel`, `Al-Azan`, `PerfumersWorld`, `Selenium IDE`, `Katalon`, `Playwright`, `Cypress`).
   - `topic-clusters.ts` — 5 topic clusters mapped to real project slugs.
   - `keyword-map.ts` — Intent-classified queries without invented search volume metrics.
   - `resources.ts` — 7 verified `"published"` pilot resources (2 interactive tools, 2 comparisons, 2 alternatives, 1 flagship architecture guide) + 2 `"draft"`/`"review"` items exercising index exclusion.
3. **Pure Engine & Formulas (`src/lib/seo-resources.ts`, `src/lib/calculators.ts`)**:
   - Port verified mass-balance extraction, Hamilton-Hare brew scaling, concentration percentage, band mapping, and heuristic SPL from `coffee-creator` and `ParfumCreator`.
   - Enforce editorial validation and JSON-LD builders linking to `ENTITY_IDS`.
4. **UI & Static Routes (`src/app/resources/`, `src/components/resources/`)**:
   - Hub `/resources/` + detail `/resources/[slug]/` + `Navbar`/`Footer`/`CaseStudyDetail`/`sitemap.ts` integration.
5. **CLI & Verification (`scripts/seo-cli.mjs`, Vitest, Playwright, Lighthouse)**:
   - Automated CLI gates on `out/` + unit tests + `axe-core` WCAG 2.2 AA + visual screenshot audit.
