import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AdrianMascot, type MascotState } from "@/features/chatbot/mascot/AdrianMascot";
import { ChatAssistant } from "@/features/chatbot/ChatAssistant";
import ChatWidget from "@/features/chatbot/ChatWidget";
import { CHAT_GREETINGS, CHAT_SUGGESTED_QUESTIONS, type ChatMessageItem } from "@/features/chatbot/types";
import { matchPresetFaq } from "@/server/chatbot/faq";

let mockQualityMode: "cinematic" | "balanced" | "reduced" = "cinematic";
let mockChatState = {
  messages: [
    {
      id: "greet-en",
      role: "assistant",
      text: CHAT_GREETINGS.en,
      isGreeting: true,
    },
  ] as ChatMessageItem[],
  settings: { language: "auto" as const, detail: "concise" as const },
  displayLang: "en" as "en" | "id",
  isStreaming: false,
  sendMessage: vi.fn(),
  stopGeneration: vi.fn(),
  retryLast: vi.fn(),
  clearConversation: vi.fn(),
  updateSettings: vi.fn(),
};

vi.mock("@/context/MotionContext", () => ({
  useMotion: () => ({
    qualityMode: mockQualityMode,
    preference: "auto",
    setPreference: vi.fn(),
    canHover: true,
    isClient: true,
    osReducedMotion: mockQualityMode === "reduced",
  }),
}));

vi.mock("@/features/chatbot/usePortfolioChat", () => ({
  usePortfolioChat: () => mockChatState,
}));

describe("Sprint 9.3: Ask Adrian Animated Chibi Mascot & Conversational UI", () => {
  beforeEach(() => {
    mockQualityMode = "cinematic";
    mockChatState = {
      messages: [
        {
          id: "greet-en",
          role: "assistant",
          text: CHAT_GREETINGS.en,
          isGreeting: true,
        },
      ],
      settings: { language: "auto", detail: "concise" },
      displayLang: "en",
      isStreaming: false,
      sendMessage: vi.fn(),
      stopGeneration: vi.fn(),
      retryLast: vi.fn(),
      clearConversation: vi.fn(),
      updateSettings: vi.fn(),
    };
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("renders layered chibi mascot states cleanly with thinking indicator strictly during active thinking", () => {
    const states: MascotState[] = [
      "idle",
      "waving",
      "hover",
      "invitation",
      "clicked",
      "thinking",
      "responding",
    ];

    for (const state of states) {
      const { container, unmount } = render(<AdrianMascot state={state} variant="fab" />);
      const mascot = screen.getByTestId("adrian-mascot");
      expect(mascot).toHaveAttribute("data-mascot-state", state);
      expect(container.querySelector('[data-mascot-part="aura"]')).not.toBeNull();
      expect(container.querySelector('[data-mascot-part="head"]')).not.toBeNull();
      expect(container.querySelector('[data-mascot-part="eyes"]')).not.toBeNull();
      expect(container.querySelector('[data-mascot-part="mouth"]')).not.toBeNull();
      expect(container.querySelector('[data-mascot-part="arm"]')).not.toBeNull();

      const thinkingDots = container.querySelector('[data-mascot-part="thinking-dots"]');
      if (state === "thinking") {
        expect(thinkingDots).not.toBeNull();
      } else {
        expect(thinkingDots).toBeNull();
      }
      unmount();
    }

    render(<AdrianMascot state="waving" variant="fab" reducedMotion />);
    expect(screen.getByTestId("adrian-mascot")).toHaveAttribute("data-reduced-motion", "true");
  });

  it("shows periodic waving/invitation without auto-opening, moves single mascot to header, and removes redundant X FAB", async () => {
    vi.useFakeTimers();
    render(<ChatAssistant />);

    const fab = screen.getByRole("button", { name: "Open Ask Adrian AI assistant" });
    expect(fab).toBeInTheDocument();
    expect(screen.getAllByTestId("adrian-mascot")).toHaveLength(1);
    expect(screen.queryByRole("dialog")).toBeNull();

    // Hover triggers hover state naturally
    fireEvent.pointerEnter(fab);
    expect(screen.getByTestId("adrian-mascot")).toHaveAttribute("data-mascot-state", "hover");
    fireEvent.pointerLeave(fab);

    // Periodic attention & invitation appear briefly without opening chatbot
    act(() => {
      vi.advanceTimersByTime(4500);
    });
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.getByTestId("mascot-invitation-pill")).toBeVisible();

    // Clicking FAB opens dialog, removes redundant X FAB, and keeps max 1 mascot visible
    vi.useRealTimers();
    fireEvent.click(fab);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    expect(screen.queryByRole("button", { name: /Close Ask Adrian AI assistant/i })).toBeNull();
    await waitFor(() => {
      expect(screen.getAllByTestId("adrian-mascot")).toHaveLength(1);
    });

    // Header Close returns focus cleanly to FAB launcher
    const closeBtn = screen.getByRole("button", { name: "Close chat" });
    fireEvent.click(closeBtn);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Open Ask Adrian AI assistant" })).toHaveFocus();
    });
  });

  it("uses simplified bilingual greetings, 3 suggested prompts that hit local FAQ cleanly, and removes composer footer", () => {
    expect(CHAT_GREETINGS.en).toBe("Hi! Want to know more about Adrian’s work, skills, or projects?");
    expect(CHAT_GREETINGS.id).toBe(
      "Halo! Mau tahu lebih banyak tentang pengalaman, keahlian, atau proyek Adrian?"
    );
    expect(CHAT_SUGGESTED_QUESTIONS.en).toEqual([
      "Work experience",
      "Featured projects",
      "Technical skills",
    ]);
    expect(CHAT_SUGGESTED_QUESTIONS.id).toEqual([
      "Pengalaman kerja",
      "Proyek unggulan",
      "Keahlian teknis",
    ]);

    for (const q of CHAT_SUGGESTED_QUESTIONS.en) {
      expect(matchPresetFaq(q, "en")?.id).toBeTruthy();
    }
    for (const q of CHAT_SUGGESTED_QUESTIONS.id) {
      expect(matchPresetFaq(q, "id")?.id).toBeTruthy();
    }

    render(<ChatWidget onClose={vi.fn()} />);
    expect(screen.getByText("AI assistant")).toBeInTheDocument();
    expect(screen.queryByText(/Avoid sharing sensitive data/i)).toBeNull();
    expect(screen.queryByText(/Based on portfolio info/i)).toBeNull();
  });

  it("clearly separates right-aligned muted-cyan user bubbles from left-aligned dark-graphite assistant bubbles", () => {
    mockChatState.messages = [
      { id: "u1", role: "user", text: "Work experience" },
      { id: "a1", role: "assistant", text: "Berijalan Techno Center & Qiscus." },
    ];
    render(<ChatWidget onClose={vi.fn()} />);

    const userText = screen.getByText("Work experience");
    const userBubble = userText.parentElement!;
    const userRow = userBubble.parentElement!;
    expect(userRow.className).toContain("items-end");
    expect(userBubble.className).toContain("bg-[#0F2B3C]");
    expect(userBubble.className).toContain("text-[#F2F0EC]");

    const assistantText = screen.getByText("Berijalan Techno Center & Qiscus.");
    const assistantBubble = assistantText.closest("div.box-border")!;
    const assistantRow = assistantBubble.parentElement!;
    expect(assistantRow.className).toContain("items-start");
    expect(assistantBubble.className).toContain("bg-[#15171C]");
    expect(assistantBubble.className).toContain("text-[#E6E4DF]");
  });

  it("syncs thinking/responding mascot state strictly to real requests and preserves scrolled-up reading position", () => {
    const onMascotStateChange = vi.fn();
    mockChatState.messages = [
      { id: "u1", role: "user", text: "Tell me more" },
      { id: "a1", role: "assistant", text: "" },
    ];
    mockChatState.isStreaming = true;

    const { rerender } = render(
      <ChatWidget onClose={vi.fn()} onMascotStateChange={onMascotStateChange} showHeaderMascot />
    );
    expect(onMascotStateChange).toHaveBeenLastCalledWith("thinking");
    expect(screen.getByTestId("adrian-mascot")).toHaveAttribute("data-mascot-state", "thinking");

    const thread = screen.getByRole("dialog").querySelector('[aria-live="polite"]') as HTMLDivElement;
    Object.defineProperty(thread, "scrollHeight", { value: 900, configurable: true });
    Object.defineProperty(thread, "clientHeight", { value: 300, configurable: true });
    thread.scrollTop = 60;
    fireEvent.scroll(thread);

    mockChatState.messages = [
      { id: "u1", role: "user", text: "Tell me more" },
      { id: "a1", role: "assistant", text: "Streaming answer token..." },
    ];
    rerender(
      <ChatWidget onClose={vi.fn()} onMascotStateChange={onMascotStateChange} showHeaderMascot />
    );
    expect(onMascotStateChange).toHaveBeenLastCalledWith("responding");
    expect(thread.scrollTop).toBe(60);

    mockChatState.isStreaming = false;
    rerender(
      <ChatWidget onClose={vi.fn()} onMascotStateChange={onMascotStateChange} showHeaderMascot />
    );
    expect(onMascotStateChange).toHaveBeenLastCalledWith("idle");
  });

  it("renders redesigned Settings panel with Language (Auto/Indonesia/English), Response style, Clear chat, and About & Privacy", () => {
    render(<ChatWidget onClose={vi.fn()} />);

    expect(screen.queryByTestId("chat-settings-panel")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Chat settings" }));

    const settingsPanel = screen.getByTestId("chat-settings-panel");
    expect(settingsPanel).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Indonesia" }));
    expect(mockChatState.updateSettings).toHaveBeenCalledWith({ language: "id" });

    fireEvent.click(screen.getByRole("button", { name: "Detailed" }));
    expect(mockChatState.updateSettings).toHaveBeenCalledWith({ detail: "detailed" });

    fireEvent.click(screen.getByRole("button", { name: /Clear chat/i }));
    expect(mockChatState.clearConversation).toHaveBeenCalledTimes(1);

    expect(settingsPanel).toHaveTextContent(/About & Privacy/i);
    expect(settingsPanel).not.toHaveTextContent(/groq|gemini|openrouter|api key/i);
  });
});
