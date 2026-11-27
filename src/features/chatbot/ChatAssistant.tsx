"use client";

import dynamic from "next/dynamic";
import gsap from "gsap";
import { useCallback, useEffect, useRef, useState } from "react";
import { useMotion } from "@/context/MotionContext";
import { ChatFAB, type AssistantTransitionPhase } from "./ChatFAB";
import { AdrianMascot, type MascotState } from "./mascot/AdrianMascot";

const LazyChatWidget = dynamic(() => import("./ChatWidget"), {
  ssr: false,
});

interface RectSnapshot {
  left: number;
  top: number;
  width: number;
  height: number;
}

function captureRect(el: HTMLElement | null): RectSnapshot | null {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, width: r.width, height: r.height };
}

export function ChatAssistant() {
  const { qualityMode, isClient } = useMotion();
  const reducedMotion = qualityMode === "reduced";

  const [phase, setPhase] = useState<AssistantTransitionPhase>("closed");
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [closedOverride, setClosedOverride] = useState<MascotState | null>(null);
  const [showInvitation, setShowInvitation] = useState(false);
  const [widgetActivity, setWidgetActivity] = useState<MascotState>("idle");
  const [invitationText, setInvitationText] = useState("Say hi!");

  const fabRef = useRef<HTMLButtonElement>(null);
  const closingAnchorRef = useRef<HTMLDivElement>(null);
  const headerSlotRef = useRef<HTMLDivElement | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);
  const flightRef = useRef<HTMLDivElement>(null);

  const fabRectRef = useRef<RectSnapshot | null>(null);
  const headerRectRef = useRef<RectSnapshot | null>(null);
  const hasOpenedRef = useRef(false);
  const clickTimerRef = useRef<number | null>(null);
  const restoreFocusRef = useRef(false);

  // Subtle locale-appropriate greeting pill label
  useEffect(() => {
    if (!isClient) return;
    if (navigator.language?.toLowerCase().startsWith("id")) {
      setInvitationText("Halo!");
    }
  }, [isClient]);

  // Preload widget chunk smoothly on hover/focus intent
  const preloadWidget = useCallback(() => {
    void import("./ChatWidget");
  }, []);

  // Occasional non-intrusive attention wave + invitation while closed and not yet opened
  useEffect(() => {
    if (phase !== "closed" || reducedMotion || hasOpenedRef.current) {
      return;
    }

    let waveEndTimer: number | null = null;
    let inviteEndTimer: number | null = null;
    let repeatTimer: number | null = null;
    let cycles = 0;

    const triggerAttention = () => {
      if (hasOpenedRef.current || cycles >= 2) return;
      cycles += 1;
      setClosedOverride("waving");
      setShowInvitation(true);

      waveEndTimer = window.setTimeout(() => {
        setClosedOverride((curr) => (curr === "waving" ? null : curr));
      }, 2200);

      inviteEndTimer = window.setTimeout(() => {
        setShowInvitation(false);
      }, 4500);
    };

    const initialTimer = window.setTimeout(() => {
      triggerAttention();
      repeatTimer = window.setInterval(() => {
        if (hasOpenedRef.current || cycles >= 2) {
          if (repeatTimer !== null) window.clearInterval(repeatTimer);
          return;
        }
        triggerAttention();
      }, 22000);
    }, 3500);

    return () => {
      window.clearTimeout(initialTimer);
      if (waveEndTimer !== null) window.clearTimeout(waveEndTimer);
      if (inviteEndTimer !== null) window.clearTimeout(inviteEndTimer);
      if (repeatTimer !== null) window.clearInterval(repeatTimer);
    };
  }, [phase, reducedMotion]);

  // Restore focus deterministically once return transition ends
  useEffect(() => {
    if (phase === "closed" && restoreFocusRef.current) {
      restoreFocusRef.current = false;
      fabRef.current?.focus();
    }
  }, [phase]);

  // Clean up any timers/tweens on unmount
  useEffect(() => {
    const flightEl = flightRef.current;
    const dialogEl = dialogRef.current;
    return () => {
      if (clickTimerRef.current !== null) window.clearTimeout(clickTimerRef.current);
      gsap.killTweensOf([flightEl, dialogEl]);
    };
  }, []);

  const runOpenFlight = useCallback(() => {
    const slotEl = headerSlotRef.current;
    const flightEl = flightRef.current;
    const dialogEl = dialogRef.current;
    const fromRect = fabRectRef.current;
    const toRect = captureRect(slotEl);

    if (
      reducedMotion ||
      !fromRect ||
      !toRect ||
      fromRect.width === 0 ||
      toRect.width === 0 ||
      !flightEl
    ) {
      setPhase("open");
      return;
    }

    gsap.killTweensOf([flightEl, dialogEl]);
    if (dialogEl) {
      gsap.fromTo(
        dialogEl,
        { opacity: 0, y: 16, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "power3.out" }
      );
    }

    gsap.fromTo(
      flightEl,
      {
        left: fromRect.left,
        top: fromRect.top,
        width: fromRect.width,
        height: fromRect.height,
        opacity: 1,
      },
      {
        left: toRect.left,
        top: toRect.top,
        width: toRect.width,
        height: toRect.height,
        duration: 0.3,
        ease: "power3.out",
        onComplete: () => {
          setPhase("open");
        },
      }
    );
  }, [reducedMotion]);

  // Trigger open flight once dynamic ChatWidget has registered both slot and dialog
  const handleRegisterMascotSlot = useCallback(
    (el: HTMLDivElement | null) => {
      headerSlotRef.current = el;
      if (el && phase === "opening") {
        window.requestAnimationFrame(() => {
          runOpenFlight();
        });
      }
    },
    [phase, runOpenFlight]
  );

  const handleRegisterDialog = useCallback((el: HTMLElement | null) => {
    dialogRef.current = el;
  }, []);

  // Reverse shared flight on closing
  useEffect(() => {
    if (phase !== "closing") return;

    const flightEl = flightRef.current;
    const dialogEl = dialogRef.current;
    const fromRect = headerRectRef.current;
    const toRect = captureRect(closingAnchorRef.current);

    if (
      reducedMotion ||
      !fromRect ||
      !toRect ||
      fromRect.width === 0 ||
      toRect.width === 0 ||
      !flightEl
    ) {
      setPhase("closed");
      return;
    }

    gsap.killTweensOf([flightEl, dialogEl]);
    if (dialogEl) {
      gsap.to(dialogEl, {
        opacity: 0,
        y: 12,
        scale: 0.96,
        duration: 0.2,
        ease: "power2.in",
      });
    }

    gsap.fromTo(
      flightEl,
      {
        left: fromRect.left,
        top: fromRect.top,
        width: fromRect.width,
        height: fromRect.height,
        opacity: 1,
      },
      {
        left: toRect.left,
        top: toRect.top,
        width: toRect.width,
        height: toRect.height,
        duration: 0.24,
        ease: "power2.inOut",
        onComplete: () => {
          setPhase("closed");
        },
      }
    );
  }, [phase, reducedMotion]);

  const handleOpen = useCallback(() => {
    if (phase !== "closed") return;
    hasOpenedRef.current = true;
    setShowInvitation(false);
    preloadWidget();
    fabRectRef.current = captureRect(fabRef.current);

    if (reducedMotion) {
      setClosedOverride(null);
      setHasLoaded(true);
      setPhase("open");
      return;
    }

    setClosedOverride("clicked");
    clickTimerRef.current = window.setTimeout(() => {
      setClosedOverride(null);
      setHasLoaded(true);
      setPhase("opening");
    }, 105);
  }, [phase, preloadWidget, reducedMotion]);

  const handleClose = useCallback(() => {
    if (phase === "closed" || phase === "closing") return;
    restoreFocusRef.current = true;

    if (reducedMotion) {
      setPhase("closed");
      return;
    }

    const fromRect = captureRect(headerSlotRef.current);
    if (!fromRect || fromRect.width === 0) {
      setPhase("closed");
      return;
    }

    headerRectRef.current = fromRect;
    setPhase("closing");
  }, [phase, reducedMotion]);

  const handleHoverChange = useCallback(
    (hovered: boolean) => {
      setIsHovered(hovered);
      if (hovered) preloadWidget();
    },
    [preloadWidget]
  );

  const closedMascotState: MascotState =
    closedOverride ?? (isHovered ? "hover" : showInvitation ? "invitation" : "idle");

  const showFlightMascot = (phase === "opening" || phase === "closing") && !reducedMotion;

  return (
    <>
      <ChatFAB
        ref={fabRef}
        phase={phase}
        mascotState={closedMascotState}
        showInvitation={showInvitation}
        invitationText={invitationText}
        reducedMotion={reducedMotion}
        onOpen={handleOpen}
        onHoverChange={handleHoverChange}
        closingAnchorRef={closingAnchorRef}
      />

      {showFlightMascot && (
        <div
          ref={flightRef}
          aria-hidden="true"
          className="pointer-events-none fixed z-[60] flex items-center justify-center rounded-full"
        >
          <AdrianMascot
            state="waving"
            variant="transition"
            reducedMotion={reducedMotion}
            className="h-full w-full"
          />
        </div>
      )}

      {hasLoaded && phase !== "closed" && (
        <LazyChatWidget
          onClose={handleClose}
          showHeaderMascot={phase === "open"}
          mascotState={widgetActivity}
          reducedMotion={reducedMotion}
          onMascotStateChange={setWidgetActivity}
          onRegisterMascotSlot={handleRegisterMascotSlot}
          onRegisterDialog={handleRegisterDialog}
        />
      )}
    </>
  );
}
