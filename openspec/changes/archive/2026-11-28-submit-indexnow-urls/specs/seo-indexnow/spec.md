## MODIFIED Requirements

### Requirement: Official IndexNow Bulk Submission Contract
The submission client (`scripts/submit-indexnow.mjs`) SHALL target `https://api.indexnow.org/IndexNow` (`POST /IndexNow HTTP/1.1`), include exact `Content-Type: application/json; charset=utf-8`, report IndexNow protocol status descriptions (`200`, `202`, `400`, `403`, `422`, `429`), and submit all canonical `sitemap.xml` URLs for `adriansyahabidin.vercel.app`.

#### Scenario: Endpoint and status diagnostics match IndexNow specification
- **WHEN** `scripts/submit-indexnow.mjs` builds and executes a submission against `https://api.indexnow.org/IndexNow`
- **THEN** `INDEXNOW_ENDPOINT` equals `"https://api.indexnow.org/IndexNow"`
- **AND** `describeIndexNowStatus` maps `200`, `202`, `400`, `403`, `422`, and `429` to human-readable protocol diagnostics

#### Scenario: Production URLs from sitemap.xml are submitted live
- **WHEN** `npm run seo:indexnow` runs after verifying `https://adriansyahabidin.vercel.app/66f0d196e94c432d91b2984a9156e7fa.txt`
- **THEN** all `81` canonical URLs from `https://adriansyahabidin.vercel.app/sitemap.xml` are sent in 1 batch
- **AND** `api.indexnow.org` returns HTTP `200` or `202`
