# Delta Spec: Animated Chibi Mascot & Conversational UI Refinement

## ADDED Requirements

### Requirement: Interactive Animated Chibi Mascot Launcher & Shared Transition
Ask Adrian SHALL replace the circular icon FAB with a single animated chibi mascot modeled after Adrian's avatar artwork, supporting restrained `idle`, periodic `waving` attention, `hover`, transient `invitation` pill (`Say hi!` / `Halo!` or dots without auto-opening), `clicked` micro-reaction, real request-linked `thinking` (`isStreaming && !text`), `responding` (actively streaming tokens), and smooth shared-element transition between the FAB and dialog header (and reverse close), while removing any redundant open-state `X` FAB button and never displaying two active mascots simultaneously. All mascot motion SHALL respect `prefers-reduced-motion`.

#### Scenario: User opens and closes Ask Adrian with shared mascot transition
- **WHEN** a visitor activates the chibi mascot launcher
- **THEN** the dialog opens smoothly via Header Close (`X`) control, no bottom-right `X` FAB button is rendered while open, and only one active mascot transitions cleanly to the dialog header (and reverses to the FAB on close/Escape while restoring keyboard focus).

#### Scenario: Mascot reflects live request states accurately
- **WHEN** an outgoing message waits for the first token (`isStreaming && !text`)
- **THEN** the mascot displays the `thinking` state, transitions to `responding` while tokens stream, and returns to `idle` once complete (never showing fake typing while idle).

## MODIFIED Requirements

### Requirement: Visually Distinct Overflow-Free Chat Bubbles & Clean Conversational UI
Chat threads SHALL visually separate right-aligned user bubbles (muted cyan/dark-blue surface with `#F2F0EC` text) from left-aligned assistant bubbles (dark graphite `#15171C` surface with `#E6E4DF` text), preserve PR #6 word wrapping and Markdown safety caps, avoid yanking scrolled-up readers during streaming, omit the noisy footer disclaimer box under the composer, present simplified bilingual greetings and 3 preset prompts (`Work experience`, `Featured projects`, `Technical skills` / Indonesian equivalents), and provide a compact animated Settings panel containing segmented controls (`Language: Auto · Indonesia · English`, `Response style: Concise · Detailed`), `Conversation: Clear chat`, and `About & Privacy` without exposing provider/API configuration.
