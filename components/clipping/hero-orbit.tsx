"use client";

import { OrbitScene, type OrbitNode } from "@/components/visual/orbit-scene";

const clippingOrbitNodes: OrbitNode[] = [
  { id: "c-footage", label: "Source Footage", role: "Long-form 4K", angle: 30, radius: 140, highlight: true },
  { id: "c-clips", label: "Vertical Edits", role: "9:16 Shorts/Reels", angle: 110, radius: 140 },
  { id: "c-pr", label: "Social Media PR", role: "10K+ Verified Pages", angle: 195, radius: 210, highlight: true },
  { id: "c-audit", label: "Day 7 View Audit", role: "Snapshot Lock", angle: 280, radius: 140, highlight: true },
  { id: "c-payout", label: "UPI Disbursements", role: "Weekly Net Rates", angle: 345, radius: 210, highlight: true },
];

export function HeroOrbit({ className, size = 420 }: { className?: string; size?: number }) {
  return <OrbitScene nodes={clippingOrbitNodes} size={size} className={className} />;
}
