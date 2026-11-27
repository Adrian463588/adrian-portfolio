# Ask Adrian — Vercel Deployment & Security Setup

## 1. Architecture Summary
- **Next.js Hybrid Build**: `next.config.ts` prerenders all portfolio pages (`/`, `/projects/`, `/projects/[slug]/`, `/resources/`, `/resources/[slug]/`, `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`) while running `POST /api/chat/` on Vercel Node.js serverless functions (`export const runtime = "nodejs"`).
- **Cost & Abuse Safeguards**:
  - FAQ-first deterministic answers (`CHAT_FAQ_FIRST=true`) serve common questions locally with zero upstream requests.
  - PII & secret guardrails intercept phone numbers, street addresses, age, date of birth, government IDs, internal schemas/URLs, and prompt injection before inference.
  - Sequential free-tier provider chain: **Groq** (`qwen/qwen3.8-27b`) -> **Google Gemini** (`gemini-3.1-flash-lite-preview`, gated by `GEMINI_ENABLED`) -> **OpenRouter Free** (`openrouter/free`, `:free` allowlist only) -> **Local Fallback**.

## 2. Vercel Environment Variables (Sensitive)
In Vercel Dashboard (`adrian-portfolio` -> **Settings** -> **Environment Variables**), set these for **Production** and **Preview** using the **Sensitive** option (never commit real secrets to Git):

```text
GROQ_ENABLED=true
GROQ_MODEL=qwen/qwen3.8-27b
GROQ_API_KEY_1=<your-groq-key-1>
GROQ_API_KEY_2=<your-groq-key-2>
GROQ_API_KEY_3=<your-groq-key-3>

GEMINI_ENABLED=true
GEMINI_MODEL=gemini-3.1-flash-lite-preview
GEMINI_API_KEY_1=<your-gemini-key-1>
GEMINI_API_KEY_2=<your-gemini-key-2>
GEMINI_API_KEY_3=<your-gemini-key-3>

OPENROUTER_ENABLED=true
OPENROUTER_MODEL=openrouter/free
OPENROUTER_API_KEY_1=<your-openrouter-key-1>
OPENROUTER_API_KEY_2=<your-openrouter-key-2>
OPENROUTER_API_KEY_3=<your-openrouter-key-3>

CHAT_FAQ_FIRST=true
CHAT_FREE_ONLY=true
CHAT_ALLOW_MULTI_ACCOUNT_ROTATION=true
CHAT_RATE_LIMIT_PER_MINUTE=5
CHAT_RATE_LIMIT_PER_DAY=20
CHAT_GLOBAL_DAILY_ATTEMPTS=100
CHAT_MAX_OUTPUT_TOKENS=512
CHAT_PROVIDER_TIMEOUT_MS=5000
CHAT_TOTAL_DEADLINE_MS=25000
```

> **Note:** When migrating multiple serverless instances under heavy traffic, optionally set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` for global Redis-backed rate limiting, plus `TURNSTILE_SECRET_KEY` / `NEXT_PUBLIC_TURNSTILE_SITE_KEY` if bot protection is needed.

## 3. Refreshing Knowledge Base
1. Ensure private raw CVs remain inside gitignored `BANKCV_MASUKKANKEGITIGNORE/`.
2. Update verified portfolio data in `src/data/*` (never store private phone numbers, street addresses, birthdates, age, or employer secrets).
3. Run:
   ```bash
   npm run knowledge:build
   npm run knowledge:validate
   npm run check:secrets
   ```
4. Inspect diff in `knowledge/adrian-knowledge.json` before committing.
