# Spec 004 — Portfolio V4 Refinement, Functional QA & SEO

## Goal
Refine the V3 portfolio (`Obsidian & Arctic`, Three.js / GLSL backdrop, Lenis + GSAP choreography, custom Chibi avatar) for recruiter clarity, interaction reliability, zero dead buttons/links, consolidated enterprise experience, and search engine readiness — without visual regression.

## Scope & Functional Requirements
1. **Consolidated Enterprise Work (`EXP-001`, `EXP-002`):**
   - Remove standalone `#enterprise-work` (`EnterpriseCaseStudies`) from `/`.
   - Consolidate *Archer Upgrade*, *STNK Alignment*, and *Advanced Joint Finance Parameter* strictly as non-interactive informational rows inside `Berijalan Techno Center` under `#experience`.
   - Keep zero `<Link>`, `<a>`, `<button>`, arrows, or pointer styles inside those enterprise project rows.
   - Remove internal Berijalan project routes from `/projects/`, navigation, `generateStaticParams()`, and `/sitemap.xml`.
2. **Action Eligibility & Link Integrity (`FUNC-001`..`FUNC-006`, `PRJ-001`..`PRJ-004`):**
   - Centralize button/link rendering via `getProjectActions(project)`.
   - Exclude dead/ephemeral demo domains (such as `*.sslip.io` timeouts) so `Live Demo` / `Source code` / `Release` / `Case Study` buttons render only when backed by real, safe `https://` targets.
   - Fix drawer link navigation focus behavior in `Navbar.tsx` and ensure Three.js canvas, custom cursor, and route transition veil never block clicks (`pointer-events: none`).
3. **Copy & Hierarchy (`COPY-001`..`COPY-003`, `UX-001`):**
   - Hero: `Software Engineer`, `Adrian Syah Abidin`, `"I build and test software."`, concise supporting narrative, `View My Work`, `Get in Touch`.
   - About: concise natural UGM & QC/automation summary + Chibi illustration.
   - Skills & Technologies: link only to public GitHub project pages.
   - Projects archive: `Projects.` / `A collection of my work and experiments.` with dynamic counts and clean Type/Category/Sort filters.
4. **Technical SEO & Social Preview (`SEO-001`..`SEO-005`):**
   - Remove `<meta name="keywords">`.
   - Canonical base `https://adriansyahabidin.vercel.app/` declared explicitly per route.
   - Static `1200x630` `public/og-image.png` asset wired for Open Graph / Twitter.
   - Structured JSON-LD (`ProfilePage` + `Person` + `WebSite` on `/`; `CollectionPage` + `BreadcrumbList` on `/projects/`; `BreadcrumbList` + `SoftwareSourceCode`/`CreativeWork` on `/projects/[slug]/`).
