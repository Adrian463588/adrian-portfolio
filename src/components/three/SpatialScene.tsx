"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  atmosphereFragmentShader,
  atmosphereVertexShader,
} from "@/shaders/atmosphereShader";
import {
  horizonGridFragmentShader,
  horizonGridVertexShader,
} from "@/shaders/horizonGridShader";

interface SpatialSceneProps {
  pointerTarget: React.RefObject<{ x: number; y: number }>;
  scrollProgress: React.RefObject<number>;
  isBalancedMode: boolean;
}

/** Deterministic golden-angle seeded starfield avoiding hydration/SSR flicker. */
function buildParticlePositions(count: number): Float32Array {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = i * 2.39996323;
    const radius = 6.8 + ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) * 14.5;
    const ySpread = (Math.cos(i * 78.233) * 0.5 + (t - 0.5)) * 18;
    arr[i * 3] = Math.cos(angle) * radius;
    arr[i * 3 + 1] = ySpread;
    arr[i * 3 + 2] = Math.sin(angle) * radius - 8;
  }
  return arr;
}

function AtmosphereShaderBackdrop({
  pointerTarget,
  scrollProgress,
  velocityRef,
  intensity,
}: {
  pointerTarget: React.RefObject<{ x: number; y: number }>;
  scrollProgress: React.RefObject<number>;
  velocityRef: React.RefObject<number>;
  intensity: number;
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uVelocity: { value: 0 },
      uIntensity: { value: intensity },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(1440, 900) },
      uObsidian: { value: new THREE.Color("#08090C") },
      uGraphite: { value: new THREE.Color("#15171C") },
      uArctic: { value: new THREE.Color("#65C8F5") },
    }),
    [intensity]
  );

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uScroll.value +=
      ((scrollProgress.current ?? 0) - mat.uniforms.uScroll.value) * 0.08;
    mat.uniforms.uVelocity.value = velocityRef.current ?? 0;
    mat.uniforms.uIntensity.value = intensity;
    mat.uniforms.uPointer.value.x +=
      ((pointerTarget.current?.x ?? 0) - mat.uniforms.uPointer.value.x) * 0.06;
    mat.uniforms.uPointer.value.y +=
      ((pointerTarget.current?.y ?? 0) - mat.uniforms.uPointer.value.y) * 0.06;
    mat.uniforms.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        depthTest={false}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={atmosphereVertexShader}
        fragmentShader={atmosphereFragmentShader}
      />
    </mesh>
  );
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
      uArctic: { value: new THREE.Color("#65C8F5") },
      uIvory: { value: new THREE.Color("#F2F0EC") },
    }),
    []
  );

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const mat = matRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value += dt;
    const targetScroll = scrollProgress.current ?? 0;
    mat.uniforms.uScroll.value += (targetScroll - mat.uniforms.uScroll.value) * 0.08;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.6, -6]}>
      <planeGeometry args={[120, 120, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={horizonGridVertexShader}
        fragmentShader={horizonGridFragmentShader}
      />
    </mesh>
  );
}

export function SpatialScene({
  pointerTarget,
  scrollProgress,
  isBalancedMode,
}: SpatialSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const torusKnotRef = useRef<THREE.Mesh>(null);
  const gyroPrimaryRef = useRef<THREE.Mesh>(null);
  const gyroSecondaryRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const prevScrollRef = useRef(0);
  const scrollVelocityRef = useRef(0);
  const shaderTimeRef = useRef<{ value: number }>({ value: 0 });
  const shaderVelocityRef = useRef<{ value: number }>({ value: 0 });

  const particleCount = isBalancedMode ? 320 : 880;

  const resources = useMemo(() => {
    const tubularSegments = isBalancedMode ? 128 : 220;
    const radialSegments = isBalancedMode ? 28 : 48;

    const knotGeo = new THREE.TorusKnotGeometry(
      isBalancedMode ? 0.98 : 1.24,
      isBalancedMode ? 0.27 : 0.36,
      tubularSegments,
      radialSegments,
      2,
      3
    );

    const gyroPrimaryGeo = new THREE.TorusGeometry(
      isBalancedMode ? 2.02 : 2.52,
      0.011,
      12,
      110
    );
    const gyroSecondaryGeo = new THREE.TorusGeometry(
      isBalancedMode ? 1.72 : 2.15,
      0.008,
      10,
      96
    );

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(buildParticlePositions(particleCount), 3)
    );

    const knotMat = new THREE.MeshPhysicalMaterial({
      color: "#C4CBD4",
      metalness: 0.94,
      roughness: 0.14,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      iridescence: 0.65,
      iridescenceIOR: 1.38,
      sheen: 0.35,
      sheenColor: new THREE.Color("#65C8F5"),
      emissive: new THREE.Color("#0B1622"),
      emissiveIntensity: 0.3,
    });

    knotMat.onBeforeCompile = (shader) => {
      shader.uniforms.uSculptTime = shaderTimeRef.current;
      shader.uniforms.uSculptVelocity = shaderVelocityRef.current;

      shader.vertexShader = shader.vertexShader
        .replace(
          "#include <common>",
          `#include <common>
           uniform float uSculptTime;
           uniform float uSculptVelocity;`
        )
        .replace(
          "#include <begin_vertex>",
          `#include <begin_vertex>
           float wave = sin(position.x * 2.1 + uSculptTime * 0.95)
                      * cos(position.y * 2.1 - uSculptTime * 0.8);
           float morph = 0.028 + min(uSculptVelocity * 0.08, 0.075);
           transformed += normal * wave * morph;`
        );
    };

    const ringMatPrimary = new THREE.MeshBasicMaterial({
      color: "#65C8F5",
      transparent: true,
      opacity: 0.34,
    });

    const ringMatSecondary = new THREE.MeshBasicMaterial({
      color: "#F2F0EC",
      transparent: true,
      opacity: 0.16,
    });

    const particleMat = new THREE.PointsMaterial({
      size: isBalancedMode ? 0.08 : 0.068,
      color: "#9DD9F7",
      transparent: true,
      opacity: 0.44,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    return {
      knotGeo,
      gyroPrimaryGeo,
      gyroSecondaryGeo,
      particleGeo,
      knotMat,
      ringMatPrimary,
      ringMatSecondary,
      particleMat,
    };
  }, [particleCount, isBalancedMode]);

  useEffect(() => {
    return () => {
      resources.knotGeo.dispose();
      resources.gyroPrimaryGeo.dispose();
      resources.gyroSecondaryGeo.dispose();
      resources.particleGeo.dispose();
      resources.knotMat.dispose();
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
    scrollVelocityRef.current += (scrollDelta * 36 - scrollVelocityRef.current) * 0.12;

    shaderTimeRef.current.value = state.clock.elapsedTime;
    shaderVelocityRef.current.value = scrollVelocityRef.current;

    const cam = state.camera;
    const targetCamX = px * 0.85;
    const targetCamY = -py * 0.45 - sp * 0.65;
    const targetCamZ = (isBalancedMode ? 10.6 : 8.4) + sp * 4.8;
    cam.position.x += (targetCamX - cam.position.x) * 0.05;
    cam.position.y += (targetCamY - cam.position.y) * 0.05;
    cam.position.z += (targetCamZ - cam.position.z) * 0.05;
    cam.lookAt(sp * 0.7, 0, -2);

    if (particlesRef.current) {
      particlesRef.current.rotation.y += dt * 0.02;
      particlesRef.current.rotation.x += (py * 0.05 - particlesRef.current.rotation.x) * 0.03;
    }

    if (groupRef.current) {
      const baseX = isBalancedMode ? 0.5 : 2.85 - sp * 1.45;
      const baseY = isBalancedMode ? 1.5 : 0.12 + sp * 0.85;
      const baseZ = -0.5 - sp * 2.3;
      groupRef.current.position.x += (baseX - groupRef.current.position.x) * 0.06;
      groupRef.current.position.y +=
        (baseY + Math.sin(state.clock.elapsedTime * 0.65) * 0.14 - groupRef.current.position.y) *
        0.06;
      groupRef.current.position.z += (baseZ - groupRef.current.position.z) * 0.06;

      groupRef.current.rotation.y += dt * (0.14 + sp * 0.25);
      groupRef.current.rotation.x += (py * 0.34 - groupRef.current.rotation.x) * 0.06;
      groupRef.current.rotation.z += (-px * 0.22 - groupRef.current.rotation.z) * 0.06;
    }

    if (torusKnotRef.current) {
      torusKnotRef.current.rotation.y += dt * 0.16;
      torusKnotRef.current.rotation.x += dt * 0.08;
    }

    if (gyroPrimaryRef.current) {
      gyroPrimaryRef.current.rotation.z += dt * 0.16;
    }
    if (gyroSecondaryRef.current) {
      gyroSecondaryRef.current.rotation.y -= dt * 0.2;
    }
  });

  return (
    <>
      <AtmosphereShaderBackdrop
        pointerTarget={pointerTarget}
        scrollProgress={scrollProgress}
        velocityRef={scrollVelocityRef}
        intensity={isBalancedMode ? 0.72 : 1.0}
      />

      <fog attach="fog" args={["#08090C", 9, 44]} />
      <ambientLight intensity={0.48} />
      <directionalLight position={[6, 7, 6]} intensity={1.75} color="#F2F0EC" />
      <directionalLight position={[-6, 4, -4]} intensity={0.85} color="#A7ADB7" />
      <pointLight position={[-4, -2, 3]} intensity={1.85} color="#65C8F5" />
      <pointLight position={[4, 2, 3]} intensity={0.95} color="#F2F0EC" />

      <PerspectiveHorizonGrid scrollProgress={scrollProgress} />

      <points ref={particlesRef} geometry={resources.particleGeo} material={resources.particleMat} />

      <group ref={groupRef} position={[isBalancedMode ? 0.5 : 2.85, 0.12, -0.5]}>
        <mesh
          ref={torusKnotRef}
          geometry={resources.knotGeo}
          material={resources.knotMat}
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
