# Current State Audit — Adrian Syah Abidin Portfolio

> **Audit Date:** 2026-11-25  
> **Production URL Audited:** `https://adriansyahabidin.vercel.app/` (`git HEAD` commit `3bc563e`)  
> **Local Workspace State:** Next.js 16.1.6 (`adrian-portfolio`, uncommitted WIP changes over `3bc563e`)

---

## 1. Existing Architecture

### 1.1 Tech Stack & Configuration (`package.json`, `next.config.ts`, `tsconfig.json`)
- **Framework:** Next.js `16.1.6` (App Router), React `19.2.3`, TypeScript `^5` (`strict: true`)
- **Styling:** Tailwind CSS v4 (`@tailwindcss/postcss`, `@import "tailwindcss"` in `src/app/globals.css`)
- **3D / Animation:** `three` `^0.183.2`, `@react-three/fiber` `^9.5.0`, `@react-three/drei` `^10.7.7`, `@react-three/postprocessing` `^3.0.4`, `postprocessing` `^6.38.3`, `framer-motion` `^12.34.3`
- **Icons / Utilities:** `lucide-react` `^0.575.0`, `clsx`, `tailwind-merge`
- **Deployment / Output Config:**
  - `HEAD` (`3bc563e`): default `nextConfig = {}` (not explicitly configured for `output: "export"`).
  - Uncommitted local WIP: `output: "standalone"` + untracked `Dockerfile`, `docker-compose.yml`, `.dockerignore`. This violates the frontend-only static Vercel export requirement.
- **Testing & Quality Scripts:** Only `dev`, `build`, `start`, `lint` exist in `package.json`. No `typecheck`, `test` (Vitest), `test:e2e` (Playwright), or `sync:github` scripts exist.

### 1.2 Routing & Component Inventory
- **Routes:** Single route `/` (`src/app/page.tsx`) rendering 8 stacked sections (`Hero`, `Experience`, `Projects`, `Skills`, `Certifications`, `Education`, `Leadership`, `Contact`) inside `RootLayout` (`Navbar`, `ThreeScene`, `ClientEffects`, `Footer`). No `/projects` explorer route and no `/projects/[slug]` case study routes exist.
- **Data Layer (`src/data/`):** Static TypeScript arrays (`projects.ts`, `experience.ts`, `skills.ts`, `certifications.ts`, `education.ts`, `leadership.ts`) containing only 7 projects.

---

## 2. Existing Features
- Responsive navigation bar with mobile toggle and active section scroll-spy (`Navbar.tsx`)
- Full-viewport Three.js scene (`Scene.tsx`) lazily mounted client-side via `next/dynamic(..., { ssr: false })` (`ThreeScene.tsx`) with `prefers-reduced-motion` check
- Experience timeline with category filters (`All Track`, `Work Experience`, `Bootcamps & Training`) in WIP
- Static lists for 7 projects, 7 skill categories, 7 certifications, 2 education entries, and 3 leadership entries
- Direct `mailto:`, LinkedIn, GitHub, Medium, and Instagram links

---

## 3. Baseline Evidence (Production `https://adriansyahabidin.vercel.app/`)

### 3.1 Baseline Screenshots
Captured via Playwright Chromium at `1440×900`, `768×1024`, and `375×812`:
- Desktop above-the-fold: `docs/evidence/before/prod-desktop-1440.png`
- Desktop full page (before scroll): `docs/evidence/before/prod-desktop-1440-full.png` — **demonstrates severe flaw: below-the-fold sections remain invisible (`opacity: 0`) until `whileInView` triggers**
- Desktop scrolled sections: `docs/evidence/before/prod-experience.png`, `docs/evidence/before/prod-projects.png`, `docs/evidence/before/prod-bottom.png`, `docs/evidence/before/prod-desktop-1440-full-scrolled.png`
- Tablet `768×1024`: `docs/evidence/before/prod-tablet-768.png`
- Mobile `375×812`: `docs/evidence/before/prod-mobile-375.png`

### 3.2 Baseline Lighthouse & Performance Trace (Chrome DevTools MCP)
- **Desktop Lighthouse (`navigation`, no perf category in MCP):**
  - Accessibility: **96**
  - Best Practices: **100**
  - SEO: **100**
  - Agentic Browsing: **100**
  - Failed audit: `color-contrast` (2 flagged nodes on above-the-fold/footer snapshot)
- **Mobile Lighthouse (`navigation`, no perf category in MCP):**
  - Accessibility: **96**
  - Best Practices: **100**
  - SEO: **100**
  - Agentic Browsing: **100**
  - Failed audit: `color-contrast` (2 flagged nodes)
- **Performance Trace (`NAVIGATION_0`, desktop 1x CPU, no throttling):**
  - LCP (lab): **1311 ms** (TTFB: `42 ms`, Render delay: `1268 ms`)
  - CLS (lab): **0.00**
  - Insights flagged: `LCPBreakdown`, `RenderBlocking`, `NetworkDependencyTree`, `DOMSize`, `ForcedReflow`, `LegacyJavaScript`
- **Console Warning (Production):**
  - `[warn] THREE.THREE.Clock: This module has been deprecated. Please use THREE.Timer instead.`

### 3.3 Baseline `axe-core` Full-Page Scan (`docs/evidence/before/axe-prod-baseline.json`)
- **Violations:** `1` rule (`color-contrast`, severity `serious`) across **7 DOM nodes**:
  - `.bg-cyan-600` (`CONTACT ME` button: `#ffffff` on `#0092b8` = **3.61:1**, below `4.5:1`)
  - Footer & secondary card metadata (`#6a7282` gray-500 on `#090910` / `#050505` = **4.10–4.21:1**, below `4.5:1`)

---

## 4. Detailed Findings & Problems

### 4.1 UI/UX Problems
1. **Gaming/Cyberpunk Aesthetic:** Production uses `Orbitron` and `Rajdhani` fonts, `#050505` pure black, bright neon blue/cyan perspective ground grid (`GroundPlane`), and 2,000 additive-blending particles behind body copy.
2. **Hero Name & Mobile Overlap:** On production desktop and mobile (`375×812`), `ADRIAN / SYAH / ABIDIN` splits across 3 oversized lines, the `OPEN TO 2025...` pill wraps across 2 lines, the wireframe icosahedron overlaps the subtitle `"Engineer"`, and the bottom scroll chevron collides with the Instagram social icon.
3. **WIP Hero Terminal Card:** The uncommitted local WIP replaced the 3D hero slot with a fake terminal card containing fabricated metrics (`142/142 passed`, `simulate_high_concurrency(users=10000)`, `Cluster Uptime: 99.99%`, `Avg API Latency: 14.2ms`) while keeping the full-screen background 3D scene.
4. **Hidden Content Behind `whileInView`:** Sections below the fold render at `opacity: 0` until IntersectionObserver triggers (`prod-desktop-1440-full.png` shows ~90% blank dark page before scrolling).
5. **No Project Screenshots / Explorer / Case Studies:** Only 7 text-only project cards exist with zero real screenshots, no search/filter catalog, and no detail pages.

### 4.2 Performance & WebGL Bottlenecks
1. **Full-Viewport Continuous Render Loop:** `Scene.tsx` renders `frameloop="always"` behind the entire document with `EffectComposer` + `Bloom` (`@react-three/postprocessing` / `postprocessing`), 700–2,000 raycasted particles per frame, custom shader `GroundPlane`, and `FloatingOrbs` — consuming GPU even when scrolled past the hero or offscreen.
2. **Unused Dependencies & Boilerplate:** `@react-three/drei` is installed in `package.json` without being used; `GlassCard.tsx`, `MagneticButton.tsx`, `TiltCard.tsx` are orphaned in the WIP tree; `public/` still ships unused starter SVGs (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`).
3. **Render Delay (`1268 ms`):** Client-side `framer-motion` wrappers (`initial={{ opacity: 0 }}`) and render-blocking font/CSS startup delay initial hero paint.

### 4.3 Content & GitHub Inventory Gaps
1. **Under-represented Portfolio:** GitHub user `Adrian463588` has **77 public repositories** (72 originals, 5 forks), including pinned & active flagship work (`AutomatePlus`, `QuranPlus`, `EnglishPrepAI`, `android-stress-detection`, `coffee-creator`, `AdzanPlus`, `ChatBuddy`, `MedBot`, `VideoEditorFree`, `LedgerScope`, `TechnoLoyaltyProgram`, `CreditRiskPrediction`, `biosignal-stress-pipeline`, `SignalBooster`, `NotifPlus`, `DemoEvershopCypress`, `Task5ManageDashboardMonitoring`, `Task12ManageKubernetesAutoscallingKubernetes`, `ForumAPI`, `GoOnlineShop`, `go-cv-ai-evaluator`, `ScreenSharingWindowsInput`, `PPTController`), whereas the site only lists 7 projects.
2. **Inaccurate Project Fact (`ProjectGame`):** The existing `src/data/projects.ts` claims `"Wrath of the Disasters"` is a `"3D Unreal Engine project"`. Inspection of `Adrian463588/ProjectGame` proves it is a **2D side-scrolling action game built with Unity (C#)** (`WrathOfDisaster/Assets`, `Packages`, `ProjectSettings`).
3. **Outdated Career / Education / Availability Dates:**
   - Production says `"Open to 2025 Full-Time & Internship Roles"` and `© 2025`.
   - `Hero.tsx` and `layout.tsx` say `"Final-year Information Technology student"` while `education.ts` lists `Aug 2020 – May 2025` (current date is `2026-11-25`). Without an externally verified graduation certificate date, copy must reflect Adrian's verified engineering roles and UGM IT background accurately without making stale `"2025"` or unverified graduation claims.
   - `TechnoLoyaltyProgram` homepage URL (`https://m4nx9kc046wxksnhs6zfseor.34.128.73.127.sslip.io/`) timed out during link verification (`URLError`), whereas `hsk1vocab.edgeone.dev`, `plsqllearn.edgeone.dev`, `fortuneteller.edgeone.dev`, and `znlkostputri.edgeone.dev` returned HTTP 200.
   - Certifications lack verified credential URLs in the repository; no verified résumé PDF exists in `public/` or git history.

### 4.4 Technical Debt & Lint Failures
- Running `npm run lint` on the current uncommitted working tree **fails with 5 errors and 3 warnings**:
  - `react-hooks/set-state-in-effect` in `ThreeScene.tsx:20`, `Scene.tsx:16`, `CursorSpotlight.tsx:28`
  - `react/jsx-no-comment-textnodes` in `Contact.tsx:25` (`// INITIATE CONTACT`)
  - `react-hooks/purity` (`Math.random` inside `useMemo`) in `Scene.tsx:69`
  - Unused symbols in `CursorSpotlight.tsx` (`dotSpringX`, `dotSpringY`) and `TimelineItem.tsx` (`cn`)

---

## 5. Proposed Improvements & Migration Strategy
1. **Spec-Driven Design (Phase 1):** Initialize GitHub Spec Kit (`specify init`), write Constitution, PRD, Design System (`Graphite & Ice Blue`: `#09090B`, `#18181B`, `#27272A`, `#F4F4F5`, `#A1A1AA`, `#38BDF8`, `Geist` + `Geist Mono` / `Inter`), Architecture, and Data Schema (`docs/` + `specs/`), plus design frames in FigCraft (`design/*.figcraft`).
2. **GitHub Static Snapshot Pipeline (Phase 2):** Implement `scripts/sync-github.mjs` (`npm run sync:github`) using paginated GitHub REST API with fallback to last valid snapshot (`src/data/github-repositories.json`), merged with curated editorial overrides (`src/data/project-overrides.ts`) into `src/data/projects.ts`. Categorize into Featured (8 projects), Project Explorer (`/projects`), and Experiments & Archive, with explicit fork attribution (`HeartRateMonitor`) and privacy filtering.
3. **Real Assets & Case Studies (Phase 2 & 4):** Download/optimize genuine app screenshots from Adrian's public GitHub repos and deployed EdgeOne web apps into `public/projects/*.webp`; generate `/projects/[slug]` static case study pages via `generateStaticParams()`.
4. **Refined 3D & Accessible UI (Phase 3–5):** Replace full-screen neon particles/grid/Bloom with a single bounded procedural Three.js architectural sculpture in the Hero right column (lazy-loaded, `frameloop="demand"` + intersection pause, WebGL ErrorBoundary + static SVG/CSS fallback, `prefers-reduced-motion` support, no `THREE.Clock` deprecation). Replace `TiltCard` with lightweight CSS/motion 4–5° hover tilt disabled on touch and reduced-motion. Eliminate all `opacity: 0` content-hiding traps and fake terminal metrics.
5. **Verification & Static Export (Phase 7–13):** Switch `next.config.ts` to `output: "export"`, remove unnecessary Docker files, add Vitest unit tests + Playwright + `axe-core` E2E/a11y/responsive tests across `320px`–`1920px`, verify console/links/build, and capture after-screenshots and Lighthouse/trace audits.

---

## 7. V2 Audit Delta — Enterprise Experience & Confidentiality Scope

- **Public Verification (2026-11-25):** Verified via `berijalan.co.id` that **Berijalan** is the commercial brand of **PT Cipta Sedaya Digital Indonesia (CSDI)** under **Astra Credit Companies (ACC)** / Astra Group, headquartered in Sleman, Yogyakarta (`Techno Center`, `Telephony Center`, `Operations Center`). Verified `Magic xpa` / `uniPaaS` terminology (Magic Software Enterprises) and Cypress headless execution in Jenkins CI.
- **Timeline Gap Identified in V1:** V1 homepage listed Qiscus (`Jul 2025 – Oct 2025`), Tokopedia (`Feb 2025 – Jun 2025`), and Bitbybit Studio (`Nov 2024 – Jul 2025`), omitting V2 Berijalan Techno Center roles (`Mar 2026 – Jul 2026` Trainee Bootcamp / Internship-equivalent, and `Jul 2026 – Oct 2026` Freelance SQC Engineer) and omitting enterprise quality engineering case studies (`Archer Upgrade`, `STNK Alignment`, `Advanced Joint Finance Parameter`).
- **Confidentiality & Portfolio Boundary:** Enterprise engagements lack public GitHub source repositories and are maintained separately in `src/data/enterprise-projects.ts` with a build-time `publicDisclosureApproved` gate so confidential artifacts, internal URLs, schemas, SQL, and pricing/joint-finance calculation rules are never emitted in `out/`.
