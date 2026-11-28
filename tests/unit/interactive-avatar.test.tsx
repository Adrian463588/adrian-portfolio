import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChibiShowcase } from "@/components/avatar/ChibiShowcase";
import {
  AVATAR_EXPRESSION_STATES,
  AVATAR_IDLE_RESET_MS,
  AVATAR_VIDEO_URL,
  AVATAR_WINK_STATE,
  DEFAULT_AVATAR_IMAGE,
} from "@/components/avatar/avatarStates";
import { computeBubblePlacement } from "@/components/avatar/bubblePlacement";

vi.mock("@/hooks/useMotionCapabilities", () => ({
  useMotionCapabilities: () => ({ reducedMotion: false, canHover: true }),
}));

const avatar = () => screen.getByRole("button", { name: "Interact with Adrian's illustrated avatar" });
const dialogue = () => screen.getByRole("status");
const video = "https://youtu.be/dQw4w9WgXcQ";

const EXPECTED_SEQUENCE = [
  "Oh, hi there!",
  "Nice to see you!",
  "Haha, that tickles!",
  "Wait... again?",
  "Don't you have work to do?",
  "Hey! I'm trying to code!",
  "Alright... I've got something for you.",
] as const;

beforeEach(() => {
  vi.stubGlobal("Image", class {
    src = "";
    decode = () => Promise.resolve();
  });
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("Adaptive external bubble placement engine", () => {
  const desktopCard = { left: 120, top: 240, right: 500, bottom: 660, width: 380, height: 420 };
  const bubble = { width: 220, height: 64 };

  it("selects top-end by default on desktop/tablet when unobstructed above the portrait", () => {
    const res = computeBubblePlacement({
      anchorRect: desktopCard,
      bubbleSize: bubble,
      viewport: { width: 1440, height: 900 },
      navBottom: 68,
      obstacles: [{ left: 548, top: 240, right: 1180, bottom: 600, width: 632, height: 360 }],
    });
    expect(res.placement).toBe("top-end");
    expect(res.top + bubble.height).toBeLessThanOrEqual(desktopCard.top - 12);
    expect(res.tailSide).toBe("bottom");
  });

  it("flips to right-start when top lacks room and horizontal clearance exists without hitting text", () => {
    const scrolledCard = { left: 120, top: 90, right: 500, bottom: 510, width: 380, height: 420 };
    const res = computeBubblePlacement({
      anchorRect: scrolledCard,
      bubbleSize: bubble,
      viewport: { width: 1440, height: 900 },
      navBottom: 68,
      obstacles: [{ left: 820, top: 90, right: 1320, bottom: 500, width: 500, height: 410 }],
    });
    expect(res.placement).toBe("right-start");
    expect(res.left).toBeGreaterThanOrEqual(scrolledCard.right + 12);
    expect(res.tailSide).toBe("left");
  });

  it("falls back to bottom-center when top is tight and side column would collide", () => {
    const scrolledCard = { left: 120, top: 90, right: 500, bottom: 510, width: 380, height: 420 };
    const res = computeBubblePlacement({
      anchorRect: scrolledCard,
      bubbleSize: bubble,
      viewport: { width: 1280, height: 800 },
      navBottom: 68,
      obstacles: [{ left: 548, top: 90, right: 1180, bottom: 480, width: 632, height: 390 }],
    });
    expect(res.placement).toBe("bottom-center");
    expect(res.top).toBeGreaterThanOrEqual(scrolledCard.bottom + 12);
    expect(res.tailSide).toBe("top");
  });

  it("adapts cleanly on 320px and 375px mobile within viewport bounds without obstacle overlap", () => {
    const mobileCard = { left: 24, top: 210, right: 296, bottom: 510, width: 272, height: 300 };
    const narrowRes = computeBubblePlacement({
      anchorRect: mobileCard,
      bubbleSize: { width: 220, height: 56 },
      viewport: { width: 320, height: 720 },
      navBottom: 64,
      obstacles: [{ left: 24, top: 558, right: 296, bottom: 700, width: 272, height: 142 }],
    });
    expect(["top-center", "bottom-center"]).toContain(narrowRes.placement);
    expect(narrowRes.left).toBeGreaterThanOrEqual(12);
    expect(narrowRes.left + 220).toBeLessThanOrEqual(320 - 12);
    expect(narrowRes.tailOffsetPx).toBeGreaterThanOrEqual(16);
  });

  it("avoids horizontal overflow in short landscape by rejecting cramped right-start in favor of bottom-center", () => {
    const centeredCard = { left: 229, top: 32, right: 609, bottom: 451, width: 380, height: 419 };
    const landscapeRes = computeBubblePlacement({
      anchorRect: centeredCard,
      bubbleSize: { width: 232, height: 65 },
      viewport: { width: 839, height: 420 },
      navBottom: 69,
      obstacles: [{ left: 24, top: 499, right: 815, bottom: 620, width: 791, height: 121 }],
    });
    expect(landscapeRes.placement).toBe("bottom-center");
    expect(landscapeRes.left).toBeGreaterThanOrEqual(12);
    expect(landscapeRes.left + 232).toBeLessThanOrEqual(839 - 12);
    expect(landscapeRes.top).toBeGreaterThanOrEqual(centeredCard.bottom + 12);
  });
});

describe("About avatar state config, external speech bubble & Easter egg UX", () => {
  it("renders the reusable speech bubble outside figure bounds to keep portrait artwork unobstructed", () => {
    render(<ChibiShowcase />);
    const bubbleEl = screen.getByTestId("avatar-speech-bubble");
    expect(bubbleEl.closest("figure")).toBeNull();
    expect(dialogue().closest("figure")).toBeNull();
  });

  it("defines natural dialogue per state, unique images, and dedicated rickroll motion", () => {
    expect(DEFAULT_AVATAR_IMAGE).toBe("/images/avatar/about/default.webp");
    expect(AVATAR_VIDEO_URL).toBe(video);
    expect(AVATAR_IDLE_RESET_MS).toBe(30_000);
    expect(AVATAR_WINK_STATE.image).toBe("/images/avatar/about/winking.webp");
    expect(AVATAR_WINK_STATE.dialogue).toBe("Hey, you!");

    expect(AVATAR_EXPRESSION_STATES).toHaveLength(9);
    const nonDefaultImages = [...AVATAR_EXPRESSION_STATES.slice(1).map((s) => s.image), AVATAR_WINK_STATE.image];
    expect(nonDefaultImages).not.toContain(DEFAULT_AVATAR_IMAGE);
    expect(new Set(nonDefaultImages).size).toBe(9);
    expect(AVATAR_EXPRESSION_STATES.slice(1, 8).map((s) => s.dialogue)).toEqual([...EXPECTED_SEQUENCE]);
    expect(AVATAR_EXPRESSION_STATES[8].dialogue).toBe("Gotcha! You've been Rickrolled. 😎");
    expect(AVATAR_EXPRESSION_STATES[8].motion).toBe("rickroll");
  });

  it("shows winking on fine-pointer hover without advancing count and avoids overriding clicked state", async () => {
    render(<ChibiShowcase />);
    expect(dialogue().textContent).toBe("");

    fireEvent.pointerEnter(avatar(), { pointerType: "mouse" });
    expect(dialogue()).toHaveTextContent("Hey, you!");

    fireEvent.pointerLeave(avatar(), { pointerType: "mouse" });
    expect(dialogue().textContent).toBe("");

    fireEvent.click(avatar());
    expect(dialogue()).toHaveTextContent("Oh, hi there!");

    fireEvent.pointerEnter(avatar(), { pointerType: "mouse" });
    expect(dialogue()).toHaveTextContent("Oh, hi there!");
    await act(async () => {});
  });

  it("advances through all eight refined dialogues and triggers Rickroll microinteraction once per cycle", async () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    const { container } = render(<ChibiShowcase />);
    expect(dialogue().textContent).toBe("");

    for (const text of EXPECTED_SEQUENCE) {
      fireEvent.click(avatar());
      expect(dialogue()).toHaveTextContent(text);
      expect(open).not.toHaveBeenCalled();
      expect(screen.queryByRole("link", { name: "Open video" })).toBeNull();
    }

    fireEvent.click(avatar());
    expect(dialogue()).toHaveTextContent("Gotcha! You've been Rickrolled. 😎");
    expect(open).toHaveBeenCalledWith(video, "_blank", "noopener,noreferrer");
    expect(screen.getByRole("link", { name: "Open video" })).toHaveAttribute("href", video);
    expect(container.querySelector('[data-motion="rickroll"]')).not.toBeNull();
    expect(container.querySelector('[data-easter-egg="true"]')).not.toBeNull();

    fireEvent.click(avatar());
    fireEvent.click(avatar());
    expect(open).toHaveBeenCalledTimes(1);
    await act(async () => {});
  });

  it("resets dialogue, Easter egg cycle, and timer cleanly at thirty seconds and unmount", async () => {
    vi.useFakeTimers();
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    const { unmount } = render(<ChibiShowcase />);
    for (let i = 0; i < 8; i++) fireEvent.click(avatar());

    act(() => vi.advanceTimersByTime(29_999));
    expect(dialogue()).toHaveTextContent("Gotcha! You've been Rickrolled. 😎");
    act(() => vi.advanceTimersByTime(1));
    expect(dialogue().textContent).toBe("");
    expect(screen.queryByRole("link", { name: "Open video" })).toBeNull();

    for (let i = 0; i < 8; i++) fireEvent.click(avatar());
    expect(open).toHaveBeenCalledTimes(2);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    await act(async () => {});
  });
});
