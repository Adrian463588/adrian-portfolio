# Spec 006 — Portfolio V6 Featured Projects & GitHub Portfolio Update

## Objective
Feature `Android Stress Detection` as the flagship research project (`01`) and enforce an explicit curated featured priority (`02` QuranPlus, `03` Coffee Creator, `04` AdzanPlus, `05` ParfumCreator private-safe summary, `06+` supporting featured projects) without altering the V3–V5 visual design system, Three.js experience, or non-interactive Berijalan experience rules.

## Traceable Requirements
| ID | Requirement | Verification |
|----|-------------|--------------|
| ORD-001 | Top-5 featured order is explicitly defined in code (`FEATURED_PROJECT_ORDER`) and immune to GitHub star/commit sorting or `npm run sync:github` refreshes | Vitest ordering invariance test + Playwright `#work` order test |
| FLG-001 | `Android Stress Detection` (`android-stress-detection`) replaces `android-wear-stress-assistant` as slot `01` (`Flagship Research`), includes verified Wear OS/PPG/ONNX/SQA case study sections, and states explicit non-diagnostic disclaimer | Vitest + Playwright detail page assertions |
| PRV-001 | `ParfumCreator` (verified private repo on GitHub) appears at slot `05` as a sanitized private summary (`visibility: "private-summary"`), with zero `GitHub`/`Live Demo` links, zero private source code, and zero fake screenshots | Vitest + Playwright `getProjectActions` & UI checks |
| IMG-001 | `android-stress-detection` uses authentic, PII-free local WebP screenshots converted from verified public repo captures; `validate:assets` passes on `public/` and `out/` | `npm run validate:assets` + Playwright image decode checks |
| SEO-001 | Custom `seoTitle` metadata renders on flagship and featured case study routes; `sitemap.xml` lists all 71 eligible `/projects/[slug]/` routes cleanly | Playwright SEO & sitemap HTTP 200 checks |
