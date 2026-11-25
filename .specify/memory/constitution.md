# Adrian Portfolio Constitution

## Core Principles

### I. Frontend-Only & Static Export First
The portfolio MUST remain strictly frontend-only (`output: "export"` in Next.js App Router). Zero runtime backend servers, zero databases, zero server actions requiring runtime execution, zero authentication layers, and zero client-exposed API tokens are permitted. All repository synchronization happens offline/build-time via static snapshots (`npm run sync:github`).

### II. Evidence-First Engineering & Anti-Slop Prose
Every claim, project feature, metric, date, link, and screenshot MUST trace directly to verified first-party repository contents, live deployments, or test artifacts. Fabricated benchmarks, simulated uptime percentages, placeholder copy, fake testimonials, and generic AI clichés are prohibited. Forks (`HeartRateMonitor`) MUST explicitly distinguish personal contributions from upstream code.

### III. Professional Minimalism Over Visual Noise (75 / 15 / 10)
Content clarity and usability constitute 75% of the experience, refined Three.js 3D interaction 15%, and purposeful microinteractions 10%. Cyberpunk neon glows, full-screen particle fields, perspective wireframe grids behind readable text, and condensed gaming fonts are prohibited. Essential content MUST remain visible (`opacity: 1`) without requiring JavaScript or scroll triggers.

### IV. Bounded & Accessible 3D Engineering
Three.js / React Three Fiber MUST be confined to one client-lazy-loaded Hero canvas using procedural geometry (`frameloop="demand"` with controlled invalidation and offscreen pause), adaptive DPR, clean GPU disposal, WebGL ErrorBoundary fallback, and `prefers-reduced-motion` support. Project cards use lightweight CSS/transform tilt (`<= 6°`) disabled on touch devices and reduced-motion users.

### V. Spec-Driven & Test-Verified Delivery (WCAG 2.2 AA + Core Web Vitals)
Every functional requirement maps from `spec.md` → `plan.md` → `tasks.md` → `acceptance-criteria.md` and automated verification (Vitest, Playwright, `axe-core`, TypeScript strict mode, ESLint, and production static export build). Minimum quality bars: WCAG 2.2 AA contrast (`>= 4.5:1` normal text, `>= 3:1` large text), zero horizontal overflow from `320px` to `1920px`, Lighthouse Performance `>= 90`, Accessibility/Best Practices/SEO `>= 95`, LCP `<= 2.5s`, CLS `<= 0.1`.

### VI. KISS, YAGNI, DRY & Security by Design
Prefer native browser/Next.js/React primitives over heavy dependencies. Never render raw unsanitized external Markdown/HTML. Never expose credentials or private/research-participant data. Remove dead components, unused packages, and unnecessary Docker/runtime boilerplate.

## Governance

- Constitution supersedes ad-hoc stylistic changes.
- All UI modifications follow Spec Kit + FigCraft (`design/tokens.json`, `design/*.figcraft`) parity.
- No requirement or test may be marked `PASS` without executed verification evidence.

**Version**: 1.0.0 | **Ratified**: 2026-11-25 | **Last Amended**: 2026-11-25
