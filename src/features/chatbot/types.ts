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
  id: ["Pengalaman kerja", "Proyek unggulan", "Keahlian teknis"],
  en: ["Work experience", "Featured projects", "Technical skills"],
} as const;

export const CHAT_GREETINGS = {
  id: "Halo! Mau tahu lebih banyak tentang pengalaman, keahlian, atau proyek Adrian?",
  en: "Hi! Want to know more about Adrian’s work, skills, or projects?",
} as const;
