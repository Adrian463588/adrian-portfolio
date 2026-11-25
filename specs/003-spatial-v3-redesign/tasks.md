# Task Breakdown 003 — Spatial Minimalist V3 Redesign

- [x] **T3.0 Branch & Recovery Baseline:** Create `feat/v3-immersive-3d-redesign`, inspect old `3bc563e` `Scene.tsx` WebGL motifs, replace unused `framer-motion` with `gsap` + `@gsap/react`.
- [x] **T3.1 Avatar Processing & Spec Kit:** Finalize crisp Chibi crops (`professional-chibi.webp`, `professional-chibi-mobile.webp`), update `design/tokens.json` & `specs/003-spatial-v3-redesign/*`.
- [x] **T3.2 FigCraft V3 Canvas:** Author V3 Hero, Editorial Gallery `/projects/`, and About+Chibi frames in `design/portfolio.figcraft`, export PNGs to `design/exports/`, and inspect visually.
- [x] **T3.3 Three.js Spatial Scene & Motion Layer:** Implement full-viewport `SpatialWidget`/`SpatialScene` (perspective shader grid, adaptive particles, orbital core with pointer + scroll camera transitions, reduced-motion/WebGL fallback) + GSAP motion primitives (`ScrollParallax`, `MagneticSurface`, `RollText`, `ChibiShowcase`).
- [x] **T3.4 Editorial Homepage Redesign:** Update `layout.tsx`, `globals.css`, `Navbar.tsx`, `Hero.tsx`, `SelectedWork.tsx`, `Experience.tsx`, `EnterpriseCaseStudies.tsx`, `Competencies.tsx`, `Certifications.tsx`, `Education.tsx`, `About.tsx`, `Contact.tsx`, `Footer.tsx`.
- [x] **T3.5 Projects Editorial Gallery & Compact Filter UX:** Redesign `src/app/projects/page.tsx`, `ProjectExplorer.tsx`, `ProjectCard.tsx`, `CaseStudyDetail.tsx` with progressive-disclosure filter drawer and Gallery/Index views.
- [x] **T3.6 Full QA, E2E, Visual & Performance Audit:** Fix `768px` tablet overflow, run `lint`/`typecheck`/`test`/`build`/`test:e2e` (27/27 E2E), `out/` confidentiality scan, Chrome DevTools Lighthouse & Performance Trace, inspect before/after screenshots, commit & push feature branch.
