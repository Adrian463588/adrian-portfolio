import type { ProviderGenerateInput } from "../types";
import { executeOpenAiCompatibleChat } from "./shared";

const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export async function generateWithGroq(
  input: ProviderGenerateInput
): Promise<{ text: string; interrupted: boolean }> {
  return executeOpenAiCompatibleChat(GROQ_ENDPOINT, input);
}
