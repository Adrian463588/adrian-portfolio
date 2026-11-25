# Technical SEO, Search Console & Crawler Readiness Checklist

## 1. Centralized Configuration (`src/config/site.config.ts` & `src/lib/seo.ts`)
- **Production Origin:** `https://adriansyahabidin.vercel.app/` (`metadataBase`, self-referencing `alternates.canonical` across `/`, `/projects/`, and all `71` `/projects/[slug]/` routes).
- **Homepage Metadata:**
  - `<title>`: `Adrian Syah Abidin | Software & QA Automation Engineer`
  - `<meta name="description">`: `"Software and QA Automation Engineer based in Indonesia. Explore my work in quality engineering, DevOps, Android development, applied AI, and enterprise financial systems."`
  - Visible `Hero` eyebrow aligned to `Software & QA Automation Engineer` with single primary `<h1>Adrian Syah Abidin</h1>`.
- **Route Metadata (`/projects/` & Case Studies):**
  - `/projects/`: `Engineering Projects | Adrian Syah Abidin` + dedicated collection description and `CollectionPage` JSON-LD.
  - Featured case studies (`android-stress-detection`, `quran-plus`, `coffee-creator`, `adzan-plus`, `parfum-creator`) expose unique `seoTitle`, `seoDescription`, self-referencing canonicals, Open Graph cards with project screenshots, and X/Twitter `summary_large_image` tags.
- **Open Graph & Icons:** `en_US` locale, static `1200×630` PNG (`public/og-image.png`), vector SVG favicon (`src/app/icon.svg`).

## 2. Structured Data Graph (`Schema.org`)
- **`/`:** `@graph` linking `WebSite` (`#website`), `Person` (`#person` with `image`, `alumniOf`, verified issued `hasCredential` entries, and `sameAs` across GitHub, LinkedIn, and Medium; historical employers and unconfirmed pending credentials excluded), and `ProfilePage` (`#profilepage`, `dateModified` derived from real catalog updates).
- **`/projects/`:** `CollectionPage` + `BreadcrumbList` linked to `#website` and `#person`.
- **`/projects/[slug]/`:** `SoftwareSourceCode` (linking `codeRepository`, `programmingLanguage`, screenshot `image`, and optional SPDX `license` to `author: { "@id": "#person" }`) + `BreadcrumbList`.

## 3. Sitemap, Robots & Crawler Policy
- **`/robots.txt` (`src/app/robots.ts`):** `Allow: /` + `Sitemap: https://adriansyahabidin.vercel.app/sitemap.xml` (no `Disallow: /`, no blocking of JS/CSS/WebP assets).
- **`/sitemap.xml` (`src/app/sitemap.ts`):** Derived cleanly from `projects` (`73` canonical HTTPS URLs total: `/`, `/projects/`, `71` `/projects/[slug]/` routes) with real `lastModified` dates and zero preview URLs, `#` fragments, query strings, or removed enterprise routes.
- **AI Search & Training Crawler Policy:** Standard search/discovery crawlers (`Googlebot`, `Bingbot`, `OAI-SearchBot`, `PerplexityBot`) can read complete semantic HTML (`<h1>`, headings, experience, case studies, JSON-LD) in initial static HTML without depending on WebGL canvas rendering. We rely on canonical technical SEO and structured data rather than unrequired `llms.txt` hacks.
- **Vercel Preview Noindex Preservation:** Production serves clean indexable HTML (`x-robots-tag: null`), while Vercel's built-in preview deployment `noindex` behavior remains untouched (`vercel.json` never overrides preview indexing headers).

## 4. Search Engine Registration & Off-Page Checklist (Owner Actions)
1. **Google Search Console (`https://search.google.com/search-console/`):**
   - URL Prefix property: `https://adriansyahabidin.vercel.app/`
   - HTML Verification Meta Tag configured in `src/app/layout.tsx`: `P4O6B5PWmL-5E0i5XRbfkOSaPcop92urgS2lk-IAZ5s` (already present in live HTML).
   - Click **Verify** (do **not** remove the meta tag afterward), submit `sitemap.xml`, inspect `/` & flagship project URLs (`android-stress-detection`, `quran-plus`, `coffee-creator`, `parfum-creator`), and request indexing if needed.
2. **Bing Webmaster Tools (`https://www.bing.com/webmasters/`):** Import from verified Google Search Console or verify cleanly, then submit `https://adriansyahabidin.vercel.app/sitemap.xml`.
3. **Natural Off-Page Authority:** Keep `https://adriansyahabidin.vercel.app/` linked consistently from GitHub profile README, featured repository homepages, LinkedIn profile & Featured items, and Medium bio.
