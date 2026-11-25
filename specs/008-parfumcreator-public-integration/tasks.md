# Tasks 008 — ParfumCreator Public Repository Integration

- [x] T001 Verify unauthenticated public GitHub API/HTML access, release `v1.3.1`, and `docs/screenshots/` assets
- [x] T002 Convert 4 authentic `v1.3.1` PNG screenshots (`formula`, `templates`, `library`, `chat`) to `public/projects/parfum-creator-*.webp` and inspect visually
- [x] T003 Run `npm run sync:github` and verify `ParfumCreator` is present in `src/data/github-repositories.json`
- [x] T004 Move `ParfumCreator` from `src/data/curated-projects.ts` into `src/data/project-overrides.ts` with public metadata, factual copy, release `v1.3.1`, and 4 screenshots
- [x] T005 Refresh `README.md` V8 table & `specs/008-*` + `docs/audit/V8_PARFUMCREATOR_AUDIT.md`
- [x] T006 Update `tests/unit/projects.test.ts` & `tests/e2e/portfolio.spec.ts` covering `TC-PC-001`..`TC-PC-018`
- [x] T007 Run `validate:assets`, `lint`, `typecheck`, `test`, `build`, `validate:assets`, `test:e2e`, Chrome DevTools Lighthouse & screenshot inspection
- [x] T008 Commit V8, merge cleanly to `main`, push `origin main`, and verify remote state
