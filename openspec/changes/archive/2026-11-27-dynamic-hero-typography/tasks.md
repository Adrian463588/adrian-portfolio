## 1. Specification & Design Alignment
- [x] Audit `src/components/sections/Hero.tsx`, `src/context/MotionContext.tsx`, `AGENTS.md`, git status, and `https://eben.biz.id/` reference behavior.
- [x] Align `design/portfolio.figcraft` V3 Hero frame with updated tagline preview and export visual reference (`design/exports/v3-hero-dynamic.png`).

## 2. TDD & Config / Component Implementation
- [x] Write failing Vitest unit tests in `tests/unit/typewriter.test.tsx` covering phrase sequence, typing/deleting/hold timing (`30ms`/`12ms`/`1500ms`/`90ms`), loop wrap, pause/resume, cleanup, and `reducedMotion` static fallback (RED verified).
- [x] Add `HERO_TAGLINES` and `HERO_TYPEWRITER_CONFIG` to `src/config/site.config.ts`.
- [x] Add `typewriter-blink` keyframe respecting `prefers-reduced-motion` to `src/app/globals.css`.
- [x] Implement `src/components/motion/TypewriterText.tsx` and integrate into `src/components/sections/Hero.tsx` (GREEN verified `6/6`).

## 3. Verification, OpenSpec Archive & Release
- [x] Expand `tests/e2e/portfolio.spec.ts` to verify live typewriter transitions, pause toggle, reduced-motion static rendering, zero horizontal overflow (`320px`–`1920px`), and `axe-core` WCAG 2.2 AA (`0` violations).
- [x] Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, `npm run validate:assets`, `npm run seo:audit`, `npm run seo:links`, and `npm run test:e2e`.
- [x] Visually inspect Desktop (`1440x900`) & Mobile (`390x844`) screenshots + Lighthouse (`100/100/100/100` Desktop & Mobile, `LCP: 424 ms`, `CLS: 0.00`).
- [x] Archive completed OpenSpec change (`openspec/changes/archive/2026-11-27-dynamic-hero-typography/`).
