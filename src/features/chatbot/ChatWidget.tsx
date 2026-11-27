"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUp,
  ArrowUpRight,
  RotateCcw,
  SlidersHorizontal,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { SafeChatMarkdown } from "./renderSafeText";
import { CHAT_SUGGESTED_QUESTIONS } from "./types";
import { usePortfolioChat } from "./usePortfolioChat";

interface ChatWidgetProps {
  onClose: () => void;
}

export default function ChatWidget({ onClose }: ChatWidgetProps) {
  const {
    messages,
    settings,
    displayLang,
    isStreaming,
    sendMessage,
    stopGeneration,
    retryLast,
    clearConversation,
    updateSettings,
  } = usePortfolioChat();

  const [inputValue, setInputValue] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = inputValue.trim();
    if (!text || isStreaming) return;
    setInputValue("");
    void sendMessage(text);
  };

  const suggested = CHAT_SUGGESTED_QUESTIONS[displayLang];
  const onlyGreeting = messages.length <= 1;

  return (
    <section
      id="ask-adrian-dialog"
      role="dialog"
      aria-labelledby="ask-adrian-title"
      className="fixed inset-x-3 bottom-3 top-14 z-50 flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0D0F14] text-[#F2F0EC] shadow-[0_24px_64px_rgba(0,0,0,0.75)] sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[min(600px,calc(100svh-8rem))] sm:w-[min(400px,calc(100vw-2.5rem))] sm:bg-[#0D0F14]/98"
    >
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[#15171C] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#65C8F5]/50 bg-[#08090C]">
            <Image
              src="/images/avatar/professional-chibi.webp"
              alt="Ask Adrian avatar"
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h2
              id="ask-adrian-title"
              className="truncate font-display text-sm font-semibold tracking-tight text-[#F2F0EC]"
            >
              Ask Adrian
            </h2>
            <p className="truncate text-[11px] text-[#A7ADB7]">
              {displayLang === "id" ? "Asisten AI · ID" : "AI assistant · EN"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSettingsOpen((prev) => !prev)}
            aria-label="Chat settings"
            aria-expanded={settingsOpen}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-[#65C8F5] ${
              settingsOpen
                ? "bg-[#1C1F26] text-[#65C8F5]"
                : "text-[#A7ADB7] hover:bg-white/5 hover:text-[#F2F0EC]"
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={clearConversation}
            aria-label="Clear conversation"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#A7ADB7] transition-colors hover:bg-white/5 hover:text-[#F2F0EC] focus-visible:outline-2 focus-visible:outline-[#65C8F5]"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#A7ADB7] transition-colors hover:bg-white/5 hover:text-[#F2F0EC] focus-visible:outline-2 focus-visible:outline-[#65C8F5]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Collapsible Visitor Preferences (strictly no API/provider controls) */}
      {settingsOpen && (
        <div className="shrink-0 space-y-2.5 border-b border-white/10 bg-[#15171C]/90 px-4 py-3 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[#A7ADB7]">
              {displayLang === "id" ? "Bahasa" : "Language"}
            </span>
            <div role="group" aria-label="Chat language" className="flex gap-1">
              {(["auto", "id", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  aria-pressed={settings.language === lang}
                  onClick={() => updateSettings({ language: lang })}
                  className={`min-h-[34px] rounded-full px-3 text-[11px] font-medium transition-colors ${
                    settings.language === lang
                      ? "bg-[#65C8F5]/20 text-[#65C8F5] ring-1 ring-[#65C8F5]/40"
                      : "bg-[#08090C] text-[#A7ADB7] hover:text-[#F2F0EC]"
                  }`}
                >
                  {lang === "auto" ? "Auto" : lang === "id" ? "ID" : "EN"}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="text-[#A7ADB7]">
              {displayLang === "id" ? "Gaya jawaban" : "Detail"}
            </span>
            <div role="group" aria-label="Response detail" className="flex gap-1">
              {(["concise", "detailed"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={settings.detail === mode}
                  onClick={() => updateSettings({ detail: mode })}
                  className={`min-h-[34px] rounded-full px-3 text-[11px] font-medium transition-colors ${
                    settings.detail === mode
                      ? "bg-[#65C8F5]/20 text-[#65C8F5] ring-1 ring-[#65C8F5]/40"
                      : "bg-[#08090C] text-[#A7ADB7] hover:text-[#F2F0EC]"
                  }`}
                >
                  {mode === "concise"
                    ? displayLang === "id"
                      ? "Ringkas"
                      : "Concise"
                    : displayLang === "id"
                      ? "Detail"
                      : "Detailed"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Conversation Thread */}
      <div
        ref={threadRef}
        data-lenis-prevent
        aria-live="polite"
        className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
      >
        {messages.map((msg, idx) => {
          const isUser = msg.role === "user";
          const isLastAssistant = idx === messages.length - 1 && !isUser;
          const isEmptyStreaming = isLastAssistant && isStreaming && !msg.text;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-[13px] ${
                  isUser
                    ? "bg-[#1C1F26] text-[#F2F0EC] ring-1 ring-white/10"
                    : "border border-white/10 bg-[#15171C] text-[#E6E4DF]"
                }`}
              >
                {isEmptyStreaming ? (
                  <p className="font-mono text-xs text-[#A7ADB7]">
                    {displayLang === "id" ? "Menyusun jawaban..." : "Thinking..."}
                  </p>
                ) : isUser ? (
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                ) : (
                  <SafeChatMarkdown text={msg.text} />
                )}

                {!isUser && !msg.isGreeting && (msg.mode === "local-faq" || msg.mode === "local-fallback") && (
                  <p className="mt-2 font-mono text-[10px] text-[#A7ADB7]">
                    {msg.mode === "local-faq"
                      ? displayLang === "id"
                        ? "FAQ portofolio lokal"
                        : "Verified local FAQ"
                      : displayLang === "id"
                        ? "Basis pengetahuan lokal"
                        : "Local portfolio fallback"}
                  </p>
                )}

                {!isUser && msg.links && msg.links.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {msg.links.map((link) =>
                      link.href.startsWith("/") ? (
                        <Link
                          key={`${msg.id}-${link.href}`}
                          href={link.href}
                          prefetch={false}
                          className="inline-flex min-h-[32px] items-center gap-1 rounded-lg border border-white/15 bg-[#08090C] px-2.5 py-1 text-[11px] font-medium text-[#65C8F5] transition-colors hover:border-[#65C8F5] hover:text-[#F2F0EC]"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </Link>
                      ) : (
                        <a
                          key={`${msg.id}-${link.href}`}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[32px] items-center gap-1 rounded-lg border border-white/15 bg-[#08090C] px-2.5 py-1 text-[11px] font-medium text-[#65C8F5] transition-colors hover:border-[#65C8F5] hover:text-[#F2F0EC]"
                        >
                          <span>{link.label}</span>
                          <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </a>
                      )
                    )}
                  </div>
                )}

                {!isUser && msg.interrupted && !isStreaming && (
                  <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-white/10 pt-2">
                    <span className="text-[11px] text-[#A7ADB7]">
                      {displayLang === "id" ? "Jawaban terhenti" : "Incomplete response"}
                    </span>
                    <button
                      type="button"
                      onClick={retryLast}
                      className="inline-flex min-h-[36px] items-center gap-1 rounded-lg border border-white/15 bg-[#08090C] px-2.5 py-1 text-[11px] font-medium text-[#F2F0EC] hover:border-[#65C8F5] hover:text-[#65C8F5]"
                    >
                      <RotateCcw className="h-3 w-3" aria-hidden="true" />
                      <span>{displayLang === "id" ? "Coba lagi" : "Retry"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {onlyGreeting && !isStreaming && (
          <div className="space-y-2 pt-1">
            {suggested.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => void sendMessage(question)}
                className="flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl border border-white/12 bg-[#08090C] px-3.5 py-2 text-left text-[13px] text-[#F2F0EC] transition-colors hover:border-[#65C8F5] focus-visible:outline-2 focus-visible:outline-[#65C8F5]"
              >
                <span>{question}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#65C8F5]" aria-hidden="true" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Composer Footer */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 space-y-2 border-t border-white/10 bg-[#0D0F14] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <div className="flex items-end gap-2">
          <label htmlFor="ask-adrian-input" className="sr-only">
            {displayLang === "id" ? "Tanyakan tentang Adrian" : "Ask about Adrian"}
          </label>
          <textarea
            ref={inputRef}
            id="ask-adrian-input"
            rows={1}
            maxLength={1000}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={displayLang === "id" ? "Tanya pengalaman atau proyek..." : "Ask about Adrian..."}
            className="min-h-[44px] max-h-28 flex-1 resize-none rounded-2xl border border-white/15 bg-[#15171C] px-3.5 py-2.5 text-sm text-[#F2F0EC] placeholder:text-[#A7ADB7] focus:border-[#65C8F5] focus:outline-none"
          />

          {isStreaming ? (
            <button
              type="button"
              onClick={stopGeneration}
              aria-label={displayLang === "id" ? "Hentikan respons" : "Stop response"}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#1C1F26] text-[#F2F0EC] transition-colors hover:border-[#65C8F5] focus-visible:outline-2 focus-visible:outline-[#65C8F5]"
            >
              <Square className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!inputValue.trim()}
              aria-label={displayLang === "id" ? "Kirim pesan" : "Send message"}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F2F0EC] text-[#08090C] transition-colors hover:bg-[#65C8F5] disabled:cursor-not-allowed disabled:bg-[#1C1F26] disabled:text-[#A7ADB7] focus-visible:outline-2 focus-visible:outline-[#65C8F5]"
            >
              <ArrowUp className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <p className="text-[11px] text-[#A7ADB7]">
          {displayLang === "id"
            ? "Asisten AI · Berdasarkan informasi portofolio · Hindari mengirim data sensitif"
            : "AI assistant · Based on portfolio info · Avoid sharing sensitive data"}
        </p>
      </form>
    </section>
  );
}
