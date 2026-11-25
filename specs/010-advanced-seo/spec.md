# Spec 010 — Advanced White Hat SEO, Programmatic Clusters & Engineering Tools

## Scope
Extend `adriansyahabidin.vercel.app` beyond V9 Technical SEO with structured programmatic engineering resources (`/resources/`), evidence-grounded competitor and tool comparisons, topical authority clusters, and client-side domain calculators derived from first-party public repositories — using strictly White Hat techniques compliant with Google Search Essentials and Spam Policies.

## Constraints
- Static Next.js export (`output: "export"`, `dynamicParams = false`), zero runtime backend, zero CMS/DB.
- Preserve V3–V8 Obsidian & Arctic visual identity (`#08090C`, `#65C8F5`), Three.js background, Lenis + GSAP motion, and non-interactive Berijalan enterprise rules.
- Every published guide, comparison, or tool must pass `validateSeoCatalog()` (`status === "published"`, `indexable === true`, `sources.length >= 1`, disclosure on first-party comparisons, no fabricated pricing/search-volume/benchmarks).

## Traceable Requirements
| ID | Requirement | Verification |
|----|-------------|--------------|
| ADV-SEO-001 | Typed competitor registry, keyword cluster map, topic clusters, and editorial resource catalog in `src/data/seo/` | `tests/unit/seo-advanced.test.ts` + `npm run seo:validate` |
| ADV-SEO-002 | Quality gate (`validateSeoCatalog`) preventing `draft`/`review` or unsourced entries from reaching `getPublishedResources()`, `sitemap.xml`, or static `out/` routes | `tests/unit/seo-advanced.test.ts` + `npm run seo:audit` |
| ADV-SEO-003 | Verified client-side Coffee Brew/Extraction & Perfumery Concentration calculators in `src/lib/calculators.ts` matching `CoffeeScienceEngine.kt` & `FormulaCalculationEngine.kt` | `tests/unit/seo-advanced.test.ts` + Playwright E2E |
| ADV-SEO-004 | Obsidian & Arctic `/resources/` hub and `/resources/[slug]/` routes with AEO summary blocks, disclosure notes, FAQs, and `Article`/`WebApplication`/`FAQPage`/`BreadcrumbList` JSON-LD linked to `#person` & `#website` | `tests/e2e/portfolio.spec.ts` + Lighthouse |
| ADV-SEO-005 | Bidirectional internal linking between `Navbar`, `Footer`, `/projects/[slug]/` (`CaseStudyDetail`), and `/resources/[slug]/` without breaking nav layout or overflow | `npm run seo:links` + Playwright responsive/axe QA |
| ADV-SEO-006 | Static SEO automation CLI (`scripts/seo-cli.mjs`) exposing `seo:validate`, `seo:audit`, `seo:keywords`, `seo:links`, and `seo:report` | CLI execution after `npm run build` |
