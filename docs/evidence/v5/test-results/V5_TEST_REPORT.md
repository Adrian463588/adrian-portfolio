# V5 Test & Verification Report (`fix/portfolio-v5-visual-functional-polish`)

**Date:** 2026-11-25  
**Target Build:** `out/` (`77` static routes exported via `next build`)

## Gate Summary
| Check | Scope | Result | Measured Output |
|-------|-------|--------|-----------------|
| `npm run validate:assets` | All 24 referenced local assets (`public/` & `out/`) | PASS | Exact case-sensitive path + binary header match (`24/24`) |
| `npm run lint` | `eslint` across `src/`, `tests/`, `scripts/` | PASS | `0` errors, `0` warnings |
| `npm run typecheck` | `tsc --noEmit` (`strict: true`) | PASS | `0` errors |
| `npm run test` | `vitest run` (`sync-github`, `experience`, `projects`) | PASS | `3` files, `14/14` passed |
| `npm run build` | `next build` (`output: "export"`) | PASS | `77` static routes built |
| `npm run test:e2e` | Chromium real clicks (zero `force: true`), hover sweep, sharp `VIEW` cursor (`scale <= 1.01`), `ResilientImage` 404 fallback, all 70 public project routes (`200`), 3 removed Berijalan routes (`404`), Lenis scroll-to-top, mobile drawer, 320px–1920px overflow, `axe-core` WCAG 2.2 AA | PASS | `30/30` passed, `0` violations |
| Lighthouse (`desktop` `/`) | Chrome DevTools MCP | PASS | Accessibility `100` · Best Practices `100` · SEO `100` · Agentic Browsing `100` (`57/57`) |
| Lighthouse (`mobile` `/`) | Chrome DevTools MCP | PASS | Accessibility `100` · Best Practices `100` · SEO `100` · Agentic Browsing `100` (`57/57`) |
| Lighthouse (`desktop` `/projects/`) | Chrome DevTools MCP | PASS | Accessibility `100` · Best Practices `100` · SEO `100` · Agentic Browsing `100` (`56/56`) |
| Core Web Vitals Trace (`/`) | Chrome DevTools MCP (`ignoreCache: true`) | PASS | `LCP: 308 ms` (TTFB `9 ms`, Render delay `299 ms`) · `CLS: 0.00` |
| Vercel Live Domain / Search Console | Remote production post-merge deploy | NOT VERIFIED | Verified cleanly on static `out/` local export; live Vercel promotion & Search Console indexing pending owner merge/submit |
