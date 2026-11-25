# AGENTS.md — Portfolio Engineering Contract

> **Project:** Adrian Syah Abidin — Professional Engineering Portfolio (`adrian-portfolio`)  
> **Methodology:** GitHub Spec Kit (`.specify/`, `specs/001-professional-portfolio/`, `specs/002-professional-experience/`, `specs/003-spatial-v3-redesign/`) + FigCraft MCP (`design/`)

## 1. Architecture & Constraints
- **Stack:** Next.js 16 (App Router, `output: "export"`), TypeScript (`strict: true`), Tailwind CSS v4, GSAP (`gsap` / `@gsap/react`), Three.js / React Three Fiber, Lucide React.
- **Frontend-Only:** No runtime API routes, no database, no auth, no client-side secrets (`NEXT_PUBLIC_*` tokens forbidden).
- **Testing:** Vitest (unit/data validation) + Playwright + `axe-core` (E2E, responsive, accessibility, WebGL fallback, reduced motion).

## 2. Design Source of Truth
1. `.specify/memory/constitution.md`, `specs/001-professional-portfolio/`, `specs/002-professional-experience/`, & `specs/003-spatial-v3-redesign/`
2. `docs/DESIGN_SYSTEM.md` & `design/tokens.json` (`Obsidian & Cyan`: `#08090B`, `#101216`, `#14161A`, `#F1F3F5`, `#A0A6B0`, `#00C8F5`, `#2563EB`, `Space Grotesk` + `Geist` + `Geist Mono`)
3. Editable FigCraft canvas `design/portfolio.figcraft` and exports in `design/exports/`

## 3. Content & Security Rules
- Public repository catalog is synced offline via `npm run sync:github` (`scripts/sync-github.mjs`), preserving curated overrides in `src/data/project-overrides.ts` and keeping enterprise professional case studies isolated in `src/data/enterprise-projects.ts` behind build-time `publicDisclosureApproved` filtering.
- Never expose private repo data, credentials, internal employer URLs, SQL/DB schemas, credit/joint-finance calculation rules, test scripts, customer/agreement/invoice data, unapproved screenshots, or research participant records.
- Never render raw unsanitized README HTML.
- Verify all claims against first-party repository sources before publishing.

## 4. Verification Commands
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run build` (must emit static `out/` cleanly)
- `npm run test:e2e`
