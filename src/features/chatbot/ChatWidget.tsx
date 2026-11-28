"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, RotateCcw, SlidersHorizontal, Square, Trash2, X } from "lucide-react";
import { SafeChatMarkdown } from "./renderSafeText";
import { CHAT_SUGGESTED_QUESTIONS } from "./types";
import { usePortfolioChat } from "./usePortfolioChat";
import { AdrianMascot, type MascotState } from "./mascot/AdrianMascot";

const LINK_CHIP_CLASS =
  "inline-flex min-h-[32px] min-w-0 max-w-full items-center gap-1 rounded-lg border border-white/15 bg-[#08090C] px-2.5 py-1 text-left text-[11px] font-medium text-[#65C8F5] transition-colors hover:border-[#65C8F5] hover:text-[#F2F0EC]";

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
}

function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const count = options.length;

  return (
    <div
      role="group"
      aria-label={label}
      className="relative grid rounded-xl border border-white/10 bg-[#08090C] p-0.5"
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0.5 left-0.5 rounded-[9px] border border-[#65C8F5]/45 bg-[#132939] shadow-sm transition-transform duration-200 ease-out"
        style={{
          width: `calc((100% - 4px) / ${count})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`relative z-10 min-h-[36px] rounded-[9px] px-2 text-center text-[11px] font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-[#65C8F5] ${
              isActive ? "text-[#F2F0EC]" : "text-[#A7ADB7] hover:text-[#F2F0EC]"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

interface ChatWidgetProps {
  onClose: () => void;
  showHeaderMascot?: boolean;
  mascotState?: MascotState;
  reducedMotion?: boolean;
  onMascotStateChange?: (state: MascotState) => void;
  onRegisterMascotSlot?: (el: HTMLDivElement | null) => void;
  onRegisterDialog?: (el: HTMLElement | null) => void;
}

export default function ChatWidget({
  onClose,
  showHeaderMascot = true,
  mascotState,
  reducedMotion = false,
  onMascotStateChange,
  onRegisterMascotSlot,
  onRegisterDialog,
}: ChatWidgetProps) {
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
  const [mascotHovered, setMascotHovered] = useState(false);

  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const prevMsgCountRef = useRef(messages.length);

  const registerDialog = useCallback((el: HTMLElement | null) => {
    dialogRef.current = el;
    onRegisterDialog?.(el);
  }, [onRegisterDialog]);

  const closeChat = useCallback(() => {
    if (document.activeElement === inputRef.current) inputRef.current?.blur();
    onClose();
  }, [onClose]);

  const lastMessage = messages[messages.length - 1];
  const onlyGreeting = messages.length <= 1;
  const isWaitingFirstToken = isStreaming && lastMessage?.role === "assistant" && !lastMessage.text;
  const isRespondingTokens =
    isStreaming && lastMessage?.role === "assistant" && Boolean(lastMessage.text);

  const derivedMascotState: MascotState = isWaitingFirstToken
    ? "thinking"
    : isRespondingTokens
      ? "responding"
      : mascotHovered
        ? "hover"
        : "idle";

  const activeMascotState = mascotState ?? derivedMascotState;

  useEffect(() => {
    onMascotStateChange?.(derivedMascotState);
  }, [derivedMascotState, onMascotStateChange]);

  useLayoutEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !e.isComposing) closeChat();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeChat]);

  useLayoutEffect(() => {
    const touchCapable = navigator.maxTouchPoints > 0 || window.matchMedia?.("(any-pointer: coarse)").matches;
    (touchCapable ? closeRef : inputRef).current?.focus({ preventScroll: true });
  }, []);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const viewport = window.visualViewport;
    if (!dialog || !viewport) return;

    const updateViewport = () => {
      // Leave browser zoom behavior intact. At normal scale, follow keyboard resize and panning.
      if (viewport.scale !== 1) {
        dialog.style.removeProperty("--chat-viewport-height");
        dialog.style.removeProperty("--chat-viewport-bottom");
        return;
      }

      const bottom = document.documentElement.clientHeight - viewport.offsetTop - viewport.height;
      dialog.style.setProperty("--chat-viewport-height", `${viewport.height}px`);
      dialog.style.setProperty("--chat-viewport-bottom", `${Math.max(0, bottom)}px`);
    };

    updateViewport();
    viewport.addEventListener("resize", updateViewport);
    viewport.addEventListener("scroll", updateViewport);
    return () => {
      viewport.removeEventListener("resize", updateViewport);
      viewport.removeEventListener("scroll", updateViewport);
    };
  }, []);

  useEffect(() => {
    if (messages.length > prevMsgCountRef.current && lastMessage?.role === "user") {
      shouldAutoScrollRef.current = true;
    }
    prevMsgCountRef.current = messages.length;

    if (onlyGreeting) shouldAutoScrollRef.current = true;
    const thread = threadRef.current;
    if (shouldAutoScrollRef.current && thread) {
      thread.scrollTop = onlyGreeting ? 0 : thread.scrollHeight;
    }
  }, [messages, isStreaming, lastMessage, onlyGreeting]);

  useEffect(() => {
    const thread = threadRef.current;
    if (onlyGreeting || !thread || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => {
      if (shouldAutoScrollRef.current) thread.scrollTop = thread.scrollHeight;
    });
    observer.observe(thread);
    return () => observer.disconnect();
  }, [onlyGreeting]);

  const handleThreadScroll = () => {
    const el = threadRef.current;
    if (!el) return;
    shouldAutoScrollRef.current = el.scrollHeight - el.scrollTop - el.clientHeight <= 56;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = inputValue.trim();
    if (!text || isStreaming) return;
    shouldAutoScrollRef.current = true;
    setInputValue("");
    void sendMessage(text);
  };

  const suggested = CHAT_SUGGESTED_QUESTIONS[displayLang];

  return (
    <section
      ref={registerDialog}
      id="ask-adrian-dialog"
      role="dialog"
      aria-labelledby="ask-adrian-title"
      data-lenis-prevent
      className="ask-adrian-panel fixed z-50 flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#0D0F14]/98 text-[#F2F0EC] shadow-[0_24px_64px_rgba(0,0,0,0.78)] backdrop-blur-md"
    >
      {/* Header */}
      <header className="ask-adrian-header flex shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-[#15171C] px-4 py-2 [@media(min-height:32rem)]:sm:py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            ref={onRegisterMascotSlot}
            onPointerEnter={() => setMascotHovered(true)}
            onPointerLeave={() => setMascotHovered(false)}
            className="relative h-10 w-10 shrink-0 rounded-full"
          >
            {showHeaderMascot && (
              <AdrianMascot
                state={activeMascotState}
                variant="header"
                reducedMotion={reducedMotion}
                className="h-10 w-10"
              />
            )}
          </div>
          <div className="min-w-0">
            <h2
              id="ask-adrian-title"
              className="truncate font-display text-sm font-semibold tracking-tight text-[#F2F0EC]"
            >
              Ask Adrian
            </h2>
            <p className="truncate text-[11px] text-[#A7ADB7]">
              {displayLang === "id" ? "Asisten AI" : "AI assistant"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
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
            ref={closeRef}
            type="button"
            onClick={closeChat}
            aria-label="Close chat"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-[#A7ADB7] transition-colors hover:bg-white/5 hover:text-[#F2F0EC] focus-visible:outline-2 focus-visible:outline-[#65C8F5]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </header>

      <div className="ask-adrian-body flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* Compact Animated Settings Panel */}
        {settingsOpen && (
          <div
            data-testid="chat-settings-panel"
            className="chat-settings-animated max-h-[65%] shrink-0 overflow-y-auto overscroll-contain border-b border-white/10 bg-[#12151C]/95 px-4 py-3 text-xs backdrop-blur-md"
          >
            <div className="space-y-3">
              <div className="space-y-1.5">
                <span className="block text-[11px] font-medium text-[#A7ADB7]">
                  {displayLang === "id" ? "Bahasa" : "Language"}
                </span>
                <SegmentedControl
                  label="Language"
                  value={settings.language}
                  options={[
                    { value: "auto", label: "Auto" },
                    { value: "id", label: "Indonesia" },
                    { value: "en", label: "English" },
                  ]}
                  onChange={(language) => updateSettings({ language })}
                />
              </div>

              <div className="space-y-1.5">
                <span className="block text-[11px] font-medium text-[#A7ADB7]">
                  {displayLang === "id" ? "Gaya jawaban" : "Response style"}
                </span>
                <SegmentedControl
                  label="Response style"
                  value={settings.detail}
                  options={[
                    { value: "concise", label: displayLang === "id" ? "Ringkas" : "Concise" },
                    { value: "detailed", label: displayLang === "id" ? "Detail" : "Detailed" },
                  ]}
                  onChange={(detail) => updateSettings({ detail })}
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-0.5">
                <span className="text-[11px] font-medium text-[#A7ADB7]">
                  {displayLang === "id" ? "Percakapan" : "Conversation"}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clearConversation();
                    setSettingsOpen(false);
                  }}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-white/12 bg-[#08090C] px-3 py-1.5 text-[11px] font-medium text-[#F2F0EC] transition-colors hover:border-[#65C8F5]/60 hover:text-[#65C8F5] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-[#65C8F5]"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{displayLang === "id" ? "Hapus obrolan" : "Clear chat"}</span>
                </button>
              </div>

              <div className="border-t border-white/10 pt-2.5">
                <p className="text-[11px] font-medium text-[#F2F0EC]">
                  {displayLang === "id" ? "Tentang & Privasi" : "About & Privacy"}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#A7ADB7]">
                  {displayLang === "id"
                    ? "Jawaban disusun berdasarkan informasi portofolio terverifikasi dan diproses oleh penyedia AI. Hindari mengirim data pribadi sensitif."
                    : "Answers use verified portfolio data and are processed by external AI providers. Avoid sharing sensitive personal data."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Conversation Thread */}
        <div
          ref={threadRef}
          onScroll={handleThreadScroll}
          role="region"
          aria-label={displayLang === "id" ? "Riwayat obrolan" : "Chat history"}
          aria-live="polite"
          tabIndex={0}
          className="ask-adrian-thread min-h-0 min-w-0 flex-1 space-y-3 overflow-x-hidden overflow-y-auto overscroll-contain px-3.5 py-3 focus-visible:-outline-offset-2 sm:px-4 sm:py-4"
        >
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            const isLastAssistant = idx === messages.length - 1 && !isUser;
            const isEmptyStreaming = isLastAssistant && isStreaming && !msg.text;

            return (
              <div
                key={msg.id}
                className={`flex min-w-0 max-w-full flex-col ${isUser ? "items-end" : "items-start"}`}
              >
                <div
                  className={`box-border min-w-0 max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] [overflow-wrap:anywhere] ${
                    isUser
                      ? "rounded-br-sm border border-[#65C8F5]/30 bg-[#0F2B3C] text-[#F2F0EC]"
                      : "rounded-bl-sm border border-white/10 bg-[#15171C] text-[#E6E4DF]"
                  }`}
                >
                  {isEmptyStreaming ? (
                    <p className="font-mono text-xs text-[#65C8F5]">
                      {displayLang === "id" ? "Menyusun jawaban..." : "Thinking..."}
                    </p>
                  ) : isUser ? (
                    <p className="min-w-0 max-w-full whitespace-pre-wrap leading-relaxed [overflow-wrap:anywhere]">
                      {msg.text}
                    </p>
                  ) : (
                    <SafeChatMarkdown text={msg.text} />
                  )}

                  {!isUser &&
                    !msg.isGreeting &&
                    (msg.mode === "local-faq" || msg.mode === "local-fallback") && (
                      <p className="mt-2 min-w-0 max-w-full font-mono text-[10px] text-[#A7ADB7] [overflow-wrap:anywhere]">
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
                    <div className="mt-2.5 flex min-w-0 max-w-full flex-wrap gap-1.5">
                      {msg.links.map((link) =>
                        link.href.startsWith("/") ? (
                          <Link
                            key={`${msg.id}-${link.href}`}
                            href={link.href}
                            prefetch={false}
                            className={LINK_CHIP_CLASS}
                          >
                            <span className="min-w-0 [overflow-wrap:anywhere]">{link.label}</span>
                            <ArrowUpRight className="h-3 w-3 shrink-0" aria-hidden="true" />
                          </Link>
                        ) : (
                          <a
                            key={`${msg.id}-${link.href}`}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={LINK_CHIP_CLASS}
                          >
                            <span className="min-w-0 [overflow-wrap:anywhere]">{link.label}</span>
                            <ArrowUpRight className="h-3 w-3 shrink-0" aria-hidden="true" />
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
                  className="flex min-h-[44px] w-full min-w-0 items-center justify-between gap-2 rounded-xl border border-white/12 bg-[#08090C] px-3.5 py-2 text-left text-[13px] text-[#F2F0EC] transition-colors hover:border-[#65C8F5] focus-visible:outline-2 focus-visible:outline-[#65C8F5]"
                >
                  <span className="min-w-0 [overflow-wrap:anywhere]">{question}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#65C8F5]" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        className="ask-adrian-composer shrink-0 border-t border-white/10 bg-[#0D0F14] px-3.5 py-2 [@media(min-height:32rem)]:sm:py-3"
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
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={
              displayLang === "id" ? "Tanya pengalaman atau proyek..." : "Ask about Adrian..."
            }
            className="min-h-[44px] max-h-28 min-w-0 flex-1 resize-none rounded-2xl border border-white/15 bg-[#15171C] px-3.5 py-2.5 text-sm text-[#F2F0EC] placeholder:text-[#A7ADB7] focus:border-[#65C8F5] focus:outline-none [@media(any-pointer:coarse)]:text-base"
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
      </form>
    </section>
  );
}
