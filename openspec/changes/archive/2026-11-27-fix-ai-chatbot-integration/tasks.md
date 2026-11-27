# Tasks: Sprint 9.1 Repair Checklist

- [x] Audit Vercel authentication with `vcp_` token via REST/CLI, verify team & project access, and link `.vercel/` locally (gitignored)
- [x] Extend `scripts/check-secrets.mjs` to cover `vcp_` tokens and audit working tree + git history
- [x] Enrich `scripts/build-knowledge.mjs` and `knowledge/adrian-knowledge.json` (`workExperience`, `currentActivities`, `academicResearch`, `personalProjects`, `careerInterests`, bilingual intent variations)
- [x] Write RED Vitest unit & integration tests covering `"berikan apa saja pengalaman adrian ?"`, `work_experience` isolation from repo names, follow-up conversation context, natural non-pipe fallback output, `<think>` stream stripping, and real/mocked provider fallback
- [x] Refactor `src/server/chatbot/{faq,retrieval,persona,config,providers/shared,orchestrator}.ts` and `src/app/api/chat/route.ts` to fix all root causes cleanly
- [x] Provision all Sensitive Environment Variables in Vercel (`Production` & `Preview`), deploy Preview & verify live `/api/chat/` inference + fallback + PII guardrails
- [x] Run full quality gates (`lint`, `typecheck`, `test`, `build`, `seo:report`, `validate:assets`, `check:secrets`, `test:e2e`), archive OpenSpec change, push PR, merge to `main`, and verify live UI & API on `https://adriansyahabidin.vercel.app/`
