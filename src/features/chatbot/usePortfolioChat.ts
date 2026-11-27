"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatHistoryMessage, ResolvedLanguage, ResponseMode, VerifiedLink } from "@/server/chatbot/types";
import { CHAT_GREETINGS, type ChatMessageItem, type ChatSettingsState } from "./types";

const HISTORY_STORAGE_KEY = "ask-adrian-chat-v1";
const SETTINGS_STORAGE_KEY = "ask-adrian-settings-v1";

function createGreetingMessage(lang: ResolvedLanguage): ChatMessageItem {
  return {
    id: "greeting",
    role: "assistant",
    text: CHAT_GREETINGS[lang],
    mode: "local-faq",
    provider: "local",
    isGreeting: true,
  };
}

function resolveDisplayLanguage(setting: ChatSettingsState["language"]): ResolvedLanguage {
  if (setting === "id" || setting === "en") return setting;
  if (typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("id")) {
    return "id";
  }
  return "en";
}

export function usePortfolioChat() {
  const [settings, setSettingsState] = useState<ChatSettingsState>({
    language: "auto",
    detail: "concise",
  });
  const [messages, setMessages] = useState<ChatMessageItem[]>(() => [
    createGreetingMessage("id"),
  ]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastSubmittedPrompt, setLastSubmittedPrompt] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const hydratedRef = useRef(false);

  useEffect(() => {
    try {
      const savedSettings = sessionStorage.getItem(SETTINGS_STORAGE_KEY);
      let activeLang: ResolvedLanguage = resolveDisplayLanguage("auto");
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings) as Partial<ChatSettingsState>;
        const next: ChatSettingsState = {
          language: parsed.language === "id" || parsed.language === "en" ? parsed.language : "auto",
          detail: parsed.detail === "detailed" ? "detailed" : "concise",
        };
        setSettingsState(next);
        activeLang = resolveDisplayLanguage(next.language);
      }

      const savedMessages = sessionStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages) as ChatMessageItem[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          hydratedRef.current = true;
          return;
        }
      }
      setMessages([createGreetingMessage(activeLang)]);
    } catch {
      // sessionStorage unavailable
    }
    hydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      sessionStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    } catch {
      // ignore storage quota errors
    }
  }, [messages]);

  const updateSettings = useCallback((patch: Partial<ChatSettingsState>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch };
      try {
        sessionStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      if (patch.language) {
        const displayLang = resolveDisplayLanguage(next.language);
        setMessages((curr) =>
          curr.length === 1 && curr[0]?.isGreeting ? [createGreetingMessage(displayLang)] : curr
        );
      }
      return next;
    });
  }, []);

  const stopGeneration = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clearConversation = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setLastSubmittedPrompt(null);
    const displayLang = resolveDisplayLanguage(settings.language);
    const fresh = [createGreetingMessage(displayLang)];
    setMessages(fresh);
    try {
      sessionStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, [settings.language]);

  const sendMessage = useCallback(
    async (rawInput: string, options?: { isRetry?: boolean }) => {
      const prompt = rawInput.trim();
      if (!prompt || isStreaming) return;

      const userMsgId = `u-${Date.now()}`;
      const assistantMsgId = `a-${Date.now() + 1}`;
      setLastSubmittedPrompt(prompt);

      let historyForRequest: ChatHistoryMessage[] = [];
      setMessages((prev) => {
        const base =
          options?.isRetry && prev.length >= 2 && prev[prev.length - 1]?.role === "assistant"
            ? prev.slice(0, -2)
            : prev;

        historyForRequest = base
          .filter((m) => !m.isGreeting)
          .slice(-6)
          .map((m) => ({ role: m.role, content: m.text }));

        return [
          ...base,
          { id: userMsgId, role: "user", text: prompt },
          { id: assistantMsgId, role: "assistant", text: "" },
        ];
      });

      setIsStreaming(true);
      const controller = new AbortController();
      abortRef.current = controller;

      const displayLang = resolveDisplayLanguage(settings.language);

      try {
        const res = await fetch("/api/chat/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: prompt,
            history: historyForRequest,
            language: settings.language,
            detail: settings.detail,
            stream: true,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP_${res.status}`);
        }

        const contentType = res.headers.get("content-type")?.toLowerCase() ?? "";
        if (contentType.includes("text/event-stream") && res.body) {
          const reader = res.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let doneMeta: {
            text?: string;
            links?: VerifiedLink[];
            mode?: ResponseMode;
            provider?: string;
            interrupted?: boolean;
          } | null = null;

          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split(/\r?\n/);
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const rawPayload = trimmed.slice(5).trim();
              if (!rawPayload) continue;
              try {
                const evt = JSON.parse(rawPayload) as {
                  type?: string;
                  text?: string;
                  links?: VerifiedLink[];
                  mode?: ResponseMode;
                  provider?: string;
                  interrupted?: boolean;
                };
                if (evt.type === "delta" && evt.text) {
                  setMessages((curr) =>
                    curr.map((m) =>
                      m.id === assistantMsgId ? { ...m, text: m.text + evt.text } : m
                    )
                  );
                } else if (evt.type === "done") {
                  doneMeta = evt;
                }
              } catch {
                // ignore malformed keepalive frames
              }
            }
          }

          if (doneMeta) {
            setMessages((curr) =>
              curr.map((m) =>
                m.id === assistantMsgId
                  ? {
                      ...m,
                      text: doneMeta.text || m.text,
                      links: doneMeta.links,
                      mode: doneMeta.mode,
                      provider: doneMeta.provider,
                      interrupted: Boolean(doneMeta.interrupted),
                    }
                  : m
              )
            );
          }
        } else {
          const data = (await res.json()) as {
            text: string;
            links?: VerifiedLink[];
            mode?: ResponseMode;
            provider?: string;
            interrupted?: boolean;
          };
          setMessages((curr) =>
            curr.map((m) =>
              m.id === assistantMsgId
                ? {
                    ...m,
                    text: data.text,
                    links: data.links,
                    mode: data.mode,
                    provider: data.provider,
                    interrupted: Boolean(data.interrupted),
                  }
                : m
            )
          );
        }
      } catch (err) {
        const abortedByUser = err instanceof Error && err.name === "AbortError";
        setMessages((curr) =>
          curr.map((m) => {
            if (m.id !== assistantMsgId) return m;
            if (abortedByUser && m.text.trim().length > 0) {
              return { ...m, interrupted: true };
            }
            const fallbackMsg =
              displayLang === "id"
                ? abortedByUser
                  ? "Respons dihentikan sebelum selesai."
                  : "Koneksi sementara terganggu. Silakan coba lagi sebentar atau kunjungi bagian Projects & Contact."
                : abortedByUser
                  ? "Response stopped before completion."
                  : "Connection interrupted cleanly. Please click Retry or explore Adrian's Projects & Contact section.";
            return {
              ...m,
              text: m.text.trim() ? m.text : fallbackMsg,
              mode: "local-fallback",
              provider: "local",
              interrupted: true,
              links: [{ label: displayLang === "id" ? "Semua Proyek" : "Projects", href: "/projects/" }],
            };
          })
        );
      } finally {
        abortRef.current = null;
        setIsStreaming(false);
      }
    },
    [isStreaming, settings.detail, settings.language]
  );

  const retryLast = useCallback(() => {
    if (!lastSubmittedPrompt || isStreaming) return;
    void sendMessage(lastSubmittedPrompt, { isRetry: true });
  }, [isStreaming, lastSubmittedPrompt, sendMessage]);

  return {
    messages,
    settings,
    displayLang: resolveDisplayLanguage(settings.language),
    isStreaming,
    sendMessage,
    stopGeneration,
    retryLast,
    clearConversation,
    updateSettings,
  };
}
