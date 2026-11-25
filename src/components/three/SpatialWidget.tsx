"use client";

import dynamic from "next/dynamic";
import { useMotion } from "@/context/MotionContext";
import { SpatialFallback } from "@/components/three/SpatialFallback";

const SpatialBackground = dynamic(
  () => import("@/components/three/SpatialBackground").then((mod) => mod.SpatialBackground),
  {
    ssr: false,
    loading: () => <SpatialFallback reason="initializing" />,
  }
);

export function SpatialWidget() {
  const { isClient, qualityMode } = useMotion();

  if (!isClient) {
    return <SpatialFallback reason="initializing" />;
  }

  if (qualityMode === "reduced") {
    return <SpatialFallback reason="reduced-motion" />;
  }

  return <SpatialBackground qualityMode={qualityMode} />;
}
