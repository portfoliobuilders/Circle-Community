export const CLIPPING_CONFIG = {
  clipRateMinInrPer1k: 10,
  clipRateMaxInrPer1k: 200,
  ownerFeePct: 10,
  clipperFeePct: 10,
  minPayoutInr: 500,
  payoutCycle: "weekly" as const,
  viewHoldDays: 7,
  minViewsToQualify: 1000,
  maxPayableViewsPerClip: null,
  perClipperAnnualCapInr: null as number | null, // [FROM CA: Fill before live production launch]
  platformsV1: ["youtube_shorts", "instagram_reels"] as const,
  caSignoffDone: false,
  promotedSlots: {
    enabled: false,
    slotCount: 3,
    minBidInr: null as number | null, // [PLACEHOLDER: Fill before enabling]
    bidCloseSchedule: "Friday 18:00 IST for the following week",
  },
} as const;

export type ClippingConfig = typeof CLIPPING_CONFIG;
