import type { ChatbotRuntimeConfig, ProviderSlotConfig } from "./types";

function parseBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value.trim() === "") return fallback;
  return value.trim().toLowerCase() === "true";
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const n = Number.parseInt(value ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function readKeySlots(prefix: string, env: Record<string, string | undefined>): string[] {
  return [1, 2, 3]
    .map((slot) => env[`${prefix}_API_KEY_${slot}`]?.trim() ?? "")
    .filter((key) => key.length > 0);
}

/**
 * Produces an irreversible obfuscated fingerprint for diagnostics without leaking real keys.
 */
export function maskKeyFingerprint(key: string): string {
  const clean = key.trim();
  if (clean.length <= 8) return "***";
  return `${clean.slice(0, 4)}***${clean.slice(-4)}`;
}

export function getChatbotConfig(
  env: Record<string, string | undefined> = process.env
): ChatbotRuntimeConfig {
  const groq: ProviderSlotConfig = {
    enabled: parseBool(env.GROQ_ENABLED, true),
    model: env.GROQ_MODEL?.trim() || "qwen/qwen3.8-27b",
    keys: readKeySlots("GROQ", env),
  };

  // Gemini defaults off unless explicitly enabled after compliance review.
  const gemini: ProviderSlotConfig = {
    enabled: parseBool(env.GEMINI_ENABLED, false),
    model: env.GEMINI_MODEL?.trim() || "gemini-3.1-flash-lite-preview",
    keys: readKeySlots("GEMINI", env),
  };

  const openrouter: ProviderSlotConfig = {
    enabled: parseBool(env.OPENROUTER_ENABLED, true),
    model: env.OPENROUTER_MODEL?.trim() || "openrouter/free",
    keys: readKeySlots("OPENROUTER", env),
  };

  return {
    groq,
    gemini,
    openrouter,
    faqFirst: parseBool(env.CHAT_FAQ_FIRST, true),
    freeOnly: parseBool(env.CHAT_FREE_ONLY, true),
    allowMultiAccountKeyRotation: parseBool(env.CHAT_ALLOW_MULTI_ACCOUNT_ROTATION, true),
    rateLimitPerMinute: parsePositiveInt(env.CHAT_RATE_LIMIT_PER_MINUTE, 5),
    rateLimitPerDay: parsePositiveInt(env.CHAT_RATE_LIMIT_PER_DAY, 20),
    globalDailyAttempts: parsePositiveInt(env.CHAT_GLOBAL_DAILY_ATTEMPTS, 100),
    maxOutputTokens: Math.min(parsePositiveInt(env.CHAT_MAX_OUTPUT_TOKENS, 512), 512),
    providerTimeoutMs: Math.min(parsePositiveInt(env.CHAT_PROVIDER_TIMEOUT_MS, 5000), 10000),
    totalDeadlineMs: Math.min(parsePositiveInt(env.CHAT_TOTAL_DEADLINE_MS, 25000), 30000),
    upstashUrl: env.UPSTASH_REDIS_REST_URL?.trim() || undefined,
    upstashToken: env.UPSTASH_REDIS_REST_TOKEN?.trim() || undefined,
    requireDistributedLimiter: parseBool(env.CHAT_REQUIRE_DISTRIBUTED_LIMITER, false),
    turnstileSecret: env.TURNSTILE_SECRET_KEY?.trim() || undefined,
  };
}
