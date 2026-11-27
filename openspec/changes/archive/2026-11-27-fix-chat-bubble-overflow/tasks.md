# Tasks: Fix Chat Bubble Overflow & Markdown Security

- [x] Add RED TDD unit tests in `tests/unit/chat-markdown-overflow.test.tsx` covering overflow CSS boundaries, fenced code blocks, streaming partial code blocks, and Markdown security limits
- [x] Add Playwright overflow regression checks in `tests/e2e/portfolio.spec.ts` (`320px`, `375px`, `390px`, `1440px`) for long URLs, repo names, Markdown lists, and code blocks
- [x] Update `src/features/chatbot/renderSafeText.tsx` with flex/wrap rules, fenced `<pre>` code blocks, and `MARKDOWN_SECURITY_LIMITS`
- [x] Update `src/features/chatbot/ChatWidget.tsx` with `min-w-0`, `max-w-full`, `[overflow-wrap:anywhere]`, and shared chip helpers
- [x] Run `lint`, `typecheck`, `test`, `build`, `validate:assets`, `check:secrets`, `gitleaks`, and full Playwright E2E
- [x] Archive OpenSpec change, commit (`fix(chatbot): resolve message bubble text overflow and responsive layout`), merge PR to `main`, and verify live `https://adriansyahabidin.vercel.app/`
