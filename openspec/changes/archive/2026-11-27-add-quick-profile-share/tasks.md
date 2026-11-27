# Tasks: Quick Profile Share & QR Code

- [x] Install devDependencies `qrcode`, `@types/qrcode`, and `jsqr` (zero new runtime dependencies)
- [x] Design Sprint 10 `ProfileShareDialog` desktop & mobile frame in `design/portfolio.figcraft` and inspect visual export
- [x] Generate canonical `public/images/profile/portfolio-qr.svg` via `scripts/generate-qr.mjs` and include it in `scripts/validate-assets.mjs`
- [x] Implement `src/hooks/useDoubleTap.ts` with Pointer Events gesture validation and cleanup
- [x] Implement `src/components/profile/ProfileShareDialog.tsx` (Instagram-inspired Obsidian & Arctic card, QR, Copy link + manual fallback, feature-detected `navigator.share`, focus trap, Escape/backdrop close, focus restoration)
- [x] Wire Hero triggers cleanly into `src/components/sections/Hero.tsx` (`onDoubleClick` + selection guard on `<h1>`, `useDoubleTap`, subtle accessible `QrCode` share button with device-aware tooltip)
- [x] Write Vitest unit tests (`tests/unit/profile-share.test.ts` & `.tsx`) for `useDoubleTap`, `ProfileShareDialog`, clipboard/native-share fallbacks, and independent `jsqr` verification of `portfolio-qr.svg`
- [x] Add Playwright E2E scenarios across Desktop (`1440px`, `1920px`, `1024px`) and Mobile (`320px`, `375px`, `390px`, `768px`), plus Safari/WebKit/Firefox when available, `axe-core` WCAG 2.2 AA check, QR pixel decode verification in browser, and Hero regression checks
- [x] Run full pipeline (`lint`, `typecheck`, `test`, `build`, `validate:assets`, `check:secrets`, `seo:report`, `test:e2e`), archive `add-quick-profile-share`, commit, push, PR, merge, and verify live Vercel production deployment
