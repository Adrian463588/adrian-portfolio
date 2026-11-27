# Tasks: refine-chatbot-ui-and-animated-mascot

- [x] Audit existing chatbot components, chibi avatar artwork, FAQ presets, and Playwright specs
- [x] Write RED TDD unit tests (`tests/unit/chat-mascot-ui.test.tsx`) for mascot states, single-mascot ownership, X FAB removal, distinct bubbles, removed footer, simplified copy, segmented settings, smart scroll, and reduced motion
- [x] Implement `AdrianMascot` layered SVG & scoped keyframes (`src/features/chatbot/mascot/`)
- [x] Refactor `ChatFAB.tsx` and `ChatAssistant.tsx` for mascot launcher + shared-element GSAP transition & reverse close without redundant `X` FAB
- [x] Refine `ChatWidget.tsx` & `types.ts` (distinct bubbles, smart scroll, removed footer, simplified greetings/chips, compact animated Settings with `About & Privacy`)
- [x] Update & run Playwright E2E tests (`320px`, `375px`, `390px`, `1440px`, reduced motion, `axe-core`) and capture before/after screenshots + Chrome DevTools animation/performance checks
- [x] Run `npm run knowledge:validate`, `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build`, `npm run check:secrets`, and `gitleaks`
- [x] Approved and shipped: commit, merge into `main`, push to GitHub, and verify Vercel production deployment
