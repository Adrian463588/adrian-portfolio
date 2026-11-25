# Spec 005 — Portfolio V5 Visual Polish, Sharp Cursor, Resilient Assets & Navigation QA

## Objective
Resolve remaining visual, interaction, asset-resilience, branding, and geographic-positioning bugs without redesigning the V3/V4 Obsidian & Arctic art direction or Three.js experience.

## Traceable Requirements
| ID | Requirement | Verification |
|----|-------------|--------------|
| UI-001 / UI-002 | Interactive labels (`Get in Touch`, `GitHub`, `LinkedIn`, `Medium`, `Adrian.`, nav items) remain visible and unclipped across default, hover, mouse-leave, rapid movement, and focus states | Playwright hover bounds + computed opacity checks + `v5-hero-hover-1440.png` |
| UI-003 / UI-004 | Custom `VIEW` cursor badge renders sharply via native HTML dimensions (`11px` font at `scale <= 1`, no upscaled raster blur) and hides over standard interactive controls/inputs/dialogs | Playwright `BUG-003` DOM/style check + `v5-cursor-view-1440.png` |
| UI-005 / UI-006 | Brand displays `Adrian.` (instead of `as.`) across desktop, mobile drawer, and OG preview; personal location displays `Indonesia` / `INDONESIA` (no `YOGYA · GMT+7`) | DOM text checks + JSON-LD inspection |
| IMG-001..IMG-006 | Profile portrait (`ChibiShowcase`) and all project images render reliably in static builds (`naturalWidth > 0`), pass case-sensitive asset validation (`npm run validate:assets`), and degrade cleanly via `ResilientImage` fallback on error | `validate:assets`, Playwright image & fallback tests |
| NAV-001..NAV-004 | All 70 public `/projects/[slug]/` routes resolve cleanly on direct load & reload, cross-page `#anchor` navigation works, Berijalan stays purely informational, WebGL canvas never blocks clicks | Playwright 70-route + real-click checks |
| COPY-001 | Remaining project summaries tightened (*QuranPlus*, *Dual-VM Monitoring*, *SignalBooster*, *NotifPlus*, `About.`, short Chibi alt, *Employee Loyalty Program Platform*) | Content audit + Vitest |
