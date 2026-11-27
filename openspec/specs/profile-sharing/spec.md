# Profile Sharing Specification

## Requirements

### Requirement: Multi-Input Quick Share Triggers on Hero Identity
Double-clicking (desktop mouse) or double-tapping (touchscreen via Pointer Events within 250–350 ms without scroll or long-press movement) the semantic `<h1>` name **Adrian Syah Abidin**, OR activating a visually-hidden-until-focused keyboard Share control (`sr-only focus-visible:not-sr-only`, with no visible QR icon button beside **Software & QA Automation Engineer**), SHALL open `ProfileShareDialog` exactly once while preserving `<h1>` typography, alignment, SEO text content, WebGL interactions, and normal website text selection.

#### Scenario: Desktop double-click and accidental highlight prevention
- **WHEN** a desktop visitor double-clicks `<h1>Adrian Syah Abidin</h1>`
- **THEN** `ProfileShareDialog` opens once with accidental multi-click text highlight prevented
- **AND** single-clicking `<h1>` does not open the dialog

#### Scenario: Mobile double-tap vs scroll and long-press isolation
- **WHEN** a touch visitor double-taps `<h1>Adrian Syah Abidin</h1>` within 320 ms without moving past jitter threshold
- **THEN** `ProfileShareDialog` opens once without duplicate synthetic events
- **AND** single-tap, vertical scrolling drag, `pointercancel`, or long-press do not trigger the dialog

### Requirement: Static Verifiable SVG QR Code & Obsidian/Arctic Modal
`ProfileShareDialog` SHALL render Adrian's existing portrait, name, job title, crisp static SVG QR code (`public/images/profile/portfolio-qr.svg` targeting `https://adriansyahabidin.vercel.app/` with Error Correction level Q, >= 4-module quiet zone, white background, crisp dark modules, zero blur/distortion), visible canonical URL, `Copy link` button (`navigator.clipboard.writeText()` + `"Copied!"` live announcement or manual selectable input fallback), and feature-detected native `Share link` button (`navigator.share()`).

#### Scenario: Copy link succeeds or degrades cleanly when Clipboard API is blocked
- **WHEN** the visitor triggers Copy link inside `ProfileShareDialog`
- **THEN** if `navigator.clipboard.writeText()` resolves for `https://adriansyahabidin.vercel.app/`, feedback updates to `"Copied!"` with `aria-live` announcement and resets after ~2 seconds
- **AND** if clipboard permission fails, a selectable read-only input containing `https://adriansyahabidin.vercel.app/` is displayed for manual copying

#### Scenario: Keyboard focus trap, dismissal, and focus restoration
- **WHEN** `ProfileShareDialog` is open and the visitor presses `Escape`, clicks the close button, or clicks the backdrop
- **THEN** the dialog closes cleanly and restores focus to the triggering element without body scroll lock leakage
