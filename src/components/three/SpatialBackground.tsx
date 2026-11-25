"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { SpatialScene } from "@/components/three/SpatialScene";
import { SpatialFallback } from "@/components/three/SpatialFallback";
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

export function SpatialBackground() {
  const pointerRef = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);
  const [webglAvailable] = useState(() => hasWebGLSupport());
  const [contextLost, setContextLost] = useState(false);
  const [isVisibleTab, setIsVisibleTab] = useState(true);
  const [isCompactViewport, setIsCompactViewport] = useState(false);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch" || !window.innerWidth || !window.innerHeight) return;
      pointerRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointerRef.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      scrollProgressRef.current = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    };

    const onVisibility = () => {
      setIsVisibleTab(!document.hidden);
    };

    const onResize = () => {
      setIsCompactViewport(window.innerWidth < 900);
    };

    onResize();
    onScroll();
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  if (!webglAvailable || contextLost) {
    return <SpatialFallback reason="webgl-unavailable" />;
  }

  return (
    <ThreeErrorBoundary fallback={<SpatialFallback reason="webgl-unavailable" />}>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#080808]"
      >
        <Canvas
          frameloop={isVisibleTab ? "always" : "never"}
          dpr={isCompactViewport ? [1, 1.25] : [1, 1.5]}
          camera={{ position: [0, 0, 8.4], fov: 48 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              setContextLost(true);
            });
          }}
        >
          <SpatialScene
            pointerTarget={pointerRef}
            scrollProgress={scrollProgressRef}
            isCompactViewport={isCompactViewport}
          />
        </Canvas>
        {/* Subtle bottom-top obsidian vignette so foreground typography keeps high WCAG contrast */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080808]/35 via-transparent to-[#080808]/92"
        />
      </div>
    </ThreeErrorBoundary>
  );
}
