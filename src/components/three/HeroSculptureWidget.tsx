"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { HeroFallback } from "@/components/three/HeroFallback";

const HeroCanvas = dynamic(
  () => import("@/components/three/HeroCanvas").then((mod) => mod.HeroCanvas),
  {
    ssr: false,
    loading: () => <HeroFallback label="INITIALIZING 3D LATTICE" />,
  }
);

function subscribeNothing() {
  return () => {};
}

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

export function HeroSculptureWidget() {
  const isClient = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false
  );

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  if (!isClient) {
    return <HeroFallback label="ARCHITECTURAL GEOMETRIC LATTICE" />;
  }

  if (reducedMotion) {
    return <HeroFallback label="REDUCED MOTION · STATIC GEOMETRY" />;
  }

  return <HeroCanvas />;
}
