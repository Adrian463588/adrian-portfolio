"use client";

import { forwardRef } from "react";
import { MessageCircle, X } from "lucide-react";

interface ChatFABProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatFAB = forwardRef<HTMLButtonElement, ChatFABProps>(function ChatFAB(
  { isOpen, onToggle },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? "Close Ask Adrian AI assistant" : "Open Ask Adrian AI assistant"}
      aria-expanded={isOpen}
      aria-controls="ask-adrian-dialog"
      className={`active-press fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#F2F0EC] text-[#08090C] shadow-[0_12px_32px_rgba(0,0,0,0.55)] ring-1 ring-white/20 transition-colors hover:bg-[#65C8F5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#65C8F5] ${
        isOpen ? "hidden sm:flex" : "flex"
      }`}
    >
      {isOpen ? (
        <X className="h-5 w-5" aria-hidden="true" />
      ) : (
        <MessageCircle className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
});
