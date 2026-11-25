# Architecture — Adrian Syah Abidin Portfolio

## 1. Deployment & Static Export Model
- **Next.js App Router (`16.1.6`)** configured with `output: "export"` and `images: { unoptimized: true }` for zero-server Vercel Hobby static hosting (`out/`).
- **Dynamic Routes:** `/projects/[slug]` statically pre-renders every curated/documented project slug at build time via `generateStaticParams()`.
- **SEO Files:** Build-time static `src/app/sitemap.ts`, `src/app/robots.ts`, canonical URLs, Open Graph / Twitter metadata, and `Person` + `SoftwareSourceCode` / `CreativeWork` JSON-LD structured data.

## 2. Directory Structure
```text
adrian-portfolio/
├── design/                        # FigCraft tokens & editable .figcraft source + PNG exports
├── docs/                          # Audit, PRD, Design System, Architecture, Schema, Evidence
├── public/projects/               # Verified, WebP-optimized application screenshots
├── scripts/
│   ├── sync-github.mjs            # Paginated GitHub API snapshot generator (offline/manual)
│   └── validate-projects.mjs      # Schema & uniqueness validator
├── specs/001-professional-portfolio/
├── src/
│   ├── app/                       # App Router pages (/, /projects, /projects/[slug]), metadata, CSS
│   ├── components/
│   │   ├── layout/                # Navbar, Footer
│   │   ├── projects/              # ProjectCard, ProjectExplorer, ProjectFilters, CaseStudyView
│   │   ├── sections/              # Hero, SelectedWork, Experience, Competencies, Certifications, Education, Contact
│   │   ├── three/                 # HeroCanvas, EngineeringSculpture, ThreeErrorBoundary, HeroFallback
│   │   └── ui/                    # TiltSurface, Badge, SectionHeader
│   ├── data/
│   │   ├── github-repositories.json  # Raw public GitHub snapshot (non-secret)
│   │   ├── project-overrides.ts      # Curated editorial metadata, screenshots, case studies
│   │   ├── projects.ts               # Validated merged project dataset & query helpers
│   │   ├── experience.ts
│   │   ├── competencies.ts
│   │   ├── certifications.ts
│   │   ├── education.ts
│   │   └── profile.ts
│   ├── lib/
│   │   ├── projects.ts            # Pure filtering, searching, sorting, validation utilities
│   │   └── utils.ts
│   └── types/
│       └── index.ts
└── tests/
    ├── unit/                      # Vitest tests for schema, validation, search/filter, merge logic
    └── e2e/                       # Playwright + axe-core responsive, keyboard, WebGL, route tests
```

## 3. Data Flow (GitHub Sync → Static Snapshot → Build)
1. Maintainer runs `npm run sync:github` locally (or optional scheduled CI).
2. `scripts/sync-github.mjs` paginates `https://api.github.com/users/Adrian463588/repos?per_page=100&sort=updated`, filters `private === false`, checks rate-limit/network errors (preserving existing snapshot on failure), and writes `src/data/github-repositories.json`.
3. `src/data/projects.ts` merges snapshot metadata with `src/data/project-overrides.ts` so automated sync never overwrites curated editorial descriptions, screenshots, fork attributions, or case studies, and appends `getApprovedEnterpriseProjects(enterpriseProjectsCatalog)` from `src/data/enterprise-projects.ts`.
4. `src/lib/projects.ts` validates unique IDs, unique slugs, valid `https://` URLs (when present), and safe data boundaries at test and build time. Enterprise records lacking `publicDisclosureApproved === true` are excluded before route generation or `sitemap.ts` serialization.
