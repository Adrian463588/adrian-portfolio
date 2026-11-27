"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import "./mascot.css";

export type MascotState =
  | "idle"
  | "waving"
  | "hover"
  | "invitation"
  | "clicked"
  | "thinking"
  | "responding";

export type MascotVariant = "fab" | "header" | "transition";

interface AdrianMascotProps {
  state: MascotState;
  variant?: MascotVariant;
  reducedMotion?: boolean;
  className?: string;
}

/**
 * Layered animated SVG chibi mascot derived faithfully from Adrian's avatar profile
 * (swept dark hair, warm expressive eyes, dark blazer over dark tee, Arctic cyan accent).
 */
export function AdrianMascot({
  state,
  variant = "fab",
  reducedMotion = false,
  className,
}: AdrianMascotProps) {
  const uid = useId().replace(/:/g, "");
  const clipId = `mascot-clip-${uid}`;
  const glowId = `mascot-glow-${uid}`;

  const isWavingOrClicked = state === "waving" || state === "clicked";
  const isThinking = state === "thinking";
  const isResponding = state === "responding";
  const isHover = state === "hover";

  return (
    <svg
      viewBox="0 0 80 80"
      aria-hidden="true"
      data-testid="adrian-mascot"
      data-mascot-state={state}
      data-mascot-variant={variant}
      data-reduced-motion={reducedMotion ? "true" : "false"}
      className={cn(
        "mascot-svg block select-none overflow-visible",
        variant === "header" ? "h-full w-full" : "h-14 w-14",
        className
      )}
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="40" cy="40" r="36" />
        </clipPath>
        <radialGradient id={glowId} cx="50%" cy="42%" r="54%">
          <stop offset="0%" stopColor="#65C8F5" stopOpacity="0.28" />
          <stop offset="68%" stopColor="#15171C" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#08090C" stopOpacity="1" />
        </radialGradient>
      </defs>

      {/* Subtle Obsidian + Arctic Cyan backing & ring */}
      <g data-mascot-part="aura" className="mascot-aura">
        <circle cx="40" cy="40" r="37" fill={`url(#${glowId})`} />
        <circle
          cx="40"
          cy="40"
          r="36.5"
          fill="none"
          stroke="#65C8F5"
          strokeOpacity={isHover || isThinking || isResponding ? 0.72 : 0.36}
          strokeWidth={isHover ? 1.75 : 1.25}
        />
      </g>

      <g clipPath={`url(#${clipId})`} className="mascot-body-group">
        {/* Torso & Dark Blazer over Crew Tee */}
        <g data-mascot-part="torso">
          <path
            d="M15 78 C16 61 24 54 40 54 C56 54 64 61 65 78 Z"
            fill="#1B1E26"
            stroke="#2E3442"
            strokeWidth="1.2"
          />
          {/* Inner crew neck tee */}
          <path d="M31 54 L49 54 L45 78 L35 78 Z" fill="#101218" />
          {/* Blazer lapels with subtle Arctic lapel pin */}
          <path d="M31 54 L36 69 L28 65 Z" fill="#252A36" />
          <path d="M49 54 L44 69 L52 65 Z" fill="#252A36" />
          <circle cx="46.5" cy="61.5" r="1.3" fill="#65C8F5" />
          {/* Neck */}
          <path d="M35.5 48 H44.5 V56 C44.5 58 35.5 58 35.5 56 Z" fill="#E6B395" />
        </g>

        {/* Independent Right Arm / Waving Hand */}
        <g data-mascot-part="arm" className="mascot-arm-group">
          {isWavingOrClicked ? (
            <g>
              {/* Raised forearm + sleeve */}
              <path
                d="M54 58 C60 55 64 49 63 42"
                fill="none"
                stroke="#1E232E"
                strokeWidth="7"
                strokeLinecap="round"
              />
              {/* Expressive waving chibi hand */}
              <ellipse cx="63.5" cy="39.5" rx="4.2" ry="4.8" fill="#F4C8AE" stroke="#36221B" strokeWidth="1" />
              <path
                d="M59.8 39.5 C58.6 38.2 59.5 36.2 61 37.2"
                fill="#F4C8AE"
                stroke="#36221B"
                strokeWidth="0.9"
                strokeLinecap="round"
              />
            </g>
          ) : (
            <g>
              {/* Relaxed jacket arm */}
              <path
                d="M56 59 C60 64 61 70 59.5 76"
                fill="none"
                stroke="#1E232E"
                strokeWidth="6.5"
                strokeLinecap="round"
              />
              <circle cx="58.5" cy="73.5" r="3.4" fill="#F4C8AE" stroke="#36221B" strokeWidth="0.9" />
            </g>
          )}
        </g>

        {/* Expressive Chibi Head Layer */}
        <g data-mascot-part="head" className="mascot-head-group">
          {/* Hair Back silhouette */}
          <ellipse cx="40" cy="31" rx="19.5" ry="18.5" fill="#181A22" />

          {/* Ears */}
          <ellipse cx="21.5" cy="37.5" rx="3.2" ry="4.2" fill="#EBBAA0" stroke="#3B241B" strokeWidth="0.9" />
          <ellipse cx="58.5" cy="37.5" rx="3.2" ry="4.2" fill="#EBBAA0" stroke="#3B241B" strokeWidth="0.9" />

          {/* Face oval */}
          <path
            d="M23 32 C23 20 57 20 57 32 C57 44 49 51.5 40 51.5 C31 51.5 23 44 23 32 Z"
            fill="#F4C8AE"
            stroke="#3B241B"
            strokeWidth="1.05"
          />

          {/* Soft chibi cheek blush */}
          <ellipse cx="29.5" cy="40.5" rx="3.2" ry="1.6" fill="#EB8B80" fillOpacity="0.45" />
          <ellipse cx="50.5" cy="40.5" rx="3.2" ry="1.6" fill="#EB8B80" fillOpacity="0.45" />

          {/* Swept Dark Hair Front Bangs */}
          <path
            d="M21.5 34 C20 21 29 12.5 41 13 C52 13.5 59.5 21 58.5 34 C56.5 28 53.5 24 49 23.5 C46 27 42.5 28.5 39 24.5 C36 28 31.5 28.5 28 24 C25 25.5 23 29 21.5 34 Z"
            fill="#191C24"
          />
          {/* Top hair locks & highlight */}
          <path
            d="M29 18 C34 13.5 44 13 50 17 C45 15.5 35 16 29 18 Z"
            fill="#2E3443"
          />

          {/* Expressive Eyebrows */}
          <path
            d={
              isThinking
                ? "M27.5 29.5 Q31.5 27.5 35.5 29.5"
                : isWavingOrClicked
                  ? "M27.5 28 Q31.5 26 35.5 28"
                  : "M27.5 29 Q31.5 27.2 35.5 29"
            }
            fill="none"
            stroke="#191C24"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <path
            d={
              isThinking
                ? "M44.5 28.2 Q48.5 26.2 52.5 28"
                : isWavingOrClicked
                  ? "M44.5 28 Q48.5 26 52.5 28"
                  : "M44.5 29 Q48.5 27.2 52.5 29"
            }
            fill="none"
            stroke="#191C24"
            strokeWidth="1.75"
            strokeLinecap="round"
          />

          {/* Glossy Brown Chibi Eyes + Blink Eyelids */}
          <g data-mascot-part="eyes">
            {/* Left eye */}
            <g transform={isThinking ? "translate(0.9, -0.7)" : undefined}>
              <ellipse cx="31.5" cy="35.5" rx="3.9" ry="4.4" fill="#FFFFFF" />
              <ellipse cx="31.8" cy="35.8" rx="3.1" ry="3.7" fill="#3C2218" />
              <circle cx="31.8" cy="35.7" r="1.6" fill="#150C09" />
              <circle cx="30.6" cy="34.2" r="1.1" fill="#FFFFFF" />
              <circle cx="33.1" cy="37.2" r="0.55" fill="#FFFFFF" fillOpacity="0.85" />
              <path
                d="M27.2 33.8 Q31.5 30 35.8 33.6"
                fill="none"
                stroke="#181A22"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </g>

            {/* Right eye */}
            <g transform={isThinking ? "translate(0.9, -0.7)" : undefined}>
              <ellipse cx="48.5" cy="35.5" rx="3.9" ry="4.4" fill="#FFFFFF" />
              <ellipse cx="48.2" cy="35.8" rx="3.1" ry="3.7" fill="#3C2218" />
              <circle cx="48.2" cy="35.7" r="1.6" fill="#150C09" />
              <circle cx="47.1" cy="34.2" r="1.1" fill="#FFFFFF" />
              <circle cx="49.6" cy="37.2" r="0.55" fill="#FFFFFF" fillOpacity="0.85" />
              <path
                d="M44.2 33.6 Q48.5 30 52.8 33.8"
                fill="none"
                stroke="#181A22"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </g>

            {/* Natural Blink Eyelid Overlay */}
            <g data-mascot-part="eyelids" className="mascot-eyelids">
              <ellipse cx="31.5" cy="35.5" rx="4.3" ry="4.7" fill="#F4C8AE" />
              <ellipse cx="48.5" cy="35.5" rx="4.3" ry="4.7" fill="#F4C8AE" />
              <path d="M27.4 36 Q31.5 37.5 35.6 36" fill="none" stroke="#181A22" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M44.4 36 Q48.5 37.5 52.6 36" fill="none" stroke="#181A22" strokeWidth="1.3" strokeLinecap="round" />
            </g>
          </g>

          {/* Subtle nose */}
          <path d="M39.5 40.3 Q40 41.1 40.5 40.3" fill="none" stroke="#C58B6D" strokeWidth="1" strokeLinecap="round" />

          {/* Expressive Mouth Layer */}
          <g data-mascot-part="mouth" className="mascot-mouth-group">
            {isThinking ? (
              <ellipse
                cx="40.5"
                cy="45"
                rx="1.9"
                ry="1.6"
                fill="#A84C4C"
                stroke="#3B241B"
                strokeWidth="0.9"
              />
            ) : isWavingOrClicked ? (
              <g>
                <path
                  d="M34.5 43.2 Q40 49.2 45.5 43.2 Z"
                  fill="#B44D4D"
                  stroke="#3B241B"
                  strokeWidth="0.9"
                  strokeLinejoin="round"
                />
                <path d="M37 46 Q40 47.4 43 46 Q40 44.8 37 46 Z" fill="#EA8D88" />
              </g>
            ) : isResponding ? (
              <path
                d="M36 43.5 Q40 47.5 44 43.5 Z"
                fill="#B44D4D"
                stroke="#3B241B"
                strokeWidth="0.9"
              />
            ) : (
              <path
                d="M35.8 43.8 Q40 47.2 44.2 43.8"
                fill="none"
                stroke="#3B241B"
                strokeWidth="1.35"
                strokeLinecap="round"
              />
            )}
          </g>
        </g>
      </g>

      {/* Active Thinking Indicator — strictly synchronized to genuine active thinking state */}
      {isThinking && (
        <g data-mascot-part="thinking-dots" transform="translate(54, 11)">
          <rect
            x="0"
            y="0"
            width="24"
            height="12"
            rx="6"
            fill="#15171C"
            stroke="#65C8F5"
            strokeOpacity="0.65"
            strokeWidth="1"
          />
          <circle cx="6.5" cy="6" r="1.6" fill="#65C8F5" className="mascot-dot-1" />
          <circle cx="12" cy="6" r="1.6" fill="#65C8F5" className="mascot-dot-2" />
          <circle cx="17.5" cy="6" r="1.6" fill="#65C8F5" className="mascot-dot-3" />
        </g>
      )}
    </svg>
  );
}
