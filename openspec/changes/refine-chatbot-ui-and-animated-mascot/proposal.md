# Proposal: Refine Chatbot UI & Animated Chibi Mascot (Sprint 9.3)

## Why
Current Ask Adrian UI uses a static circular launcher icon, leaves a redundant white `X` button floating below the open dialog, frames a noisy disclaimer footer under the input box, uses nearly indistinguishable grey bubbles for both user and assistant messages, and renders a rigid inline Settings bar.

## Scope
- Replace the static circular FAB icon with a single, lightweight, layered SVG + CSS animated chibi mascot modeled after Adrian (`public/images/avatar/professional-chibi.webp`), paired with Obsidian & Arctic tokens (`#08090C`, `#15171C`, `#65C8F5`, `#F2F0EC`).
- Coordinate a smooth shared-element transition moving the single mascot between bottom-right FAB and dialog header (plus reverse return on close) using CSS + existing `gsap`, eliminating any duplicate simultaneous mascot and removing the redundant open-state `X` FAB button.
- Sync mascot `thinking` and `responding` states strictly to active request streaming (`isStreaming`), alongside tasteful periodic `waving`, `idle` float/blink, subtle `"Say hi!"` / `"Halo!"` / three-dot `invitation`, `hover`, and `clicked` states.
- Redesign chat bubbles (right-aligned muted cyan/dark blue user bubbles vs left-aligned dark graphite assistant bubbles), preserve PR #6 overflow wrapping and Markdown security caps, and add bottom-aware auto-scroll so reading older messages is never interrupted.
- Remove the composer footer disclaimer box, move concise privacy disclosure to **Settings -> About & Privacy**, simplify bilingual greetings/suggested prompts, and redesign Settings as an animated compact panel with segmented active indicators (`Language: Auto / Indonesia / English`, `Response style: Concise / Detailed`, `Conversation: Clear chat`, `About & Privacy`).
- Strictly excludes changes to AI providers, fallback order, knowledge JSON schema, or `/api/chat/` serverless logic.
