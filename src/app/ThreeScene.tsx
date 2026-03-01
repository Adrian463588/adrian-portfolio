"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Scene = dynamic(
  () => import("@/components/three/Scene").then((mod) => mod.Scene),
  { ssr: false }
);

export function ThreeScene() {
  const [showScene, setShowScene] = useState(false);

  useEffect(() => {
    // Don't show 3D if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!prefersReducedMotion) {
      setShowScene(true);
    }
  }, []);

  if (!showScene) return null;

  return <Scene />;
}
