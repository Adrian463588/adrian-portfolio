# Acceptance Criteria 005

1. Hovering `Get in Touch`, `GitHub`, `LinkedIn`, `Medium`, `Adrian.`, and nav links keeps text readable (`>= 4.5:1` / unclipped visible bounds) on default, hover, focus, and mouse-leave.
2. Hovering `[data-cursor='work']` renders sharp `11px` `VIEW` text (`scale <= 1`, `filter: none`, `pointer-events: none`), never covering `Adrian.` or text CTAs.
3. All required local images exist with exact filename casing (`npm run validate:assets` passes on `public/` and `out/`), render with `naturalWidth > 0`, and fall back cleanly via `ResilientImage` if missing.
4. Public navbar displays `Adrian.`, public location displays `Indonesia` / `INDONESIA`, zero `YOGYA` or `GMT+7` references remain on personal profile surfaces, while UGM & company history stay accurate.
5. All 70 public project routes return HTTP 200 with valid headings; Berijalan remains non-interactive; `axe-core` reports `0` violations; Lighthouse Accessibility/Best Practices/SEO >= 95.
