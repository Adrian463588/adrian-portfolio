import crypto from "node:crypto";
import { getChatbotConfig } from "@/server/chatbot/config";
import { matchPresetFaq } from "@/server/chatbot/faq";
import { checkSensitiveGuardrail, redactStreamingChunk } from "@/server/chatbot/guardrails";
import { resolveVisitorLanguage } from "@/server/chatbot/knowledge";
import { runChatOrchestrator } from "@/server/chatbot/orchestrator";
import {
  consumeDistributedOrLocalLimit,
  DailyAttemptBudget,
  extractVisitorKey,
  InMemoryRateLimiter,
} from "@/server/chatbot/rate-limit";
import { buildLocalFallbackAnswer } from "@/server/chatbot/retrieval";
import type { ResolvedLanguage, ResponseMode, VerifiedLink } from "@/server/chatbot/types";
import { validateChatRequestBody } from "@/server/chatbot/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;

// Persist per-process rate limiter & daily upstream budget cleanly across warm lambda invocations.
const globalState = globalThis as unknown as {
  __askAdrianLimiter?: InMemoryRateLimiter;
  __askAdrianBudget?: DailyAttemptBudget;
};

function getLimiter(perMinute: number, perDay: number): InMemoryRateLimiter {
  if (!globalState.__askAdrianLimiter) {
    globalState.__askAdrianLimiter = new InMemoryRateLimiter({ perMinute, perDay });
  }
  return globalState.__askAdrianLimiter;
}

function getDailyBudget(limit: number): DailyAttemptBudget {
  if (!globalState.__askAdrianBudget) {
    globalState.__askAdrianBudget = new DailyAttemptBudget(limit);
  }
  return globalState.__askAdrianBudget;
}

interface ChatJsonBody {
  requestId: string;
  mode: ResponseMode;
  provider: string;
  language: ResolvedLanguage;
  text: string;
  links: VerifiedLink[];
  interrupted: boolean;
}

function buildJsonResponse(body: ChatJsonBody, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

function respondSingle(body: ChatJsonBody, wantsStream: boolean): Response {
  if (!wantsStream) {
    return buildJsonResponse(body, 200);
  }
  const encoder = new TextEncoder();
  const payload = [
    `data: ${JSON.stringify({ type: "delta", text: body.text })}\n\n`,
    `data: ${JSON.stringify({ type: "done", ...body })}\n\n`,
  ].join("");

  return new Response(encoder.encode(payload), {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
    },
  });
}

async function verifyTurnstileToken(
  token: string | undefined,
  secret: string,
  visitorIp: string
): Promise<boolean> {
  if (!token) return false;
  try {
    const form = new URLSearchParams({ secret, response: token, remoteip: visitorIp });
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(3000),
    });
    const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
    return data?.success === true;
  } catch {
    return false;
  }
}

export async function handleChatRequest(req: Request): Promise<Response> {
  const requestId = crypto.randomUUID().slice(0, 8);
  const contentLength = Number.parseInt(req.headers.get("content-length") ?? "0", 10);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json(
      { requestId, error: "Request payload too large." },
      { status: 413 }
    );
  }

  let rawText: string;
  try {
    rawText = await req.text();
  } catch {
    return Response.json({ requestId, error: "Unable to read request body." }, { status: 400 });
  }

  if (Buffer.byteLength(rawText, "utf8") > MAX_BODY_BYTES) {
    return Response.json(
      { requestId, error: "Request payload exceeds limit." },
      { status: 413 }
    );
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawText);
  } catch {
    return Response.json({ requestId, error: "Invalid JSON payload." }, { status: 400 });
  }

  const validation = validateChatRequestBody(parsedBody);
  if (!validation.ok) {
    return Response.json({ requestId, error: validation.error }, { status: 400 });
  }

  const { message, history, language: prefLang, detail, stream, challengeToken } =
    validation.data;
  const lang = resolveVisitorLanguage(message, prefLang);
  const config = getChatbotConfig();

  // 1. Deterministic pre-LLM PII & secret guardrail
  const guardrail = checkSensitiveGuardrail(message, lang);
  if (guardrail.blocked) {
    return respondSingle(
      {
        requestId,
        mode: "guardrail",
        provider: "local",
        language: lang,
        text: guardrail.reply,
        links: [
          { label: lang === "id" ? "Kontak" : "Contact", href: "/#contact" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/" },
        ],
        interrupted: false,
      },
      stream
    );
  }

  // 2. Bilingual FAQ-first routing (zero upstream LLM requests for strict static greetings/FAQ)
  if (config.faqFirst) {
    const faq = matchPresetFaq(message, lang, history);
    if (faq) {
      console.info(
        "[ask-adrian]",
        JSON.stringify({ requestId, mode: "local-faq", provider: "local", intent: faq.id })
      );
      return respondSingle(
        {
          requestId,
          mode: "local-faq",
          provider: "local",
          language: lang,
          text: faq.answer,
          links: faq.links,
          interrupted: false,
        },
        stream
      );
    }
  }

  // 3. Rate limit, optional Turnstile gate & global upstream budget guard
  const visitorKey = extractVisitorKey(req);
  if (config.turnstileSecret) {
    const verified = await verifyTurnstileToken(
      challengeToken,
      config.turnstileSecret,
      visitorKey.split(":")[0] || ""
    );
    if (!verified) {
      const local = buildLocalFallbackAnswer(message, lang, detail);
      return respondSingle(
        {
          requestId,
          mode: "local-fallback",
          provider: "local",
          language: lang,
          text: local.text,
          links: local.links,
          interrupted: false,
        },
        stream
      );
    }
  }

  const rateResult = await consumeDistributedOrLocalLimit(
    visitorKey,
    config,
    getLimiter(config.rateLimitPerMinute, config.rateLimitPerDay)
  );
  if (!rateResult.allowed) {
    const local = buildLocalFallbackAnswer(message, lang, detail);
    const rateNote =
      rateResult.reason === "limiter-unavailable"
        ? lang === "id"
          ? "Mode AI eksternal dinonaktifkan sementara (limiter tidak tersedia)."
          : "Live AI inference is temporarily paused; showing local portfolio knowledge."
        : lang === "id"
          ? `Batas permintaan AI sementara tercapai (${rateResult.retryAfterSeconds ?? 60}d). Berikut jawaban lokal terverifikasi:`
          : `Temporary AI request limit reached (${rateResult.retryAfterSeconds ?? 60}s). Showing verified local portfolio info:`;

    return respondSingle(
      {
        requestId,
        mode: rateResult.reason === "limiter-unavailable" ? "local-fallback" : "rate-limited",
        provider: "local",
        language: lang,
        text: `${rateNote}\n\n${local.text}`,
        links: local.links,
        interrupted: false,
      },
      stream
    );
  }

  const budget = getDailyBudget(config.globalDailyAttempts);

  // 4. Streaming SSE path when client asks for real-time token streaming
  if (stream) {
    const encoder = new TextEncoder();
    const sseStream = new ReadableStream({
      async start(controller) {
        const result = await runChatOrchestrator({
          message,
          history,
          language: lang,
          detail,
          stream: true,
          config,
          budget,
          signal: req.signal,
          onToken: (delta) => {
            const safeDelta = redactStreamingChunk(delta);
            if (safeDelta) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "delta", text: safeDelta })}\n\n`)
              );
            }
          },
        });

        const donePayload: ChatJsonBody = {
          requestId,
          mode: result.mode,
          provider: result.provider,
          language: lang,
          text: result.text,
          links: result.links,
          interrupted: result.interrupted,
        };
        console.info(
          "[ask-adrian]",
          JSON.stringify({
            requestId,
            mode: result.mode,
            provider: result.provider,
            attempts: result.attempts,
            interrupted: result.interrupted,
          })
        );
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done", ...donePayload })}\n\n`)
        );
        controller.close();
      },
    });

    return new Response(sseStream, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-store, no-transform",
      },
    });
  }

  // 5. Standard JSON response path
  const result = await runChatOrchestrator({
    message,
    history,
    language: lang,
    detail,
    stream: false,
    config,
    budget,
    signal: req.signal,
  });

  console.info(
    "[ask-adrian]",
    JSON.stringify({
      requestId,
      mode: result.mode,
      provider: result.provider,
      attempts: result.attempts,
      interrupted: result.interrupted,
    })
  );

  return buildJsonResponse(
    {
      requestId,
      mode: result.mode,
      provider: result.provider,
      language: lang,
      text: result.text,
      links: result.links,
      interrupted: result.interrupted,
    },
    200
  );
}

export async function POST(req: Request): Promise<Response> {
  return handleChatRequest(req);
}
