# Acceptance Criteria 004

1. **Zero Enterprise Route Duplication:** Homepage renders `#hero -> #work -> #project-explorer -> #experience -> #competencies -> #certifications -> #education -> #about -> #contact` with NO `#enterprise-work` section.
2. **Non-Interactive Enterprise Projects:** *Archer Upgrade*, *STNK Alignment*, and *Advanced Joint Finance Parameter* appear exclusively inside the Berijalan Techno Center `Experience` item as non-clickable text rows (`<a>` count `= 0`, `<button>` count `= 0` inside `selectedProjects`).
3. **Zero Dead Links or Dead Buttons:** All 70 public projects use `getProjectActions()`, `TechnoLoyaltyProgram` renders no broken `sslip.io` `Live Demo` button, and HTTP audit verifies external links resolve cleanly.
4. **Full Real-Click Interactivity:** Clicking every nav link, Hero CTA, Featured Project card/link, Experience tab, Contact action, Projects search/filter/view switcher, and mobile overlay menu item succeeds via genuine user click events (`force: true` not used) with zero WebGL/cursor obstruction.
5. **Technical SEO & A11y Pass:** Unique per-route canonical (`https://adriansyahabidin.vercel.app/...`), no `<meta name="keywords">`, valid JSON-LD, `/og-image.png` HTTP 200 (`1200x630`), valid `/sitemap.xml` excluding removed enterprise routes, valid `/robots.txt`, and `0` `axe-core` WCAG 2.2 AA violations.
