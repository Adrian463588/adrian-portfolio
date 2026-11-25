"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { HeroSculpture } from "@/components/three/HeroSculpture";
import { HeroFallback } from "@/components/three/HeroFallback";
import { ThreeErrorBoundary } from "@/components/three/ThreeErrorBoundary";

function hasWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [inView, setInView] = useState(true);
  const [webglAvailable] = useState(() => hasWebGLSupport());
  const [contextLost, setContextLost] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (!webglAvailable || contextLost) {
    return <HeroFallback label="STATIC GEOMETRIC LATTICE · WEBGL FALLBACK" />;
  }

  return (
    <ThreeErrorBoundary fallback={<HeroFallback label="STATIC GEOMETRIC LATTICE" />}>
      <div
        ref={containerRef}
        aria-hidden="true"
        onPointerMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          if (!rect.width || !rect.height) return;
          pointerRef.current.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          pointerRef.current.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        }}
        onPointerLeave={() => {
          pointerRef.current.x = 0;
          pointerRef.current.y = 0;
        }}
        className="relative h-full w-full overflow-hidden rounded-2xl border border-[#27272A] bg-[#111114]"
      >
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5.4], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              setContextLost(true);
            });
          }}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 5, 4]} intensity={1.1} color="#F4F4F5" />
          <pointLight position={[-4, -2, 3]} intensity={0.8} color="#38BDF8" />
          <HeroSculpture active={inView} pointerTarget={pointerRef} />
        </Canvas>
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
          <span className="rounded-md border border-[#27272A] bg-[#09090B]/80 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-[#A1A1AA]">
            Interactive 3D Lattice · Demand Rendered
          </span>
        </div>
      </div>
    </ThreeErrorBoundary>
  );
}
