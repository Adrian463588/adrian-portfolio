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
    const radius = 6 + ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) * 14;
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
      uCyan: { value: new THREE.Color("#00C8F5") },
      uBlue: { value: new THREE.Color("#2563EB") },
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
          uniform vec3 uCyan;
          uniform vec3 uBlue;
          varying vec3 vWorldPos;

          float gridLine(float coord, float width) {
            float d = abs(fract(coord - 0.5) - 0.5);
            return 1.0 - smoothstep(0.0, width, d);
          }

          void main() {
            float spacing = 2.6;
            float gx = gridLine(vWorldPos.x / spacing, 0.025);
            float gz = gridLine(vWorldPos.z / spacing + uTime * 0.14 + uScroll * 4.0, 0.025);
            float grid = max(gx, gz);
            float dist = length(vWorldPos.xz) / 56.0;
            float fade = (1.0 - smoothstep(0.15, 0.95, dist));
            vec3 color = mix(uBlue, uCyan, clamp(gx * gz + 0.28, 0.0, 1.0));
            float scrollDim = 1.0 - smoothstep(0.1, 0.9, uScroll) * 0.45;
            gl_FragColor = vec4(color, grid * fade * 0.34 * scrollDim);
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
  const outerShellRef = useRef<THREE.LineSegments>(null);
  const innerLatticeRef = useRef<THREE.LineSegments>(null);
  const gyroPrimaryRef = useRef<THREE.Mesh>(null);
  const gyroSecondaryRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particleCount = isCompactViewport ? 420 : 1100;

  const resources = useMemo(() => {
    const outerIco = new THREE.IcosahedronGeometry(2.05, 1);
    const outerEdges = new THREE.EdgesGeometry(outerIco);
    outerIco.dispose();

    const innerOct = new THREE.OctahedronGeometry(1.08, 0);
    const innerEdges = new THREE.EdgesGeometry(innerOct);
    innerOct.dispose();

    const coreSolidGeo = new THREE.OctahedronGeometry(0.68, 0);
    const gyroPrimaryGeo = new THREE.TorusGeometry(2.58, 0.014, 12, 96);
    const gyroSecondaryGeo = new THREE.TorusGeometry(2.24, 0.01, 10, 84);

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(buildParticlePositions(particleCount), 3)
    );

    const outerMat = new THREE.LineBasicMaterial({
      color: "#2563EB",
      transparent: true,
      opacity: 0.46,
    });
    const innerEdgeMat = new THREE.LineBasicMaterial({
      color: "#00C8F5",
      transparent: true,
      opacity: 0.88,
    });
    const coreSolidMat = new THREE.MeshStandardMaterial({
      color: "#0D1117",
      metalness: 0.82,
      roughness: 0.24,
      emissive: "#003B5C",
      emissiveIntensity: 0.38,
    });
    const ringMatPrimary = new THREE.MeshBasicMaterial({
      color: "#00C8F5",
      transparent: true,
      opacity: 0.32,
    });
    const ringMatSecondary = new THREE.MeshBasicMaterial({
      color: "#60A5FA",
      transparent: true,
      opacity: 0.22,
    });
    const particleMat = new THREE.PointsMaterial({
      size: isCompactViewport ? 0.09 : 0.075,
      color: "#00C8F5",
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return {
      outerEdges,
      innerEdges,
      coreSolidGeo,
      gyroPrimaryGeo,
      gyroSecondaryGeo,
      particleGeo,
      outerMat,
      innerEdgeMat,
      coreSolidMat,
      ringMatPrimary,
      ringMatSecondary,
      particleMat,
    };
  }, [particleCount, isCompactViewport]);

  useEffect(() => {
    return () => {
      resources.outerEdges.dispose();
      resources.innerEdges.dispose();
      resources.coreSolidGeo.dispose();
      resources.gyroPrimaryGeo.dispose();
      resources.gyroSecondaryGeo.dispose();
      resources.particleGeo.dispose();
      resources.outerMat.dispose();
      resources.innerEdgeMat.dispose();
      resources.coreSolidMat.dispose();
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

    // Smooth camera parallax + scroll-driven depth shift via frame state camera
    const cam = state.camera;
    const targetCamX = px * 0.9;
    const targetCamY = -py * 0.55 - sp * 0.6;
    const targetCamZ = (isCompactViewport ? 10.5 : 8.4) + sp * 4.8;
    cam.position.x += (targetCamX - cam.position.x) * 0.05;
    cam.position.y += (targetCamY - cam.position.y) * 0.05;
    cam.position.z += (targetCamZ - cam.position.z) * 0.05;
    cam.lookAt(sp * 0.8, 0, -2);

    if (particlesRef.current) {
      particlesRef.current.rotation.y += dt * 0.024;
      particlesRef.current.rotation.x += (py * 0.06 - particlesRef.current.rotation.x) * 0.03;
    }

    if (groupRef.current) {
      const baseX = isCompactViewport ? 0.5 : 2.75 - sp * 1.1;
      const baseY = isCompactViewport ? 1.55 : 0.25 + sp * 0.85;
      const baseZ = -0.6 - sp * 2.2;
      groupRef.current.position.x += (baseX - groupRef.current.position.x) * 0.06;
      groupRef.current.position.y +=
        (baseY + Math.sin(state.clock.elapsedTime * 0.7) * 0.12 - groupRef.current.position.y) * 0.06;
      groupRef.current.position.z += (baseZ - groupRef.current.position.z) * 0.06;

      groupRef.current.rotation.y += dt * (0.16 + sp * 0.22);
      groupRef.current.rotation.x += (py * 0.32 - groupRef.current.rotation.x) * 0.06;
      groupRef.current.rotation.z += (-px * 0.24 - groupRef.current.rotation.z) * 0.06;
    }

    if (outerShellRef.current) {
      outerShellRef.current.rotation.y += dt * 0.14;
      outerShellRef.current.rotation.z -= dt * 0.08;
    }

    if (innerLatticeRef.current) {
      innerLatticeRef.current.rotation.y -= dt * 0.34;
      innerLatticeRef.current.rotation.x += dt * 0.18;
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
      <fog attach="fog" args={["#08090B", 8, 42]} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 6, 5]} intensity={1.15} color="#F1F3F5" />
      <pointLight position={[-4, -2, 3]} intensity={1.1} color="#00C8F5" />
      <pointLight position={[4, 2, 2]} intensity={0.65} color="#2563EB" />

      <PerspectiveHorizonGrid scrollProgress={scrollProgress} />

      <points ref={particlesRef} geometry={resources.particleGeo} material={resources.particleMat} />

      <group ref={groupRef} position={[isCompactViewport ? 0.5 : 2.75, 0.25, -0.6]}>
        <lineSegments
          ref={outerShellRef}
          geometry={resources.outerEdges}
          material={resources.outerMat}
        />
        <lineSegments
          ref={innerLatticeRef}
          geometry={resources.innerEdges}
          material={resources.innerEdgeMat}
        />
        <mesh geometry={resources.coreSolidGeo} material={resources.coreSolidMat} />
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
