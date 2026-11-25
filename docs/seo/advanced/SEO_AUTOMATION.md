# SEO Automation CLI Documentation

Run static SEO validation, HTML build audits, keyword coverage, and internal link integrity verification via `scripts/seo-cli.mjs`.

| NPM Script | Flag | Purpose |
|------------|------|---------|
| `npm run seo:validate` | `--validate` | Validates `src/data/seo/` records, quality gates, canonical uniqueness, disclosure rules, and zero draft leakage |
| `npm run seo:audit` | `--audit` | Inspects compiled `out/` HTML & `out/sitemap.xml` (`<title>`, meta description, canonical, H1 count, JSON-LD parseability, draft exclusion) |
| `npm run seo:keywords` | `--keywords` | Summarizes intent clusters, published pilot coverage, and gated draft backlog |
| `npm run seo:links` | `--links` | Audits internal `<a href>` targets across `out/` against generated static paths and anchor hashes |
| `npm run seo:report` | `--report` | Runs full validation + audit + links and writes `docs/seo/advanced/SEO_CLI_SNAPSHOT.json` |
