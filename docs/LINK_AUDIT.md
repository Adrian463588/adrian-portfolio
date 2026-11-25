# External Link Audit Methodology & Findings

**Baseline Scan:** 2026-11-25 (`docs/evidence/link-audit-raw.json`)  
**Total Unique External URLs Audited:** 99

## Summary of Baseline Findings
- **HTTP 200 OK:** 95 URLs (all 78 synced GitHub repositories + 10 GitHub releases + 4 live EdgeOne demos + `berijalan.co.id` + `youtu.be/XGk-1T3N3SU`).
- **Bot-Shielded Valid Profiles:** 2 URLs (`linkedin.com/in/adrian-syah-abidin-0416b81b9/` HTTP 999, `medium.com/@adriansyah1230` HTTP 403 — both confirmed active human profile URLs blocked only from automated `fetch` User-Agents).
- **Broken / Stale URLs Caught & Remediated:**
  1. `https://m4nx9kc046wxksnhs6zfseor.34.128.73.127.sslip.io/` (`TechnoLoyaltyProgram` snapshot `homepage` — ephemeral Coolify URL timed out). Stripped via `isVerifiedLiveDemoUrl()` in `src/lib/projects.ts` and `projectOverrides.TechnoLoyaltyProgram`, eliminating the dead `Live Demo` button cleanly.
  2. `https://adrian-portfolio-plum.vercel.app` (HTTP 404 on excluded `adrian-portfolio` repo — excluded from public portfolio).
