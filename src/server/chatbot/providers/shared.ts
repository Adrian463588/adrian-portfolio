import {
  ProviderAttemptError,
  type ChatHistoryMessage,
  type FailureKind,
  type ProviderGenerateInput,
} from "../types";

export class PartialStreamError extends Error {
  readonly partialText: string;

  constructor(partialText: string, causeMessage: string) {
    super(causeMessage);
    this.name = "PartialStreamError";
    this.partialText = partialText;
  }
}

export function parseRetryAfterMs(headerValue: string | null): number | undefined {
  if (!headerValue) return undefined;
  const seconds = Number.parseFloat(headerValue);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return Math.min(seconds * 1000, 120_000);
  }
  const dateMs = Date.parse(headerValue);
  if (Number.isFinite(dateMs)) {
    return Math.max(0, Math.min(dateMs - Date.now(), 120_000));
  }
  return undefined;
}

export function classifyHttpFailure(
  status: number,
  bodyText: string,
  allowMultiAccountKeyRotation: boolean,
  retryAfterMs?: number
): ProviderAttemptError {
  const lower = bodyText.toLowerCase();

  if (status === 401 || status === 403 || lower.includes("invalid_api_key")) {
    return new ProviderAttemptError("credential-invalid", `Credential rejected (${status})`);
  }
  if (status === 404 || lower.includes("model_not_found") || lower.includes("does not exist")) {
    return new ProviderAttemptError("model-unavailable", `Model unavailable (${status})`);
  }
  if (status === 429) {
    const looksSharedOrg =
      !allowMultiAccountKeyRotation ||
      lower.includes("organization") ||
      lower.includes("shared") ||
      lower.includes("insufficient_quota");
    const kind: FailureKind =
      allowMultiAccountKeyRotation && !lower.includes("billing")
        ? "key-quota"
        : looksSharedOrg
          ? "shared-quota"
          : "key-quota";
    return new ProviderAttemptError(kind, `Rate limit / quota (${status})`, retryAfterMs);
  }
  return new ProviderAttemptError("upstream-error", `Provider HTTP ${status}`, retryAfterMs);
}

export function createAttemptSignal(
  timeoutMs: number,
  externalSignal?: AbortSignal
): AbortSignal {
  const timeoutSignal = AbortSignal.timeout(Math.max(500, timeoutMs));
  if (!externalSignal) return timeoutSignal;
  if (typeof AbortSignal.any === "function") {
    return AbortSignal.any([externalSignal, timeoutSignal]);
  }
  return timeoutSignal;
}

interface SseReadResult {
  text: string;
  interrupted: boolean;
}

export async function consumeSseLines(
  body: ReadableStream<Uint8Array>,
  extractDelta: (jsonPayload: unknown) => string,
  onToken?: (delta: string) => void
): Promise<SseReadResult> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let accumulated = "";

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const parsed = JSON.parse(payload);
          const delta = extractDelta(parsed);
          if (delta) {
            accumulated += delta;
            onToken?.(delta);
          }
        } catch {
          // Ignore partial SSE comment/keepalive frames
        }
      }
    }
    return { text: accumulated, interrupted: false };
  } catch (err) {
    if (accumulated.length > 0) {
      return { text: accumulated, interrupted: true };
    }
    throw err;
  }
}

export async function executeOpenAiCompatibleChat(
  endpoint: string,
  input: ProviderGenerateInput,
  extraHeaders: Record<string, string> = {}
): Promise<{ text: string; interrupted: boolean }> {
  const signal = createAttemptSignal(input.timeoutMs, input.signal);
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: input.systemPrompt },
    ...input.messages.map((m: ChatHistoryMessage) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  let res: Response;
  try {
    res = await input.fetchImpl(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.apiKey}`,
        "Content-Type": "application/json",
        ...extraHeaders,
      },
      body: JSON.stringify({
        model: input.model,
        messages,
        max_tokens: input.maxTokens,
        temperature: 0.35,
        stream: input.stream,
      }),
      signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new ProviderAttemptError("timeout", "Provider pre-response timeout");
    }
    throw new ProviderAttemptError("upstream-error", "Upstream connection failure");
  }

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    const retryMs = parseRetryAfterMs(res.headers.get("retry-after"));
    throw classifyHttpFailure(
      res.status,
      errText,
      input.allowMultiAccountKeyRotation,
      retryMs
    );
  }

  const contentType = res.headers.get("content-type")?.toLowerCase() ?? "";
  if (input.stream && res.body && contentType.includes("text/event-stream")) {
    const result = await consumeSseLines(
      res.body,
      (payload) => {
        const obj = payload as { choices?: Array<{ delta?: { content?: string } }> };
        return obj?.choices?.[0]?.delta?.content ?? "";
      },
      input.onToken
    );
    if (!result.text.trim() && !result.interrupted) {
      throw new ProviderAttemptError("empty-output", "Provider stream returned empty content");
    }
    return result;
  }

  const json = (await res.json().catch(() => null)) as {
    choices?: Array<{ message?: { content?: string } }>;
  } | null;
  const text = json?.choices?.[0]?.message?.content?.trim() ?? "";
  if (!text) {
    throw new ProviderAttemptError("empty-output", "Provider returned empty response");
  }
  input.onToken?.(text);
  return { text, interrupted: false };
}
