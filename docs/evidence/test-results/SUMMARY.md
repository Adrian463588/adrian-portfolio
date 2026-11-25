# Verification & Evidence Summary

> **Date:** 2026-11-25  
> **Target Build:** Static Next.js 16 export (`out/`, 77/77 static pages)

## 1. Automated Verification Commands
| Check | Command | Result | Details |
|---|---|---|---|
| Lint | `npm run lint` | PASS | 0 ESLint errors, 0 warnings |
| TypeScript | `npm run typecheck` | PASS | `tsc --noEmit` strict mode, 0 errors |
| Unit Tests | `npm run test` | PASS | Vitest: 2 test files, 8/8 tests passed (`projects.test.ts`, `sync-github.test.ts`) |
| GitHub Sync | `npm run sync:github` | PASS | Paginated REST sync of 78 public repos for `Adrian463588` |
| Static Export Build | `npm run build` | PASS | Next.js `output: "export"` generated 77/77 static pages (`/`, `/projects/`, 70 `/projects/[slug]/`, `/icon.svg`, `/robots.txt`, `/sitemap.xml`) |
| E2E & A11y Suite | `npm run test:e2e` | PASS | Playwright + `axe-core`: 19/19 tests passed (`320px`–`1920px` zero overflow, zero `axe` violations across 4 routes, reduced-motion, WebGL fallback, keyboard & mobile focus, zero 404s, zero console errors) |

## 2. Before vs After Audits (Chrome DevTools MCP)
| Metric / Audit | Before (`https://adriansyahabidin.vercel.app/`) | After (`out/` static build via `127.0.0.1:4184`) |
|---|---|---|
| Lighthouse Accessibility (Desktop / Mobile) | 96 / 96 (failed `color-contrast` on 2 nodes; 7 nodes in full-page `axe-core`) | **100 / 100** (57/57 passed, 0 failed) |
| Lighthouse Best Practices (Desktop / Mobile) | 100 / 100 | **100 / 100** |
| Lighthouse SEO (Desktop / Mobile) | 100 / 100 | **100 / 100** |
| Lighthouse Agentic Browsing (`/` and `/projects/`) | 100 (`/`) | **100** (`/`) & **100** (`/projects/`) |
| Performance Trace LCP (Lab, 1x CPU) | 1311 ms (`Render delay: 1268 ms`) | **333 ms** (`Render delay: 326 ms`, `292 ms` on initial pass) |
| Performance Trace CLS (Lab) | 0.00 (below-the-fold hidden at `opacity: 0` pre-scroll) | **0.00** (full content visible at `opacity: 1`) |
| Console Errors / DevTools Issues | 0 runtime errors, `THREE.Clock` warn | **0 runtime errors**, **0 lazy-image issues**, upstream R3F v9 `THREE.Clock` warn |
| Lighthouse Numeric Performance Category Score (0–100) | NOT VERIFIED (`chrome-devtools` MCP omits perf score; `npx lighthouse` skipped) | NOT VERIFIED (lab LCP `333 ms` & CLS `0.00` measured via Performance Trace) |
| Field INP (p75 CrUX) | n/a (no CrUX data) | NOT VERIFIED (laboratory static test only; no field traffic) |

## 3. Security & Privacy Audit
- `out/` secret/PII scan (`gho_`, `ghp_`, `GITHUB_TOKEN`, `NEXT_PUBLIC_`, `participant`): 0 leaks.
- `npm audit --omit=dev` (`docs/evidence/test-results/npm-audit.json`): reports 5 advisories (2 moderate, 2 high, 1 critical) within upstream runtime dependency trees (e.g. `next` / transitive dependencies); no custom credentials or raw HTML rendering exist in application code.
- `vercel.json`: configured with `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, and strict `Content-Security-Policy` headers.
- Vercel CLI Preview Deployment: NOT VERIFIED (`vercel` CLI not installed globally in local environment).

---

## 4. V2 Verification — Professional Experience & Enterprise Quality Engineering

> **Date:** 2026-11-25  
> **Target Build:** Static Next.js 16 export (`out/`, 80/80 static pages including 3 enterprise case study routes)

| Check | Command / Tool | Result | Details |
|---|---|---|---|
| Lint | `npm run lint` | PASS | 0 ESLint errors, 0 warnings |
| TypeScript | `npm run typecheck` | PASS | `tsc --noEmit` strict mode, 0 errors |
| Unit Tests | `npm run test` | PASS | Vitest: 3 test files, 14/14 tests passed (`experience.test.ts`, `projects.test.ts`, `sync-github.test.ts`) |
| Static Export Build | `npm run build` | PASS | Next.js `output: "export"` generated 80/80 static pages (`/`, `/projects/`, `/projects/archer-upgrade/`, `/projects/stnk-alignment/`, `/projects/advanced-joint-finance-parameter/`, 70 GitHub project pages, `/icon.svg`, `/robots.txt`, `/sitemap.xml`) |
| E2E & A11y Suite | `npm run test:e2e` | PASS | Playwright + `axe-core`: 23/23 tests passed (Berijalan multi-role grouping, reverse-chronological sorting, 11-step V2 homepage IA order, 3 Enterprise Case Studies, `Professional Work` origin filtering, zero broken GitHub links, `320px–1920px` zero overflow, zero `axe` violations across all 7 tested routes, reduced-motion, WebGL fallback, keyboard & mobile focus) |
| Confidentiality & Spelling Scan | PowerShell scan across 702 `out/` files | PASS | Zero confidential leaks (`sharepoint.com`, internal Jenkins domains, private IPs, raw SQL, test fixtures) and exact casing enforced (`Magic xpa`, `AOL UniPaaS`, `Joint Financing`) |
| Lighthouse (`/` Desktop & Mobile) | Chrome DevTools MCP | PASS | Accessibility `100`, Best Practices `100`, SEO `100`, Agentic Browsing `100` (`57/57` passed, `0` failed) |
| Lighthouse (`/projects/archer-upgrade/` Desktop) | Chrome DevTools MCP | PASS | Accessibility `100`, Best Practices `100`, SEO `100`, Agentic Browsing `100` (`51/51` passed, `0` failed) |
| Performance Trace (`/` Lab, 1x CPU) | Chrome DevTools MCP | PASS | LCP `259 ms` (`TTFB: 5 ms`, `Render delay: 255 ms`), CLS `0.00` |
| Unverified Internal Items | Employer internal docs / Vercel deploy | NOT VERIFIED | Official internal project titles beyond supplied names, split of projects per Berijalan period, quantitative outcomes, and live remote Vercel deployment status require user verification / dashboard publish |

---

## 5. V3 Verification — Digital Engineering · Kinetic Systems (`feat/v3-immersive-3d-redesign`)

> **Date:** 2026-11-25  
> **Target Build:** Static Next.js 16 export (`out/`, 80/80 static pages)

| Check | Command / Tool | Result | Details |
|---|---|---|---|
| Lint | `npm run lint` | PASS | 0 ESLint errors, 0 warnings |
| TypeScript | `npm run typecheck` | PASS | `tsc --noEmit` strict mode, 0 errors |
| Unit Tests | `npm run test` | PASS | Vitest: 3 files, 14/14 passed (`experience.test.ts`, `projects.test.ts`, `sync-github.test.ts`) |
| Static Export Build | `npm run build` | PASS | Next.js `output: "export"` built 80/80 static pages in `out/` |
| E2E & A11y Suite | `npm run test:e2e` | PASS | Playwright + `axe-core`: 27/27 tests passed (6-item asymmetric Selected Work spread, open Enterprise Case Study rows without card walls, Lenis + GSAP + procedural GLSL backdrop + liquid-chrome TorusKnot sculpture, `as.` brand mark + fullscreen nav overlay, adaptive `Cinematic/Balanced/Reduced` quality switcher, `All projects.` with progressive `Filters` popover & `Index` hover preview, Chibi portrait in `#about`, zero horizontal overflow across `320px–1920px`, zero `axe` violations across 7 routes) |
| Confidentiality & Slop Scan | PowerShell scan across `747` `out/` files | PASS | Zero secret leaks and zero banned placeholder/jargon tokens (`All Eligible`, `Engagement Origin`, `DEMAND RENDERED`, `Static snapshot synced`, `All 73 Projects`, `Engineering Project Explorer`, `Repository Catalog`, `Engineering Domain`) |
| Lighthouse (`/` Desktop & Mobile) | Chrome DevTools MCP | PASS | Accessibility `100`, Best Practices `100`, SEO `100`, Agentic Browsing `100` (`57/57` passed, `0` failed on both desktop and mobile) |
| Lighthouse (`/projects/` Desktop) | Chrome DevTools MCP | PASS | Accessibility `100`, Best Practices `100`, SEO `100`, Agentic Browsing `100` (`56/56` passed, `0` failed) |
| Performance Trace (`/` Lab, 1x CPU) | Chrome DevTools MCP | PASS | LCP `305 ms` (`TTFB: 9 ms`, `Render delay: 296 ms`), CLS `0.00` |
| Unverified Items | Numeric Perf score / live prod | NOT VERIFIED | `chrome-devtools` MCP omits numeric Lighthouse Performance category score (0–100) and CrUX field INP; feature branch `feat/v3-immersive-3d-redesign` pushed cleanly without overwriting production `main` |
