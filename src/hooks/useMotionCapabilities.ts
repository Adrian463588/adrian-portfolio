"use client";

import { useSyncExternalStore } from "react";

function subscribeNothing() {
  return () => {};
}

function subscribeMedia(query: string, callback: () => void) {
  const mql = window.matchMedia(query);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

/** Detect client mount, reduced-motion preference, fine pointer capability, and WebGL support safely without hydration mismatch. */
export function useMotionCapabilities() {
  const isClient = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false
  );

  const reducedMotion = useSyncExternalStore(
    (cb) => subscribeMedia("(prefers-reduced-motion: reduce)", cb),
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  const canHover = useSyncExternalStore(
    (cb) => subscribeMedia("(hover: hover) and (pointer: fine)", cb),
    () => window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    () => false
  );

  return { isClient, reducedMotion, canHover };
}
