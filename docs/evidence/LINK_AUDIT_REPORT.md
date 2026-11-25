# External Link Audit Report (Post-Fix V4)

**Audit Timestamp:** 2026-11-25  
**Source Data Verified:** 99 unique external URLs (`docs/evidence/link-audit-raw.json`)

## Results Summary
| Status Class | Count | Notes |
|--------------|-------|-------|
| HTTP 200 OK | 95 | All 78 GitHub repos + 10 release tags + 4 EdgeOne live demos (`hsk1vocab`, `plsqllearn`, `znlkostputri`, `fortuneteller`) + `berijalan.co.id` + `youtu.be/XGk-1T3N3SU` |
| HTTP 403 / 999 (Bot-Shielded) | 2 | `linkedin.com/in/adrian-syah-abidin-0416b81b9/` & `medium.com/@adriansyah1230` (active human profiles) |
| Blocked / Remediated Broken Demos | 2 | 1) `*.sslip.io` (`TechnoLoyaltyProgram` dead temporary preview stripped via `isVerifiedLiveDemoUrl()` — zero `Live Demo` button rendered); 2) `adrian-portfolio-plum.vercel.app` (HTTP 404 on excluded `adrian-portfolio` repo) |

## Verification After Fix
- Unit test verifies `TechnoLoyaltyProgram` `demoUrl === undefined` and `getProjectActions()` omits `demoUrl`.
- Playwright E2E verifies `TechnoLoyaltyProgram` card renders `Case Study` + `GitHub` with 0 `Live Demo` links.
- Static export scan confirms `href=...sslip.io` hits `= 0` across `out/`.
