import { ProviderAttemptError, type ProviderGenerateInput } from "../types";
import { executeOpenAiCompatibleChat } from "./shared";

const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export function isFreeOpenRouterModel(model: string): boolean {
  const clean = model.trim();
  return clean === "openrouter/free" || clean.endsWith(":free");
}

export async function generateWithOpenRouter(
  input: ProviderGenerateInput
): Promise<{ text: string; interrupted: boolean }> {
  if (input.freeOnly && !isFreeOpenRouterModel(input.model)) {
    throw new ProviderAttemptError(
      "paid-model-blocked",
      `Paid OpenRouter model blocked under free-only policy: ${input.model}`
    );
  }

  return executeOpenAiCompatibleChat(
    OPENROUTER_ENDPOINT,
    // Reserve sufficient budget so OpenRouter :free reasoning models still emit visible content
    { ...input, maxTokens: Math.max(input.maxTokens, 1024) },
    {
      "HTTP-Referer": "https://adriansyahabidin.vercel.app",
      "X-Title": "Ask Adrian Portfolio Assistant",
    },
    { reasoning: { effort: "low" } }
  );
}
