# Acceptance Criteria 006

1. Homepage `#work` displays 6 featured items in exact order: `Android Stress Detection` (`01 / Flagship Research`), `QuranPlus` (`02`), `Coffee Creator` (`03`), `AdzanPlus` (`04`), `ParfumCreator` (`05`), and `AutomatePlus` (`06`).
2. `npm run sync:github` and randomized `pushedAt` / star inputs do not alter Top-5 featured order (`FEATURED_PROJECT_ORDER`).
3. `ParfumCreator` is represented strictly as a private-safe summary (`visibility: "private-summary"`) with zero `GitHub`, `Source code`, or `Live Demo` links and renders an intentional Obsidian & Arctic typographic cover.
4. `/projects/android-stress-detection/` renders authentic local WebP screenshots (`naturalWidth > 0`), verified Wear OS / PPG / ONNX / SQA architecture copy, custom SEO `<title>`, and the explicit non-diagnostic disclaimer (`not a medical diagnostic tool`); old `/projects/android-wear-stress-assistant/` returns 404.
5. `npm run validate:assets`, `eslint`, `tsc --noEmit`, `vitest`, `next build`, Playwright E2E + `axe-core` (0 violations), and Lighthouse verification pass on `feat/portfolio-v6-featured-projects`.
