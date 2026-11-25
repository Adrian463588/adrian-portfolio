# Acceptance Criteria & Traceability Matrix

| Req ID | User Story | Acceptance Criteria | Tasks | Verification Method |
|---|---|---|---|---|
| **FR-001** | US1 | Graphite & Ice Blue tokens (`#09090B`, `#18181B`, `#27272A`, `#F4F4F5`, `#A1A1AA`, `#38BDF8`) + `Geist`/`Geist Mono`; zero cyberpunk neon/grids/particles. | T003, T009 | Visual inspection (`design/exports/`, `docs/evidence/after/`), CSS token inspection |
| **FR-002** | US1 | 2-col desktop Hero; `h1` max 2 lines; verified bio/CTAs left; one bounded 3D sculpture right; zero text overlap on mobile. | T003, T012, T013 | Playwright desktop/mobile bounding-box & screenshot check |
| **FR-003** | US3 | `npm run sync:github` paginates `Adrian463588` public repos to `github-repositories.json`; preserves snapshot on error; merges cleanly with overrides. | T004, T005, T006 | Vitest (`sync-github.test.ts`), live `npm run sync:github` execution |
| **FR-004** | US2, US3 | 3 curation tiers: Featured (8 on `/`), Catalog (`/projects`), Experiments & Archive tab; forks (`HeartRateMonitor`) distinguish personal contributions. | T008, T014, T016 | Vitest (`projects.test.ts`), Playwright E2E |
| **FR-005** | US3 | `/projects` search by name/desc/tech, category/tech/tier filters, sort, result count, empty state + reset, URL sync. | T016 | Vitest + Playwright interactive filter tests |
| **FR-006** | US2 | `/projects/[slug]` statically generated via `generateStaticParams()`; displays verified architecture/contribution/screenshots; omits empty sections. | T017 | `npm run build` (`out/projects/*/index.html`), Playwright route checks |
| **FR-007** | US2 | Real screenshots stored as `.webp` in `public/projects/` with explicit `width`/`height` and `alt`. | T007, T014, T017 | Asset file check + Playwright image naturalWidth check |
| **FR-008** | US4 | Separated Work vs Bootcamps timeline; Competency groups linked to projects; honest Certifications/Education/Contact without backend forms or fake metrics. | T015 | Playwright + content audit |
| **FR-009** | US1, US2 | Bounded R3F Hero (`frameloop="demand"`, lazy-load, offscreen pause, WebGL fallback, reduced-motion, no `THREE.Clock` warning) + lightweight CSS 3D tilt (`<= 5°`). | T011, T012 | Playwright WebGL disabled test, reduced-motion test, console check |
| **NFR-001** | US5 | Static export (`output: "export"`), zero runtime backend/DB/secrets, direct route refresh works on `out/`. | T001, T002, T019 | `npm run build`, Playwright static server reload on `/projects` & `/projects/[slug]` |
| **NFR-002** | US5 | WCAG 2.2 AA (`>= 4.5:1` contrast, keyboard nav, focus rings, >=44px mobile targets, zero `axe-core` violations, no `opacity: 0` scroll hide). | T009, T010, T018 | Playwright + `axe-core` scan + keyboard tab traversal |
| **NFR-003** | US1, US5 | Responsive across `320`, `375`, `390`, `768`, `1024`, `1440`, `1920`px with zero horizontal overflow. | T018, T020 | Playwright multi-viewport overflow assertion + visual review |
| **NFR-004** | US5 | Lighthouse Accessibility/BP/SEO `>= 95`, Performance `>= 90` (lab), LCP `<= 2.5s`, CLS `<= 0.1`. | T019, T020 | Chrome DevTools MCP `lighthouse_audit` & `performance_start_trace` |
| **NFR-005** | US5 | Zero private repos, zero participant/confidential data, zero unsanitized HTML/Markdown, valid static SEO (`sitemap.xml`, `robots.txt`, JSON-LD). | T005, T008, T009 | Security grep/audit + `out/sitemap.xml` & `out/robots.txt` check |
