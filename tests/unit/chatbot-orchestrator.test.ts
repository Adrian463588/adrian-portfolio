import { describe, expect, it, vi } from "vitest";
import { runChatOrchestrator } from "@/server/chatbot/orchestrator";
import { DailyAttemptBudget, InMemoryRateLimiter } from "@/server/chatbot/rate-limit";
import type { ChatbotRuntimeConfig } from "@/server/chatbot/types";

function makeConfig(overrides: Partial<ChatbotRuntimeConfig> = {}): ChatbotRuntimeConfig {
  return {
    groq: { enabled: true, model: "qwen/qwen3.8-27b", keys: ["test-g-1", "test-g-2", "test-g-3"] },
    gemini: {
      enabled: true,
      model: "gemini-3.1-flash-lite-preview",
      keys: ["test-m-1", "test-m-2", "test-m-3"],
    },
    openrouter: { enabled: true, model: "openrouter/free", keys: ["test-o-1", "test-o-2", "test-o-3"] },
    faqFirst: true,
    freeOnly: true,
    allowMultiAccountKeyRotation: false,
    rateLimitPerMinute: 5,
    rateLimitPerDay: 20,
    globalDailyAttempts: 100,
    maxOutputTokens: 512,
    providerTimeoutMs: 5000,
    totalDeadlineMs: 25000,
    requireDistributedLimiter: false,
    ...overrides,
  };
}

function jsonResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

describe("Ask Adrian provider orchestrator & fallback rules", () => {
  it("follows Groq -> Gemini -> OpenRouter priority and rotates Groq credential on 401 invalid key", async () => {
    const calls: string[] = [];
    const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
      const auth = (init?.headers as Record<string, string>)?.Authorization || "";
      calls.push(`${url}:${auth}`);
      if (auth.includes("test-g-1")) {
        return jsonResponse({ error: { message: "Invalid API Key", code: "invalid_api_key" } }, 401);
      }
      return jsonResponse({
        choices: [{ message: { content: "Adrian built ParfumCreator in Kotlin." } }],
      });
    });

    const result = await runChatOrchestrator({
      message: "Compare ParfumCreator architecture with AdzanPlus",
      history: [],
      language: "en",
      detail: "concise",
      config: makeConfig(),
      fetchImpl: fetchMock as unknown as typeof fetch,
      budget: new DailyAttemptBudget(100),
    });

    expect(result.mode).toBe("ai");
    expect(result.provider).toBe("groq");
    expect(result.text).toContain("ParfumCreator");
    expect(calls).toHaveLength(2);
    expect(calls[0]).toContain("api.groq.com");
    expect(calls[1]).toContain("api.groq.com");
  });

  it("skips remaining Groq keys on shared org quota exhaustion and skips Gemini when GEMINI_ENABLED=false", async () => {
    const visitedHosts: string[] = [];
    const fetchMock = vi.fn(async (url: string) => {
      visitedHosts.push(new URL(url).hostname);
      if (url.includes("api.groq.com")) {
        return jsonResponse(
          { error: { message: "Organization rate limit exceeded", type: "tokens" } },
          429,
          { "retry-after": "30" }
        );
      }
      if (url.includes("openrouter.ai")) {
        return jsonResponse({
          model: "openrouter/free",
          choices: [{ message: { content: "OpenRouter free response for Qiscus." } }],
        });
      }
      throw new Error("Should not call Gemini when disabled");
    });

    const result = await runChatOrchestrator({
      message: "What specific QA work did Adrian do on ParfumCreator vs Qiscus?",
      history: [],
      language: "en",
      detail: "concise",
      config: makeConfig({
        gemini: { enabled: false, model: "gemini-3.1-flash-lite-preview", keys: ["m-1", "m-2"] },
        allowMultiAccountKeyRotation: false,
      }),
      fetchImpl: fetchMock as unknown as typeof fetch,
      budget: new DailyAttemptBudget(100),
    });

    expect(result.mode).toBe("ai");
    expect(result.provider).toBe("openrouter");
    // 1 shared-quota call on Groq (no cycling key 2/3), 0 on Gemini, 1 on OpenRouter
    expect(visitedHosts).toEqual(["api.groq.com", "openrouter.ai"]);
  });

  it("tries multiple account keys per provider when allowMultiAccountKeyRotation=true and falls back Groq -> Gemini -> OpenRouter -> Local FAQ", async () => {
    const attempts: string[] = [];
    const fetchMock = vi.fn(async (url: string) => {
      attempts.push(new URL(url).hostname);
      return jsonResponse({ error: { message: "Quota exhausted" } }, 429);
    });

    const result = await runChatOrchestrator({
      message: "Tell me about Adrian's QuranPlus architecture details",
      history: [],
      language: "en",
      detail: "concise",
      config: makeConfig({ allowMultiAccountKeyRotation: true }),
      fetchImpl: fetchMock as unknown as typeof fetch,
      budget: new DailyAttemptBudget(20),
    });

    // 3 Groq + 3 Gemini + 3 OpenRouter = 9 total attempts, then deterministic local fallback
    expect(attempts.filter((h) => h === "api.groq.com")).toHaveLength(3);
    expect(attempts.filter((h) => h === "generativelanguage.googleapis.com")).toHaveLength(3);
    expect(attempts.filter((h) => h === "openrouter.ai")).toHaveLength(3);
    expect(result.mode).toBe("local-fallback");
    expect(result.provider).toBe("local");
    expect(result.text).toContain("QuranPlus");
    expect(result.text).not.toMatch(/429|Quota exhausted|test-g-/);
  });

  it("blocks paid OpenRouter models under freeOnly mode and enforces atomic concurrent daily attempt budget", async () => {
    const budget = new DailyAttemptBudget(2);
    const fetchMock = vi.fn(async () => {
      await new Promise((r) => setTimeout(r, 15));
      return jsonResponse({ error: { message: "upstream unavailable" } }, 503);
    });

    const config = makeConfig({
      gemini: { enabled: false, model: "gemini-3.1-flash-lite-preview", keys: [] },
      openrouter: { enabled: true, model: "openai/gpt-4o", keys: ["test-o-1"] }, // paid model must be rejected!
    });

    const runs = await Promise.all(
      [1, 2, 3, 4].map((i) =>
        runChatOrchestrator({
          message: `Deep dive query ${i} about AutomatePlus`,
          history: [],
          language: "en",
          detail: "concise",
          config,
          fetchImpl: fetchMock as unknown as typeof fetch,
          budget,
        })
      )
    );

    // At most 2 upstream calls fire globally; paid OpenRouter model is never called
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(runs.every((r) => r.mode === "local-fallback")).toBe(true);
  });

  it("marks interrupted mid-stream response incomplete without appending a second provider output", async () => {
    const encoder = new TextEncoder();
    let pulls = 0;
    const failingStream = new ReadableStream({
      pull(controller) {
        pulls += 1;
        if (pulls === 1) {
          controller.enqueue(
            encoder.encode('data: {"choices":[{"delta":{"content":"Partial answer on "}}]}\n\n')
          );
        } else {
          controller.error(new Error("Upstream connection dropped mid-stream"));
        }
      },
    });

    const fetchMock = vi.fn(async (url: string) => {
      if (url.includes("api.groq.com")) {
        return new Response(failingStream, { status: 200, headers: { "Content-Type": "text/event-stream" } });
      }
      return jsonResponse({ choices: [{ message: { content: "Second provider text" } }] });
    });

    const streamedChunks: string[] = [];
    const result = await runChatOrchestrator({
      message: "How does AutomatePlus generate Playwright code?",
      history: [],
      language: "en",
      detail: "detailed",
      stream: true,
      onToken: (delta) => streamedChunks.push(delta),
      config: makeConfig(),
      fetchImpl: fetchMock as unknown as typeof fetch,
      budget: new DailyAttemptBudget(100),
    });

    expect(streamedChunks.join("")).toContain("Partial answer on");
    expect(result.interrupted).toBe(true);
    expect(result.text).toContain("Partial answer on");
    expect(result.text).not.toContain("Second provider text");
    // Must not retry another provider after partial output started
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("enforces per-minute and per-day visitor rate limits", async () => {
    const limiter = new InMemoryRateLimiter({ perMinute: 2, perDay: 3 });
    expect((await limiter.consume("visitor-1")).allowed).toBe(true);
    expect((await limiter.consume("visitor-1")).allowed).toBe(true);
    const overMin = await limiter.consume("visitor-1");
    expect(overMin.allowed).toBe(false);
    expect(overMin.reason).toBe("minute-limit");
  });

  it("strips <think> reasoning tags incrementally during SSE streaming", async () => {
    const encoder = new TextEncoder();
    const sse = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"<think>hidden "}}]}\n\n'));
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"cot</think>Visible "}}]}\n\n'));
        controller.enqueue(encoder.encode('data: {"choices":[{"delta":{"content":"answer."}}]}\n\n'));
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    const fetchMock = vi.fn(
      async () => new Response(sse, { status: 200, headers: { "Content-Type": "text/event-stream" } })
    );

    const streamed: string[] = [];
    const res = await runChatOrchestrator({
      message: "Summarize his DevOps background briefly.",
      history: [],
      language: "en",
      detail: "concise",
      stream: true,
      onToken: (delta) => streamed.push(delta),
      config: makeConfig(),
      fetchImpl: fetchMock as unknown as typeof fetch,
      budget: new DailyAttemptBudget(10),
    });

    expect(res.mode).toBe("ai");
    expect(res.text).toBe("Visible answer.");
    expect(streamed.join("")).not.toContain("<think>");
    expect(streamed.join("")).not.toContain("hidden");
    expect(streamed.join("")).toBe("Visible answer.");
  });
});
