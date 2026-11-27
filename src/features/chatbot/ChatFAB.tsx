"use client";

import { forwardRef, type RefObject } from "react";
import { AdrianMascot, type MascotState } from "./mascot/AdrianMascot";

export type AssistantTransitionPhase = "closed" | "opening" | "open" | "closing";

interface ChatFABProps {
  phase: AssistantTransitionPhase;
  mascotState: MascotState;
  showInvitation: boolean;
  invitationText: string;
  reducedMotion: boolean;
  onOpen: () => void;
  onHoverChange: (hovered: boolean) => void;
  closingAnchorRef: RefObject<HTMLDivElement | null>;
}

export const ChatFAB = forwardRef<HTMLButtonElement, ChatFABProps>(function ChatFAB(
  {
    phase,
    mascotState,
    showInvitation,
    invitationText,
    reducedMotion,
    onOpen,
    onHoverChange,
    closingAnchorRef,
  },
  ref
) {
  if (phase === "opening" || phase === "open") {
    return null;
  }

  if (phase === "closing") {
    return (
      <div
        ref={closingAnchorRef}
        aria-hidden="true"
        className="pointer-events-none fixed bottom-5 right-5 z-40 h-16 w-16 opacity-0"
      />
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5">
      {showInvitation && !reducedMotion && (
        <div
          data-testid="mascot-invitation-pill"
          aria-hidden="true"
          className="mascot-invitation-pill pointer-events-none flex items-center gap-1.5 rounded-full border border-[#65C8F5]/30 bg-[#15171C]/95 px-3 py-1.5 text-xs font-medium text-[#F2F0EC] shadow-[0_10px_24px_rgba(0,0,0,0.55)] backdrop-blur-md"
        >
          <span>{invitationText}</span>
          <span className="flex items-center gap-0.5" aria-hidden="true">
            <span className="h-1 w-1 rounded-full bg-[#65C8F5]/90" />
            <span className="h-1 w-1 rounded-full bg-[#65C8F5]/65" />
            <span className="h-1 w-1 rounded-full bg-[#65C8F5]/45" />
          </span>
        </div>
      )}

      <button
        ref={ref}
        type="button"
        onClick={onOpen}
        onPointerEnter={() => onHoverChange(true)}
        onPointerLeave={() => onHoverChange(false)}
        onFocus={() => onHoverChange(true)}
        onBlur={() => onHoverChange(false)}
        aria-label="Open Ask Adrian AI assistant"
        aria-expanded={false}
        aria-controls="ask-adrian-dialog"
        className="group relative flex h-16 w-16 items-center justify-center rounded-full border border-[#65C8F5]/40 bg-[#0D1017]/95 shadow-[0_14px_34px_rgba(0,0,0,0.65)] backdrop-blur-md transition-[transform,border-color,box-shadow] duration-200 hover:scale-[1.04] hover:border-[#65C8F5]/80 hover:shadow-[0_14px_36px_rgba(101,200,245,0.18)] active:scale-[0.95] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65C8F5]"
      >
        <AdrianMascot
          state={mascotState}
          variant="fab"
          reducedMotion={reducedMotion}
          className="h-14 w-14"
        />
      </button>
    </div>
  );
});
