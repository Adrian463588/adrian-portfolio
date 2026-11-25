# Acceptance Criteria 003 — V3 Spatial Minimalist 3D Redesign

## Visual, Motion & Chibi Criteria (`TC-V3-UI`)
- **TC-V3-001:** Hero displays `Adrian Syah Abidin` (`Space Grotesk` display type) without a boxed border container around the Three.js scene and without debug labels (`DEMAND RENDERED`); full-viewport WebGL background (`canvas`) + perspective grid + orbital lattice animate cleanly on desktop.
- **TC-V3-002:** `/projects/` opens directly with a single compact toolbar (`Search`, `Origin`/`Category`/`Sort`, and `More Filters` disclosure button + `Editorial Gallery` / `Index List` toggle); first project card is immediately visible above the fold at `1440x900`.
- **TC-V3-003:** `More Filters` drawer toggles advanced domain/tier filters cleanly, syncs URL query params, supports reset and empty state, and preserves all 73 documented entries (`3` enterprise + `70` GitHub).
- **TC-V3-004:** `About` section displays `professional-chibi.webp` (`naturalWidth > 0`) with clean square aspect ratio, rounded framing hiding outer artifacts, and interactive desktop tilt without obstructing text.
- **TC-V3-005:** No repetitive `#18181B` rounded card stacks dominate Competencies, Credentials, Education, or Experience; asymmetrical hairline editorial lists & dossiers remain crisp and legible.
- **TC-V3-006:** Zero horizontal overflow across `320px, 360px, 390px, 430px, 768px, 1024px, 1280px, 1440px, 1920px`.
- **TC-V3-007:** Zero `axe-core` WCAG 2.2 AA violations across `/`, `/projects/`, `/projects/archer-upgrade/`, `/projects/stnk-alignment/`, `/projects/advanced-joint-finance-parameter/`, `/projects/automate-plus/`, and `/projects/heart-rate-monitor/`.
- **TC-V3-008:** Both `prefers-reduced-motion: reduce` and disabled WebGL context fall back gracefully with zero runtime errors and intact core content.
- **TC-V3-009:** All V1+V2 invariants pass (`experience.test.ts`, `projects.test.ts`, `sync-github.test.ts`), `out/` confidentiality scan stays clean, and Lighthouse scores pass (`>= 95` Accessibility / Best Practices / SEO, `CLS <= 0.1`, `LCP <= 2.5s`).
