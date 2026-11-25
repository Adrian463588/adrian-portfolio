"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SpatialSceneProps {
  pointerTarget: React.RefObject<{ x: number; y: number }>;
  scrollProgress: React.RefObject<number>;
  isCompactViewport: boolean;
}

/** Deterministic golden-angle seeded coordinates avoiding SSR/client random flicker. */
function buildParticlePositions(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = i * 2.39996323;
    const radius = 6.5 + ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) * 14.5;
    const ySpread = (Math.cos(i * 78.233) * 0.5 + (t - 0.5)) * 18;
    arr[i * 3] = Math.cos(angle) * radius;
    arr[i * 3 + 1] = ySpread;
    arr[i * 3 + 2] = Math.sin(angle) * radius - 8;
  }
  return arr;
}

function PerspectiveHorizonGrid({
  scrollProgress,
}: {
  scrollProgress: React.RefObject<number>;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uElectric: { value: new THREE.Color("#4169FF") },
      uCyan: { value: new THREE.Color("#00C8F5") },
    }),
    []
  );

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    if (!matRef.current) return;
    matRef.current.uniforms.uTime.value += dt;
    const targetScroll = scrollProgress.current ?? 0;
    matRef.current.uniforms.uScroll.value +=
      (targetScroll - matRef.current.uniforms.uScroll.value) * 0.08;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.6, -6]}>
      <planeGeometry args={[120, 120, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vWorldPos;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPos = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uScroll;
          uniform vec3 uElectric;
          uniform vec3 uCyan;
          varying vec3 vWorldPos;

          float gridLine(float coord, float width) {
            float d = abs(fract(coord - 0.5) - 0.5);
            return 1.0 - smoothstep(0.0, width, d);
          }

          void main() {
            float spacing = 2.6;
            float gx = gridLine(vWorldPos.x / spacing, 0.022);
            float gz = gridLine(vWorldPos.z / spacing + uTime * 0.14 + uScroll * 4.5, 0.022);
            float grid = max(gx, gz);
            float dist = length(vWorldPos.xz) / 56.0;
            float fade = 1.0 - smoothstep(0.14, 0.95, dist);
            vec3 color = mix(uElectric, uCyan, clamp(gx * gz + 0.18, 0.0, 1.0));
            float scrollDim = 1.0 - smoothstep(0.12, 0.92, uScroll) * 0.42;
            gl_FragColor = vec4(color, grid * fade * 0.3 * scrollDim);
          }
        `}
      />
    </mesh>
  );
}

export function SpatialScene({
  pointerTarget,
  scrollProgress,
  isCompactViewport,
}: SpatialSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const torusKnotRef = useRef<THREE.Mesh>(null);
  const auraShellRef = useRef<THREE.Mesh>(null);
  const gyroPrimaryRef = useRef<THREE.Mesh>(null);
  const gyroSecondaryRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const prevScrollRef = useRef(0);
  const scrollVelocityRef = useRef(0);

  const particleCount = isCompactViewport ? 340 : 960;

  const auraUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uVelocity: { value: 0 },
      uAccent: { value: new THREE.Color("#4169FF") },
      uIvory: { value: new THREE.Color("#F1F0EB") },
    }),
    []
  );

  const resources = useMemo(() => {
    const knotGeo = new THREE.TorusKnotGeometry(
      isCompactViewport ? 0.92 : 1.15,
      isCompactViewport ? 0.25 : 0.31,
      160,
      28,
      2,
      3
    );

    const auraGeo = new THREE.IcosahedronGeometry(isCompactViewport ? 1.72 : 2.12, 3);
    const gyroPrimaryGeo = new THREE.TorusGeometry(
      isCompactViewport ? 2.05 : 2.52,
      0.012,
      12,
      96
    );
    const gyroSecondaryGeo = new THREE.TorusGeometry(
      isCompactViewport ? 1.78 : 2.18,
      0.009,
      10,
      84
    );

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(buildParticlePositions(particleCount), 3)
    );

    const knotMat = new THREE.MeshPhysicalMaterial({
      color: "#D9D8D2",
      metalness: 0.92,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      emissive: "#0D1A4A",
      emissiveIntensity: 0.35,
    });

    const auraMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      wireframe: true,
      blending: THREE.AdditiveBlending,
      uniforms: auraUniforms,
      vertexShader: `
        uniform float uTime;
        uniform float uVelocity;
        varying float vPulse;

        void main() {
          float wave = sin(position.x * 2.4 + uTime * 1.1)
                     * cos(position.y * 2.4 - uTime * 0.9)
                     * sin(position.z * 2.4 + uTime * 0.7);
          float amp = 0.065 + min(uVelocity * 1.4, 0.22);
          vec3 displaced = position + normal * wave * amp;
          vPulse = 0.5 + 0.5 * wave;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uAccent;
        uniform vec3 uIvory;
        varying float vPulse;

        void main() {
          vec3 tint = mix(uAccent, uIvory, vPulse * 0.42);
          gl_FragColor = vec4(tint, 0.16 + vPulse * 0.12);
        }
      `,
    });

    const ringMatPrimary = new THREE.MeshBasicMaterial({
      color: "#4169FF",
      transparent: true,
      opacity: 0.36,
    });

    const ringMatSecondary = new THREE.MeshBasicMaterial({
      color: "#F1F0EB",
      transparent: true,
      opacity: 0.18,
    });

    const particleMat = new THREE.PointsMaterial({
      size: isCompactViewport ? 0.085 : 0.072,
      color: "#A6B8FF",
      transparent: true,
      opacity: 0.48,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return {
      knotGeo,
      auraGeo,
      gyroPrimaryGeo,
      gyroSecondaryGeo,
      particleGeo,
      knotMat,
      auraMat,
      ringMatPrimary,
      ringMatSecondary,
      particleMat,
    };
  }, [particleCount, isCompactViewport, auraUniforms]);

  useEffect(() => {
    return () => {
      resources.knotGeo.dispose();
      resources.auraGeo.dispose();
      resources.gyroPrimaryGeo.dispose();
      resources.gyroSecondaryGeo.dispose();
      resources.particleGeo.dispose();
      resources.knotMat.dispose();
      resources.auraMat.dispose();
      resources.ringMatPrimary.dispose();
      resources.ringMatSecondary.dispose();
      resources.particleMat.dispose();
    };
  }, [resources]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const px = pointerTarget.current?.x ?? 0;
    const py = pointerTarget.current?.y ?? 0;
    const sp = scrollProgress.current ?? 0;

    const scrollDelta = Math.abs(sp - prevScrollRef.current);
    prevScrollRef.current = sp;
    scrollVelocityRef.current += (scrollDelta * 32 - scrollVelocityRef.current) * 0.12;

    if (auraShellRef.current) {
      const mat = auraShellRef.current.material as THREE.ShaderMaterial;
      mat.uniforms.uTime.value = state.clock.elapsedTime;
      mat.uniforms.uVelocity.value = scrollVelocityRef.current;
      auraShellRef.current.rotation.y -= dt * 0.1;
      auraShellRef.current.rotation.z += dt * 0.06;
    }

    const cam = state.camera;
    const targetCamX = px * 0.85;
    const targetCamY = -py * 0.5 - sp * 0.65;
    const targetCamZ = (isCompactViewport ? 10.6 : 8.4) + sp * 4.9;
    cam.position.x += (targetCamX - cam.position.x) * 0.05;
    cam.position.y += (targetCamY - cam.position.y) * 0.05;
    cam.position.z += (targetCamZ - cam.position.z) * 0.05;
    cam.lookAt(sp * 0.7, 0, -2);

    if (particlesRef.current) {
      particlesRef.current.rotation.y += dt * 0.022;
      particlesRef.current.rotation.x += (py * 0.06 - particlesRef.current.rotation.x) * 0.03;
    }

    if (groupRef.current) {
      const baseX = isCompactViewport ? 0.55 : 2.85 - sp * 1.4;
      const baseY = isCompactViewport ? 1.55 : 0.15 + sp * 0.85;
      const baseZ = -0.6 - sp * 2.4;
      groupRef.current.position.x += (baseX - groupRef.current.position.x) * 0.06;
      groupRef.current.position.y +=
        (baseY + Math.sin(state.clock.elapsedTime * 0.68) * 0.14 - groupRef.current.position.y) *
        0.06;
      groupRef.current.position.z += (baseZ - groupRef.current.position.z) * 0.06;

      groupRef.current.rotation.y += dt * (0.14 + sp * 0.28);
      groupRef.current.rotation.x += (py * 0.34 - groupRef.current.rotation.x) * 0.06;
      groupRef.current.rotation.z += (-px * 0.22 - groupRef.current.rotation.z) * 0.06;
    }

    if (torusKnotRef.current) {
      torusKnotRef.current.rotation.y += dt * 0.18;
      torusKnotRef.current.rotation.x += dt * 0.09;
    }

    if (gyroPrimaryRef.current) {
      gyroPrimaryRef.current.rotation.z += dt * 0.18;
    }
    if (gyroSecondaryRef.current) {
      gyroSecondaryRef.current.rotation.y -= dt * 0.22;
    }
  });

  return (
    <>
      <fog attach="fog" args={["#080808", 8, 42]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 7, 6]} intensity={1.65} color="#F1F0EB" />
      <directionalLight position={[-5, 4, -4]} intensity={0.75} color="#A6A6A6" />
      <pointLight position={[-4, -2, 3]} intensity={1.8} color="#4169FF" />
      <pointLight position={[4, 2, 3]} intensity={1.05} color="#00C8F5" />

      <PerspectiveHorizonGrid scrollProgress={scrollProgress} />

      <points ref={particlesRef} geometry={resources.particleGeo} material={resources.particleMat} />

      <group ref={groupRef} position={[isCompactViewport ? 0.55 : 2.85, 0.15, -0.6]}>
        <mesh
          ref={torusKnotRef}
          geometry={resources.knotGeo}
          material={resources.knotMat}
        />
        <mesh
          ref={auraShellRef}
          geometry={resources.auraGeo}
          material={resources.auraMat}
        />
        <mesh
          ref={gyroPrimaryRef}
          rotation={[Math.PI / 3.1, Math.PI / 6, 0]}
          geometry={resources.gyroPrimaryGeo}
          material={resources.ringMatPrimary}
        />
        <mesh
          ref={gyroSecondaryRef}
          rotation={[-Math.PI / 2.6, Math.PI / 4, 0]}
          geometry={resources.gyroSecondaryGeo}
          material={resources.ringMatSecondary}
        />
      </group>
    </>
  );
}
