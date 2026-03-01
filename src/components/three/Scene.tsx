"use client";

import { useRef, useMemo, useEffect, useState, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

/* ════════════════════════════════════════════════
   A) CAMERA — Mouse parallax + scroll depth
   ════════════════════════════════════════════════ */
function CameraRig() {
  const [reducedMotion, setReducedMotion] = useState(false);
  const scrollY = useRef(0);

  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
    const onScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state) => {
    if (reducedMotion) return;
    const { pointer, camera } = state;

    // Mouse parallax (damped)
    const targetX = pointer.x * 3;
    const targetY = -pointer.y * 2;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;

    // Scroll-based camera depth: pull camera back as user scrolls
    const scrollFraction = Math.min(scrollY.current / 3000, 1);
    const targetZ = 12 + scrollFraction * 8;
    camera.position.z += (targetZ - camera.position.z) * 0.03;

    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* ════════════════════════════════════════════════
   B) PARTICLES — 2000 with mouse repulsion
   ════════════════════════════════════════════════

   FIX: The position attribute is now set eagerly inside
   the component body (via useMemo + immediate setAttribute),
   not deferred to useEffect. This guarantees it exists before
   the first useFrame tick, preventing the "Cannot read
   properties of undefined (reading 'array')" TypeError.
   ════════════════════════════════════════════════ */
function Particles() {
  const meshRef = useRef<THREE.Points>(null!);
  const geoRef = useRef<THREE.BufferGeometry>(null!);
  const mouseWorld = useRef(new THREE.Vector3());
  const posAttrRef = useRef<THREE.BufferAttribute | null>(null);
  const { camera, pointer } = useThree();

  const count = 2000;
  const { basePositions, positions } = useMemo(() => {
    const bp = new Float32Array(count * 3);
    const cp = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      bp[i] = (Math.random() - 0.5) * 50;
      cp[i] = bp[i];
    }
    return { basePositions: bp, positions: cp };
  }, []);

  // Eagerly set position attribute on mount so it exists before first useFrame
  const handleGeoRef = useCallback(
    (geo: THREE.BufferGeometry | null) => {
      if (!geo) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (geoRef as any).current = geo;
      const attr = new THREE.BufferAttribute(positions, 3);
      geo.setAttribute("position", attr);
      posAttrRef.current = attr;
    },
    [positions]
  );

  // Reused Raycaster + Vector2 to avoid per-frame allocations
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const pointerVec = useMemo(() => new THREE.Vector2(), []);

  useFrame((_, delta) => {
    if (!meshRef.current || !posAttrRef.current) return;

    // Slow orbit
    meshRef.current.rotation.y += delta * 0.03;

    // Project mouse into 3D world for repulsion
    pointerVec.set(pointer.x, pointer.y);
    raycaster.setFromCamera(pointerVec, camera);
    const dir = raycaster.ray.direction.clone().multiplyScalar(15);
    mouseWorld.current.copy(raycaster.ray.origin).add(dir);

    // Repulsion: push particles away from cursor
    const arr = posAttrRef.current.array as Float32Array;
    const mw = mouseWorld.current;
    const repulseRadius = 5;
    const repulseForce = 0.8;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const dx = arr[ix] - mw.x;
      const dy = arr[ix + 1] - mw.y;
      const dz = arr[ix + 2] - mw.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < repulseRadius && dist > 0.01) {
        const force =
          ((repulseRadius - dist) / repulseRadius) * repulseForce;
        arr[ix] += (dx / dist) * force;
        arr[ix + 1] += (dy / dist) * force;
        arr[ix + 2] += (dz / dist) * force;
      } else {
        // Ease back to base position
        arr[ix] += (basePositions[ix] - arr[ix]) * 0.01;
        arr[ix + 1] += (basePositions[ix + 1] - arr[ix + 1]) * 0.01;
        arr[ix + 2] += (basePositions[ix + 2] - arr[ix + 2]) * 0.01;
      }
    }
    posAttrRef.current.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry ref={handleGeoRef} />
      <pointsMaterial
        size={0.08}
        color="#00ffff"
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ════════════════════════════════════════════════
   C) ICOSAHEDRON — Counter-rotation + raycaster hover
   ════════════════════════════════════════════════ */
function Icosahedron() {
  const groupRef = useRef<THREE.Group>(null!);
  const outerRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const baseSpeed = useRef({ outer: 0.25, inner: 0.5 });

  const handlePointerOver = useCallback(() => setHovered(true), []);
  const handlePointerOut = useCallback(() => setHovered(false), []);

  // Reuse Color objects to avoid per-frame allocations
  const hoverColor = useMemo(() => new THREE.Color("#ff6633"), []);
  const baseColor = useMemo(() => new THREE.Color("#00ffff"), []);

  useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    const speedMul = hovered ? 3 : 1;

    if (outerRef.current) {
      outerRef.current.rotation.y +=
        delta * baseSpeed.current.outer * speedMul;
      outerRef.current.rotation.x += delta * 0.1 * speedMul;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -=
        delta * baseSpeed.current.inner * speedMul;
      innerRef.current.rotation.x -= delta * 0.5 * speedMul;

      const mat = innerRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.7 + Math.sin(elapsed * 2) * 0.3;

      // Color shift on hover: cyan → orange-red
      mat.color.lerp(hovered ? hoverColor : baseColor, hovered ? 0.05 : 0.03);
    }

    // Levitation (sine wave)
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(elapsed * 0.5) * 0.8;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[5, 0, -2]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Outer shell */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshBasicMaterial
          color="#0088ff"
          wireframe
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* Inner core */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.2, 0]} />
        <meshBasicMaterial
          color="#00ffff"
          wireframe
          transparent
          opacity={0.8}
          toneMapped={false}
        />
      </mesh>
      {/* Invisible hitbox */}
      <mesh visible={false}>
        <sphereGeometry args={[3, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}

/* ════════════════════════════════════════════════
   D) GROUND PLANE — shader-based grid (replaces GridHelper)

   Uses a PlaneGeometry with a custom ShaderMaterial to draw
   a glowing cyan/blue grid. No GridHelper in the scene graph.
   ════════════════════════════════════════════════ */
function GroundPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(0x00ffff) },
      uColor2: { value: new THREE.Color(0x0044ff) },
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position-y={-5}>
      <planeGeometry args={[120, 120, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vWorldPos;
          void main() {
            vUv = uv;
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec3 uColor1;
          uniform vec3 uColor2;
          varying vec2 vUv;
          varying vec3 vWorldPos;

          float gridLine(float coord, float lineWidth) {
            float d = abs(fract(coord - 0.5) - 0.5);
            return 1.0 - smoothstep(0.0, lineWidth, d);
          }

          void main() {
            // Grid spacing: every 2 world units
            float spacing = 2.0;
            float lineWidth = 0.03;

            float gx = gridLine(vWorldPos.x / spacing, lineWidth);
            float gz = gridLine(vWorldPos.z / spacing + uTime * 0.25, lineWidth);
            float grid = max(gx, gz);

            // Fade out with distance from center
            float dist = length(vWorldPos.xz) / 60.0;
            float fade = 1.0 - smoothstep(0.2, 1.0, dist);

            // Mix colors: intersections brighter
            vec3 color = mix(uColor2, uColor1, gx * gz);
            float alpha = grid * fade * 0.6;

            gl_FragColor = vec4(color, alpha);
          }
        `}
      />
    </mesh>
  );
}

/* ════════════════════════════════════════════════
   E) FLOATING ORBS — ambient accent
   ════════════════════════════════════════════════ */
function FloatingOrbs() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const offset = i * 1.5;
        child.position.y = Math.sin(t * 0.3 + offset) * 2;
        child.position.x =
          Math.cos(t * 0.2 + offset) * 0.5 + (i - 1) * 8;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[(i - 1) * 8, 0, -8]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshBasicMaterial
            color="#00ffff"
            transparent
            opacity={0.5}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ════════════════════════════════════════════════
   F) SCENE ASSEMBLY
   ════════════════════════════════════════════════ */
function SceneContent() {
  return (
    <>
      <fog attach="fog" args={["#050510", 5, 80]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} color="#00ffff" intensity={1.5} />
      <pointLight position={[-5, 3, 3]} color="#0066ff" intensity={0.8} />

      <GroundPlane />
      <Particles />
      <Icosahedron />
      <FloatingOrbs />
      <CameraRig />

      {/* Bloom post-processing for neon glow */}
      <EffectComposer>
        <Bloom
          intensity={0.6}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  );
}

export function Scene() {
  return (
    <Canvas
      aria-hidden="true"
      tabIndex={-1}
      camera={{ position: [0, 0, 12], fov: 75 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: false }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <SceneContent />
    </Canvas>
  );
}
