# IndexNow URL Submission Specification

## Metadata
- **Target Host**: `adriansyahabidin.vercel.app`
- **Endpoint**: `POST https://api.indexnow.org/IndexNow` (`Content-Type: application/json; charset=utf-8`)
- **Public Key**: `66f0d196e94c432d91b2984a9156e7fa`
- **Key Location**: `https://adriansyahabidin.vercel.app/66f0d196e94c432d91b2984a9156e7fa.txt`
- **Source of URLs**: `https://adriansyahabidin.vercel.app/sitemap.xml` (or explicit CLI/workflow `--urls` / `--deleted` list)

## Invariants
1. **Key Ownership Pre-Flight**: No `POST /IndexNow` request SHALL be dispatched unless `GET https://adriansyahabidin.vercel.app/66f0d196e94c432d91b2984a9156e7fa.txt` returns HTTP `200` (without redirect) and trimmed body equals `66f0d196e94c432d91b2984a9156e7fa`.
2. **Same-Origin HTTPS Allowlist**: Every URL in `urlList` MUST use `https:` and match origin `https://adriansyahabidin.vercel.app`, with `#fragment` stripped and duplicate entries eliminated.
3. **Batch Bound & Rate Restraint**: A single `POST /IndexNow` request SHALL contain between `1` and `10,000` URLs; empty URL lists MUST short-circuit with zero HTTP requests, and automated CI submissions MUST skip commits that do not touch `src/`, `public/`, `next.config.ts`, or `vercel.json`.
4. **Zero Secret Leakage**: Only the public IndexNow verification key and public canonical URLs are transmitted; no private tokens, `.env.local` values, or non-indexed drafts may enter `urlList`.

## Requirements

### Requirement: Official IndexNow Bulk Submission Contract
The submission client (`scripts/submit-indexnow.mjs`) SHALL dispatch `POST https://api.indexnow.org/IndexNow` with `Content-Type: application/json; charset=utf-8` and JSON body `{ host, key, keyLocation, urlList }` parameterized for `adriansyahabidin.vercel.app`.

#### Scenario: Live bulk submission of production sitemap URLs succeeds
- **Given** `https://adriansyahabidin.vercel.app/66f0d196e94c432d91b2984a9156e7fa.txt` responds with HTTP `200` and body `66f0d196e94c432d91b2984a9156e7fa`
- **And** `https://adriansyahabidin.vercel.app/sitemap.xml` returns HTTP `200` with canonical portfolio URLs
- **When** `npm run seo:indexnow` executes `POST https://api.indexnow.org/IndexNow`
- **Then** the request payload uses `host: "adriansyahabidin.vercel.app"`, `key: "66f0d196e94c432d91b2984a9156e7fa"`, `keyLocation: "https://adriansyahabidin.vercel.app/66f0d196e94c432d91b2984a9156e7fa.txt"`, and deduplicated `urlList`
- **AND** IndexNow responds with HTTP `200` (`Ok`) or `202` (`Accepted`)

#### Scenario: Foreign-origin, insecure, or duplicate URLs are sanitized before dispatch
- **Given** an input list containing relative paths, duplicate URLs, `#fragment` suffixes, `http://` URLs, or third-party hosts
- **When** `normalizeAndFilterUrls` processes the list
- **Then** foreign-origin and non-HTTPS URLs are excluded
- **AND** relative paths resolve against `https://adriansyahabidin.vercel.app` with duplicates removed

#### Scenario: IndexNow HTTP error codes are surfaced explicitly
- **Given** `https://api.indexnow.org/IndexNow` returns HTTP `400`, `403`, `422`, or `429`
- **When** the submission runner evaluates the response
- **Then** it classifies the protocol reason (`Invalid format`, `Key not valid`, `URL/host or key schema mismatch`, or `Too Many Requests`) and exits non-zero without retrying blindly

#### Scenario: Non-content repository updates avoid unnecessary submissions
- **Given** a production deployment whose commit only changes `openspec/`, `docs/`, `tests/`, or `.github/`
- **When** the CI workflow runs `node scripts/submit-indexnow.mjs --ci-filter`
- **Then** `shouldTriggerIndexNowForFiles` returns `false` and the workflow exits `0` without calling `api.indexnow.org`

## Verification Gates
1. `npm run lint` and `npm run typecheck` pass with zero errors.
2. `npx vitest run` passes all unit tests including `tests/unit/indexnow.test.ts` and `tests/unit/seo.test.ts`.
3. `npm run check:secrets`, `npm run seo:validate`, `npm run seo:audit`, and `npm run seo:links` pass.
4. Live `npm run seo:indexnow` execution verifies `keyLocation` HTTP `200` and receives HTTP `200` or `202` from `https://api.indexnow.org/IndexNow`.
