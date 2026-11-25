# V3 WebGL & Three.js Architecture

## 1. Shared Full-Viewport Canvas (`SpatialWidget` -> `SpatialBackground` -> `SpatialScene`)
- Single persistent `fixed inset-0` WebGL canvas (`z-0`) rendered behind semantic page content (`z-10`), decoupling 3D GPU state cleanly from project filtering, routing, and React UI renders.

## 2. Parametric & Shader Elements
1. **Fluid Chrome & Glass Torus-Knot Sculpture (`ParametricCore`):**
   - Custom subdivided `TorusKnotGeometry(1.45, 0.42, 180, 32, 2, 3)` rendered with physically based metallic chrome + clearcoat (`MeshPhysicalMaterial`) + nested translucent glass gyro rings (`MeshPhysicalMaterial` with roughness/sheen) illuminated by `#4169FF` Electric Blue & Ivory `#F1F0EB` point/directional lights.
   - Real-time GLSL custom shader halo/shell (`onBeforeCompile` / custom `ShaderMaterial`) applying organic vertex displacement (`sin/cos` harmonics driven by `uTime` & `uScrollVelocity`), rotating & translating across scroll chapters.
2. **Perspective Horizon Shader Grid:** Custom `ShaderMaterial` ground grid scrolling dynamically with time + scroll fraction (`#4169FF` base fading softly into `#080808`).
3. **Adaptive Particle Cloud:** Seeded deterministic spatial starfield (`900` desktop / `320` compact viewport).

## 3. Adaptive Quality & Fallback
- Dynamic DPR capped (`[1, 1.5]` desktop, `[1, 1.2]` mobile).
- Suspends rendering when `document.hidden === true`.
- Explicit `.dispose()` across every geometry/material/attribute on unmount.
- Degrades cleanly to CSS SVG horizon architecture (`SpatialFallback`) on `prefers-reduced-motion: reduce` or missing/lost WebGL context (`webglcontextlost`).
