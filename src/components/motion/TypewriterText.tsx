"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { HERO_TAGLINES, HERO_TYPEWRITER_CONFIG } from "@/config/site.config";
import { useMotion } from "@/context/MotionContext";

type TypewriterPhase = "holding" | "deleting" | "pausingBeforeType" | "typing";

export interface TypewriterTextProps {
  phrases?: readonly string[];
  typingMs?: number;
  deletingMs?: number;
  pauseAfterCompleteMs?: number;
  pauseBetweenPhrasesMs?: number;
  className?: string;
}

/**
 * Lightweight, SSR/hydration-safe continuous typewriter headline.
 * Reserves the longest phrase height via overlapping CSS Grid cells (0.00 CLS),
 * exposes static screen-reader text to prevent character chatter, and honors reduced motion.
 */
export function TypewriterText({
  phrases = HERO_TAGLINES,
  typingMs = HERO_TYPEWRITER_CONFIG.typingMs,
  deletingMs = HERO_TYPEWRITER_CONFIG.deletingMs,
  pauseAfterCompleteMs = HERO_TYPEWRITER_CONFIG.pauseAfterCompleteMs,
  pauseBetweenPhrasesMs = HERO_TYPEWRITER_CONFIG.pauseBetweenPhrasesMs,
  className = "",
}: TypewriterTextProps) {
  const { qualityMode } = useMotion();
  const safePhrases = useMemo(
    () => (phrases.length > 0 ? phrases : HERO_TAGLINES),
    [phrases]
  );

  const longestPhrase = useMemo(
    () =>
      safePhrases.reduce(
        (longest, current) => (current.length > longest.length ? current : longest),
        safePhrases[0]
      ),
    [safePhrases]
  );

  const isReducedMotion = qualityMode === "reduced";
  const [isPaused, setIsPaused] = useState(false);
  const [viewState, setViewState] = useState(() => ({
    phraseIndex: 0,
    charCount: safePhrases[0]?.length ?? 0,
  }));

  const engineRef = useRef<{
    phraseIndex: number;
    charCount: number;
    phase: TypewriterPhase;
    lastTickMs: number;
  }>({
    phraseIndex: 0,
    charCount: safePhrases[0]?.length ?? 0,
    phase: "holding",
    lastTickMs: 0,
  });

  const activePhrase =
    safePhrases[viewState.phraseIndex % safePhrases.length] ?? safePhrases[0];
  const visibleText = isReducedMotion
    ? safePhrases[0]
    : activePhrase.slice(0, viewState.charCount);

  useEffect(() => {
    if (isReducedMotion || isPaused || safePhrases.length <= 1) {
      return;
    }

    let timerId: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    const getDelayForPhase = (phase: TypewriterPhase) => {
      switch (phase) {
        case "holding":
          return pauseAfterCompleteMs;
        case "deleting":
          return deletingMs;
        case "pausingBeforeType":
          return pauseBetweenPhrasesMs;
        case "typing":
          return typingMs;
      }
    };

    const scheduleNext = () => {
      if (cancelled) return;
      engineRef.current.lastTickMs = performance.now();
      const delay = getDelayForPhase(engineRef.current.phase);

      timerId = setTimeout(() => {
        if (cancelled) return;
        const state = engineRef.current;
        const now = performance.now();
        const phrase = safePhrases[state.phraseIndex % safePhrases.length] ?? safePhrases[0];

        if (state.phase === "holding") {
          state.phase = "deleting";
        } else if (state.phase === "deleting") {
          const steps = Math.max(1, Math.floor((now - state.lastTickMs) / deletingMs));
          state.charCount = Math.max(0, state.charCount - steps);
          if (state.charCount === 0) {
            state.phase = "pausingBeforeType";
          }
          setViewState({ phraseIndex: state.phraseIndex, charCount: state.charCount });
        } else if (state.phase === "pausingBeforeType") {
          state.phraseIndex = (state.phraseIndex + 1) % safePhrases.length;
          state.charCount = 0;
          state.phase = "typing";
          setViewState({ phraseIndex: state.phraseIndex, charCount: 0 });
        } else {
          const steps = Math.max(1, Math.floor((now - state.lastTickMs) / typingMs));
          state.charCount = Math.min(phrase.length, state.charCount + steps);
          if (state.charCount >= phrase.length) {
            state.phase = "holding";
          }
          setViewState({ phraseIndex: state.phraseIndex, charCount: state.charCount });
        }

        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      cancelled = true;
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
    };
  }, [
    isReducedMotion,
    isPaused,
    safePhrases,
    typingMs,
    deletingMs,
    pauseAfterCompleteMs,
    pauseBetweenPhrasesMs,
  ]);

  const showBlinkingCursor = !isReducedMotion && !isPaused;

  return (
    <div className={`flex items-start gap-1.5 ${className}`}>
      <p className="relative grid max-w-[calc(100%-3.25rem)] font-display text-[clamp(1.25rem,2.3vw,1.7rem)] font-medium leading-snug tracking-[-0.015em] text-[#F2F0EC]">
        <span className="sr-only">{safePhrases[0]}</span>
        {/* Intrinsic CSS grid sizer guarantees 0.00 CLS across mobile wraps and 0-char gaps */}
        <span
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 select-none invisible"
        >
          {longestPhrase}
          <span className="inline-block w-[3px]" />
        </span>
        <span aria-hidden="true" className="col-start-1 row-start-1">
          <span data-testid="hero-typewriter-text">{visibleText}</span>
          {!isReducedMotion && (
            <span
              data-testid="hero-typewriter-cursor"
              className={`ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[0.12em] bg-[#65C8F5] ${
                showBlinkingCursor ? "typewriter-cursor" : "opacity-60"
              }`}
            />
          )}
        </span>
      </p>

      {!isReducedMotion && (
        <button
          type="button"
          onClick={() => setIsPaused((prev) => !prev)}
          aria-pressed={isPaused}
          aria-label={
            isPaused
              ? "Resume dynamic headline animation"
              : "Pause dynamic headline animation"
          }
          title={isPaused ? "Resume headline" : "Pause headline"}
          className="active-press group/pause -mt-1.5 inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full text-[#A7ADB7] transition-colors hover:text-[#65C8F5]"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-[#15171C]/75 backdrop-blur-sm transition-colors group-hover/pause:border-[#65C8F5]/60">
            {isPaused ? (
              <Play className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Pause className="h-3 w-3" aria-hidden="true" />
            )}
          </span>
        </button>
      )}
    </div>
  );
}
