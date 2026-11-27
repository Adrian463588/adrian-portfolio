# Design: Chatbot AI Integration, Retrieval & Vercel Repair

## Root Cause Summary
1. **Vercel Env Scope**: Earlier token (`vck_...`) lacked scope on team `team_Hb2eeyZG1IYyyr5hppi2MSZo`, leaving `GROQ_API_KEY_*`, `GEMINI_API_KEY_*`, `OPENROUTER_API_KEY_*`, and `GROQ_MODEL` / `GEMINI_MODEL` unset in Vercel Production/Preview.
2. **Owner-Name Token Collision in Retrieval**: `retrieval.ts` tokenized the owner's own name (`adrian`) without stop-word filtering and applied a `+8` `titleBoost` to any GitHub repo containing `"adrian"`, outranking actual `experience` records.
3. **Raw Pipe-Formatted Local Fallback**: `buildLocalFallbackAnswer` surfaced internal RAG strings (`Project: ... | Summary: ... | Description: ...`) verbatim instead of clean intent-aware prose.
4. **Tight Provider Timeout & Reasoning Stream Artifacts**: `5000ms` timeout was tight for free-tier TLS + OpenRouter routing, and `<think>` tags during streaming needed incremental buffering/stripping.

## Architecture Adjustments
- **Vercel Automation (`VERCEL_TOKEN` in env only)**: Link `.vercel/project.json` (gitignored), upsert Sensitive env vars via Vercel CLI/REST API (`GROQ_ENABLED=true`, `GROQ_MODEL=qwen/qwen3.8-27b`, `GEMINI_ENABLED=true`, `GEMINI_MODEL=gemini-3.1-flash-lite-preview`, `OPENROUTER_ENABLED=true`, `OPENROUTER_MODEL=openrouter/free`, keys `1..3` each, operational bounds).
- **Intent-First Retrieval & Follow-up Context (`src/server/chatbot/retrieval.ts`)**:
  - Detect `work_experience`, `company_experience`, `current_activities`, `academic_research`, `technical_skills`, `projects`, `education`, `certifications`, `contact`, `general`.
  - When query is anaphoric / short follow-up, merge non-stopword terms from recent `history` messages.
  - Exclude stop-words and owner name tokens from repo matching; format every fallback response as crisp human-readable prose/bullets in matching language (`id` / `en`).
- **Incremental `<think>` Stream Filter (`src/server/chatbot/providers/shared.ts` + `guardrails.ts`)**: Suppress `<think>...</think>` reasoning spans incrementally before forwarding SSE deltas to clients.
