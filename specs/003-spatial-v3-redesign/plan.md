# Plan 003 — Spatial Minimalist 3D & Editorial Redesign

## Phased Execution Architecture
1. **Asset & Design Prep:**
   - Crop outer frame edges cleanly (`public/images/avatar/professional-chibi.webp`, `professional-chibi-mobile.webp`), update `design/tokens.json` and `design/portfolio.figcraft` via FigCraft MCP (`v3-spatial-redesign` board + `/projects/` compact toolbar wireframe), export PNGs, visually inspect.
2. **Modular Architecture Refactor (KISS / DRY / Separation of Concerns):**
   - `src/components/three/`: `SpatialScene.tsx` (single shared full-viewport R3F canvas with shader perspective horizon grid, adaptive star/node particles, orbital core + scroll-progress camera choreography), `SpatialFallback.tsx`, `SpatialWidget.tsx` (handles WebGL availability + reduced-motion). Keep WebGL decoupled from data/routing.
   - `src/components/motion/`: `RevealSection.tsx` & `MagneticButton.tsx` + `RollText.tsx` built cleanly on `@gsap/react` (`useGSAP`) + CSS transforms with automatic `prefers-reduced-motion` cleanup.
   - `src/components/avatar/`: `ChibiShowcase.tsx` (pointer parallax depth card, layered glow lighting, fallback-safe responsive `<Image>`).
   - `src/components/projects/`:
     - Clean **Compact Filter Toolbar** + collapsible **More Filters** disclosure panel + `Gallery` vs `Index List` (hover thumbnail preview!) view mode switcher inside `ProjectExplorer.tsx`.
     - Restrained asymmetric showcase layout on Featured & Enterprise sections without uniform card borders.
   - `src/app/layout.tsx` & `globals.css`: load `Space_Grotesk`, `Geist`, `Geist_Mono`; define Obsidian/Graphite/Chalk/Cyan tokens; mount `SpatialWidget` cleanly behind `<main>`.
3. **Verification:**
   - Preserve and extend Vitest (`experience`, `projects`, `sync-github`) + Playwright + `axe-core` across `360px`..`1920px` + `prefers-reduced-motion` + WebGL disabled.
   - Capture before/after desktop & mobile screenshots, inspect Chrome DevTools Lighthouse & Performance Trace (`LCP <= 2.5s`, `CLS <= 0.1`), scan `out/` for confidentiality compliance, commit & push on branch `feat/v3-immersive-3d-redesign`.
