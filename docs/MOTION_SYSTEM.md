# V3 Motion System — GSAP, Lenis & Adaptive Quality

## 1. Adaptive Quality Modes (`MotionContext`)
- `cinematic`: Capable fine-pointer desktop contexts — full 220x48 Torus-Knot vertex morph, procedural GLSL backdrop, GPU vertical parallax, context cursor halo (`VIEW`), Lenis smooth scroll, staggered section choreography, and route transition veil.
- `balanced`: Compact viewports / touch devices — reduced DPR `[1, 1.25]`, lower particle & geometry complexity, light touch-safe parallax, zero continuous cursor tracking.
- `reduced`: OS `prefers-reduced-motion: reduce` or user-toggled `Reduced` mode — swaps WebGL scene immediately for static SVG `SpatialFallback`, disables Lenis smooth wheel, parallax, magnetic attraction, and overlays.

## 2. Orchestration & Ownership
- **Scroll Smoothness:** Single centralized `Lenis` instance synced via `gsap.ticker` + `ScrollTrigger.update`, plus top `1.5px` `#65C8F5` Arctic scroll progress hairline.
- **Section Choreography:** Distinct `clip-reveal`, `slide-right`, and `stagger-list` treatments (`SectionChoreography.tsx`) keeping all critical elements immediately visible (`opacity: 1`).
- **Cleanup:** All GSAP scopes use `useGSAP` with automatic context reversion on unmount/quality toggle.
