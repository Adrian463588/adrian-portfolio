# Adrian Syah Abidin — Engineering Portfolio

Frontend-only professional engineering portfolio showcasing software systems across **QA Automation / SDET**, **DevOps & DevSecOps**, **Backend Engineering**, **Android & Wear OS**, **On-Device Applied AI**, and **FinTech**. Built with Next.js 16 static export (`output: "export"`), TypeScript strict mode, Tailwind CSS v4, and bounded React Three Fiber 3D interaction.

🌐 **Production Site:** [adriansyahabidin.vercel.app](https://adriansyahabidin.vercel.app)

---

## Architecture & Stack

- **Framework:** Next.js 16 (App Router, `output: "export"`, static SSG `/projects/[slug]`)
- **Language:** TypeScript (`strict: true`)
- **Styling:** Tailwind CSS v4 (`Graphite & Ice Blue` semantic tokens)
- **3D Experience:** Three.js + React Three Fiber (`frameloop="demand"`, client lazy-loaded, WebGL + reduced-motion fallback)
- **Icons:** Lucide React
- **Testing:** Vitest (unit & data invariants) + Playwright + `axe-core` (E2E, responsive, accessibility)

---

## Repository Structure

```text
adrian-portfolio/
├── design/                        # Design tokens and FigCraft source + exports
├── docs/                          # Audit, PRD, Design System, Architecture, Evidence
├── public/projects/               # WebP application screenshots
├── scripts/sync-github.mjs        # Paginated offline GitHub snapshot generator
├── specs/001-professional-portfolio/
├── src/
│   ├── app/                       # App Router pages (/, /projects, /projects/[slug])
│   ├── components/
│   │   ├── layout/                # Navbar, Footer
│   │   ├── projects/              # ProjectCard, ProjectExplorer, CaseStudyDetail
│   │   ├── sections/              # Homepage sections
│   │   ├── three/                 # Bounded R3F Hero sculpture & fallbacks
│   │   └── ui/                    # Badge, SectionHeader, TiltSurface, TimelineItem
│   ├── data/
│   │   ├── github-repositories.json  # Static GitHub API snapshot
│   │   ├── project-overrides.ts      # Curated case studies & fork attribution
│   │   └── projects.ts               # Validated merged dataset
│   ├── lib/                       # Pure filtering, validation, utilities
│   └── types/                     # Domain TypeScript definitions
└── tests/
    ├── unit/                      # Vitest tests
    └── e2e/                       # Playwright + axe-core tests
```

---

## Updating Projects from GitHub

Project metadata is synchronized offline so the deployed static frontend never calls GitHub APIs at runtime:

1. Sync public repositories from `@Adrian463588`:
   ```bash
   npm run sync:github
   ```
   Optionally set `GITHUB_TOKEN` in your local shell environment (never commit tokens or use `NEXT_PUBLIC_*`) to increase API rate limits. If GitHub is unreachable, the existing snapshot in `src/data/github-repositories.json` is preserved.
2. Add or refine curated case studies, categories, or screenshots in `src/data/project-overrides.ts`.
3. Add WebP screenshots to `public/projects/` with explicit `width` and `height`.
4. Verify and build:
   ```bash
   npm run lint
   npm run typecheck
   npm run test
   npm run build
   npm run test:e2e
   ```

---

## Local Development

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
