import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChibiShowcase } from "@/components/avatar/ChibiShowcase";

vi.mock("@/hooks/useMotionCapabilities", () => ({
  useMotionCapabilities: () => ({ reducedMotion: false, canHover: true }),
}));

const avatar = () => screen.getByRole("button", { name: "Interact with Adrian's illustrated avatar" });
const dialogue = () => screen.getByRole("status");
const video = "https://youtu.be/dQw4w9WgXcQ";

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

describe("About avatar", () => {
  it("advances all eight steps and requests one secure tab per cycle", async () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    render(<ChibiShowcase />);
    expect(dialogue().textContent).toBe("");

    for (const text of [
      "Hi there!",
      "Nice to meet you!",
      "Haha, that tickles!",
      "Wait... again?",
      "Hey! I'm working!",
      "Stop poking me!",
      "Fine. I have a surprise for you.",
    ]) {
      fireEvent.click(avatar());
      expect(dialogue()).toHaveTextContent(text);
      expect(open).not.toHaveBeenCalled();
      expect(screen.queryByRole("link", { name: "Open video" })).toBeNull();
    }
    fireEvent.click(avatar());
    expect(dialogue()).toHaveTextContent("You've been Rickrolled!");
    expect(open).toHaveBeenCalledWith(video, "_blank", "noopener,noreferrer");
    expect(screen.getByRole("link", { name: "Open video" })).toHaveAttribute("href", video);
    fireEvent.click(avatar());
    expect(open).toHaveBeenCalledTimes(1);
    await act(async () => {});
  });

  it("resets the cycle at thirty seconds and clears the timer on unmount", async () => {
    vi.useFakeTimers();
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    const { unmount } = render(<ChibiShowcase />);
    for (let i = 0; i < 8; i++) fireEvent.click(avatar());

    act(() => vi.advanceTimersByTime(29_999));
    expect(dialogue()).toHaveTextContent("You've been Rickrolled!");
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
