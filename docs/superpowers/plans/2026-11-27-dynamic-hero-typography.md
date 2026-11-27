# Dynamic Hero Typography Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]` / `- [ ]`) syntax for tracking.

**Goal:** Replace `"I build and test software."` in `Hero.tsx` with a lightweight, zero-CLS, accessible continuous typewriter component cycling 12 bold engineering phrases.

**Architecture:** Store the immutable 12-phrase catalog and timing constants in `src/config/site.config.ts`. Build a self-contained `TypewriterText` client component under `src/components/motion/TypewriterText.tsx` that overlaps an invisible intrinsic grid sizer (longest phrase) beneath an `aria-hidden` visible animated span + `#65C8F5` hairline cursor + `sr-only` static copy + `44x44px` Pause/Resume control, integrating with existing `MotionContext` (`qualityMode === "reduced"`).

**Tech Stack:** Next.js 16, React 19, TypeScript (`strict: true`), Tailwind CSS v4, Vitest + Testing Library, Playwright + `axe-core`.

**Spec:** [openspec/specs/hero-typography/spec.md](../../../openspec/specs/hero-typography/spec.md)

## Global Constraints
- 12 exact phrases starting with `"Think. Build. Repeat."`; longest phrase `"Deploy faster. Build smarter."`
- Timings: typing `25–35 ms` (`30`), deleting `10–15 ms` (`12`), hold `1500 ms`, empty gap `80–100 ms` (`90`), cursor blink `450–500 ms` (`480`)
- Zero new npm dependencies; strict `Timer` cleanup; `sr-only` non-chatter a11y; `0` horizontal overflow (`320px–1920px`)

## Review Focus
1. Hydrating SSR with `"Think. Build. Repeat."` immediately (not `""`) avoids blank subtitle flash and SSR mismatch.
2. CSS Grid overlapping (`col-start-1 row-start-1`) reserves exact mobile wrapped height across phrases so `0` visible chars never causes vertical jump.
3. Unmounting or toggling pause / `qualityMode === "reduced"` clears every `setTimeout` cleanly.
4. Pause/Resume button hits `44x44px` accessible touch target cleanly without disturbing hero line balance.
5. Existing E2E tests checking `#hero` CTAs (`View My Work`, `Get in Touch`) and `"Software & QA Automation Engineer"` remain green.

---

### Task 1: FigCraft Hero Tagline Alignment
- Update node `96` (`Display Headline` in `D:\SEMESTER12\adrian-portfolio\design\portfolio.figcraft` frame `88`) or adjacent subtitle note to reflect `"Think. Build. Repeat."`, save, and export `design/exports/v3-hero-dynamic.png` for visual sign-off.

### Task 2: TDD Red Phase — Failing Typewriter Unit Suite
**Files:**
- Create: `tests/unit/typewriter.test.tsx`

- Write deterministic Vitest + Testing Library tests using `vi.useFakeTimers()` verifying:
  - exact 12 phrases list integrity,
  - initial SSR-safe full text `"Think. Build. Repeat."` renders immediately,
  - holds `1500 ms` before deleting (`12 ms/char`), pauses `90 ms` when empty, types `"Code with purpose."` at `30 ms/char`, loops back after last phrase,
  - Pause button stops mutations (`aria-pressed="true"`) and Resume restarts,
  - `qualityMode === "reduced"` keeps text static,
  - timer cleanup runs cleanly on unmount.
- Run `npx vitest run tests/unit/typewriter.test.tsx` -> observe FAIL cleanly.

### Task 3: Minimal Implementation (Config, CSS Keyframe, Component, Hero Integration)
**Files:**
- Modify: `src/config/site.config.ts`
- Modify: `src/app/globals.css`
- Create: `src/components/motion/TypewriterText.tsx`
- Modify: `src/components/sections/Hero.tsx`

- Add `HERO_TAGLINES` & `HERO_TYPEWRITER_CONFIG` to `src/config/site.config.ts`.
- Add `@keyframes typewriter-blink` to `src/app/globals.css`.
- Implement `TypewriterText` and wire into `Hero.tsx`.
- Run `npx vitest run tests/unit/typewriter.test.tsx` -> observe PASS cleanly.

### Task 4: E2E Regression & Verification Gate
**Files:**
- Modify: `tests/e2e/portfolio.spec.ts`

- Add Playwright checks covering initial text, dynamic transition after `>1.6s`, Pause/Resume state toggle, `prefers-reduced-motion` static fallback, zero horizontal overflow (`320px`–`1920px`), and `axe-core` WCAG 2.2 AA (`0` violations).
- Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, `npm run validate:assets`, `npm run seo:audit`, `npm run seo:links`, `npm run test:e2e`.
- Inspect rendered Desktop/Mobile screenshots + Desktop/Mobile Lighthouse (`0.00 CLS`).
- Archive OpenSpec change into `openspec/changes/archive/2026-11-27-dynamic-hero-typography/` & promote `openspec/specs/hero-typography/spec.md`.
