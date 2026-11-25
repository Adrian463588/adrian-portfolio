"use client";

import dynamic from "next/dynamic";
import { useMotionCapabilities } from "@/hooks/useMotionCapabilities";
import { SpatialFallback } from "@/components/three/SpatialFallback";

const SpatialBackground = dynamic(
  () => import("@/components/three/SpatialBackground").then((mod) => mod.SpatialBackground),
  {
    ssr: false,
    loading: () => <SpatialFallback reason="initializing" />,
  }
);

export function SpatialWidget() {
  const { isClient, reducedMotion } = useMotionCapabilities();

  if (!isClient) {
    return <SpatialFallback reason="initializing" />;
  }

  if (reducedMotion) {
    return <SpatialFallback reason="reduced-motion" />;
  }

  return <SpatialBackground />;
}
