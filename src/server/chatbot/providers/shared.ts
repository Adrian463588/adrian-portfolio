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

export interface PreResponseSignalHandle {
  signal: AbortSignal;
  clearPreResponseTimeout: () => void;
  cleanup: () => void;
}

/**
 * Enforces a pre-response (TTFB) timeout until HTTP headers arrive while still honoring
 * visitor abort signals across the entire request/stream lifecycle.
 */
export function createPreResponseControl(
  timeoutMs: number,
  externalSignal?: AbortSignal
): PreResponseSignalHandle {
  const controller = new AbortController();
  const safeTimeoutMs = Math.max(500, timeoutMs);

  const onExternalAbort = () => {
    controller.abort(externalSignal?.reason);
  };

  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort(externalSignal.reason);
    } else {
      externalSignal.addEventListener("abort", onExternalAbort, { once: true });
    }
  }

  let timer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
    timer = null;
    const timeoutErr = new Error("Pre-response timeout");
    timeoutErr.name = "TimeoutError";
    controller.abort(timeoutErr);
  }, safeTimeoutMs);

  const clearPreResponseTimeout = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const cleanup = () => {
    clearPreResponseTimeout();
    externalSignal?.removeEventListener("abort", onExternalAbort);
  };

  return { signal: controller.signal, clearPreResponseTimeout, cleanup };
}

interface SseReadResult {
  text: string;
  interrupted: boolean;
}

function trailingThinkPrefixLen(text: string): number {
  const lower = text.toLowerCase();
  const maxPrefix = Math.min(6, lower.length);
  for (let len = maxPrefix; len >= 1; len -= 1) {
    if ("<think>".startsWith(lower.slice(-len))) {
      return len;
    }
  }
  return 0;
}

/**
 * Incrementally strips `<think>...</think>` blocks from streamed tokens so raw reasoning
 * never reaches the client mid-stream even when split across multiple SSE packets.
 */
function createThinkTagStreamFilter() {
  let pending = "";
  let inThink = false;

  return {
    push(chunk: string): string {
      pending += chunk;
      let visible = "";

      while (pending.length > 0) {
        if (inThink) {
          const closeIdx = pending.toLowerCase().indexOf("</think>");
          if (closeIdx === -1) {
            // Retain only tail chars in case `</think>` spans packet boundary
            if (pending.length > 8) pending = pending.slice(-8);
            break;
          }
          pending = pending.slice(closeIdx + 8);
          inThink = false;
        } else {
          const openIdx = pending.toLowerCase().indexOf("<think>");
          if (openIdx === -1) {
            const safeLen = pending.length - trailingThinkPrefixLen(pending);
            if (safeLen > 0) {
              visible += pending.slice(0, safeLen);
              pending = pending.slice(safeLen);
            }
            break;
          }
          visible += pending.slice(0, openIdx);
          pending = pending.slice(openIdx + 7);
          inThink = true;
        }
      }
      return visible;
    },
    flush(): string {
      if (inThink) {
        pending = "";
        return "";
      }
      const rest = pending;
      pending = "";
      return rest;
    },
  };
}

export function stripThinkTags(text: string): string {
  const filter = createThinkTagStreamFilter();
  return (filter.push(text) + filter.flush()).trim();
}

export async function consumeSseLines(
  body: ReadableStream<Uint8Array>,
  extractDelta: (jsonPayload: unknown) => string,
  onToken?: (delta: string) => void,
  idleChunkTimeoutMs = 12_000
): Promise<SseReadResult> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const thinkFilter = createThinkTagStreamFilter();
  let buffer = "";
  let accumulated = "";

  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  const clearIdleTimer = () => {
    if (idleTimer !== null) {
      clearTimeout(idleTimer);
      idleTimer = null;
    }
  };
  const armIdleTimer = () => {
    clearIdleTimer();
    if (idleChunkTimeoutMs > 0) {
      idleTimer = setTimeout(() => {
        idleTimer = null;
        void reader.cancel();
      }, idleChunkTimeoutMs);
    }
  };

  const emitVisible = (delta: string) => {
    if (!delta) return;
    accumulated += delta;
    onToken?.(delta);
  };

  const flushVisibleTail = () => {
    emitVisible(thinkFilter.flush());
  };

  try {
    while (true) {
      armIdleTimer();
      const { value, done } = await reader.read();
      clearIdleTimer();
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
          const rawDelta = extractDelta(parsed);
          if (rawDelta) {
            emitVisible(thinkFilter.push(rawDelta));
          }
        } catch {
          // Ignore partial SSE comment/keepalive frames
        }
      }
    }

    flushVisibleTail();
    return { text: accumulated, interrupted: false };
  } catch (err) {
    flushVisibleTail();
    if (accumulated.length > 0) {
      return { text: accumulated, interrupted: true };
    }
    throw err;
  } finally {
    clearIdleTimer();
  }
}

export async function executeOpenAiCompatibleChat(
  endpoint: string,
  input: ProviderGenerateInput,
  extraHeaders: Record<string, string> = {},
  extraBody: Record<string, unknown> = {}
): Promise<{ text: string; interrupted: boolean }> {
  const { signal, clearPreResponseTimeout, cleanup } = createPreResponseControl(
    input.timeoutMs,
    input.signal
  );
  const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
    { role: "system", content: input.systemPrompt },
    ...input.messages.map((m: ChatHistoryMessage) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  try {
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
          ...extraBody,
        }),
        signal,
      });
    } catch (err) {
      const abortReason = signal.aborted ? signal.reason : err;
      if (
        (err instanceof Error && err.name === "TimeoutError") ||
        (abortReason instanceof Error && abortReason.name === "TimeoutError")
      ) {
        throw new ProviderAttemptError("timeout", "Provider pre-response timeout");
      }
      throw new ProviderAttemptError("upstream-error", "Upstream connection failure");
    }

    clearPreResponseTimeout();

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
    const rawText = json?.choices?.[0]?.message?.content ?? "";
    const text = stripThinkTags(rawText);
    if (!text) {
      throw new ProviderAttemptError("empty-output", "Provider returned empty response");
    }
    input.onToken?.(text);
    return { text, interrupted: false };
  } finally {
    cleanup();
  }
}
