"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ResilientImage } from "@/components/ui/ResilientImage";
import styles from "./InteractiveAvatar.module.css";

const DEFAULT = "/images/avatar/about/default.webp";
const EXPRESSIONS = [
  { image: DEFAULT, dialogue: "", motion: "idle" },
  { image: "/images/avatar/about/greeting.webp", dialogue: "Hi there!", motion: "greeting" },
  { image: "/images/avatar/about/happy.webp", dialogue: "Nice to meet you!" },
  { image: "/images/avatar/about/laughing.webp", dialogue: "Haha, that tickles!" },
  { image: "/images/avatar/about/surprised.webp", dialogue: "Wait... again?" },
  { image: "/images/avatar/about/confused.webp", dialogue: "Hey! I'm working!" },
  { image: "/images/avatar/about/angry.webp", dialogue: "Stop poking me!", motion: "angry" },
  { image: DEFAULT, dialogue: "Fine. I have a surprise for you.", motion: "mischievous" },
  { image: "/images/avatar/about/rickroll.webp", dialogue: "You've been Rickrolled!" },
] as const;

const WINK = { image: "/images/avatar/about/winking.webp", dialogue: "Hey, you!" } as const;
const REVEAL_STEP = EXPRESSIONS.length - 1;
const VIDEO_URL = "https://youtu.be/dQw4w9WgXcQ";
const IDLE_RESET_MS = 30_000;

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
          <a href={VIDEO_URL} target="_blank" rel="noopener noreferrer" className={styles.video}>
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
    current: DEFAULT,
    previous: DEFAULT,
  });

  const revealed = step === REVEAL_STEP;
  const expression = hovered && step === 0 ? WINK : EXPRESSIONS[step];
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
    const ready = requested === DEFAULT ? Promise.resolve(true) : loadExpression(requested, images.current);
    void ready.then((loaded) => {
      if (!active) return;
      const current = loaded ? requested : DEFAULT;
      setFrames((old) => old.current === current ? old : { current, previous: old.current });
    });
    return () => { active = false; };
  }, [requested]);

  useEffect(() => {
    const next = EXPRESSIONS[step + 1]?.image;
    if (visible && next && next !== DEFAULT) void loadExpression(next, images.current);
  }, [visible, step]);

  function activate() {
    setHovered(false);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => {
      cycle.current = 0;
      setStep(0);
      setHovered(false);
    }, IDLE_RESET_MS);

    if (cycle.current === REVEAL_STEP) return;
    cycle.current += 1;
    setStep(cycle.current);
    if (cycle.current === REVEAL_STEP) {
      // The manual link stays available because noopener returns null even when a tab opens.
      window.open(VIDEO_URL, "_blank", "noopener,noreferrer");
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
          <span className={styles.art} data-motion={"motion" in expression ? expression.motion : undefined}>
            <ResilientImage
              src={DEFAULT}
              alt="Illustrated portrait of Adrian Syah Abidin."
              width={1000}
              height={1000}
              loading="lazy"
              fallbackTitle="Adrian Syah Abidin"
              fallbackCategory="Software Engineer"
              className={styles.base}
            />
            {[frames.previous, frames.current].filter((src) => src !== DEFAULT).map((src) => (
              <Image
                key={src}
                src={src}
                alt=""
                width={1000}
                height={1000}
                unoptimized
                draggable={false}
                className={`${styles.frame} ${src === frames.current ? styles.incoming : frames.current === DEFAULT ? styles.outgoing : ""}`}
              />
            ))}
          </span>
        </span>
      </button>
      <SpeechBubble dialogue={expression.dialogue} revealed={revealed} />
    </>
  );
}
