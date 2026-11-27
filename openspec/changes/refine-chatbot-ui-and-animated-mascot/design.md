# Design: Animated Chibi Mascot & Conversational UI Refinement

## 1. Component Architecture (KISS / YAGNI / Single Ownership)
- `src/features/chatbot/mascot/AdrianMascot.tsx` + `src/features/chatbot/mascot/mascot.css`:
  - Stateless layered SVG mascot referencing Adrian's chibi identity (swept dark charcoal hair, warm expressive eyes with independent eyelid blink group, expressive mouth per state, dark blazer over dark tee, cyan accent ring, independently animated waving right hand, active thinking dots).
  - Supports states: `"idle" | "waving" | "hover" | "invitation" | "clicked" | "thinking" | "responding"`, plus `reducedMotion` mode disabling non-essential motion timers & keyframe loops.
- `src/features/chatbot/ChatAssistant.tsx`:
  - Owns open/close lifecycle (`"closed" | "opening" | "open" | "closing"`), periodic low-frequency `waving` and `invitation` timers while closed (suppressed when reduced-motion is active or once opened in session), and the single shared-element mascot transition via `gsap` coordinate interpolation between FAB rect and Header slot rect.
  - Only ONE visible `<AdrianMascot />` renders at any instant; open-state redundant `X` FAB button is removed completely.
- `src/features/chatbot/ChatFAB.tsx`:
  - Renders accessible mascot trigger button (`Open Ask Adrian AI assistant`) when closed (or invisible target anchor during reverse closing flight) plus optional non-blocking `"Say hi!"` / `"Halo!"` / three-dot invitation chip.
- `src/features/chatbot/ChatWidget.tsx` + `src/features/chatbot/types.ts`:
  - Accepts registered header mascot slot ref (`mascotSlotRef`) and streams live mascot activity (`"idle" | "thinking" | "responding"`) back to the single header mascot owner without duplicating `<AdrianMascot />`.
  - Distinguishes bubbles visually (user right `#0F2B3C` muted cyan/dark blue `#F2F0EC`; assistant left `#15171C` dark graphite `#E6E4DF`) while preserving all PR #6 `[overflow-wrap:anywhere]`, `min-w-0`, and local `<pre overflow-x-auto>` containment.
  - Bottom-pin auto-scroll checks `scrollHeight - scrollTop - clientHeight <= 56` on user scroll so streaming tokens never hijack scrolled-up reading.
  - Compact animated Settings panel uses CSS `grid-template-rows` + opacity transition, CSS transform sliding pill active indicator on `Language` (`Auto | Indonesia | English`) & `Response style` (`Concise | Detailed`), `Conversation -> Clear chat`, and `About & Privacy` note.
