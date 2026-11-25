"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface HeroSculptureProps {
  active: boolean;
  pointerTarget: React.RefObject<{ x: number; y: number }>;
}

/** Procedural geometric engineering sculpture with explicit GPU cleanup. */
export function HeroSculpture({ active, pointerTarget }: HeroSculptureProps) {
  const rootRef = useRef<THREE.Group>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerCoreRef = useRef<THREE.Mesh>(null);
  const invalidate = useThree((s) => s.invalidate);

  const resources = useMemo(() => {
    const outerIco = new THREE.IcosahedronGeometry(1.75, 1);
    const outerEdges = new THREE.EdgesGeometry(outerIco);
    outerIco.dispose();

    const innerOct = new THREE.OctahedronGeometry(0.95, 0);
    const innerEdges = new THREE.EdgesGeometry(innerOct);
    const coreSolidGeo = new THREE.OctahedronGeometry(0.62, 0);
    const ringGeo = new THREE.TorusGeometry(2.15, 0.012, 8, 72);

    const outerMat = new THREE.LineBasicMaterial({
      color: "#52525b",
      transparent: true,
      opacity: 0.72,
    });
    const innerEdgeMat = new THREE.LineBasicMaterial({
      color: "#38bdf8",
      transparent: true,
      opacity: 0.9,
    });
    const coreSolidMat = new THREE.MeshStandardMaterial({
      color: "#18181b",
      metalness: 0.65,
      roughness: 0.35,
      emissive: "#0c4a6e",
      emissiveIntensity: 0.25,
    });
    const ringMat = new THREE.MeshBasicMaterial({
      color: "#38bdf8",
      transparent: true,
      opacity: 0.28,
    });

    return {
      outerEdges,
      innerOct,
      innerEdges,
      coreSolidGeo,
      ringGeo,
      outerMat,
      innerEdgeMat,
      coreSolidMat,
      ringMat,
    };
  }, []);

  useEffect(() => {
    return () => {
      resources.outerEdges.dispose();
      resources.innerOct.dispose();
      resources.innerEdges.dispose();
      resources.coreSolidGeo.dispose();
      resources.ringGeo.dispose();
      resources.outerMat.dispose();
      resources.innerEdgeMat.dispose();
      resources.coreSolidMat.dispose();
      resources.ringMat.dispose();
    };
  }, [resources]);

  useEffect(() => {
    if (!active) return;
    const interval = window.setInterval(() => {
      if (!document.hidden) {
        invalidate();
      }
    }, 34);
    return () => window.clearInterval(interval);
  }, [active, invalidate]);

  useFrame((_, rawDelta) => {
    if (!rootRef.current) return;
    const dt = Math.min(rawDelta, 0.05);
    const px = pointerTarget.current?.x ?? 0;
    const py = pointerTarget.current?.y ?? 0;

    rootRef.current.rotation.y += dt * 0.24;
    rootRef.current.rotation.x += (py * 0.28 - rootRef.current.rotation.x) * 0.08;
    rootRef.current.rotation.z += (-px * 0.22 - rootRef.current.rotation.z) * 0.08;

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y -= dt * 0.38;
      innerCoreRef.current.rotation.x += dt * 0.16;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z += dt * 0.14;
    }
  });

  return (
    <group ref={rootRef}>
      <lineSegments geometry={resources.outerEdges} material={resources.outerMat} />

      <mesh
        ref={outerRingRef}
        geometry={resources.ringGeo}
        material={resources.ringMat}
        rotation={[Math.PI / 3, 0.25, 0]}
      />

      <group ref={innerCoreRef}>
        <mesh geometry={resources.coreSolidGeo} material={resources.coreSolidMat} />
        <lineSegments geometry={resources.innerEdges} material={resources.innerEdgeMat} />
      </group>
    </group>
  );
}
