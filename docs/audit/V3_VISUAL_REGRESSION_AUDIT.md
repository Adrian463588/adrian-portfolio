# V3 Visual Regression & Design Audit

> **Date:** 2026-11-25  
> **Scope:** Live `https://adriansyahabidin.vercel.app/` (V2) vs V0 (`3bc563e`) vs Reference Studios (`pierre.io`, `www.rhdigital.co.uk`, `p5aholic.me`)

## 1. Visual Regression Findings (V2 -> V3 Target Fixes)
- **Boxed 3D Canvas & Debug Caption:** Wrapping the Three.js geometry inside a dark bordered square with *"INTERACTIVE 3D LATTICE · DEMAND RENDERED"* broke spatial continuity compared with full-bleed `3bc563e`.
- **Generic Card & Container Repetition:** Repeating `#18181B rounded-xl border-[#27272A]` card grids across Work, Experience, Competencies, Credentials, Education, and About resembled a SaaS template rather than an editorial creative studio.
- **Dashboard-Style `/projects/` Filter Wall:** Stacking search + selects + origin pills + tier pills + domain chips pushed projects out of the initial viewport, compounded by utilitarian jargon (`ALL ELIGIBLE`, `ENGAGEMENT ORIGIN`, `STATIC SNAPSHOT SYNCED`, `REPOSITORY CATALOG`).
- **Low-Poly Sphere Reuse vs Sculptural 3D:** Retaining bare low-poly wireframe icosahedrons lacked custom parametric/shader surface materiality and scroll-driven chapter transformation.

## 2. Reference Benchmarks Observed
- **`p5aholic.me`:** Full-bleed GLSL particle/shader depth behind hairline boundaries, minimalist `Projects` editorial index rows, and clean typographic hierarchy.
- **`pierre.io`:** Sculptural 3D objects floating across open grid coordinates, kinetic roll-hover navigation, concise wordmark, and live location header bar.
- **`rhdigital.co.uk`:** Bold oversized display typography (`Plus Jakarta Sans`) with highlighted keyword emphasis, asymmetric portrait framing, and clear proof sequencing.

## 3. V3 Design System Decisions (Monochrome, Chrome & Electric Blue)
- **Palette:** Obsidian `#080808`, Graphite `#151515`, Silver `#A6A6A6`, Ivory `#F1F0EB`, Electric Blue `#4169FF` (with cyan specular rim highlights `#00C8F5`).
- **Typography:** `Space Grotesk` fluid oversized `clamp()` display titles + `Geist` UI body + sparse `Geist Mono` tabular metadata.
- **Preserved Engineering Data:** Berijalan Techno Center (PT CSDI / ACC Group) Freelance + Trainee (`Bootcamp / Internship-equivalent`), 3 sanitized Enterprise Case Studies (`Archer Upgrade`, `STNK Alignment`, `Advanced Joint Finance Parameter`), Qiscus, Bitbybit, Tokopedia, and all 70 public GitHub repos.
