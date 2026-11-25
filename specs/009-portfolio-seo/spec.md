# Spec 009 — Personal Portfolio Technical SEO, Entity Graph & Discoverability

## Scope
Centralize SEO metadata, structured data (`Schema.org`), canonical URLs, social cards, XML sitemap hygiene, internal topical linking, and automated SEO smoke/unit verification across `https://adriansyahabidin.vercel.app/` without altering the Obsidian & Arctic design, Three.js scene, parallax, or motion interactions.

## Traceable Requirements
| ID | Requirement | Verification |
|----|-------------|--------------|
| SEO-001 | Centralize site constants, social profiles, verification token, and URL helpers in `src/config/site.config.ts` and `src/lib/seo.ts` | `tests/unit/seo.test.ts` + static code review |
| SEO-002 | Align global `<title>`, `<meta description>`, `og:locale` (`en_US`), Twitter cards, and `Hero` subtitle (`Software & QA Automation Engineer`) | Playwright SEO test + `out/index.html` inspection |
| SEO-003 | Align `/projects/` title (`Engineering Projects | Adrian Syah Abidin`), description, `CollectionPage` JSON-LD, and self-referencing canonical | `tests/e2e/portfolio.spec.ts` |
| SEO-004 | Strengthen Schema.org entity graph (`#person` + `#website` + `#profilepage`) with verified `sameAs` (GitHub, LinkedIn, Medium), verified issued `hasCredential` entries, portrait `image`, and project `SoftwareSourceCode`/`CreativeWork` nodes linking `author: { "@id": "#person" }` | `tests/unit/seo.test.ts` + Playwright JSON-LD checks |
| SEO-005 | Derive `sitemap.ts` `lastModified` from real latest project `updatedAt` timestamps and strip unneeded `changeFrequency`/`priority` boilerplate | `tests/unit/seo.test.ts` + `/sitemap.xml` check |
| SEO-006 | Strengthen topical internal linking across Homepage Skills (`competencies.ts`) and category-matched Related Projects (`CaseStudyDetail.tsx`) | Playwright link checks |
| SEO-007 | Verify SSR/static HTML readability independent of WebGL (`out/index.html` contains full semantic sections) and re-run Lighthouse + Core Web Vitals | `validate:assets`, `vitest`, Playwright `axe-core`, Lighthouse |
