# V8 Audit — ParfumCreator Public Repository Integration

**Audit Date:** 2026-11-25  
**Target Repo:** `https://github.com/Adrian463588/ParfumCreator`  

## Phase 0 — Root Cause of Stale Private Presentation
1. During V6 (`d62cfa8`), `Adrian463588/ParfumCreator` was private on GitHub (`isPrivate: true`), so `scripts/sync-github.mjs` omitted it from `src/data/github-repositories.json`.
2. To display slot `05` safely while private, V6 placed a temporary entry in `src/data/curated-projects.ts` (`curatedPrivateProjects`) with `visibility: "private-summary"`, `screenshots: []`, `repositoryUrl: undefined`, and `sourceReferences: []`.
3. `src/components/sections/SelectedWork.tsx` and `src/components/projects/ProjectCard.tsx` intentionally rendered a `PRIVATE REPOSITORY` / `PRIVATE OVERVIEW · SOURCE OMITTED` typographic placeholder when `project.screenshots.length === 0 && project.visibility === "private-summary"`, while `getProjectActions()` suppressed `repoUrl` and `CaseStudyDetail.tsx` suppressed `Source code` / `Release` / `Related Links`.

## Phase 2 — Unauthenticated Public Verification
- **`GET https://api.github.com/repos/Adrian463588/ParfumCreator`** (unauthenticated): HTTP `200`, `private: false`, `visibility: "public"`, `default_branch: "main"`, `language: "Kotlin"`, `pushed_at: "2026-11-25T10:32:21Z"`.
- **`HEAD https://github.com/Adrian463588/ParfumCreator`** (unauthenticated): HTTP `200`.
- **Releases:** `v1.3.1` (`https://github.com/Adrian463588/ParfumCreator/releases/tag/v1.3.1`), `v1.2.0`, `v1.1.0`.
- **Verified Features & Architecture (README.md & tree inspection):**
  - Kotlin, Jetpack Compose BOM `2025.05.00` + Material 3 ("Luxury Apothecary"), Dagger Hilt, Navigation Compose, Clean Architecture + MVVM.
  - Formula Creator & `FormulaCalculationEngine` (`g`, `mg`, `mL` density conversions, `% w/w` concentration, Top/Heart/Base note architecture, heuristic SPL index, 4-axis Fragrance Wheel radar chart) backed by Android NDK C++17 JNI (`libparfume_core.so`).
  - 232 recipe templates (`100` natural `NAT-001`..`NAT-100`, `100` fragrance-oil `BIB-001`..`BIB-100`, `32` starter/legacy) with explicit catalog SKU binding and non-ready-to-wear / non-IFRA disclaimers.
  - Ingredient library of `2,046+` natural & catalog fragrance oils (Luzi, Parfarome, Macrabame, Benberg) with custom entries and CSV SAF import.
  - Local RAG using `all-MiniLM-L6-v2.tflite` (384-d embeddings stored in Room v3 `rag_chunks`), PDFBox-Android text extraction, WorkManager + SAF + SHA-256 Gemma 4 E2B/E4B LiteRT-LM model bundles, grounded deterministic fallback, and opt-in HTTPS-allowlisted Wikimedia/IFRA/FDA/EU search (`allowInternetFallback = false` by default).
  - Security & quality: OWASP MASVS-RESILIENCE NDK checks (`ptrace`, `TracerPid`, `/proc/self/maps`), `AndroidKeyStoreCrypto` AES-256 GCM, `allowBackup="false"`, `usesCleartextTraffic="false"`, R8 minification, and `188` unit tests across `19` suites passing with Android lint `0` errors on `v1.3.1`.
- **Recovered Local WebP Screenshots (`public/projects/`):**
  - `/projects/parfum-creator-formula.webp` (`1080×2340`, from `docs/screenshots/menu_formula.png`)
  - `/projects/parfum-creator-templates.webp` (`1080×2340`, from `docs/screenshots/menu_templates.png`)
  - `/projects/parfum-creator-library.webp` (`1080×2340`, from `docs/screenshots/menu_library.png`)
  - `/projects/parfum-creator-chat.webp` (`1080×2340`, from `docs/screenshots/menu_chat.png`)
