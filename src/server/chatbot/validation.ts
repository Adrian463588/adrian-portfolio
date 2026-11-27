import type { ChatDetailLevel, ChatHistoryMessage, ChatLanguage, ValidatedChatPayload } from "./types";

const MAX_MESSAGE_CHARS = 1000;
const MAX_HISTORY_MESSAGES = 6;

const FORBIDDEN_CLIENT_KEYS = new Set([
  "model",
  "models",
  "provider",
  "providers",
  "apikey",
  "api_key",
  "apikeys",
  "system",
  "systemprompt",
  "system_prompt",
  "prompt",
  "instructions",
  "endpoint",
  "baseurl",
  "base_url",
  "url",
  "maxtokens",
  "max_tokens",
  "temperature",
  "knowledge",
]);

export type ValidationResult =
  | { ok: true; data: ValidatedChatPayload }
  | { ok: false; error: string };

export function validateChatRequestBody(raw: unknown): ValidationResult {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { ok: false, error: "Request body must be a JSON object." };
  }

  const obj = raw as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    if (FORBIDDEN_CLIENT_KEYS.has(key.toLowerCase())) {
      return { ok: false, error: `Unsupported configuration field: ${key}` };
    }
  }

  if (typeof obj.message !== "string") {
    return { ok: false, error: "Message is required." };
  }
  const message = obj.message.trim();
  if (message.length === 0) {
    return { ok: false, error: "Message cannot be empty." };
  }
  if (message.length > MAX_MESSAGE_CHARS) {
    return { ok: false, error: `Message exceeds ${MAX_MESSAGE_CHARS} characters.` };
  }

  const language: ChatLanguage =
    obj.language === "id" || obj.language === "en" || obj.language === "auto"
      ? obj.language
      : "auto";

  const detail: ChatDetailLevel =
    obj.detail === "detailed" || obj.detail === "concise" ? obj.detail : "concise";

  const stream = obj.stream === true;
  const challengeToken =
    typeof obj.challengeToken === "string" ? obj.challengeToken.trim().slice(0, 2048) : undefined;

  const history: ChatHistoryMessage[] = [];
  if (obj.history !== undefined) {
    if (!Array.isArray(obj.history)) {
      return { ok: false, error: "History must be an array." };
    }
    if (obj.history.length > MAX_HISTORY_MESSAGES) {
      return { ok: false, error: `History cannot exceed ${MAX_HISTORY_MESSAGES} messages.` };
    }
    for (const item of obj.history) {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return { ok: false, error: "Invalid history entry." };
      }
      const entry = item as Record<string, unknown>;
      if (entry.role !== "user" && entry.role !== "assistant") {
        return { ok: false, error: "History entries must use role user or assistant only." };
      }
      if (typeof entry.content !== "string") {
        return { ok: false, error: "History content must be text." };
      }
      const cleanContent = entry.content.trim();
      if (cleanContent.length > MAX_MESSAGE_CHARS) {
        return { ok: false, error: "History entry exceeds length limit." };
      }
      if (cleanContent.length > 0) {
        history.push({ role: entry.role, content: cleanContent });
      }
    }
  }

  return {
    ok: true,
    data: {
      message,
      history,
      language,
      detail,
      stream,
      challengeToken,
    },
  };
}
