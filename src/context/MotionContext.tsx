"use client";

import { createContext, useContext, useState } from "react";
import { useMotionCapabilities } from "@/hooks/useMotionCapabilities";

export type MotionQualityMode = "cinematic" | "balanced" | "reduced";
export type MotionPreference = "auto" | MotionQualityMode;

interface MotionContextValue {
  qualityMode: MotionQualityMode;
  preference: MotionPreference;
  setPreference: (pref: MotionPreference) => void;
  canHover: boolean;
  isClient: boolean;
  osReducedMotion: boolean;
}

const MotionContext = createContext<MotionContextValue>({
  qualityMode: "balanced",
  preference: "auto",
  setPreference: () => {},
  canHover: false,
  isClient: false,
  osReducedMotion: false,
});

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const { isClient, reducedMotion, canHover } = useMotionCapabilities();
  const [preference, setPreference] = useState<MotionPreference>("auto");

  const qualityMode: MotionQualityMode =
    isClient && reducedMotion
      ? "reduced"
      : preference !== "auto"
        ? preference
        : canHover
          ? "cinematic"
          : "balanced";

  return (
    <MotionContext.Provider
      value={{
        qualityMode,
        preference,
        setPreference,
        canHover,
        isClient,
        osReducedMotion: reducedMotion,
      }}
    >
      {children}
    </MotionContext.Provider>
  );
}

export function useMotion() {
  return useContext(MotionContext);
}
