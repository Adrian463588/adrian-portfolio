# Design: IndexNow Bulk Submission Alignment & Execution

## Request Contract
```http
POST /IndexNow HTTP/1.1
Content-Type: application/json; charset=utf-8
Host: api.indexnow.org
{
  "host": "adriansyahabidin.vercel.app",
  "key": "66f0d196e94c432d91b2984a9156e7fa",
  "keyLocation": "https://adriansyahabidin.vercel.app/66f0d196e94c432d91b2984a9156e7fa.txt",
  "urlList": [
    "https://adriansyahabidin.vercel.app/",
    "https://adriansyahabidin.vercel.app/projects/",
    "https://adriansyahabidin.vercel.app/resources/",
    "..."
  ]
}
```

## Changes
1. Update `INDEXNOW_ENDPOINT` in `scripts/submit-indexnow.mjs` to `https://api.indexnow.org/IndexNow` to match the official IndexNow HTTP specification verbatim.
2. Add a pure `describeIndexNowStatus(status)` helper mapping `200`, `202`, `400`, `403`, `422`, and `429` to clear diagnostic reasons matching IndexNow docs without external dependencies.
3. Add TDD unit tests in `tests/unit/indexnow.test.ts` covering `INDEXNOW_ENDPOINT` and `describeIndexNowStatus`.
4. Verify preconditions (`GET https://adriansyahabidin.vercel.app/66f0d196e94c432d91b2984a9156e7fa.txt` and `sitemap.xml`), execute `npm run seo:indexnow`, and verify all quality/security gates before PR merge.
