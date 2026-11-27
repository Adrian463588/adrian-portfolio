# Tasks: Ask Adrian Implementation Checklist

- [x] Ignore `BANKCV_MASUKKANKEGITIGNORE/`, `.env*` (`!.env.example`), `private/`, `knowledge/raw/` in `.gitignore`
- [x] Create FigCraft desktop screen (`Portfolio / V4 Ask Adrian Chatbot / Default`) and export visual reference
- [x] Generate and validate canonical `knowledge/adrian-knowledge.json` (`scripts/build-knowledge.mjs`, `scripts/validate-knowledge.mjs`)
- [x] Write RED Vitest unit & integration tests covering PII guardrails, FAQ-first routing, bilingual retrieval, provider priority, key rotation vs shared quota skip, Gemini eligibility flag, OpenRouter `:free` restriction, validation, rate limit, budget concurrency, and stream interruption
- [x] Transition `next.config.ts`, `playwright.config.ts`, `scripts/validate-assets.mjs`, and `scripts/seo-cli.mjs` for static pages + `/api/chat` serverless route
- [x] Implement modular server modules in `src/server/chatbot/*` and `src/app/api/chat/route.ts` until all tests pass GREEN
- [x] Implement accessible Obsidian & Arctic chatbot UI in `src/features/chatbot/*` and mount lazily in `src/app/layout.tsx`
- [x] Add `scripts/check-secrets.mjs`, `.env.example`, README/deployment docs, and expand Playwright E2E + `axe-core` regression suite
- [x] Run full verification gates (`lint`, `typecheck`, `test`, `build`, `validate:assets`, `seo:validate`, `seo:audit`, `seo:links`, `check-secrets`, `test:e2e`), archive OpenSpec change, push PR, merge to `main`, and verify Vercel production deployment
