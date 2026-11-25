# Technical SEO & Google Search Console Readiness Checklist

## Implemented On-Site Foundations
- **Primary Host & Canonical Base:** `https://adriansyahabidin.vercel.app/` configured in `metadataBase` and explicit per-route `alternates.canonical` (`/` on homepage, `/projects/` on archive, `/projects/[slug]/` on project detail pages).
- **Title & Meta Description:**
  - Homepage: `Adrian Syah Abidin | Software & QA Automation Engineer`
  - Description: concise human-written summary mentioning enterprise software testing, Cypress automation, DevOps, and personal projects (`<= 160` chars).
  - Deprecated `<meta name="keywords">` removed cleanly.
- **Open Graph & Twitter Preview:** Dedicated `1200x630` PNG (`public/og-image.png`) using Obsidian & Arctic brand typography.
- **Structured Data (`JSON-LD`):**
  - `/`: `@graph` combining `ProfilePage`, `Person` (excluding historical employers from active `worksFor`), and `WebSite`.
  - `/projects/`: `@graph` combining `CollectionPage` and `BreadcrumbList`.
  - `/projects/[slug]/`: `@graph` combining `BreadcrumbList` and `SoftwareSourceCode` / `CreativeWork`.
- **Crawl Directives & Sitemap:**
  - `/robots.txt` allows crawling and references `https://adriansyahabidin.vercel.app/sitemap.xml`.
  - `/sitemap.xml` includes `/`, `/projects/`, and all 70 public repository case study pages with valid `lastModified` dates and excludes removed internal enterprise paths.

## Post-Deploy Verification (Owner Action in Google Search Console)
1. Deploy production branch to `https://adriansyahabidin.vercel.app/`.
2. Open [Google Search Console](https://search.google.com/search-console) for `https://adriansyahabidin.vercel.app/`.
3. Verify property ownership (meta tag or DNS TXT record if not already verified).
4. Submit `https://adriansyahabidin.vercel.app/sitemap.xml` under **Sitemaps**.
5. Run **URL Inspection** on `/` and `/projects/` -> verify canonical, rendered DOM, and **Request Indexing**.
6. Validate rich results (`Person` / `ProfilePage` / `BreadcrumbList`) at [Google Rich Results Test](https://search.google.com/test/rich-results).
