# Plan 008 — ParfumCreator Public Integration

1. **GitHub Snapshot Sync (`scripts/sync-github.mjs`):** Run `npm run sync:github` to ingest `Adrian463588/ParfumCreator` (`public`, `main`, `pushed_at` `2026-11-25`) into `src/data/github-repositories.json`.
2. **Authentic Image Recovery:** Convert `docs/screenshots/menu_formula.png`, `menu_templates.png`, `menu_library.png`, and `menu_chat.png` (`v1.3.1`) into `public/projects/parfum-creator-{formula,templates,library,chat}.webp` (`1080×2340`, WebP q84).
3. **Catalog Transition (`src/data/curated-projects.ts`, `src/data/project-overrides.ts`, `README.md`):**
   - Empty stale `parfum-creator` entry from `curatedPrivateProjects` (retaining `private-summary` capability in types/`lib/projects.ts` for future private projects while keeping zero stale ParfumCreator override).
   - Add `ParfumCreator` key in `src/data/project-overrides.ts` (`id: "parfum-creator"`, `slug: "parfum-creator"`, `editorialOrder: 4`, `tier: "featured"`, `featured: true`, `hasCiWorkflow: true`, `releaseUrl` `v1.3.1`, verified technologies, factual Clean MVVM + NDK C++17 + Room/MiniLM RAG + Gemma 4 LiteRT-LM summary, zero IFRA safety claims, zero AI-slop filler, 4 WebP screenshots).
   - Update `README.md` featured table removing `(Private Repository)` label on `ParfumCreator`.
4. **Tests, Build, Visual Proof & Ship:**
   - Update `tests/unit/projects.test.ts` and `tests/e2e/portfolio.spec.ts` (`TC-PC-001`..`TC-PC-018`) asserting slot `05`, authentic cover `<img>` decode, `GitHub` CTA (`https://github.com/Adrian463588/ParfumCreator`), zero private placeholder text, updated SEO title/description & `SoftwareSourceCode` JSON-LD, ordering immunity across sync, and zero duplicate slugs.
   - Run `npm run validate:assets`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, post-build `validate:assets`, and `npm run test:e2e`.
   - Capture before/after & live verification screenshots under `docs/evidence/v8/after/` and inspect via `read_file`.
   - Update `docs/evidence/v8/test-results/V8_TEST_REPORT.md` and `docs/evidence/test-results/SUMMARY.md`.
   - Commit, merge to `main`, push `origin main`, and run `vercel` CLI check/preview if authenticated.
