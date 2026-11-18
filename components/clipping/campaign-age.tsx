"use client";

import { useSyncExternalStore } from "react";

function formatAge(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  if (diffDays >= 14) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks}w`;
  }
  if (diffDays >= 1) {
    return `${diffDays}d`;
  }
  return "New";
}

const emptySubscribe = () => () => {};

export function CampaignAge({ isoDate }: { isoDate: string }) {
  const age = useSyncExternalStore(
    emptySubscribe,
    () => formatAge(isoDate),
    () => "New"
  );

  return <span>{age}</span>;
}
