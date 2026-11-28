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

describe("About avatar state config, refined dialogue & Easter egg UX", () => {
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

    // Hovering after step >= 1 must never revert dialogue back to hover greeting
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

    // Subsequent clicks within the same cycle keep dialogue steady and do not open duplicate tabs
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
