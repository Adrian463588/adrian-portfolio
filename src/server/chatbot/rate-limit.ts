import type { ChatbotRuntimeConfig } from "./types";

export interface RateCheckResult {
  allowed: boolean;
  reason?: "minute-limit" | "daily-limit" | "limiter-unavailable";
  retryAfterSeconds?: number;
}

/**
 * Synchronous single-threaded atomic reservation before any `await fetch()`
 * ensures concurrent requests cannot exceed the global daily upstream attempt cap.
 */
export class DailyAttemptBudget {
  private readonly limit: number;
  private dayKey: string;
  private used = 0;

  constructor(limit: number) {
    this.limit = Math.max(1, limit);
    this.dayKey = new Date().toISOString().slice(0, 10);
  }

  private rolloverIfNewDay(): void {
    const today = new Date().toISOString().slice(0, 10);
    if (today !== this.dayKey) {
      this.dayKey = today;
      this.used = 0;
    }
  }

  tryReserve(): boolean {
    this.rolloverIfNewDay();
    if (this.used >= this.limit) {
      return false;
    }
    this.used += 1;
    return true;
  }

  getRemaining(): number {
    this.rolloverIfNewDay();
    return Math.max(0, this.limit - this.used);
  }
}

export class InMemoryRateLimiter {
  private readonly perMinute: number;
  private readonly perDay: number;
  private readonly hits = new Map<string, number[]>();

  constructor(opts: { perMinute: number; perDay: number }) {
    this.perMinute = Math.max(1, opts.perMinute);
    this.perDay = Math.max(1, opts.perDay);
  }

  async consume(visitorKey: string): Promise<RateCheckResult> {
    const now = Date.now();
    const dayAgo = now - 86_400_000;
    const minAgo = now - 60_000;

    if (this.hits.size > 2000) {
      this.hits.clear();
    }

    const recent = (this.hits.get(visitorKey) ?? []).filter((ts) => ts > dayAgo);
    const inLastMinute = recent.filter((ts) => ts > minAgo);

    if (inLastMinute.length >= this.perMinute) {
      this.hits.set(visitorKey, recent);
      const oldestInMin = inLastMinute[0] ?? now;
      return {
        allowed: false,
        reason: "minute-limit",
        retryAfterSeconds: Math.max(1, Math.ceil((oldestInMin + 60_000 - now) / 1000)),
      };
    }

    if (recent.length >= this.perDay) {
      this.hits.set(visitorKey, recent);
      return { allowed: false, reason: "daily-limit", retryAfterSeconds: 3600 };
    }

    recent.push(now);
    this.hits.set(visitorKey, recent);
    return { allowed: true };
  }
}

async function runUpstashIncr(
  upstashUrl: string,
  upstashToken: string,
  key: string,
  ttlSeconds: number
): Promise<number> {
  const endpoint = `${upstashUrl.replace(/\/$/, "")}/pipeline`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${upstashToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", key],
      ["EXPIRE", key, ttlSeconds, "NX"],
    ]),
    signal: AbortSignal.timeout(2500),
  });
  if (!res.ok) {
    throw new Error(`Upstash HTTP ${res.status}`);
  }
  const data = (await res.json()) as Array<{ result?: number }>;
  const count = data?.[0]?.result;
  if (typeof count !== "number") {
    throw new Error("Unexpected Upstash pipeline response");
  }
  return count;
}

export async function consumeDistributedOrLocalLimit(
  visitorKey: string,
  config: ChatbotRuntimeConfig,
  fallbackLimiter: InMemoryRateLimiter
): Promise<RateCheckResult> {
  if (config.upstashUrl && config.upstashToken) {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const minBucket = Math.floor(Date.now() / 60_000);
      const [minCount, dayCount] = await Promise.all([
        runUpstashIncr(config.upstashUrl, config.upstashToken, `chat:m:${visitorKey}:${minBucket}`, 65),
        runUpstashIncr(config.upstashUrl, config.upstashToken, `chat:d:${visitorKey}:${today}`, 86_500),
      ]);
      if (minCount > config.rateLimitPerMinute) {
        return { allowed: false, reason: "minute-limit", retryAfterSeconds: 60 };
      }
      if (dayCount > config.rateLimitPerDay) {
        return { allowed: false, reason: "daily-limit", retryAfterSeconds: 3600 };
      }
      return { allowed: true };
    } catch {
      if (config.requireDistributedLimiter) {
        return { allowed: false, reason: "limiter-unavailable" };
      }
    }
  } else if (config.requireDistributedLimiter) {
    return { allowed: false, reason: "limiter-unavailable" };
  }

  return fallbackLimiter.consume(visitorKey);
}

export function extractVisitorKey(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = req.headers.get("x-real-ip")?.trim();
  const ua = req.headers.get("user-agent")?.slice(0, 48) ?? "anon";
  return `${forwarded || realIp || "local"}:${ua}`;
}
