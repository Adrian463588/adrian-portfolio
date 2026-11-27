# Design: Ask Adrian AI Portfolio Assistant

## Architecture Overview
1. **Static Portfolio + Serverless Chat Route**: Removing `output: "export"` from `next.config.ts` preserves static build-time prerendering (`/` , `/projects/`, `/projects/[slug]/`, `/resources/`, `/resources/[slug]/`, `/sitemap.xml`, `/robots.txt`) while enabling `POST /api/chat` (`runtime = "nodejs"`). `scripts/seo-cli.mjs` and `scripts/validate-assets.mjs` inspect build output (`.next/server/app` + `public/`) and Playwright boots `npx next start`.
2. **Knowledge Pipeline (`scripts/build-knowledge.mjs`, `scripts/validate-knowledge.mjs`)**: Normalizes verified facts from `src/data/*` + approved non-PII CV highlights into `knowledge/adrian-knowledge.json`, validating schema completeness, allowlisted URLs, and absence of PII patterns.
3. **Request Flow in `POST /api/chat`**:
   - Validate JSON payload size, schema (`message <= 1000`, `history <= 6` user/assistant turns), and reject client-supplied privileged fields (`model`, `apiKey`, `systemPrompt`, `endpoint`, non-user/assistant roles).
   - Detect response language (`auto` -> heuristic ID/EN detection, or explicit `id` / `en`).
   - Run deterministic **PII & Secret Guardrail** (refuses phone, residential address, age, DOB, ID numbers, credentials, private employer secrets -> zero upstream call).
   - Run deterministic **Bilingual FAQ Matcher** (`CHAT_FAQ_FIRST=true`) -> confident matches return verified knowledge + allowlisted links with zero upstream call.
   - Check visitor rate limit (`5/min`, `20/day`) and atomic global upstream attempt budget (`100/day`); if exhausted or distributed limiter strict-fail triggered, degrade to local retrieved answer.
   - Run sequential bounded **Provider Orchestrator** (`25s` total deadline, `5s` pre-response timeout per attempt):
     1. `Groq` (`GROQ_ENABLED=true`, default `qwen/qwen3.8-27b`, keys `1..3`)
     2. `Gemini` (`GEMINI_ENABLED=true|false`, default `gemini-3.1-flash-lite-preview`, keys `1..3`)
     3. `OpenRouter Free` (`OPENROUTER_ENABLED=true`, default `openrouter/free` / `:free` allowlist only, keys `1..3`)
     4. `Local Knowledge Fallback` (retrieved snippets + verified links, zero raw upstream error leakage)
   - Credential-specific errors (`401`, `403`, invalid key) rotate within permitted slots; shared quota errors halt that provider immediately when `CHAT_ALLOW_MULTI_ACCOUNT_ROTATION=false`, or try distinct account slots when `true`. Retry-After headers are respected.
4. **Frontend Widget (`src/features/chatbot/`)**:
   - Dynamically imported in `src/app/layout.tsx` (`ssr: false`) inside `<MotionProvider>`.
   - Desktop: bottom-right FAB (`56x56px`) opening a `400px` floating dialog (`#0D0F14` / `#15171C` / `#F2F0EC` / `#65C8F5`).
   - Mobile (`< 640px`): near-fullscreen responsive dialog keeping composer visible above virtual keyboard, zero horizontal overflow.
   - Safe Markdown rendering without `dangerouslySetInnerHTML`.
