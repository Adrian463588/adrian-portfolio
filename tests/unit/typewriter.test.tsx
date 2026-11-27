import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { HERO_TAGLINES, HERO_TYPEWRITER_CONFIG } from "@/config/site.config";
import { TypewriterText } from "@/components/motion/TypewriterText";

let mockQualityMode: "cinematic" | "balanced" | "reduced" = "cinematic";

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

describe("HERO_TAGLINES & TypewriterText TDD invariants", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    mockQualityMode = "cinematic";
  });

  it("defines the exact 12 bold engineering statements starting with 'Think. Build. Repeat.'", () => {
    expect(HERO_TAGLINES).toEqual([
      "Think. Build. Repeat.",
      "Code with purpose.",
      "Quality. No compromises.",
      "Break it. Make it better.",
      "Deploy faster. Build smarter.",
      "Make data matter.",
      "Build beyond limits.",
      "Secure by design.",
      "Built to stay online.",
      "Make AI work.",
      "From idea to impact.",
      "Engineer what's next.",
    ]);
    expect(HERO_TYPEWRITER_CONFIG.typingMs).toBeGreaterThanOrEqual(25);
    expect(HERO_TYPEWRITER_CONFIG.typingMs).toBeLessThanOrEqual(35);
    expect(HERO_TYPEWRITER_CONFIG.deletingMs).toBeGreaterThanOrEqual(10);
    expect(HERO_TYPEWRITER_CONFIG.deletingMs).toBeLessThanOrEqual(15);
    expect(HERO_TYPEWRITER_CONFIG.pauseAfterCompleteMs).toBe(1500);
    expect(HERO_TYPEWRITER_CONFIG.pauseBetweenPhrasesMs).toBeGreaterThanOrEqual(80);
    expect(HERO_TYPEWRITER_CONFIG.pauseBetweenPhrasesMs).toBeLessThanOrEqual(100);
    expect(HERO_TYPEWRITER_CONFIG.cursorBlinkMs).toBeGreaterThanOrEqual(450);
    expect(HERO_TYPEWRITER_CONFIG.cursorBlinkMs).toBeLessThanOrEqual(500);
  });

  it("renders initial phrase immediately for SSR/LCP, holds 1500ms, deletes smoothly, pauses, and types next phrase", () => {
    vi.useFakeTimers();
    render(
      <TypewriterText
        phrases={["Think. Build. Repeat.", "Code with purpose."]}
        typingMs={30}
        deletingMs={12}
        pauseAfterCompleteMs={1500}
        pauseBetweenPhrasesMs={90}
      />
    );

    const tick = (ms: number, repeats = 1) => {
      for (let i = 0; i < repeats; i++) {
        act(() => {
          vi.advanceTimersByTime(ms);
        });
      }
    };

    const display = screen.getByTestId("hero-typewriter-text");
    expect(display).toHaveTextContent("Think. Build. Repeat.");

    // During initial 1500ms hold window, text remains intact
    tick(1400);
    expect(display).toHaveTextContent("Think. Build. Repeat.");

    // Hold finishes at 1500ms -> starts deleting chars at 12ms steps
    tick(100);
    tick(12, 3);
    expect(display.textContent).toBe("Think. Build. Repe");

    // Finish deleting remaining 18 chars -> 90ms gap -> type 18 chars of "Code with purpose."
    tick(12, 18);
    expect(display.textContent).toBe("");
    tick(90);
    tick(30, 18);
    expect(display).toHaveTextContent("Code with purpose.");

    // Hold 1500ms -> delete 18 chars -> 90ms gap -> type back to "Think. Build. Repeat."
    tick(1500);
    tick(12, 18);
    tick(90);
    tick(30, 21);
    expect(display).toHaveTextContent("Think. Build. Repeat.");
  });

  it("supports keyboard-accessible Pause and Resume without losing current state", () => {
    vi.useFakeTimers();
    render(
      <TypewriterText
        phrases={["Think. Build. Repeat.", "Code with purpose."]}
        typingMs={30}
        deletingMs={12}
        pauseAfterCompleteMs={1500}
        pauseBetweenPhrasesMs={90}
      />
    );

    const pauseBtn = screen.getByRole("button", { name: /Pause dynamic headline animation/i });
    expect(pauseBtn).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(pauseBtn);
    expect(pauseBtn).toHaveAttribute("aria-pressed", "true");
    expect(pauseBtn).toHaveAccessibleName(/Resume dynamic headline animation/i);

    const lockedText = screen.getByTestId("hero-typewriter-text").textContent;
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(screen.getByTestId("hero-typewriter-text").textContent).toBe(lockedText);

    fireEvent.click(pauseBtn);
    expect(pauseBtn).toHaveAttribute("aria-pressed", "false");
    act(() => {
      vi.advanceTimersByTime(1500);
    });
    act(() => {
      vi.advanceTimersByTime(12);
    });
    expect(screen.getByTestId("hero-typewriter-text").textContent?.length).toBeLessThan(
      lockedText!.length
    );
  });

  it("keeps text static with zero timer churn under prefers-reduced-motion / qualityMode reduced", () => {
    vi.useFakeTimers();
    mockQualityMode = "reduced";
    render(<TypewriterText phrases={["Think. Build. Repeat.", "Code with purpose."]} />);

    const display = screen.getByTestId("hero-typewriter-text");
    expect(display).toHaveTextContent("Think. Build. Repeat.");

    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(display).toHaveTextContent("Think. Build. Repeat.");
    expect(screen.queryByRole("button", { name: /Pause dynamic headline/i })).not.toBeInTheDocument();
  });

  it("exposes static screen-reader text cleanly without character-by-character live-region announcements", () => {
    render(<TypewriterText phrases={["Think. Build. Repeat.", "Code with purpose."]} />);

    const animatedSpan = screen.getByTestId("hero-typewriter-text").closest('[aria-hidden="true"]');
    expect(animatedSpan).not.toBeNull();
    expect(document.querySelector('[aria-live="polite"]')).toBeNull();
    expect(screen.getByText("Think. Build. Repeat.", { selector: ".sr-only" })).toBeInTheDocument();
  });

  it("clears scheduled timers cleanly on unmount", () => {
    vi.useFakeTimers();
    const clearSpy = vi.spyOn(globalThis, "clearTimeout");
    const { unmount } = render(<TypewriterText phrases={["Think. Build. Repeat.", "Code with purpose."]} />);
    unmount();
    expect(clearSpy).toHaveBeenCalled();
    clearSpy.mockRestore();
  });
});
