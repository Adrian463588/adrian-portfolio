# Feature Specification: Professional 3D Engineering Portfolio Redesign

**Feature Branch**: `001-professional-portfolio`  
**Created**: 2026-11-25  
**Status**: Approved for Implementation  

---

## User Scenarios & Testing

### User Story 1 - Immediate Professional Impression & Core Identity (Priority: P1)
A technical recruiter or hiring manager opens the homepage on desktop or mobile and understands Adrian Syah Abidin's engineering specialization, industry experience, and primary call-to-action within 5 seconds, without neon cyberpunk clutter or illegible fonts.

**Independent Test**: Load `/` at `320px`, `375px`, `768px`, `1024px`, `1440px`, and `1920px`; confirm `<h1>` renders in `<= 2` lines, primary CTA (`Explore Projects`), GitHub/LinkedIn/Email actions are immediately visible without scroll, and `axe-core` reports zero contrast violations.

1. **Given** a recruiter opens `/` on desktop (`1440×900`), **When** the hero renders, **Then** the left column shows name, specialization (`DevOps · QA/SDET · Backend · Applied AI`), concise verified bio, and CTAs while the right column hosts one bounded 3D geometric sculpture with zero text overlap.
2. **Given** a visitor opens `/` with `prefers-reduced-motion: reduce` or WebGL unavailable, **When** the hero loads, **Then** a crisp static architectural SVG fallback renders inside the sculpture frame and all sections remain immediately readable at `opacity: 1`.

### User Story 2 - Curated Selected Work & Case Study Evidence (Priority: P1)
A hiring manager wants to verify engineering depth through 6–8 flagship projects across QA/SDET, Mobile/AI, Desktop/Systems, Backend/FinTech, and DevOps with real screenshots and technical case studies.

**Independent Test**: Inspect Selected Work on `/` (`8` curated projects) and navigate to `/projects/[slug]`; confirm real screenshots load, fork attribution is explicit on `HeartRateMonitor`, and no empty sections appear when optional metadata is absent.

1. **Given** a user views Selected Work on `/`, **When** inspecting the cards, **Then** each card displays title, category, verified summary, real app screenshot, core technologies, repository/demo links, and a link to `/projects/[slug]`.
2. **Given** a user opens `/projects/heart-rate-monitor`, **When** viewing project details, **Then** the page clearly distinguishes upstream (`aditydcp/sample-wear-phone-app`) from Adrian's contributions (Galaxy Watch accelerometer, Polar ECG/HR/RR timing fixes, ordered session controls, SAF CSV export, DevSecOps CI).

### User Story 3 - Searchable Project Explorer & Tiered GitHub Catalog (Priority: P2)
An engineering lead wants to search and filter across all eligible public GitHub repositories by domain category, technology, or tier (`Featured`, `All Projects`, `Experiments & Archive`).

**Independent Test**: Navigate to `/projects`, filter by category, technology, search query, and archive toggle; verify URL query params, result count, empty state, and `Clear filters` reset.

1. **Given** a user visits `/projects`, **When** typing `"cypress"` or selecting `QA & Test Automation`, **Then** only matching projects render, the count updates accurately, and URL params update without page reload.
2. **Given** a search query matches zero projects (`"nonexistent-xyz"`), **When** results update, **Then** a clear empty state appears with a functional `Reset filters` button.
3. **Given** the maintainer runs `npm run sync:github`, **When** the GitHub API is reachable, **Then** `src/data/github-repositories.json` updates via pagination without overwriting `src/data/project-overrides.ts`; **When** the API fails, **Then** the existing snapshot is preserved and a non-zero exit/error is reported.

### User Story 4 - Verified Career, Competencies, Certifications & Contact (Priority: P2)
A recruiter reviews Adrian's professional experience separately from bootcamps/training, inspects competency groups linked to real projects, verifies certifications, and contacts Adrian directly.

**Independent Test**: On `/`, switch Experience tabs (`Work Experience` vs `Bootcamps & Training`), inspect competencies linked to project routes, and inspect Certifications, Education, and Contact sections.

1. **Given** a user views Professional Experience, **When** viewing the default state, **Then** professional roles (Qiscus, Tokopedia – ByteDance, Bitbybit Studio) are displayed first and cleanly separated from bootcamps/training.
2. **Given** a user views Certifications, **When** no verified third-party verification URL exists in source records, **Then** issuer and status note are shown honestly without fabricated credential links.

### User Story 5 - Static Export, Accessibility, Security & Performance (Priority: P1)
All pages export cleanly as static HTML/JS/CSS for Vercel (`output: "export"`), support full keyboard navigation, emit zero critical console errors, and meet WCAG 2.2 AA and Core Web Vitals lab thresholds.

**Independent Test**: Run `npm run build` (`out/` output), serve `out/` statically, refresh `/projects` and `/projects/automate-plus/` directly, run Playwright + `axe-core` + keyboard navigation + Lighthouse/trace checks.

---

## Functional & Non-Functional Requirements

- **FR-001**: Professional Graphite & Ice Blue design system (`#09090B`, `#18181B`, `#27272A`, `#F4F4F5`, `#A1A1AA`, `#38BDF8`, `Geist` & `Geist Mono`) replacing cyberpunk neon/particles/grids.
- **FR-002**: Two-column desktop Hero with max-2-line `h1`, verified engineering positioning, primary CTAs, social links, and one bounded Three.js procedural sculpture in the right column (no background particles/grids behind text).
- **FR-003**: Automated paginated GitHub sync script (`scripts/sync-github.mjs`, `npm run sync:github`) writing `src/data/github-repositories.json`, merged cleanly with `src/data/project-overrides.ts` into `src/data/projects.ts` with fallback preservation on failure.
- **FR-004**: Three-tier project curation across Featured (`8` projects on `/`), Project Explorer (`/projects` covering eligible public repos), and Experiments & Archive (separate tab/tier for forks, coursework, bootcamp exercises, prototypes).
- **FR-005**: Searchable & filterable `/projects` route supporting keyword search, category filter, technology filter, featured/archive filter, sort (`editorial` / `recent`), result count, empty state, and filter reset.
- **FR-006**: Statically generated `/projects/[slug]` case study pages (`generateStaticParams`) rendering verified project metadata, architecture, contribution, screenshots, testing/security notes, and omitting empty sections.
- **FR-007**: Verified real application screenshots optimized to WebP/PNG in `public/projects/` with explicit dimensions (`width`/`height`) and descriptive `alt` text.
- **FR-008**: Separated Professional Experience vs Bootcamps & Training timeline, Competency Groups linked to projects, honest Certifications/Education metadata, and direct Contact (`mailto:`, LinkedIn, GitHub, Medium) without backend forms.
- **FR-009**: Bounded R3F Hero Canvas (`frameloop="demand"`, client lazy-loaded, offscreen pause, GPU cleanup, WebGL ErrorBoundary + static fallback, `prefers-reduced-motion` support) + lightweight CSS 3D card tilt (`<= 5°`, disabled on touch/reduced motion).
- **NFR-001**: Frontend-only Next.js static export (`output: "export"`), zero runtime backend/database/client API secrets, direct static route refresh compatibility.
- **NFR-002**: WCAG 2.2 AA compliance (`>= 4.5:1` contrast, keyboard navigation, visible focus rings, `>= 44×44px` interactive targets, zero `axe-core` critical/serious violations, `opacity: 1` visible content without scroll locks).
- **NFR-003**: Responsive layout across `320px`, `375px`, `390px`, `768px`, `1024px`, `1440px`, `1920px` with zero horizontal overflow.
- **NFR-004**: Lab performance targets: Lighthouse Performance `>= 90`, Accessibility `>= 95`, Best Practices `>= 95`, SEO `>= 95`, LCP `<= 2.5s`, CLS `<= 0.1`.
- **NFR-005**: Security & Privacy: Zero private repo data, zero participant/confidential clinical data, zero unsanitized external HTML/Markdown rendering, static SEO (`sitemap`, `robots`, Open Graph, JSON-LD `Person`).
