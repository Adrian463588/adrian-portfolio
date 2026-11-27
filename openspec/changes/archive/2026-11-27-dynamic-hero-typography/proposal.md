# Change: dynamic-hero-typography

## Why
The static sub-headline `"I build and test software."` under the primary hero H1 (`Adrian Syah Abidin`) reads like a generic resume line. Replacing it with a concise, rotating set of 12 memorable engineering statements gives hiring managers and technical visitors an immediate signal across software, QA, DevOps, SRE, security, data, AI, and mobile engineering while preserving the V3–V10 spatial 3D aesthetic.

## What Changes
- Centralize the 12 approved brand statements (`Think. Build. Repeat.` through `Engineer what's next.`) and typewriter timing defaults (`30 ms` typing, `12 ms` deleting, `1500 ms` hold, `90 ms` transition pause, `480 ms` cursor blink) in `src/config/site.config.ts`.
- Create a lightweight, SSR/hydration-safe `TypewriterText` component (`src/components/motion/TypewriterText.tsx`) using CSS grid intrinsic size reservation (`0.00 CLS`), non-intrusive `sr-only` static copy, `prefers-reduced-motion` + `MotionContext` awareness, and an accessible pause/resume control.
- Wire `TypewriterText` into `src/components/sections/Hero.tsx` replacing only the static `"I build and test software."` paragraph while preserving `h1` (`Adrian Syah Abidin`), eyebrow label, description, CTAs, links, and Three.js background.

## Impact
- Affected components: `Hero.tsx`, new `TypewriterText.tsx`, `globals.css`, `site.config.ts`, unit/E2E tests, and `design/portfolio.figcraft`.
- Zero new runtime dependencies added; zero backend changes; static `output: "export"` preserved.
