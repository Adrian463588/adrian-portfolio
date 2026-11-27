import type { ChatDetailLevel, ChatLanguage, ResponseMode, VerifiedLink } from "@/server/chatbot/types";

export interface ChatMessageItem {
  id: string;
  role: "user" | "assistant";
  text: string;
  links?: VerifiedLink[];
  mode?: ResponseMode;
  provider?: string;
  interrupted?: boolean;
  isGreeting?: boolean;
}

export interface ChatSettingsState {
  language: ChatLanguage;
  detail: ChatDetailLevel;
}

export const CHAT_SUGGESTED_QUESTIONS = {
  id: [
    "Apa pengalaman kerjanya?",
    "Apa proyek unggulannya?",
    "Apa keahlian teknisnya?",
  ],
  en: [
    "What is his work experience?",
    "What are his featured projects?",
    "What is his technical stack?",
  ],
} as const;

export const CHAT_GREETINGS = {
  id: "Halo! Saya **Ask Adrian**, asisten AI portofolio untuk Adrian Syah Abidin. Silakan tanyakan pengalaman kerja, proyek, atau keahlian teknisnya.",
  en: "Hello! I'm **Ask Adrian**, an AI portfolio assistant representing Adrian Syah Abidin. Ask me about his experience, projects, or technical skills.",
} as const;
