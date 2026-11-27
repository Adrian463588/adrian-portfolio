# Change: add-quick-profile-share

## Why
Visitors, recruiters, and the portfolio owner frequently want to share Adrian Syah Abidin's canonical portfolio (`https://adriansyahabidin.vercel.app/`) quickly from desktop browsers or mobile devices without manually copying the address bar URL or opening external QR services.

## What Changes
- **Static Verified QR Code (`public/images/profile/portfolio-qr.svg`)**: Generate an offline SVG QR code at development/build time from canonical `SITE_CONFIG.url` (`https://adriansyahabidin.vercel.app/`) via a local script (`scripts/generate-qr.mjs`) using `node-qrcode` (`errorCorrectionLevel: "Q"`, 4-module white quiet zone, `shape-rendering="crispEdges"`, zero runtime QR API calls).
- **Multi-Input Share Triggers on Hero Name (`src/components/sections/Hero.tsx` + `src/hooks/useDoubleTap.ts`)**:
  - Desktop mouse `onDoubleClick` on semantic `<h1>Adrian Syah Abidin</h1>` prevents accidental blue text selection highlight (`onMouseDown` multi-click guard) and opens `ProfileShareDialog` once without changing typography, `<h1>` text content, SEO, WebGL, or site-wide text selection.
  - Touchscreen double-tap (`useDoubleTap` via Pointer Events) with `250–350 ms` interval, distance tolerance, scroll/long-press/cancel rejection, `touch-action: manipulation` locally, duplicate synthetic click suppression, and unmount cleanup.
  - Small subtle accessible `QrCode` share button near the Hero identity with device-aware tooltip (`Double-click to share profile` / `Double-tap to share profile`) and full keyboard (`Enter` / `Space`) support.
- **Reusable Accessible Share Modal (`src/components/profile/ProfileShareDialog.tsx`)**: Obsidian & Arctic modal inspired by Instagram Share Profile featuring close (`×`), Escape, backdrop dismissal, focus trap + focus restoration, scroll lock, crisp `portfolio-qr.svg`, approved portrait, canonical URL, `Copy link` (Clipboard API + manual selectable fallback + `aria-live` `"Copied!"`), and feature-detected native `Share link` (`navigator.share()`).
