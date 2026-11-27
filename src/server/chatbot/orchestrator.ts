import { sanitizeAssistantOutput } from "./guardrails";
import { buildSystemPrompt } from "./persona";
import { generateWithGemini } from "./providers/gemini";
import { generateWithGroq } from "./providers/groq";
import { generateWithOpenRouter } from "./providers/openrouter";
import { buildLocalFallbackAnswer, retrieveKnowledgeContext } from "./retrieval";
import {
  ProviderAttemptError,
  type ChatHistoryMessage,
  type OrchestratorInput,
  type OrchestratorResult,
  type ProviderGenerateInput,
  type ProviderName,
} from "./types";

interface ProviderAdapterEntry {
  name: Exclude<ProviderName, "local">;
  enabled: boolean;
  model: string;
  keys: string[];
  invoke: (input: ProviderGenerateInput) => Promise<{ text: string; interrupted: boolean }>;
}

export async function runChatOrchestrator(
  input: OrchestratorInput
): Promise<OrchestratorResult> {
  const {
    message,
    history,
    language,
    detail,
    stream = false,
    onToken,
    config,
    fetchImpl = fetch,
    budget,
    signal,
  } = input;

  const retrieved = retrieveKnowledgeContext(message, language);
  const systemPrompt = buildSystemPrompt(language, detail, retrieved.snippets);
  const messages: ChatHistoryMessage[] = [
    ...history.slice(-6),
    { role: "user", content: message },
  ];

  const adapters: ProviderAdapterEntry[] = [
    {
      name: "groq",
      enabled: config.groq.enabled,
      model: config.groq.model,
      keys: config.groq.keys,
      invoke: generateWithGroq,
    },
    {
      name: "gemini",
      enabled: config.gemini.enabled,
      model: config.gemini.model,
      keys: config.gemini.keys,
      invoke: generateWithGemini,
    },
    {
      name: "openrouter",
      enabled: config.openrouter.enabled,
      model: config.openrouter.model,
      keys: config.openrouter.keys,
      invoke: generateWithOpenRouter,
    },
  ];

  const startedAt = Date.now();
  let attempts = 0;

  for (const adapter of adapters) {
    if (!adapter.enabled || adapter.keys.length === 0) continue;

    for (const apiKey of adapter.keys) {
      if (signal?.aborted) break;

      const remainingDeadlineMs = config.totalDeadlineMs - (Date.now() - startedAt);
      if (remainingDeadlineMs <= 400) {
        break;
      }

      if (!budget.tryReserve()) {
        // Global daily attempt budget exhausted — fall back deterministically
        break;
      }

      attempts += 1;
      const attemptTimeoutMs = Math.min(config.providerTimeoutMs, remainingDeadlineMs);

      try {
        const res = await adapter.invoke({
          apiKey,
          model: adapter.model,
          systemPrompt,
          messages,
          maxTokens: config.maxOutputTokens,
          timeoutMs: attemptTimeoutMs,
          stream,
          freeOnly: config.freeOnly,
          allowMultiAccountKeyRotation: config.allowMultiAccountKeyRotation,
          signal,
          fetchImpl,
          onToken,
        });

        const safe = sanitizeAssistantOutput(res.text);
        if (res.interrupted) {
          return {
            mode: "ai",
            provider: adapter.name,
            text: safe.text,
            links: retrieved.links,
            interrupted: true,
            attempts,
          };
        }

        if (!safe.text) {
          continue;
        }

        return {
          mode: "ai",
          provider: adapter.name,
          text: safe.text,
          links: retrieved.links,
          interrupted: false,
          attempts,
        };
      } catch (err) {
        if (err instanceof ProviderAttemptError) {
          if (
            err.kind === "shared-quota" ||
            err.kind === "paid-model-blocked" ||
            err.kind === "model-unavailable"
          ) {
            // Skip remaining credential slots on this provider cleanly
            break;
          }
          // credential-invalid, key-quota (independent account), timeout, empty-output, upstream-error:
          // proceed to next configured slot or next provider.
          continue;
        }
        continue;
      }
    }
  }

  const fallback = buildLocalFallbackAnswer(message, language, detail);
  return {
    mode: "local-fallback",
    provider: "local",
    text: fallback.text,
    links: fallback.links,
    interrupted: false,
    attempts,
  };
}
