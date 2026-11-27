"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Check, Copy, Share2, X } from "lucide-react";
import { SITE_CONFIG } from "@/config/site.config";

export interface ProfileShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHARE_PAYLOAD = {
  title: `${SITE_CONFIG.name} — Portfolio`,
  text: "Explore Adrian's professional experience and software projects.",
  url: SITE_CONFIG.shareUrl,
};

function getDisplayHost(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

export function ProfileShareDialog({ isOpen, onClose }: ProfileShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [copyFallbackVisible, setCopyFallbackVisible] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const fallbackInputRef = useRef<HTMLInputElement>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCanNativeShare(
      typeof navigator !== "undefined" && typeof navigator.share === "function"
    );
  }, []);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      setCopyFallbackVisible(false);
      setStatusMessage("");
      return;
    }

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopy = useCallback(async () => {
    if (resetTimerRef.current !== null) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(SITE_CONFIG.shareUrl);
      setCopyFallbackVisible(false);
      setCopied(true);
      setStatusMessage("Portfolio link copied to clipboard.");
      resetTimerRef.current = setTimeout(() => {
        setCopied(false);
        setStatusMessage("");
      }, 2000);
    } catch {
      setCopied(false);
      setCopyFallbackVisible(true);
      setStatusMessage("Automatic copy unavailable. Select and copy the URL below.");
      window.requestAnimationFrame(() => {
        fallbackInputRef.current?.focus();
        fallbackInputRef.current?.select();
      });
    }
  }, []);

  const handleNativeShare = useCallback(async () => {
    if (typeof navigator === "undefined" || typeof navigator.share !== "function") {
      return;
    }
    try {
      await navigator.share(SHARE_PAYLOAD);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      // Graceful silent degradation to Copy link if OS share sheet rejects unexpectedly
      setCopyFallbackVisible(true);
    }
  }, []);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-[#08090C]/80 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-sm transition-opacity duration-180 motion-reduce:transition-none sm:items-center sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        id="profile-share-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-profile-heading"
        className="w-full max-w-[392px] rounded-2xl border border-white/15 bg-[#0D0F14] p-5 text-[#F2F0EC] shadow-[0_24px_64px_rgba(0,0,0,0.75)] transition-transform duration-180 motion-reduce:transition-none sm:p-6"
      >
        {/* Top Row */}
        <div className="flex items-center justify-between gap-3">
          <h2
            id="share-profile-heading"
            className="font-display text-base font-semibold tracking-tight text-[#F2F0EC]"
          >
            Share profile
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close share profile dialog"
            className="inline-flex h-11 w-11 -mr-2 items-center justify-center rounded-full border border-white/12 bg-[#15171C] text-[#A7ADB7] transition-colors hover:border-[#65C8F5] hover:text-[#F2F0EC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65C8F5]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Identity */}
        <div className="mt-3 flex flex-col items-center text-center">
          <div className="h-12 w-12 overflow-hidden rounded-full border border-[#65C8F5]/50 bg-[#15171C]">
            <Image
              src={SITE_CONFIG.portraitImage}
              alt={SITE_CONFIG.name}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-2.5 font-display text-lg font-bold tracking-tight text-[#F2F0EC]">
            {SITE_CONFIG.name}
          </p>
          <p className="mt-0.5 text-xs text-[#A7ADB7]">{SITE_CONFIG.jobTitle}</p>
        </div>

        {/* Crisp Static SVG QR Card (zero filter/blur over modules) */}
        <div className="mt-5 flex justify-center">
          <div className="rounded-2xl border border-white/15 bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/profile/portfolio-qr.svg"
              alt={`QR code linking to ${SITE_CONFIG.shareUrl}`}
              width={232}
              height={232}
              decoding="sync"
              className="block h-[220px] w-[220px] sm:h-[236px] sm:w-[236px]"
              style={{ imageRendering: "pixelated" }}
            />
          </div>
        </div>

        {/* Canonical URL */}
        <p className="mt-4 text-center font-mono text-xs tracking-wide text-[#65C8F5] select-all">
          {getDisplayHost(SITE_CONFIG.shareUrl)}
        </p>

        {/* Manual Clipboard Fallback when navigator.clipboard fails */}
        {copyFallbackVisible && (
          <div className="mt-3 space-y-1.5">
            <label htmlFor="share-fallback-url" className="block text-[11px] text-[#A7ADB7]">
              Copy URL manually:
            </label>
            <input
              ref={fallbackInputRef}
              id="share-fallback-url"
              type="text"
              readOnly
              value={SITE_CONFIG.shareUrl}
              onFocus={(e) => e.currentTarget.select()}
              className="min-h-[44px] w-full rounded-xl border border-white/15 bg-[#15171C] px-3 py-2 font-mono text-xs text-[#F2F0EC] focus:border-[#65C8F5] focus:outline-none"
            />
          </div>
        )}

        {/* Primary Actions */}
        <div className="mt-4 flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className={`active-press inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65C8F5] ${
              copied
                ? "bg-[#65C8F5] text-[#08090C]"
                : "bg-[#F2F0EC] text-[#08090C] hover:bg-[#65C8F5]"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" aria-hidden="true" />
                <span>Copy link</span>
              </>
            )}
          </button>

          {canNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="active-press inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-full border border-white/15 bg-[#15171C] px-4 py-2 text-xs font-medium text-[#F2F0EC] transition-colors motion-reduce:transition-none hover:border-[#65C8F5] hover:text-[#65C8F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65C8F5]"
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              <span>Share link</span>
            </button>
          )}
        </div>

        {/* Supporting Copy & Screen Reader Feedback */}
        <p className="mt-3.5 text-center text-xs text-[#A7ADB7]">
          Scan the QR code to explore my portfolio.
        </p>
        <p className="sr-only" aria-live="polite">
          {statusMessage}
        </p>
      </div>
    </div>,
    document.body
  );
}
