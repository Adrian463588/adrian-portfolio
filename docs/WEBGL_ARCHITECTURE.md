# V3 WebGL & Three.js Architecture

## 1. Shared Full-Viewport Canvas (`SpatialWidget` -> `SpatialBackground` -> `SpatialScene`)
- Single persistent `fixed inset-0` WebGL canvas (`z-0`) rendered behind accessible HTML (`z-10`).

## 2. Shaders & Parametric Sculpture
1. **Procedural Atmosphere Shader (`src/shaders/atmosphereShader.ts`):** Full-screen GLSL fBm noise, dithering, and pointer/scroll-responsive Arctic `#65C8F5` lighting over Obsidian `#08090C`.
2. **Signature Iridescent Chrome Torus-Knot (`SpatialScene.tsx`):** Subdivided `TorusKnotGeometry` with physically based `MeshPhysicalMaterial` (`metalness: 0.94`, `roughness: 0.14`, `clearcoat: 1.0`, `iridescence: 0.65`) and `onBeforeCompile` harmonic vertex undulation driven by `uSculptTime` and `uSculptVelocity`, paired with two precision orbital guide hairlines (zero wireframe sphere cage).
3. **Perspective Horizon Shader Grid (`src/shaders/horizonGridShader.ts`):** Coordinate grid scrolling dynamically with time & scroll fraction.
4. **Adaptive Particle Cloud:** Seeded deterministic field (`880` `cinematic` / `320` `balanced`).

## 3. Adaptive Quality & Fallback
- Dynamic DPR (`[1, 1.65]` cinematic / `[1, 1.25]` balanced).
- Suspends `frameloop` when `document.hidden === true`.
- Explicit `.dispose()` cleanup across every geometry and material.
- Graceful `SpatialFallback` under `reduced` quality mode or missing/lost WebGL context (`webglcontextlost`).
