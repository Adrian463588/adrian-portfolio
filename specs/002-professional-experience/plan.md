# Implementation Plan 002 — Professional Experience & Enterprise Case Studies

## 1. Architecture Strategy
Extend the V1 typed domain model cleanly without breaking GitHub snapshot sync:
1. **Grouped Experience Model (`src/types/index.ts`, `src/data/experience.ts`, `src/components/ui/TimelineItem.tsx`):**
   - Represent each company/program entry as a chronological block (`id`, `category`, `organization`, optional `legalEntity`, `corporateGroup`, `industry`, `location`, `website`, `summary`, optional `projectIds`, `roles: ExperienceRole[]`, `startDate`, `endDate`, `bullets`, `technologies`).
   - Inside `Berijalan Techno Center`, `roles` holds Freelance (`2026-07`–`2026-10`) before Trainee (`2026-03`–`2026-07`, `Bootcamp / Internship-equivalent`).
   - Top-level experiences sort reverse-chronologically by company `endDate` so Berijalan (`2026-10`) leads Qiscus (`2025-10`), Tokopedia (`2025-06`), and Bitbybit (`2025-07`), and Berijalan links directly to its 3 enterprise case studies.
2. **Separated Enterprise Dataset & Build-Time Disclosure Gate (`src/data/enterprise-projects.ts`, `src/lib/projects.ts`, `src/data/projects.ts`):**
   - Define `enterpriseProjectsCatalog` with `projectOrigin: "professional"`, `visibility: "public-sanitized"`, `publicDisclosureApproved: boolean`, optional `repositoryUrl`, optional `conceptualFlow` diagram nodes, `testingType`, `testingTools`, `ciTools`, and `applicationTechnologies`.
   - Filter with `getApprovedEnterpriseProjects(items)` (`publicDisclosureApproved === true`) before exporting `enterpriseProjects` and merging into `projects`.
   - `Featured Personal Projects` queries `getFeaturedProjects(personalProjects)` so Hero/SelectedWork keeps showcasing the 8 public GitHub projects independently of the 3 `Enterprise Case Studies`.
3. **UI Sections & Project Explorer Updates:**
   - New components: `src/components/sections/EnterpriseCaseStudies.tsx` and `src/components/sections/About.tsx`.
   - Updated section sequence in `src/app/page.tsx`: Hero -> Experience -> EnterpriseCaseStudies -> SelectedWork ("Featured Personal Projects") -> Explorer Callout -> Competencies -> Certifications -> Education -> About -> Contact.
   - Updated `ProjectExplorer.tsx` with `Origin` filter pills (`All`, `Professional Work`, `Personal Projects`, `Academic Projects`, `Experiments`) + enterprise domain tags.
   - Updated `CaseStudyDetail.tsx` & `ProjectCard.tsx` to omit missing repo/demo buttons cleanly, render enterprise QA/CI/platform metadata cleanly when screenshots are absent, and include a clearly labeled non-proprietary `Conceptual Workflow Architecture` diagram for enterprise QA flows.

## 2. Verification & Tooling Strategy
- Update `design/portfolio.figcraft` via FigCraft MCP and re-export visual reference assets to `design/exports/`.
- Execute RED-GREEN-KEEP TDD via Vitest unit tests (`tests/unit/projects.test.ts` & `tests/unit/experience.test.ts`).
- Execute full Playwright + `axe-core` suite (`tests/e2e/portfolio.spec.ts`) on static `out/`, plus confidentiality text grep over `out/`, before/after visual verification, and Lighthouse/Trace checks.
