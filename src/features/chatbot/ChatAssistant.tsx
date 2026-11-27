"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { ChatFAB } from "./ChatFAB";

const LazyChatWidget = dynamic(() => import("./ChatWidget"), {
  ssr: false,
});

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);

  const handleToggle = useCallback(() => {
    setHasLoaded(true);
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    window.requestAnimationFrame(() => {
      fabRef.current?.focus();
    });
  }, []);

  return (
    <>
      <ChatFAB ref={fabRef} isOpen={isOpen} onToggle={handleToggle} />
      {hasLoaded && isOpen && <LazyChatWidget onClose={handleClose} />}
    </>
  );
}
