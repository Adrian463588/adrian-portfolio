# V9 Technical SEO & Entity Architecture Audit

**Audit Date:** 2026-11-26  
**Target Production Domain:** `https://adriansyahabidin.vercel.app/`  

## 1. Phase 1 Live Production Baseline Audit
Inspected live production endpoints directly prior to refactoring:
- `/` -> HTTP `200`, `text/html; charset=utf-8`, `x-robots-tag: null`, Google verification meta tag present (`P4O6B5PWmL-5E0i5XRbfkOSaPcop92urgS2lk-IAZ5s`), canonical `https://adriansyahabidin.vercel.app/`.
- `/robots.txt` -> HTTP `200`, `text/plain`, references `https://adriansyahabidin.vercel.app/sitemap.xml`.
- `/sitemap.xml` -> HTTP `200`, `application/xml`, `73` URLs (`/` + `/projects/` + `71` project case studies including `android-stress-detection` and public `parfum-creator`).
- `/projects/parfum-creator/` -> HTTP `200`, public (`https://github.com/Adrian463588/ParfumCreator` live).
- `/non-existent-route-404-test/` -> HTTP `404`.

## 2. Gaps Identified & Fixed
| Gap ID | Priority | Finding Before V9 | Fix Implemented |
| --- | --- | --- | --- |
| `SEO-G01` | P1 | Hardcoded `SITE_URL`, title, description, and profile links duplicated across 6 files | Centralized single source of truth in `src/config/site.config.ts` and `src/lib/seo.ts` |
| `SEO-G02` | P1 | `Hero` subtitle (`"Software Engineer"`), root description, and `/projects/` title (`"Projects"`) weren't aligned with target branded entities; missing `og:locale` (`en_US`) & project `twitter` cards | Aligned Hero (`Software & QA Automation Engineer`), updated root description & `/projects/` (`Engineering Projects`), added `locale: "en_US"` & per-project X/Twitter cards |
| `SEO-G03` | P1 | `Person` JSON-LD exposed raw `email`, omitted portrait `image` & `hasCredential`, and subpages used inline anonymous `author` objects instead of `@id` linking | Linked all schemas (`WebSite`, `ProfilePage`, `CollectionPage`, `SoftwareSourceCode`, `CreativeWork`) to `@id: #person` & `#website`; added `hasCredential` strictly for issued certs; removed raw email from `Person` JSON-LD |
| `SEO-G04` | P2 | `sitemap.ts` used hardcoded `"2026-11-25"` on `/` & `/projects/` and boilerplate `changeFrequency`/`priority` tags | Derived real `lastModified` from latest catalog `updatedAt` and removed unnecessary `changeFrequency`/`priority` noise |
| `SEO-G05` | P2 | `competencies.ts` linked only `android-stress-detection` & `quran-plus` for Mobile; project detail footer lacked same-domain `Related Projects` links | Added `coffee-creator`, `adzan-plus`, `parfum-creator` to `competencies.ts` & added 3-item category-matched Related Projects row in `CaseStudyDetail.tsx` |

## 3. Keyword-to-Route Mapping (Anti-Cannibalization)
- `/`: `Adrian Syah Abidin`, `Software & QA Automation Engineer`, `Software Engineer Indonesia`, portfolio overview, work experience, verified credentials.
- `/projects/`: `Engineering Projects`, `QA Automation Engineer Portfolio`, `Android Developer Portfolio`, `DevOps Engineer Portfolio`.
- `/projects/android-stress-detection/`: `Android Stress Detection`, `Wearable PPG & On-Device AI`, `Wear OS Stress Detection`, `ONNX Runtime`.
- `/projects/quran-plus/`, `/projects/coffee-creator/`, `/projects/adzan-plus/`, `/projects/parfum-creator/`: Kotlin, Jetpack Compose, Local RAG, and domain-specific mobile case studies.
- `/projects/automate-plus/`, `/projects/credit-risk-mlops/`, `/projects/ledger-scope/`: Rust/Tauri QA automation, Credit Risk MLOps, financial accounting systems.

## 4. Known Limitations
- Search Console property **Verifikasi** click, sitemap submission, and Bing Webmaster Tools setup remain owner-interactive actions in external Google/Bing consoles.
- Core Web Vitals field data (CrUX) has insufficient traffic volume on the subdomain (`n/a`), so lab trace metrics (`LCP`, `CLS`) and Lighthouse audits are reported cleanly without fabricating field data.
