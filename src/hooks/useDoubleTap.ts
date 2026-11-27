"use client";

import { useCallback, useEffect, useRef } from "react";
import type React from "react";

export interface DoubleTapOptions {
  maxIntervalMs?: number;
  maxHoldMs?: number;
  maxMovePx?: number;
  maxTapDistancePx?: number;
  cooldownMs?: number;
}

interface PendingTap {
  time: number;
  x: number;
  y: number;
}

interface ActivePointer {
  id: number;
  startX: number;
  startY: number;
  startTime: number;
  movedTooFar: boolean;
}

/**
 * Reusable Pointer Events double-tap gesture detector for touchscreens/stylus.
 * Intentionally ignores mouse pointers (handled natively via `onDoubleClick`) and
 * rejects scroll drags, multi-touch pinches, long presses, and rapid duplicate bursts.
 */
export function useDoubleTap<T extends HTMLElement = HTMLElement>(
  onDoubleTap: () => void,
  options: DoubleTapOptions = {}
) {
  const {
    maxIntervalMs = 350,
    maxHoldMs = 450,
    maxMovePx = 14,
    maxTapDistancePx = 28,
    cooldownMs = 450,
  } = options;

  const callbackRef = useRef(onDoubleTap);
  const activePointerRef = useRef<ActivePointer | null>(null);
  const lastTapRef = useRef<PendingTap | null>(null);
  const expiryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTriggerTimeRef = useRef(0);

  useEffect(() => {
    callbackRef.current = onDoubleTap;
  }, [onDoubleTap]);

  const clearPendingExpiry = useCallback(() => {
    if (expiryTimerRef.current !== null) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
  }, []);

  const resetGestureState = useCallback(() => {
    clearPendingExpiry();
    activePointerRef.current = null;
    lastTapRef.current = null;
  }, [clearPendingExpiry]);

  useEffect(() => {
    return () => {
      resetGestureState();
    };
  }, [resetGestureState]);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<T>) => {
      if (event.pointerType === "mouse") return;
      if (!event.isPrimary) {
        resetGestureState();
        return;
      }

      activePointerRef.current = {
        id: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startTime: Date.now(),
        movedTooFar: false,
      };
    },
    [resetGestureState]
  );

  const onPointerMove = useCallback(
    (event: React.PointerEvent<T>) => {
      if (event.pointerType === "mouse") return;
      const active = activePointerRef.current;
      if (!active || active.id !== event.pointerId || active.movedTooFar) return;

      const dist = Math.hypot(event.clientX - active.startX, event.clientY - active.startY);
      if (dist > maxMovePx) {
        active.movedTooFar = true;
        resetGestureState();
      }
    },
    [maxMovePx, resetGestureState]
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent<T>) => {
      if (event.pointerType === "mouse") return;
      const active = activePointerRef.current;
      activePointerRef.current = null;

      if (!active || active.id !== event.pointerId || active.movedTooFar) {
        return;
      }

      const now = Date.now();
      const holdDuration = now - active.startTime;
      if (holdDuration > maxHoldMs) {
        resetGestureState();
        return;
      }

      if (now - lastTriggerTimeRef.current < cooldownMs) {
        resetGestureState();
        return;
      }

      const prevTap = lastTapRef.current;
      if (prevTap) {
        // Measure gap between tap #1 release and tap #2 press so normal finger hold on tap #2 stays forgiving
        const dt = active.startTime - prevTap.time;
        const tapSpread = Math.hypot(event.clientX - prevTap.x, event.clientY - prevTap.y);
        resetGestureState();

        if (dt <= maxIntervalMs && tapSpread <= maxTapDistancePx) {
          lastTriggerTimeRef.current = now;
          callbackRef.current();
          return;
        }
      }

      clearPendingExpiry();
      lastTapRef.current = { time: now, x: event.clientX, y: event.clientY };
      expiryTimerRef.current = setTimeout(() => {
        lastTapRef.current = null;
        expiryTimerRef.current = null;
      }, maxIntervalMs);
    },
    [clearPendingExpiry, cooldownMs, maxHoldMs, maxIntervalMs, maxTapDistancePx, resetGestureState]
  );

  const onPointerCancel = useCallback(
    (event: React.PointerEvent<T>) => {
      if (event.pointerType === "mouse") return;
      resetGestureState();
    },
    [resetGestureState]
  );

  return {
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
    },
  };
}
