"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ResilientImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
  fallbackTitle: string;
  fallbackCategory?: string;
  fallbackClassName?: string;
}

/**
 * Static-export safe image renderer with deterministic fallback on load failure.
 * Avoids broken browser image icons, exposed long alt text, and retry loops.
 */
export function ResilientImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  loading,
  fallbackTitle,
  fallbackCategory,
  fallbackClassName,
}: ResilientImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const isFailed = failedSrc === src;

  if (isFailed) {
    return (
      <div
        role="img"
        aria-label={fallbackTitle}
        data-image-fallback="true"
        className={cn(
          "flex h-full w-full flex-col justify-between border border-white/10 bg-gradient-to-br from-[#15171C] via-[#101217] to-[#08090C] p-5 text-left",
          fallbackClassName
        )}
      >
        {fallbackCategory && (
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#65C8F5]">
            {fallbackCategory}
          </span>
        )}
        <p className="font-display text-base font-bold tracking-tight text-[#F2F0EC]">
          {fallbackTitle}
        </p>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      loading={priority ? undefined : loading}
      onError={() => setFailedSrc(src)}
      className={className}
    />
  );
}
