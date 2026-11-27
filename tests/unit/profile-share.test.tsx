import fs from "node:fs";
import path from "node:path";
import jsQR from "jsqr";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { SITE_CONFIG } from "@/config/site.config";
import { MotionProvider } from "@/context/MotionContext";
import { Hero } from "@/components/sections/Hero";
import { useDoubleTap } from "@/hooks/useDoubleTap";
import { ProfileShareDialog } from "@/components/profile/ProfileShareDialog";

function rasterizeQrSvgStrokesToRgba(svgContent: string, scale = 8) {
  const viewBoxMatch = svgContent.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (!viewBoxMatch) throw new Error("Missing viewBox in QR SVG");
  const size = Number.parseInt(viewBoxMatch[1], 10);

  const strokePathMatch = svgContent.match(/<path stroke="#08090C" d="([^"]+)"/);
  if (!strokePathMatch) throw new Error("Missing crisp dark stroke path in QR SVG");

  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const cmds = strokePathMatch[1].matchAll(/M(\d+)\s+(\d+(?:\.\d+)?)\s*h(\d+)|m(-?\d+)\s+(-?\d+)\s*h(\d+)/g);
  void cmds;

  // Parse absolute row runs: each M<x> <y>.5 starts a row segment followed by m<dx> 0 / h<w> or explicit M<x> <y>h<w>
  const tokens = strokePathMatch[1].match(/[MmHh]|-?\d+(?:\.\d+)?/g) ?? [];
  let i = 0;
  let curX = 0;
  let curY = 0;
  let cmd = "";
  while (i < tokens.length) {
    const t = tokens[i];
    if (/[MmHh]/.test(t)) {
      cmd = t;
      i += 1;
      continue;
    }
    if (cmd === "M") {
      curX = Number.parseFloat(tokens[i]);
      curY = Math.floor(Number.parseFloat(tokens[i + 1]));
      i += 2;
    } else if (cmd === "m") {
      curX += Number.parseFloat(tokens[i]);
      curY += Number.parseFloat(tokens[i + 1]);
      curY = Math.floor(curY);
      i += 2;
    } else if (cmd === "h") {
      const len = Number.parseInt(tokens[i], 10);
      for (let x = curX; x < curX + len; x++) {
        if (curY >= 0 && curY < size && x >= 0 && x < size) {
          grid[curY][x] = true;
        }
      }
      curX += len;
      i += 1;
    } else {
      i += 1;
    }
  }

  const width = size * scale;
  const rgba = new Uint8ClampedArray(width * width * 4);
  for (let py = 0; py < width; py++) {
    const my = Math.floor(py / scale);
    for (let px = 0; px < width; px++) {
      const mx = Math.floor(px / scale);
      const dark = grid[my]?.[mx] ?? false;
      const offset = (py * width + px) * 4;
      rgba[offset] = dark ? 8 : 255;
      rgba[offset + 1] = dark ? 9 : 255;
      rgba[offset + 2] = dark ? 12 : 255;
      rgba[offset + 3] = 255;
    }
  }
  return { rgba, width, height: width, size };
}

function TapHarness({ onDoubleTap }: { onDoubleTap: () => void }) {
  const { pointerHandlers } = useDoubleTap(onDoubleTap);
  return (
    <h1 data-testid="tap-target" {...pointerHandlers}>
      Adrian Syah Abidin
    </h1>
  );
}

describe("Sprint 10 Quick Profile Share — QR, Gesture & Modal TDD", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("decodes static public/images/profile/portfolio-qr.svg independently with jsQR to canonical URL", () => {
    const qrPath = path.resolve(process.cwd(), "public/images/profile/portfolio-qr.svg");
    const svg = fs.readFileSync(qrPath, "utf8");

    expect(svg).toContain('shape-rendering="crispEdges"');
    expect(svg).not.toMatch(/shape-rendering="[^"]*"[^>]*shape-rendering=/);
    expect(svg).not.toMatch(/<linearGradient|<filter/i);
    expect(svg).toContain(`aria-label="QR code linking to ${SITE_CONFIG.shareUrl}"`);

    const { rgba, width, height, size } = rasterizeQrSvgStrokesToRgba(svg);
    expect(size).toBeGreaterThanOrEqual(33);
    const decoded = jsQR(rgba, width, height);
    expect(decoded?.data).toBe("https://adriansyahabidin.vercel.app/");
  });

  it("detects valid touch double-tap while rejecting mouse, single tap, scroll drag, long press, pointercancel, and duplicate burst", () => {
    vi.useFakeTimers();
    const trigger = vi.fn();
    render(<TapHarness onDoubleTap={trigger} />);
    const el = screen.getByTestId("tap-target");

    const firePtr = (type: string, opts: { id?: number; pType?: string; x?: number; y?: number } = {}) => {
      fireEvent(
        el,
        new MouseEvent(type, { bubbles: true, clientX: opts.x ?? 100, clientY: opts.y ?? 100 })
      );
      // Fallback jsdom doesn't attach pointerType on PointerEvent cleanly without defineProperty when MouseEvent is used;
      // dispatch custom Event with pointer fields directly
    };
    void firePtr;

    const dispatchPointer = (
      type: "pointerdown" | "pointermove" | "pointerup" | "pointercancel",
      opts: { pointerId?: number; pointerType?: string; clientX?: number; clientY?: number } = {}
    ) => {
      const evt = new Event(type, { bubbles: true, cancelable: true }) as PointerEvent & Record<string, unknown>;
      Object.defineProperties(evt, {
        pointerId: { value: opts.pointerId ?? 1 },
        pointerType: { value: opts.pointerType ?? "touch" },
        clientX: { value: opts.clientX ?? 100 },
        clientY: { value: opts.clientY ?? 100 },
        isPrimary: { value: true },
      });
      act(() => {
        el.dispatchEvent(evt);
      });
    };

    // 1. Mouse events ignored by touch double-tap hook (handled by native onDoubleClick)
    dispatchPointer("pointerdown", { pointerType: "mouse" });
    dispatchPointer("pointerup", { pointerType: "mouse" });
    vi.advanceTimersByTime(100);
    dispatchPointer("pointerdown", { pointerType: "mouse" });
    dispatchPointer("pointerup", { pointerType: "mouse" });
    expect(trigger).toHaveBeenCalledTimes(0);

    // 2. Single tap expires past 350ms -> 0 triggers
    dispatchPointer("pointerdown");
    dispatchPointer("pointerup");
    vi.advanceTimersByTime(420);
    expect(trigger).toHaveBeenCalledTimes(0);

    // 3. Vertical scroll movement (> 14px) cancels tap
    dispatchPointer("pointerdown", { clientY: 100 });
    dispatchPointer("pointermove", { clientY: 130 });
    dispatchPointer("pointerup", { clientY: 130 });
    vi.advanceTimersByTime(150);
    dispatchPointer("pointerdown", { clientY: 130 });
    dispatchPointer("pointerup", { clientY: 130 });
    expect(trigger).toHaveBeenCalledTimes(0);

    // 4. Long press (> 450ms) does not seed double-tap
    vi.advanceTimersByTime(500);
    dispatchPointer("pointerdown");
    vi.advanceTimersByTime(520);
    dispatchPointer("pointerup");
    vi.advanceTimersByTime(120);
    dispatchPointer("pointerdown");
    dispatchPointer("pointerup");
    expect(trigger).toHaveBeenCalledTimes(0);

    // 5. pointercancel clears candidate
    vi.advanceTimersByTime(500);
    dispatchPointer("pointerdown");
    dispatchPointer("pointercancel");
    vi.advanceTimersByTime(100);
    dispatchPointer("pointerdown");
    dispatchPointer("pointerup");
    expect(trigger).toHaveBeenCalledTimes(0);

    // 6. Valid double-tap (160ms apart) + rapid 3rd tap in cooldown -> fires ONCE
    vi.advanceTimersByTime(500);
    dispatchPointer("pointerdown");
    dispatchPointer("pointerup");
    vi.advanceTimersByTime(160);
    dispatchPointer("pointerdown");
    dispatchPointer("pointerup");
    vi.advanceTimersByTime(100);
    dispatchPointer("pointerdown");
    dispatchPointer("pointerup");
    expect(trigger).toHaveBeenCalledTimes(1);
  });

  it("handles Copy link, Clipboard fallback, Web Share API feature detection, and dismissal cleanly", async () => {
    vi.useFakeTimers();
    const writeText = vi.fn().mockResolvedValue(undefined);
    const shareMock = vi.fn().mockRejectedValue(new DOMException("Cancelled", "AbortError"));
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    Object.defineProperty(navigator, "share", { value: shareMock, configurable: true });

    const onClose = vi.fn();
    render(<ProfileShareDialog isOpen onClose={onClose} />);

    expect(screen.getByRole("heading", { name: "Share profile" })).toBeInTheDocument();
    expect(screen.getByText("Adrian Syah Abidin")).toBeInTheDocument();
    expect(screen.getByText("Software & QA Automation Engineer")).toBeInTheDocument();
    expect(screen.getByText("Scan the QR code to explore my portfolio.")).toBeInTheDocument();

    const qrImg = screen.getByRole("img", { name: /QR code/i });
    expect(qrImg).toHaveAttribute("src", "/images/profile/portfolio-qr.svg");

    // Copy success -> Copied! -> resets after 2000ms
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Copy link/i }));
    });
    expect(writeText).toHaveBeenCalledWith("https://adriansyahabidin.vercel.app/");
    expect(screen.getByRole("button", { name: /Copied!/i })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2100);
    });
    expect(screen.getByRole("button", { name: /Copy link/i })).toBeInTheDocument();

    // Native share button triggers navigator.share & ignores AbortError silently
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Share link/i }));
    });
    expect(shareMock).toHaveBeenCalledWith({
      title: "Adrian Syah Abidin — Portfolio",
      text: "Explore Adrian's professional experience and software projects.",
      url: "https://adriansyahabidin.vercel.app/",
    });

    // Escape closes dialog
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);

    // Clipboard failure reveals selectable manual fallback URL input without fake Copied! state
    writeText.mockRejectedValueOnce(new Error("Clipboard denied"));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Copy link/i }));
    });
    expect(screen.queryByRole("button", { name: /Copied!/i })).not.toBeInTheDocument();
    expect(screen.getByDisplayValue("https://adriansyahabidin.vercel.app/")).toBeInTheDocument();
  });

  it("hides native Share link button cleanly when navigator.share is unavailable", () => {
    Object.defineProperty(navigator, "share", { value: undefined, configurable: true });
    render(<ProfileShareDialog isOpen onClose={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /Share link/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copy link/i })).toBeInTheDocument();
  });

  it("renders Hero without visible QR icon while preserving double-click and keyboard Share access", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    });

    const { container } = render(
      <MotionProvider>
        <Hero />
      </MotionProvider>
    );

    expect(container.querySelector("svg.lucide-qr-code")).toBeNull();
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();

    const srButton = screen.getByRole("button", { name: "Share Adrian Syah Abidin profile" });
    expect(srButton.className).toContain("sr-only");
    expect(srButton.className).toContain("focus-visible:not-sr-only");

    // Double-click heading opens dialog
    fireEvent.doubleClick(screen.getByRole("heading", { level: 1, name: "Adrian Syah Abidin" }));
    expect(screen.getByRole("heading", { name: "Share profile" })).toBeInTheDocument();

    // Escape restores focus to keyboard Share trigger without reintroducing visible icon
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("heading", { name: "Share profile" })).not.toBeInTheDocument();
    fireEvent.click(srButton);
    expect(screen.getByRole("heading", { name: "Share profile" })).toBeInTheDocument();
  });
});
