# Change: fix-ai-chatbot-integration

## Why
Manual verification on production (`https://adriansyahabidin.vercel.app/`) showed premature external AI unavailability, unconfigured Vercel production environment variables (`vck_` lacked team scope until `vcp_` was supplied), overly naive keyword scoring that boosted unrelated GitHub repos containing `"adrian"` above real work experience, and raw pipe-delimited (`Project | Summary | Description`) fallback strings.

## What Changes
- **Vercel CLI Linking & Sensitive Environment Setup**: Authenticate with the supplied team-capable Vercel token (`VERCEL_TOKEN` kept strictly in process memory, never written to repo/logs), link the repository to `adrian-portfolio` (`prj_pARcfty4YJN02JRWmhjCKK6GCyHZ` in `team_Hb2eeyZG1IYyyr5hppi2MSZo`), provision all 9 AI keys plus provider/model/limit variables as Vercel **Sensitive** environment variables for Production and Preview, and verify real upstream AI inference on both Vercel Preview and Production.
- **Intent Classification, Knowledge Enrichment & Natural Responses**:
  - Enrich `knowledge/adrian-knowledge.json` cleanly with explicit `workExperience`, `currentActivities`, `personalProjects`, `academicResearch`, `careerInterests`, and expanded Indonesian/English synonyms/intents via `scripts/build-knowledge.mjs`.
  - Filter stop words and owner name tokens (`adrian`, `syah`, `abidin`) before repository matching so queries like `"berikan apa saja pengalaman adrian ?"` never match unrelated repo slugs.
  - Route `work_experience` / `company_experience` / `current_activities` / `academic_research` deterministically with follow-up conversation context support (`history`) and replace raw pipe-delimited fallback strings with natural human-readable prose/bullets.
- **Provider Reliability & Streaming Cleanup**:
  - Calibrate provider timeouts (`7000ms` default / bounded within `25000ms` global deadline), preserve Groq -> Gemini -> OpenRouter Free -> Local fallback priority, and filter `<think>...</think>` blocks incrementally during SSE streaming so only clean visible answer tokens reach the UI.
- **DevSecOps Hardening**: Extend `scripts/check-secrets.mjs` to catch `vcp_` tokens as well as `vck_`, `gsk_`, `AQ.Ab`/`AIzaSy`, and `sk-or-v1-`, keeping `.vercel/` and `.env.local` strictly gitignored.
