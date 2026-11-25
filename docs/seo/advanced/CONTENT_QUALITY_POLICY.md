# Content Quality & White Hat Publishing Policy

## Hard Publishing Gate (`validateSeoCatalog`)
Every `SeoResourceEntry` must define `status` (`"draft" | "review" | "published" | "archived"`) and `indexable: boolean`. Only entries meeting **all** criteria below can be `published` and `indexable`:
1. Unique slug not colliding with existing project or static routes.
2. Concise `seoTitle` (<= 70 chars) and `metaDescription` (50–165 chars) without keyword stuffing.
3. Non-empty `directAnswer` (AEO summary) + minimum 220 words of substantive prose across structured `sections`.
4. Valid ISO `reviewedAt` timestamp and >= 1 verified HTTPS `sources` URL.
5. Valid `relatedProjectSlugs` referencing active catalog projects (`publicProjects`) and valid `competitorIds` referencing verified competitors.
6. Explicit conflict-of-interest `disclosure` whenever a comparison or alternative page evaluates Adrian's own project alongside third-party software.
7. Explicit methodology / safety `limitations` on calculators and biosignal/health/perfumery engineering guides.

## Gated Unpublished States
Items in `draft`, `review`, or `archived` status are **never**:
- returned by `getPublishedResources()`,
- passed to `generateStaticParams()` (so `out/` emits 404 instead of thin/draft HTML),
- emitted into `sitemap.xml`, or
- linked in `/resources/` navigation or `/projects/[slug]/`.
