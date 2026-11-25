# V3 Motion System — GSAP, Lenis & Adaptive Micro-Interactions

## 1. Orchestration Architecture
- **Scroll Smoothness:** Single centralized `Lenis` instance (`src/components/motion/SmoothScrollProvider.tsx`) driving native anchor/route scroll seamlessly and synchronized via `lenis.on("scroll", ScrollTrigger.update)` + `gsap.ticker`. Automatically disabled when `prefers-reduced-motion: reduce` is enabled.
- **Scroll Choreography:**
  - `ScrollTrigger` scrubbed camera transformation & GLSL horizon progress across Hero -> Selected Work -> Experience -> Enterprise -> About -> Contact.
  - `clip-path` image wipe reveals and subtle GPU `yPercent` parallax on editorial project spreads and `ChibiShowcase`.
- **Micro-Interactions:**
  - Kinetic `RollText` hover/focus slide (`300ms cubic-bezier(0.22, 1, 0.36, 1)`).
  - `MagneticSurface` desktop fine-pointer attraction on primary CTAs.
  - Lightweight custom pointer cursor ring (`DesktopPointerCursor` on `@media (hover: hover) and (pointer: fine)` + reduced-motion off) providing subtle contextual feedback without hiding or breaking native controls.
  - Top `1px` Electric Blue `#4169FF` scroll progress hairline & concise `clip-path` / transform route veil on navigation.

## 2. Cleanup & Safety
- All GSAP instances register inside `useGSAP()` scope or `gsap.matchMedia()` so unmount/resize/reduced-motion reverts cleanly without memory leaks or stale triggers.
- Never animate root `#contact` or major sections from permanent `opacity: 0`.
