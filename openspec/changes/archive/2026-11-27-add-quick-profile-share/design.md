# Design: Quick Profile Share & Static QR Code

## Architecture & Component Choices
1. **Single Source of Truth (`src/config/site.config.ts`)**:
   - Canonical share URL comes from `SITE_CONFIG.url` normalized with trailing slash (`https://adriansyahabidin.vercel.app/`).
   - Used consistently by `scripts/generate-qr.mjs`, `ProfileShareDialog.tsx`, Copy Link, and Native Web Share API payload.
2. **Static Local SVG QR Asset (`public/images/profile/portfolio-qr.svg`)**:
   - Generated locally with `qrcode.toString(..., { type: "svg", errorCorrectionLevel: "Q", margin: 4, color: { dark: "#08090C", light: "#FFFFFF" } })` plus `shape-rendering="crispEdges"` for razor-sharp module geometry on high-DPI/Retina displays.
   - Added to `scripts/validate-assets.mjs` required static asset list and decoded independently in unit/E2E verification with `jsqr`.
3. **Touch & Mouse Gesture Isolation (`useDoubleTap.ts` + `Hero.tsx`)**:
   - Mouse/trackpad double-click uses native React `onDoubleClick` + `onMouseDown` `e.detail > 1` selection guard (zero global `user-select: none`).
   - Touch/pen double-tap uses Pointer Events (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`):
     - Rejects non-touch pointer types inside `useDoubleTap` so mouse never double-fires alongside `onDoubleClick`.
     - Records start coordinates & timestamp on `pointerdown`; invalidates candidate if `pointermove` exceeds `14px` (scroll/drag) or `pointerup - pointerdown > 450ms` (long press) or `pointercancel` fires.
     - Triggers when second valid tap completes within `320ms` (`<= 28px` between taps), applies a `450ms` cooldown lock to suppress synthetic duplicate events, and clears timers cleanly on unmount.
4. **Accessible Native-Grade Dialog (`ProfileShareDialog.tsx`)**:
   - Obsidian `#0D0F14` / Graphite `#15171C` modal (`360–420px` desktop, responsive sheet on mobile with `env(safe-area-inset-bottom)` and zero horizontal overflow), high-contrast white `#FFFFFF` QR card (`220–248px`, zero blur/filters on QR), backdrop dim, `Escape` & backdrop dismiss, Tab/Shift+Tab focus trap, body scroll lock (cooperating cleanly with Lenis), focus restoration to opener element, and CSS `180ms` transitions honoring `prefers-reduced-motion` and `MotionContext`.
