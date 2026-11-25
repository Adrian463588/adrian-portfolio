# Implementation Plan: Professional 3D Engineering Portfolio Redesign

**Branch**: `001-professional-portfolio` | **Date**: 2026-11-25 | **Spec**: [spec.md](./spec.md)

## Summary
Redesign `adrian-portfolio` into a refined Graphite & Ice Blue engineering portfolio (`Next.js 16` App Router with `output: "export"`, `TypeScript` strict mode, `Tailwind CSS v4`, `Framer Motion`, and `Three.js` / `@react-three/fiber`). Replace the full-viewport cyberpunk neon scene and fake WIP terminal metrics with one bounded Hero 3D procedural sculpture, curate all 77 public GitHub repositories via an offline snapshot + editorial override pipeline (`npm run sync:github`), add `/projects` Explorer and `/projects/[slug]` Case Study static routes backed by real WebP application screenshots, and verify everything with Vitest, Playwright, `axe-core`, and Chrome DevTools / Lighthouse.

## Technical Context
- **Language/Version:** TypeScript `^5` (`strict: true`), Node.js `v24.11.0`, ESM scripts (`.mjs`)
- **Primary Dependencies:** `next@16.1.6`, `react@19.2.3`, `three@0.183.2`, `@react-three/fiber@9.5.0`, `framer-motion@12.34.3`, `lucide-react@0.575.0`, `tailwindcss@4`, `clsx`, `tailwind-merge` (remove unused `@react-three/postprocessing`, `postprocessing`, `@react-three/drei`)
- **Storage:** Static TypeScript & JSON (`src/data/github-repositories.json`, `src/data/project-overrides.ts`, `src/data/projects.ts`)
- **Testing:** `vitest` + `@testing-library/react` + `jsdom` (unit/data validation), `@playwright/test` + `axe-core` (E2E, responsive, keyboard, WebGL fallback, reduced motion)
- **Target Platform:** Static Web Export (`out/`) deployed on Vercel Hobby (`trailingSlash: true` or clean static routes)
- **Performance Goals:** LCP `<= 2.5s`, CLS `<= 0.1`, Lighthouse Accessibility/Best Practices/SEO `>= 95`, Performance `>= 90`
- **Constraints:** Zero runtime backend, zero database, zero client API tokens, zero Docker artifacts required for deployment

## Constitution Check
- Frontend-only static export (`output: "export"`)? **PASS**
- No runtime GitHub API calls from browser? **PASS** (`scripts/sync-github.mjs` runs offline)
- No fabricated metrics / fake résumé / unverified cert links? **PASS**
- Bounded Three.js Canvas (`frameloop="demand"`, WebGL fallback, reduced motion)? **PASS**
- FigCraft canvas parity (`design/tokens.json`, `design/portfolio.figcraft`) before UI code? **PASS**

## Project Structure
```text
design/
├── tokens.json
├── portfolio.figcraft
└── exports/
scripts/
├── sync-github.mjs
├── sync-github.test-fixture (via unit tests)
└── fetch-project-assets.py (scratch/build-time asset optimization)
src/
├── app/
│   ├── layout.tsx, globals.css, page.tsx, sitemap.ts, robots.ts
│   ├── projects/page.tsx
│   └── projects/[slug]/page.tsx
├── components/
│   ├── layout/{Navbar,Footer}.tsx
│   ├── projects/{ProjectCard,ProjectExplorer,CaseStudyDetail}.tsx
│   ├── sections/{Hero,SelectedWork,Experience,Competencies,Certifications,Education,Leadership,Contact}.tsx
│   ├── three/{HeroCanvas,HeroSculpture,HeroFallback,ThreeErrorBoundary}.tsx
│   └── ui/{Badge,SectionHeader,TiltSurface,TimelineItem}.tsx
├── data/
│   ├── github-repositories.json
│   ├── project-overrides.ts
│   ├── projects.ts
│   ├── experience.ts
│   ├── competencies.ts
│   ├── certifications.ts
│   ├── education.ts
│   └── leadership.ts
├── lib/{projects,utils}.ts
└── types/index.ts
tests/
├── unit/{projects.test.ts,sync-github.test.ts}
└── e2e/{portfolio.spec.ts}
```
