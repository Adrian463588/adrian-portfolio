# Plan 009 — Personal Portfolio Technical SEO

1. **Centralized Config & Helpers:** Add `src/config/site.config.ts` and `src/lib/seo.ts` as single source of truth for canonical URLs, Open Graph / Twitter metadata, and Schema.org `@graph` JSON-LD generators.
2. **Route Metadata & Schema Graph:** Refactor `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/projects/page.tsx`, `src/app/projects/[slug]/page.tsx`, `src/app/sitemap.ts`, and `src/app/robots.ts` to consume `SITE_CONFIG` and `src/lib/seo.ts`.
3. **Hero & Internal Linking Alignment:** Align `Hero.tsx` eyebrow to `Software & QA Automation Engineer`, include top Android projects in `src/data/competencies.ts`, and render category-matched related projects on `CaseStudyDetail.tsx`.
4. **Docs, Crawler Policy & Tests:** Update `docs/SEO_CHECKLIST.md`, author `docs/audit/V9_SEO_AUDIT.md`, add `tests/unit/seo.test.ts`, and expand `tests/e2e/portfolio.spec.ts`.
5. **Verification:** Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, `npm run validate:assets`, `npm run test:e2e`, Chrome DevTools Lighthouse & Performance Trace, and inspect visual captures without altering approved V1–V8 design.
