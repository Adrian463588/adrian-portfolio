"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { AVATAR_VIDEO_URL } from "./avatarStates";
import {
  computeBubblePlacement,
  type BoxRect,
  type BubblePlacement,
  type TailSide,
} from "./bubblePlacement";
import styles from "./InteractiveAvatar.module.css";

interface SpeechBubbleProps {
  dialogue: string;
  revealed: boolean;
  anchorRef: RefObject<HTMLDivElement | null>;
  cardRef: RefObject<HTMLElement | null>;
}

interface PositionedState {
  ready: boolean;
  placement: BubblePlacement;
  tailSide: TailSide;
  leftPx: number;
  topPx: number;
  tailOffsetPx: number;
}

function toBoxRect(rect: DOMRect): BoxRect {
  return {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
}

/** Measure tight visual text bounds for headings/paragraphs so empty block margin doesn't block placements. */
function getContentRect(el: Element): BoxRect {
  if (typeof document !== "undefined" && (el.tagName === "H2" || el.tagName === "P") && el.childNodes.length > 0) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const tight = range.getBoundingClientRect();
    if (tight.width > 0 && tight.height > 0) {
      return toBoxRect(tight);
    }
  }
  return toBoxRect(el.getBoundingClientRect());
}

export function SpeechBubble({ dialogue, revealed, anchorRef, cardRef }: SpeechBubbleProps) {
  const bubbleRef = useRef<HTMLDivElement>(null);
  const active = Boolean(dialogue);

  const [pos, setPos] = useState<PositionedState>({
    ready: false,
    placement: "top-end",
    tailSide: "bottom",
    leftPx: 0,
    topPx: 0,
    tailOffsetPx: 36,
  });

  const updatePosition = useCallback(() => {
    const bubbleEl = bubbleRef.current;
    const anchorEl = anchorRef.current;
    const cardEl = cardRef.current;
    if (!bubbleEl || !anchorEl || !cardEl) return;

    const anchorRect = anchorEl.getBoundingClientRect();
    const cardRect = cardEl.getBoundingClientRect();
    if (cardRect.width === 0) return;

    const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
    const maxBubbleWidth = Math.min(240, viewportWidth - 24);
    const measuredWidth = Math.min(maxBubbleWidth, bubbleEl.offsetWidth || maxBubbleWidth);
    const measuredHeight = bubbleEl.offsetHeight || 48;
    if (measuredWidth === 0) return;

    const navEl = document.querySelector("header");
    const navBottom = navEl ? navEl.getBoundingClientRect().bottom : 0;

    const aboutSection = cardEl.closest("#about");
    const obstacles: BoxRect[] = [];
    if (aboutSection) {
      for (const el of aboutSection.querySelectorAll("h2, p, article")) {
        if (cardEl.contains(el) || bubbleEl.contains(el)) continue;
        const r = getContentRect(el);
        if (r.width > 0 && r.height > 0) {
          obstacles.push(r);
        }
      }
    }

    const result = computeBubblePlacement({
      anchorRect: toBoxRect(cardRect),
      bubbleSize: { width: measuredWidth, height: measuredHeight },
      viewport: { width: viewportWidth, height: viewportHeight },
      navBottom,
      obstacles,
    });

    const leftPx = result.left - anchorRect.left;
    const topPx = result.top - anchorRect.top;
    setPos((prev) =>
      prev.ready &&
      prev.placement === result.placement &&
      prev.tailSide === result.tailSide &&
      Math.abs(prev.leftPx - leftPx) < 0.5 &&
      Math.abs(prev.topPx - topPx) < 0.5 &&
      Math.abs(prev.tailOffsetPx - result.tailOffsetPx) < 0.5
        ? prev
        : {
            ready: true,
            placement: result.placement,
            tailSide: result.tailSide,
            leftPx,
            topPx,
            tailOffsetPx: result.tailOffsetPx,
          }
    );
  }, [anchorRef, cardRef]);

  useLayoutEffect(() => {
    if (!active) return;
    updatePosition();
  }, [active, dialogue, revealed, updatePosition]);

  useEffect(() => {
    if (!active) return;
    const handleUpdate = () => updatePosition();
    window.addEventListener("scroll", handleUpdate, { passive: true });
    window.addEventListener("resize", handleUpdate, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(handleUpdate) : null;
    if (ro && bubbleRef.current) ro.observe(bubbleRef.current);
    return () => {
      window.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
      ro?.disconnect();
    };
  }, [active, updatePosition]);

  const inlineStyle: CSSProperties & { "--bubble-tail-offset"?: string } = {
    "--bubble-tail-offset": `${pos.tailOffsetPx}px`,
    ...(pos.ready ? { left: `${pos.leftPx}px`, top: `${pos.topPx}px` } : {}),
  };

  return (
    <div
      ref={bubbleRef}
      data-testid="avatar-speech-bubble"
      data-active={active}
      data-positioned={pos.ready ? "true" : undefined}
      data-placement={pos.placement}
      data-tail-side={pos.tailSide}
      data-easter-egg={revealed ? "true" : undefined}
      style={inlineStyle}
      className={styles.externalBubble}
    >
      <p role="status" aria-atomic="true">
        <span key={dialogue}>{dialogue}</span>
      </p>
      {revealed && (
        <a href={AVATAR_VIDEO_URL} target="_blank" rel="noopener noreferrer" className={styles.video}>
          Open video
        </a>
      )}
    </div>
  );
}
