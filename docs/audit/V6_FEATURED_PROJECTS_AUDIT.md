# V6 Featured Projects GitHub Audit

**Audit Date:** 2026-11-25  
**Branch:** `feat/portfolio-v6-featured-projects`  

## Live GitHub Eligibility & Visibility Matrix

| Slot | Project | Repository | GitHub Visibility | Action & Confidentiality Boundary | Local Visual Asset(s) |
| --- | --- | --- | --- | --- | --- |
| `01` | **Android Stress Detection** (Flagship Research) | `Adrian463588/android-stress-detection` | Public (`private: false`, verified via GitHub REST API) | Promoted from `android-wear-stress-assistant` -> `android-stress-detection`; full research & engineering case study with explicit non-diagnostic disclaimer; zero participant PII | `/projects/android-stress-detection-home.webp`, `/projects/android-stress-detection-history.webp` (converted from `docs/screenshots/*-xiaomi-2412DPC0AG-v0.1.5-20261018.png`) |
| `02` | **QuranPlus** | `Adrian463588/QuranPlus` | Public (`private: false`, verified via GitHub REST API) | Featured slot `02`; keeps existing verified `v1.0.13` release link & device captures | `/projects/quran-plus-home.webp`, `/projects/quran-plus-ai.webp` |
| `03` | **Coffee Creator** | `Adrian463588/coffee-creator` | Public (`private: false`, verified via GitHub REST API) | Promoted from catalog to Featured slot `03`; keeps verified `v1.14.7` release link & device capture | `/projects/coffee-creator-home.webp` |
| `04` | **AdzanPlus** | `Adrian463588/AdzanPlus` | Public (`private: false`, verified via GitHub REST API) | Promoted from catalog to Featured slot `04`; keeps verified `v2.2.1` release link & device capture | `/projects/adzan-plus-home.webp` |
| `05` | **ParfumCreator** | `Adrian463588/ParfumCreator` | **Private** (`isPrivate: true`, HTTP 404 publicly, verified via authenticated `gh repo view`) | Curated via `src/data/curated-projects.ts` (`visibility: "private-summary"`, `publicDisclosureApproved: true`). **Zero** `repositoryUrl`, `demoUrl`, `releaseUrl`, `sourceReferences`, source code, or private screenshots | Intentional Obsidian & Arctic typographic cover (no `<img>`) |
| `06+` | Supporting Featured Projects | `AutomatePlus`, `Task5ManageDashboardMonitoring`, `ChatBuddy`, `EnglishPrepAI`, `MedBot`, `hsk1vocab`, `Task12ManageKubernetesAutoscallingKubernetes` | Public (`private: false`) | Retained in Tier 1 Featured (`editorialOrder: 5..11`) strictly after Top-5 | Existing verified `.webp` assets in `public/projects/` |

## Confidentiality Guardrails Applied
- `ParfumCreator` is omitted from `src/data/github-repositories.json` and isolated in `src/data/curated-projects.ts` with empty `repositoryUrl` / `sourceReferences` / `screenshots`.
- `android-stress-detection` explicitly includes `"This project is an experimental research prototype for stress monitoring and decision support, not a medical diagnostic tool."` and publishes zero participant recordings or fabricated clinical accuracy metrics.
- Berijalan Techno Center enterprise projects (`Archer Upgrade`, `STNK Alignment`, `Advanced Joint Finance Parameter`) remain strictly non-interactive inside `#experience` and return `404` on `/projects/[slug]/`.
