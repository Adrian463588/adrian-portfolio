import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SafeChatMarkdown } from "@/features/chatbot/renderSafeText";
import ChatWidget from "@/features/chatbot/ChatWidget";

vi.mock("@/features/chatbot/usePortfolioChat", () => ({
  usePortfolioChat: () => ({
    messages: [
      {
        id: "user-long",
        role: "user",
        text: "Check https://github.com/Adrian463588/Eksperimen_SML_AdrianSyahAbidin_super_long_repository_slug_without_breaks",
      },
      {
        id: "assistant-long",
        role: "assistant",
        text: [
          "- Repo: `Adrian463588/Eksperimen_SML_AdrianSyahAbidin_super_long_repository_slug`",
          "- Docs: [VeryLongLinkWithoutSpacesLabel](https://github.com/Adrian463588/AutomatePlus)",
          "",
          "```bash",
          "curl -X POST https://adriansyahabidin.vercel.app/api/chat/ -H 'Content-Type: application/json' --data-raw 'long_unbroken_flag_argument_test'",
          "```",
        ].join("\n"),
        links: [
          {
            label: "Eksperimen_SML_AdrianSyahAbidin_Long_Project_Badge_Label Case Study",
            href: "/projects/eksperimen-sml-adrian-syah-abidin/",
          },
        ],
      },
    ],
    settings: { language: "en", detail: "concise" },
    displayLang: "en" as const,
    isStreaming: false,
    sendMessage: vi.fn(),
    stopGeneration: vi.fn(),
    retryLast: vi.fn(),
    clearConversation: vi.fn(),
    updateSettings: vi.fn(),
  }),
}));

describe("Ask Adrian ChatBubble overflow containment & Markdown security bounds", () => {
  it("applies min-w-0, max-w-full, and overflow-wrap:anywhere across thread, bubbles, and links", () => {
    const { container } = render(<ChatWidget onClose={vi.fn()} />);
    const thread = container.querySelector('[aria-live="polite"]');
    expect(thread?.className).toContain("min-w-0");
    expect(thread?.className).toContain("overflow-x-hidden");

    const userBubbleText = screen.getByText(/Eksperimen_SML_AdrianSyahAbidin_super_long_repository_slug_without_breaks/);
    expect(userBubbleText.className).toContain("[overflow-wrap:anywhere]");
    expect(userBubbleText.className).toContain("min-w-0");
    expect(userBubbleText.parentElement?.className).toContain("min-w-0");
    expect(userBubbleText.parentElement?.className).toContain("[overflow-wrap:anywhere]");

    const pre = container.querySelector("pre");
    expect(pre).not.toBeNull();
    expect(pre?.className).toContain("overflow-x-auto");
    expect(pre?.className).toContain("max-w-full");

    const linkChip = screen.getByRole("link", {
      name: /Eksperimen_SML_AdrianSyahAbidin_Long_Project_Badge_Label/,
    });
    expect(linkChip.className).toContain("max-w-full");
    expect(linkChip.className).toContain("min-w-0");
  });

  it("renders fenced code blocks cleanly (including partial streaming) and strips dangerous URLs/HTML", () => {
    const dangerousInput = [
      "Normal **bold** and [safe](/projects/) plus [relBypass](//evil.com/phish) and [creds](https://user:pass@evil.com)",
      "Bad scheme [xss](javascript:alert(1)) and <script>alert(1)</script>",
      "```ts",
      "const veryLongTokenName_abcdefghijklmnopqrstuvwxyz_0123456789 = true;",
      "// still streaming without closing fence",
    ].join("\n");

    const { container } = render(<SafeChatMarkdown text={dangerousInput} />);
    expect(container.querySelector("script")).toBeNull();
    expect(screen.getByRole("link", { name: "safe" }).getAttribute("href")).toMatch(/^\/projects\/?$/);
    expect(screen.queryByRole("link", { name: "relBypass" })).toBeNull();
    expect(screen.queryByRole("link", { name: "creds" })).toBeNull();
    expect(screen.queryByRole("link", { name: "xss" })).toBeNull();

    const pre = container.querySelector("pre");
    expect(pre).not.toBeNull();
    expect(pre?.textContent).toContain("veryLongTokenName_abcdefghijklmnopqrstuvwxyz_0123456789");
    expect(pre?.textContent).toContain("still streaming without closing fence");
  });

  it("enforces bounded Markdown truncation and excessive token guards safely", () => {
    const huge = Array.from({ length: 300 }, (_, i) => `- Line ${i}: ${"x".repeat(80)}`).join("\n");
    const { container } = render(<SafeChatMarkdown text={huge} />);
    expect(container.querySelectorAll("li").length).toBeLessThanOrEqual(60);
    expect(container.textContent?.length ?? 0).toBeLessThanOrEqual(12_100);
  });
});
