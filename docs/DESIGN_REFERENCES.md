# Design & Engineering References (`docs/DESIGN_REFERENCES.md`)

> **License Compliance Policy:** Only architectural patterns and visual principles were studied from the references below. No source code or proprietary assets were copied from unlicensed repositories.

| Reference | License (Verified via GitHub API) | Studied Patterns | Applied / Rejected Decisions |
|---|---|---|---|
| `adrianhajdin/3d-portfolio` | None (`No SPDX`) | Component-section separation, structured project/experience data arrays | Adopted clean data/UI separation; rejected copy/paste templates and heavy multi-canvas 3D embeds. |
| `adrianhajdin/threejs-portfolio` | None (`No SPDX`) | Bounded interactive 3D showcase framing alongside text | Adopted clean Hero 2-column canvas framing; rejected full-bleed heavy 3D room assets. |
| `bruno-simon.com` | Commercial/Personal site | Creative 3D responsiveness to pointer input | Inspired pointer-driven subtle tilt/rotation feedback on one sculpture; rejected full-screen playable 3D world (violates 75/15/10 ratio). |
| `PavanKusunuri/pavan_kusunuri_portfolio` | None (`No SPDX`) | Client-side lazy loading (`next/dynamic` `ssr: false`) for Three.js | Adopted dynamic import boundary with static fallback poster before hydration. |
| `NoesisNous/Satori-web` | `MIT` | Data-driven content modeling & scroll-linked restraint | Adopted clean TypeScript domain models; rejected GSAP ScrollTrigger complexity in favor of native CSS + existing Framer Motion. |
| `kwiruu/portfolio` | None (`No SPDX`) | Interactive project cards, project detail breakdown, Vercel static delivery | Adopted dedicated `/projects/[slug]` case study views and clean Vercel export. |
| `Bharathkdev/portfolio` | None (`No SPDX`) | Combining React Three Fiber with Framer Motion transitions | Adopted non-blocking motion transitions alongside R3F Hero container. |
| `er-pritamdas/Portfolio` | None (`No SPDX`) | Responsive project showcase filtering | Adopted responsive grid & category filter architecture. |
| `zackabrah/r3f-starter-kit` | `MIT` | TypeScript R3F component hygiene & camera framing | Adopted clean typed R3F group/mesh refs, `THREE.Timer`/delta animation, and geometry/material cleanup. |
| `Aceternity 3D Card` | Component reference | Subtle CSS `perspective` + `rotateX/rotateY` depth shift | Implemented original lightweight `TiltSurface` (`<= 5°`, reduced-motion & touch disabled) without heavy nested 3D wrappers. |
