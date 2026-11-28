"use client";

import Image from "next/image";
import type { KeyboardEvent, PointerEvent, RefObject } from "react";
import { ResilientImage } from "@/components/ui/ResilientImage";
import { DEFAULT_AVATAR_IMAGE, type AvatarExpressionState } from "./avatarStates";
import styles from "./InteractiveAvatar.module.css";

interface InteractiveAvatarProps {
  buttonRef: RefObject<HTMLButtonElement | null>;
  frames: { current: string; previous: string };
  expression: AvatarExpressionState;
  visible: boolean;
  onActivate: () => void;
  onPointerEnter: (event: PointerEvent<HTMLButtonElement>) => void;
  onPointerLeave: () => void;
}

export function InteractiveAvatar({
  buttonRef,
  frames,
  expression,
  visible,
  onActivate,
  onPointerEnter,
  onPointerLeave,
}: InteractiveAvatarProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.repeat && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
    }
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label="Interact with Adrian's illustrated avatar"
      className={styles.target}
      data-visible={visible}
      onClick={onActivate}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onKeyDown={handleKeyDown}
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
  );
}
