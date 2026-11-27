# Proposal: Fix Chat Bubble Text Overflow & Markdown Security Bounds

## Why
Live reproduction via Chrome DevTools on `https://adriansyahabidin.vercel.app/` (`375px` viewport) confirmed that long URLs, unbroken GitHub repository paths (`Adrian463588/Eksperimen_SML_AdrianSyahAbidin...`), and unspaced strings overflow both user (`scrollWidth: 707` vs `clientWidth: 385`) and assistant (`scrollWidth: 438` vs `clientWidth: 383`) chat bubbles, triggering horizontal scroll (`threadScrollW: 765` vs `threadClientW: 460`) inside Ask Adrian's scrollable thread.

## Scope
- Frontend-only containment & typography fix inside `ChatWidget.tsx` and `renderSafeText.tsx` (`SafeChatMarkdown`).
- Safe fenced code block rendering with local horizontal scroll (`overflow-x-auto`) inside `<pre>` without expanding parent flex bubbles.
- Strict Markdown security bounds (URL protocol/credential/protocol-relative `//` rejection, length/line/token caps, control-character sanitization).
- Unit tests + Playwright multi-viewport regression tests (`320px`, `375px`, `390px`, `1440px`).
- Strictly excludes backend routes, AI provider logic, persona, knowledge JSON, or unrelated components.
