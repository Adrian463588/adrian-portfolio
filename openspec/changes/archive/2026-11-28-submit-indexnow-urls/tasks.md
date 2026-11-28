# Tasks: Submit Production URLs to IndexNow (OpenSpec)

- [x] Phase 1–2: Author canonical `openspec/specs/seo-indexnow/spec.md` and `openspec/changes/submit-indexnow-urls/*`
- [x] Phase 3: Write RED Vitest unit tests in `tests/unit/indexnow.test.ts` for `INDEXNOW_ENDPOINT` (`https://api.indexnow.org/IndexNow`) and `describeIndexNowStatus`
- [x] Phase 4: Implement minimal diff in `scripts/submit-indexnow.mjs` until unit tests pass GREEN
- [x] Phase 5: Execute `npm run seo:indexnow` live against `https://api.indexnow.org/IndexNow` (`HTTP 200 Ok - URL submitted successfully`, `81 URL(s)`)
- [x] Phase 6: Run `lint`, `typecheck`, `test`, `build`, `check:secrets`, `seo:validate`, `seo:audit`, `seo:links`, archive OpenSpec change, push PR, merge to `main`, and verify deployment
