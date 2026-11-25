# Specification 003 — Immersive Spatial 3D Portfolio Redesign

## 1. Objective
Eliminate the repetitive dark-card/dashboard visual regression ("AI Slop") across `adriansyahabidin.vercel.app` while retaining 100% of verified V1/V2 career history, Berijalan Techno Center grouped dual roles, 3 Enterprise Case Studies, 70 GitHub repos, and confidentiality gates. Synthesize:
- **Spatial Minimalism (`p5aholic.me`)**: editorial typographic rhythm, architectural hairline dividers, extreme signal-to-noise whitespace, zero uniform card soup.
- **Kinetic Creative Identity (`pierre.io`)**: full-bleed background/hero Three.js atmosphere, dual-line kinetic roll nav/links, cursor-responsive coordinates, fluid view transitions.
- **High-Contrast Editorial Authority (`rhdigital.co.uk`)**: oversized Space Grotesk display headline, human portrait presence (custom Chibi illustration in interactive 3D depth card), clear proof-driven sections.
- **Restored V0 3D DNA (`3bc563e`)**: full-viewport shader perspective grid, adaptive spatial particle depth, counter-rotating cyan/electric-blue geometric orbital lattice reacting seamlessly to pointer velocity & scroll-driven camera depth.

## 2. Core Functional & Visual Requirements (`V3-001` – `V3-012`)
- **V3-001 — Full-Viewport Signature WebGL Scene (`AmbientScene` / `HeroSculpture`):**
  Single shared `fixed inset-0` full-viewport WebGL canvas anchored cleanly behind page content (`z-0`, main content `z-10`) featuring: (a) refined custom perspective shader ground plane, (b) adaptive count particle field with smooth cursor drift, (c) multi-ring geometric orbital core reacting to pointer parallax + GSAP scroll-progress camera transitions (`Hero -> Experience -> Enterprise -> Work -> About -> Contact`).
  Gracefully suspends offscreen/hidden, scales quality adaptively by DPR/viewport, honors `prefers-reduced-motion` (`HERO STATIC ARCHITECTURE`) and missing WebGL context (`WEBGL FALLBACK`).
- **V3-002 — Editorial Typography & Token System (`#08090B` / `#F1F3F5` / `#00C8F5` / `#2563EB`):**
  Pair `Space Grotesk` display headings (`clamp()`) with `Geist` body and `Geist Mono` sparse metadata. Replace repetitive rounded dark boxes (`#18181B`) with open layouts, generous padding, and `1px` hairline structural boundaries.
- **V3-003 — Minimal Navigation & Kinetic Hover Interactions:**
  Single-line floating/sticky architectural bar (`Work`, `Enterprise`, `Experience`, `Projects`, `About`) + magnetic primary CTA (`Get in Touch`) with kinetic roll-text hover micro-interactions and `44px` mobile accessible drawer.
- **V3-004 — Immersive Hero Viewport:**
  Communicates `Adrian Syah Abidin` (`Software Engineer · DevOps · QA/SDET · Applied AI`) + concise positioning + primary CTAs (`Explore Work`, `Get in Touch`, magnetic copy email) without boxed 3D borders, debug labels, or visual clutter.
- **V3-005 — Editorial Projects Gallery & Compact Filter Bar (`/projects/`):**
  Replace the 5-row dashboard filter wall with a compact single-strip toolbar (`Search` + `Origin` segmented/select + `More Filters` disclosure drawer/panel + `Sort` + `Editorial Gallery` / `Index List` toggle) so the first project renders immediately within initial desktop viewport (`1440x900`), while keeping full URL query state, counts, and search/filtering intact.
- **V3-006 — Asymmetric Editorial Sections on `/`:**
  - `Experience`: sticky left summary/tabs + architectural hairline timeline rows (Berijalan Techno Center grouped Freelance + Bootcamp/Internship-equivalent, linked case studies, Qiscus, Bitbybit, Tokopedia).
  - `Enterprise Case Studies`: numbered obsidian-glass dossiers (`01`, `02`, `03`) with conceptual workflow visualization and zero fake screenshots/GitHub buttons.
  - `Selected Work`: asymmetric curated personal showcase (large real screenshots, image reveal framing, zero dashboard pill bloat).
  - `Technical Competencies`, `Certifications`, `Education`: crisp 2-column / structured typographic ledgers instead of identical 3xN card walls.
- **V3-007 — Professional Chibi Avatar Integration:**
  Cleanly process and embed user's provided Chibi desk illustration (`public/images/avatar/professional-chibi.webp` & `-mobile.webp`) inside `About` / `Contact` with interactive 3D perspective tilt, pointer-reactive sheen, and reduced-motion stillness. Keep strictly out of Berijalan/ACC Enterprise compliance cards.
- **V3-008..V3-012 — Performance, Accessibility, Confidentiality, Static Export:**
  GSAP (`useGSAP`, `ScrollTrigger`) scroll choreography respecting `prefers-reduced-motion`, WCAG 2.2 AA (`axe-core` zero violations), `320px–1920px` overflow check, static `output: "export"`, zero confidentiality leaks in `out/`.
