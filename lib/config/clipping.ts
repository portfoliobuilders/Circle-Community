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
  pr: {
    enabled: true,
    minFollowers: 10000,
    followerRecheckDays: 90,
    liveDays: 7,
    minFeePerPostInr: 500, // Minimum floor fee per deliverable post
    ownerFeePct: 10,
    creatorFeePct: 10,
    maxRevisions: 1,
    bannedCategories: [
      "political",
      "betting",
      "crypto_investment",
      "health_claims",
      "adult",
      "defamation",
    ] as const,
  },
} as const;

export type ClippingConfig = typeof CLIPPING_CONFIG;
