"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ResilientImage } from "@/components/ui/ResilientImage";
import {
  AVATAR_EXPRESSION_STATES,
  AVATAR_IDLE_RESET_MS,
  AVATAR_VIDEO_URL,
  AVATAR_WINK_STATE,
  DEFAULT_AVATAR_IMAGE,
} from "./avatarStates";
import styles from "./InteractiveAvatar.module.css";

const REVEAL_STEP = AVATAR_EXPRESSION_STATES.length - 1;

function loadExpression(src: string, pending: Map<string, Promise<boolean>>) {
  const cached = pending.get(src);
  if (cached) return cached;

  const image = new window.Image();
  image.src = src;
  const decoded = image.decode().then(() => true, () => false);
  pending.set(src, decoded);
  return decoded;
}

function SpeechBubble({ dialogue, revealed }: { dialogue: string; revealed: boolean }) {
  return (
    <div className={styles.bubbleArea}>
      <div className={styles.bubble} data-active={Boolean(dialogue)}>
        <p role="status" aria-atomic="true">
          <span key={dialogue}>{dialogue}</span>
        </p>
        {revealed && (
          <a href={AVATAR_VIDEO_URL} target="_blank" rel="noopener noreferrer" className={styles.video}>
            Open video
          </a>
        )}
      </div>
    </div>
  );
}

export function InteractiveAvatar() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cycle = useRef(0);
  const resetTimer = useRef<number | undefined>(undefined);
  const images = useRef(new Map<string, Promise<boolean>>());
  const [step, setStep] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [frames, setFrames] = useState<{ current: string; previous: string }>({
    current: DEFAULT_AVATAR_IMAGE,
    previous: DEFAULT_AVATAR_IMAGE,
  });

  const revealed = step === REVEAL_STEP;
  const expression = hovered && step === 0 ? AVATAR_WINK_STATE : AVATAR_EXPRESSION_STATES[step];
  const requested = expression.image;

  useEffect(() => {
    const button = buttonRef.current;
    if (!button || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  useEffect(() => {
    let active = true;
    const ready =
      requested === DEFAULT_AVATAR_IMAGE
        ? Promise.resolve(true)
        : loadExpression(requested, images.current);
    void ready.then((loaded) => {
      if (!active) return;
      const current = loaded ? requested : DEFAULT_AVATAR_IMAGE;
      setFrames((old) => (old.current === current ? old : { current, previous: old.current }));
    });
    return () => {
      active = false;
    };
  }, [requested]);

  useEffect(() => {
    const next = AVATAR_EXPRESSION_STATES[step + 1]?.image;
    if (visible && next && next !== DEFAULT_AVATAR_IMAGE) {
      void loadExpression(next, images.current);
    }
  }, [visible, step]);

  function activate() {
    setHovered(false);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      cycle.current = 0;
      setStep(0);
      setHovered(false);
    }, AVATAR_IDLE_RESET_MS);

    if (cycle.current === REVEAL_STEP) return;
    cycle.current += 1;
    setStep(cycle.current);
    if (cycle.current === REVEAL_STEP) {
      // The manual link stays available because noopener returns null even when a tab opens.
      window.open(AVATAR_VIDEO_URL, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Interact with Adrian's illustrated avatar"
        className={styles.target}
        data-visible={visible}
        onClick={activate}
        onPointerEnter={(event) => {
          if (cycle.current === 0 && event.pointerType === "mouse") setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        onKeyDown={(event) => {
          if (event.repeat && (event.key === "Enter" || event.key === " ")) event.preventDefault();
        }}
      >
        <span className={styles.scale}>
          <span className={styles.art} data-motion={expression.motion}>
            <ResilientImage
              src={DEFAULT_AVATAR_IMAGE}
              alt="Illustrated portrait of Adrian Syah Abidin."
              width={1000}
              height={1000}
              loading="lazy"
              fallbackTitle="Adrian Syah Abidin"
              fallbackCategory="Software Engineer"
              className={styles.base}
            />
            {[frames.previous, frames.current]
              .filter((src) => src !== DEFAULT_AVATAR_IMAGE)
              .map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={1000}
                  height={1000}
                  unoptimized
                  draggable={false}
                  className={`${styles.frame} ${
                    src === frames.current
                      ? styles.incoming
                      : frames.current === DEFAULT_AVATAR_IMAGE
                        ? styles.outgoing
                        : ""
                  }`}
                />
              ))}
          </span>
        </span>
      </button>
      <SpeechBubble dialogue={expression.dialogue} revealed={revealed} />
    </>
  );
}
