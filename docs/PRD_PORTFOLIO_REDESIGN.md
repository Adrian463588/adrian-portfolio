# PRD — Professional 3D Engineering Portfolio Redesign

## 1. Problem Statement
The live portfolio (`https://adriansyahabidin.vercel.app/`) uses a neon cyberpunk visual identity (`Orbitron`/`Rajdhani` fonts, glowing perspective grid, 2,000 additive particles behind body copy), fails WCAG 2.2 AA color contrast on multiple nodes, hides below-the-fold sections behind `opacity: 0` scroll triggers, omits real application screenshots, contains stale 2025 availability/copyright copy and an inaccurate game engine description (`ProjectGame`), and surfaces only 7 projects despite 77 public repositories on `github.com/Adrian463588` spanning DevOps, DevSecOps, QA/SDET, Backend, Android/Wear OS, Applied AI, Desktop/Systems, and FinTech/MLOps.

## 2. Goals & Non-Goals
### Goals
- Transform the aesthetic into **Graphite & Ice Blue — Professional Engineering Portfolio** (75% content/usability, 15% bounded 3D interaction, 10% subtle motion).
- Establish a static GitHub synchronization workflow (`npm run sync:github`) indexing all eligible public repositories across 3 curation tiers:
  - **Tier 1 (Featured):** 8 flagship projects with real screenshots, personal contribution notes, architecture summaries, and case study pages (`/projects/[slug]`).
  - **Tier 2 (Project Explorer):** Searchable, filterable catalog (`/projects`) across verified engineering categories and technologies.
  - **Tier 3 (Experiments & Archive):** Separate section/filter tab for forks, academic coursework, bootcamp exercises, and early prototypes.
- Preserve Next.js + Three.js / React Three Fiber in a strictly frontend-only static export (`output: "export"`) deployable to Vercel Hobby without runtime backend or database.
- Achieve WCAG 2.2 AA compliance, mobile-to-desktop responsiveness (`320px–1920px`), and Lighthouse targets (`Performance >= 90`, `Accessibility/Best Practices/SEO >= 95`, `LCP <= 2.5s`, `CLS <= 0.1`).

### Non-Goals
- No backend server, runtime database, auth, AI chatbot, blog CMS, or paid third-party service.
- No fabricated metrics, unverified testimonials, or runtime GitHub API polling from visitor browsers.

## 3. Target Audience
Technical recruiters, engineering hiring managers, QA/SDET & DevOps leads, backend/mobile engineering teams, fintech/banking tech reviewers, and research engineering groups.

## 4. Information Architecture
- `/` — Homepage: Navigation, Hero (left identity/CTAs + right bounded 3D sculpture), Selected Work (8 featured projects with real screenshots), Professional Experience (compact reverse-chronological work vs training toggle), Technical Competencies (grouped by engineering domain linked to projects), Certifications (issuer, status, verification notes), Education & Leadership, Contact (direct email/social links), Footer.
- `/projects` — Searchable & filterable Project Explorer (category tabs, technology filter, tier/origin toggle including Experiments & Archive, sort by editorial relevance or recent update, URL query sync, empty state + reset).
- `/projects/[slug]` — Static-exported technical case study page for featured and eligible documented projects (overview, status, origin/fork attribution, problem, solution, personal contribution, architecture, stack, verified screenshots, testing/CI/security notes, limitations, repo/demo links).

## 5. V2 Revision — Professional Experience & Enterprise Case Studies (`002-professional-experience`)
- **Grouped Company Timeline (`#experience`):** Present Berijalan Techno Center (PT Cipta Sedaya Digital Indonesia, Astra Credit Companies Group) as one company card with Freelance (`Jul 2026 – Oct 2026`) and Bootcamp / Internship-equivalent (`Mar 2026 – Jul 2026`) sub-roles in reverse-chronological order above Qiscus, Tokopedia, and Bitbybit.
- **Enterprise Case Studies (`#enterprise-work`):** Showcase three sanitized enterprise engagements (`Archer Upgrade`, `STNK Alignment`, `Advanced Joint Finance Parameter`) directly above Featured Personal Projects, backed by build-time `publicDisclosureApproved` filtering.
- **Homepage Flow:** Hero -> Professional Experience -> Enterprise Case Studies -> Featured Personal Projects -> Project Explorer Callout -> Technical Competencies -> Certifications -> Education -> About -> Contact & Footer.
