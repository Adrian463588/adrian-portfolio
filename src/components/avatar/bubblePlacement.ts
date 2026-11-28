export interface BoxRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export type BubblePlacement = "top-end" | "right-start" | "bottom-center" | "top-center";
export type TailSide = "bottom" | "left" | "top";

export interface PlacementInput {
  anchorRect: BoxRect;
  bubbleSize: { width: number; height: number };
  viewport: { width: number; height: number };
  navBottom?: number;
  obstacles?: readonly BoxRect[];
  gap?: number;
  edgePadding?: number;
}

export interface PlacementResult {
  placement: BubblePlacement;
  left: number;
  top: number;
  tailSide: TailSide;
  tailOffsetPx: number;
  collisionScore: number;
}

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.max(min, Math.min(max, value));
}

function intersectArea(a: BoxRect, b: BoxRect): number {
  const xOverlap = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const yOverlap = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return xOverlap * yOverlap;
}

function makeRect(left: number, top: number, width: number, height: number): BoxRect {
  return { left, top, right: left + width, bottom: top + height, width, height };
}

/**
 * Pure adaptive positioning & collision solver for the external avatar speech bubble.
 * Desktop/tablet prefers top-end -> right-start -> top-center -> bottom-center.
 * Mobile selects bottom-center or top-center based on unobstructed space.
 */
export function computeBubblePlacement({
  anchorRect,
  bubbleSize,
  viewport,
  navBottom = 0,
  obstacles = [],
  gap = 14,
  edgePadding = 12,
}: PlacementInput): PlacementResult {
  const { width, height } = bubbleSize;
  const minTop = Math.max(edgePadding, navBottom + 8);
  const maxRight = viewport.width - edgePadding;
  const maxBottom = viewport.height - edgePadding;
  const anchorCenterX = anchorRect.left + anchorRect.width / 2;
  const isDesktopOrTablet = viewport.width >= 768;

  const order: readonly BubblePlacement[] = isDesktopOrTablet
    ? ["top-end", "right-start", "top-center", "bottom-center"]
    : ["bottom-center", "top-center"];

  let best: PlacementResult | null = null;

  for (let idx = 0; idx < order.length; idx++) {
    const placement = order[idx];
    let left: number;
    let top: number;
    let tailSide: TailSide;
    let tailOffsetPx: number;

    if (placement === "top-end") {
      left = clamp(anchorRect.right - width, edgePadding, maxRight - width);
      top = anchorRect.top - gap - height;
      tailSide = "bottom";
      tailOffsetPx = clamp(anchorCenterX - left, 18, Math.max(18, width - 18));
    } else if (placement === "right-start") {
      left = anchorRect.right + gap;
      top = clamp(anchorRect.top + 24, minTop, maxBottom - height);
      tailSide = "left";
      tailOffsetPx = clamp(anchorRect.top + anchorRect.height * 0.28 - top, 14, Math.max(14, height - 14));
    } else if (placement === "top-center") {
      left = clamp(anchorCenterX - width / 2, edgePadding, maxRight - width);
      top = anchorRect.top - gap - height;
      tailSide = "bottom";
      tailOffsetPx = clamp(anchorCenterX - left, 18, Math.max(18, width - 18));
    } else {
      left = clamp(anchorCenterX - width / 2, edgePadding, maxRight - width);
      top = anchorRect.bottom + gap;
      tailSide = "top";
      tailOffsetPx = clamp(anchorCenterX - left, 18, Math.max(18, width - 18));
    }

    const candidateRect = makeRect(left, top, width, height);

    const clipLeft = Math.max(0, edgePadding - candidateRect.left);
    const clipRight = Math.max(0, candidateRect.right - maxRight);
    const clipTop = Math.max(0, minTop - candidateRect.top);
    const clipBottom = Math.max(0, candidateRect.bottom - maxBottom);
    // Horizontal overflow breaks document scrollWidth; top-navbar clip hides content behind fixed header.
    const outOfBoundsPenalty =
      (clipLeft * height + clipRight * height) * 100_000 +
      clipTop * width * 2_000 +
      clipBottom * width * 1_000;

    const anchorOverlapPenalty = intersectArea(candidateRect, anchorRect) * 2000;

    let obstacleOverlapPenalty = 0;
    for (const obs of obstacles) {
      obstacleOverlapPenalty += intersectArea(candidateRect, obs) * 100;
    }

    // Small deterministic tie-breaker preserves priority order when multiple spots have zero collisions
    const collisionScore = outOfBoundsPenalty + anchorOverlapPenalty + obstacleOverlapPenalty + idx;

    if (!best || collisionScore < best.collisionScore) {
      best = { placement, left, top, tailSide, tailOffsetPx, collisionScore };
    }
  }

  return best!;
}
