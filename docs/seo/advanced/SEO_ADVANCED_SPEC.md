# Advanced SEO Architecture Spec (V10)

- **Site:** `https://adriansyahabidin.vercel.app/`
- **Rendering Mode:** Next.js 16 static export (`output: "export"`, `trailingSlash: true`, `dynamicParams = false`).
- **Objective:** Expand non-branded discovery across software QA automation, offline-first Android AI/mobile engineering, biosignal ML, specialty coffee brewing math, and perfumery formulation without sacrificing portfolio minimalism or Google Spam Policy compliance.

## URL & Content Taxonomy
| Route Pattern | Role | Indexation Rule |
|---------------|------|-----------------|
| `/` | Entity root (`#person`, `#website`, `#profilepage`) | Always indexable |
| `/projects/` & `/projects/[slug]/` | Engineering portfolio showcase | Always indexable |
| `/resources/` | Topical cluster hub for guides, comparisons & interactive tools | Always indexable |
| `/resources/[slug]/` | Approved high-value guide, comparison, alternative, or tool page | Emitted **only** if `status === "published" && indexable === true` |

## White Hat & Editorial Guardrails
1. **No doorway or thin permutations:** Each route targets a distinct problem with original architectural notes, worked equations, trade-offs, and verified citations.
2. **Disclosure:** Pages evaluating one of Adrian's projects alongside third-party tools display an explicit affiliation/conflict-of-interest disclosure banner.
3. **No unverified claims:** Competitor features cite official sites/GitHub repos verified on `2026-11-26`. Commercial pricing tiers without public static confirmation are omitted or flagged; benchmark tables are never invented.
4. **No auto-indexed drafts:** Items in `draft`, `review`, or `archived` status never emit static HTML in `out/` and never appear in `sitemap.xml`.
