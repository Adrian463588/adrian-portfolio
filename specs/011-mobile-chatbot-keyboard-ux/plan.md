# Mobile chatbot keyboard UX

The acceptance criteria live in the OpenSpec change `fix-mobile-chatbot-keyboard-ux`.

Reuse the current panel surface, bubbles and chibi transition. Give the phone sheet a compact height capped by the visible viewport, using the existing 4 px spacing scale for its gutters. Keep the tablet and desktop floating at the bottom right. Reserve safe-area gutters and keep the header and composer outside the scrollable area. In a wide, short panel, place the composer beside the conversation to leave room for history.

Use CSS dynamic viewport units as the baseline. While a panel is mounted, synchronize its size and bottom inset to the visual viewport. Update CSS properties directly on viewport events and remove listeners on close. Test focus and geometry in Chromium and WebKit, and verify the native keyboard on connected Android hardware.
