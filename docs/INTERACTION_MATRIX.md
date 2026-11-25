# V3 Interaction & Motion Matrix

| Interaction | Motion Behavior | Mechanism | Quality Scope |
|---|---|---|---|
| **Hero entrance** | Staggered upward reveal of subtitle & action bar (`opacity: 1` preserved for `h1` & LCP) | GSAP (`useGSAP`) | `cinematic`, `balanced` |
| **Ambient WebGL backdrop** | fBm procedural GLSL noise, cursor glow parallax, dithering (`uTime`, `uPointer`, `uScroll`, `uVelocity`) | Custom `ShaderMaterial` ([atmosphereShader.ts](file:///d:/SEMESTER12/adrian-portfolio/src/shaders/atmosphereShader.ts)) | `cinematic`, `balanced` |
| **Signature 3D sculpture** | Metallic iridescent `TorusKnotGeometry` with vertex harmonic undulation + camera/scroll parallax | R3F `onBeforeCompile` ([SpatialScene.tsx](file:///d:/SEMESTER12/adrian-portfolio/src/components/three/SpatialScene.tsx)) | `cinematic`, `balanced` |
| **Smooth scroll & progress** | `Lenis` (`lerp: 0.095`) synced with `gsap.ticker`, `ScrollTrigger.update`, + top `1.5px` `#65C8F5` hairline | [SmoothScrollProvider.tsx](file:///d:/SEMESTER12/adrian-portfolio/src/components/motion/SmoothScrollProvider.tsx) | `cinematic`, `balanced` |
| **Route transition veil** | Lightweight non-blocking `clipPath` reveal on App Router path transitions (`pointer-events-none`) | GSAP route effect | `cinematic`, `balanced` |
| **Section choreography** | Distinct per-section `clip-reveal`, `slide-right`, and `stagger-list` treatments (`opacity: 1` safe) | [SectionChoreography.tsx](file:///d:/SEMESTER12/adrian-portfolio/src/components/motion/SectionChoreography.tsx) | `cinematic`, `balanced` |
| **Media parallax** | Scrubbed vertical displacement on featured editorial photography & `ChibiShowcase` | [ScrollParallax.tsx](file:///d:/SEMESTER12/adrian-portfolio/src/components/motion/ScrollParallax.tsx) | `cinematic`, `balanced` |
| **Context pointer halo** | Magnetic CTA pull, ring scale on links, `"VIEW"` indicator over `[data-cursor='work']` | [DesktopCursor.tsx](file:///d:/SEMESTER12/adrian-portfolio/src/components/motion/DesktopCursor.tsx), [MagneticSurface.tsx](file:///d:/SEMESTER12/adrian-portfolio/src/components/motion/MagneticSurface.tsx) | Fine pointer + non-reduced |
| **Fullscreen nav overlay** | Clip-path reveal + staggered `01..06` items + Escape focus restoration + scroll lock | [Navbar.tsx](file:///d:/SEMESTER12/adrian-portfolio/src/components/layout/Navbar.tsx) | All modes (instant in `reduced`) |
| **Index hover preview** | Smooth interpolated floating thumbnail/dossier card following desktop pointer | [ProjectHoverPreview.tsx](file:///d:/SEMESTER12/adrian-portfolio/src/components/projects/ProjectHoverPreview.tsx) | Fine pointer + non-reduced |
| **Quality mode & fallback** | Runtime selector (`Cinematic | Balanced | Reduced`), auto OS `prefers-reduced-motion`, WebGL `SpatialFallback` | [MotionContext.tsx](file:///d:/SEMESTER12/adrian-portfolio/src/context/MotionContext.tsx) | All modes |
