export type ChatLanguage = "auto" | "id" | "en";
export type ResolvedLanguage = "id" | "en";
export type ChatDetailLevel = "concise" | "detailed";

export type ProviderName = "groq" | "gemini" | "openrouter" | "local";
export type ResponseMode = "ai" | "local-faq" | "local-fallback" | "guardrail" | "rate-limited";

export interface VerifiedLink {
  label: string;
  href: string;
}

export interface ChatHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ValidatedChatPayload {
  message: string;
  history: ChatHistoryMessage[];
  language: ChatLanguage;
  detail: ChatDetailLevel;
  stream: boolean;
  challengeToken?: string;
}

export interface ProviderSlotConfig {
  enabled: boolean;
  model: string;
  keys: string[];
}

export interface ChatbotRuntimeConfig {
  groq: ProviderSlotConfig;
  gemini: ProviderSlotConfig;
  openrouter: ProviderSlotConfig;
  faqFirst: boolean;
  freeOnly: boolean;
  allowMultiAccountKeyRotation: boolean;
  rateLimitPerMinute: number;
  rateLimitPerDay: number;
  globalDailyAttempts: number;
  maxOutputTokens: number;
  providerTimeoutMs: number;
  totalDeadlineMs: number;
  upstashUrl?: string;
  upstashToken?: string;
  requireDistributedLimiter: boolean;
  turnstileSecret?: string;
}

export type FailureKind =
  | "credential-invalid"
  | "shared-quota"
  | "key-quota"
  | "model-unavailable"
  | "timeout"
  | "empty-output"
  | "upstream-error"
  | "paid-model-blocked";

export class ProviderAttemptError extends Error {
  readonly kind: FailureKind;
  readonly retryAfterMs?: number;

  constructor(kind: FailureKind, message: string, retryAfterMs?: number) {
    super(message);
    this.name = "ProviderAttemptError";
    this.kind = kind;
    this.retryAfterMs = retryAfterMs;
  }
}

export interface ProviderGenerateInput {
  apiKey: string;
  model: string;
  systemPrompt: string;
  messages: ChatHistoryMessage[];
  maxTokens: number;
  timeoutMs: number;
  stream: boolean;
  freeOnly: boolean;
  allowMultiAccountKeyRotation: boolean;
  signal?: AbortSignal;
  fetchImpl: typeof fetch;
  onToken?: (delta: string) => void;
}

export interface OrchestratorInput {
  message: string;
  history: ChatHistoryMessage[];
  language: ResolvedLanguage;
  detail: ChatDetailLevel;
  stream?: boolean;
  onToken?: (delta: string) => void;
  config: ChatbotRuntimeConfig;
  fetchImpl?: typeof fetch;
  budget: { tryReserve: () => boolean };
  signal?: AbortSignal;
}

export interface OrchestratorResult {
  mode: "ai" | "local-fallback";
  provider: ProviderName;
  text: string;
  links: VerifiedLink[];
  interrupted: boolean;
  attempts: number;
}
