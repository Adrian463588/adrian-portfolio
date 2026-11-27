import { ProviderAttemptError, type ProviderGenerateInput } from "../types";
import {
  classifyHttpFailure,
  consumeSseLines,
  createAttemptSignal,
  parseRetryAfterMs,
} from "./shared";

const GEMINI_MODEL_RE = /^gemini-[a-z0-9.-]+$/i;

export async function generateWithGemini(
  input: ProviderGenerateInput
): Promise<{ text: string; interrupted: boolean }> {
  if (!GEMINI_MODEL_RE.test(input.model)) {
    throw new ProviderAttemptError("model-unavailable", "Invalid Gemini model ID");
  }

  const action = input.stream ? "streamGenerateContent?alt=sse" : "generateContent";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    input.model
  )}:${action}`;

  const signal = createAttemptSignal(input.timeoutMs, input.signal);

  const contents = input.messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  let res: Response;
  try {
    res = await input.fetchImpl(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": input.apiKey,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: input.systemPrompt }] },
        contents,
        generationConfig: {
          maxOutputTokens: input.maxTokens,
          temperature: 0.35,
        },
      }),
      signal,
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new ProviderAttemptError("timeout", "Gemini pre-response timeout");
    }
    throw new ProviderAttemptError("upstream-error", "Gemini upstream connection failure");
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
        const obj = payload as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
        };
        return (
          obj?.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? ""
        );
      },
      input.onToken
    );
    if (!result.text.trim() && !result.interrupted) {
      throw new ProviderAttemptError("empty-output", "Gemini stream returned empty text");
    }
    return result;
  }

  const json = (await res.json().catch(() => null)) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  } | null;
  const text =
    json?.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("")
      .trim() ?? "";

  if (!text) {
    throw new ProviderAttemptError("empty-output", "Gemini returned empty text");
  }
  input.onToken?.(text);
  return { text, interrupted: false };
}
