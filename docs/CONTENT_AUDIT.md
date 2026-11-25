# Content Audit & Anti-AI-Slop Revisions (V3 -> V4)

> **Date:** 2026-11-25  
> **Scope:** Hero, Homepage Sections, Experience, Projects Archive, Case Studies & SEO Metadata

## 1. Before vs After Copy Matrix
| Location | V3 / Early Draft | Final V4 | Reason |
|---|---|---|---|
| **Hero Positioning** | `Software Engineer — Quality Engineering & DevOps` / *"I build software, automate testing, and work on reliable systems."* + inline email copy pill | `Software Engineer` / *"I build and test software."* + concise Q.E./automation/DevOps/AI summary (`View My Work`, `Get in Touch`) | Natural 1st-person clarity with 2 distinct CTAs |
| **Enterprise Section** | Standalone `#enterprise-work` (`Enterprise Work.`) + clickable Berijalan detail routes | Removed standalone section; consolidated into **Berijalan Techno Center** `Selected projects` non-interactive list inside `#experience` | Eliminates duplication and distinguishes internal employer projects from public repos |
| **Berijalan Details** | Repeated bullet list + mismatched *Advanced Joint Finance Parameter* description | *Archer Upgrade* (Cypress & Jenkins automation on React/AOL UniPaaS), *STNK Alignment* (Manual across AOL UniPaaS & Magic xpa), *Advanced Joint Finance Parameter* (Manual in AOL UniPaaS), concise stack (`Cypress · Jenkins · AOL UniPaaS · Magic xpa`) | Accurate ownership and zero prose duplication |
| **Technical Skills** | `Technical Skills.` linking enterprise slugs (`archer-upgrade`, etc.) | `Skills & Technologies.` linking only verified public repositories (`automate-plus`, `ledger-scope`, `credit-risk-mlops`, etc.) | Every link resolves to a real public codebase |
| **Project Copy Polish** | *MedBot*: `Evidence-Gated On-Device Medical Assistant`<br>*Dual-VM*: `Dual-VM DevOps observability deployment isolating Nginx...`<br>*EnglishPrepAI*: `100% offline Android test-prep suite...` | *MedBot*: `Offline Android Health Assistant`<br>*Dual-VM*: `Two-VM infrastructure monitoring setup using Prometheus, Grafana, Alertmanager, Uptime Kuma, and Terraform.`<br>*EnglishPrepAI*: `Offline Android application for TOEFL ITP, TOEFL iBT (2026), and IELTS Academic preparation using Room FTS4, Media3, Gemma 4, and Whisper ONNX.` | Concise, grounded descriptions without hype phrasing |
| **Projects Archive** | `All projects.` (`73` items including 3 internal Berijalan rows + `Professional` tab) | `Projects.` / `A collection of my work and experiments.` (`70` public GitHub repos; dead `.sslip.io` `Live Demo` stripped cleanly) | Clean catalog scoped to verified public work |
| **About** | Long multi-employer listing duplicating `#experience` | Concise 2-paragraph UGM + QA/automation + personal projects summary paired with `ChibiShowcase` | Complements `#experience` rather than repeating it |

## 2. Discrepancies Flagged for Owner Verification (Unmodified)
1. **Overlapping Internship Dates (`src/data/experience.ts`):** `Bitbybit Studio – Favo Group` (`Nov 2024 – Jul 2025`) overlaps `Tokopedia – ByteDance Group` (`Feb 2025 – Jun 2025`). Existing verified dates remain untouched pending owner confirmation.
2. **Alibaba Cloud Credential Level (`src/data/certifications.ts`):** Retained `Alibaba Cloud Certified Associate (ACA)` with `"Level & verification pending confirmation"`.
3. **Google Search Console (`docs/SEO_CHECKLIST.md`):** On-site metadata, `sitemap.xml`, `robots.txt`, JSON-LD, and `public/og-image.png` are ready; domain verification and indexing submission must be executed by the owner after Vercel production deployment.
