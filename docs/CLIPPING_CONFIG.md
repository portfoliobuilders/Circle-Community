# CIRCLE — Clipping Configuration Parameters (`CLIPPING_CONFIG.md`)

> **Instructions for Project Owner:**  
> Review and fill every `[PLACEHOLDER]` in the table below before running Part 15.  
> These values serve as the single source of truth for `lib/config/clipping.ts` and will govern business logic across campaign creation, view verification, ledger calculations, and payout execution.

---

## 1. Configuration Table

| Configuration Key | Current / Recommended Value | Type | Description | Owner Action |
| :--- | :--- | :--- | :--- | :--- |
| `CLIP_RATE_MIN_INR_PER_1K` | `10` | `integer` | Minimum pay rate in INR per 1,000 verified views that a campaign owner can offer. The campaign owner sets the rate within `10`–`200`. No fixed or recommended rate anywhere. | **LOCKED (10)** |
| `CLIP_RATE_MAX_INR_PER_1K` | `200` | `integer` | Maximum pay rate in INR per 1,000 verified views that can be set without custom admin authorization. | **LOCKED (200)** |
| `OWNER_FEE_PCT` | `10` | `integer` (percentage) | Service fee charged to the campaign owner on top of the campaign budget. Invoice = `budget + 10%`. The full budget goes to clipper earnings. | **LOCKED (10%)** |
| `CLIPPER_FEE_PCT` | `10` | `integer` (percentage) | Platform fee deducted from each clip's gross earnings when locked. Net = `gross - 10%`. No joining, submission, or payout fee. | **LOCKED (10%)** |
| `MIN_PAYOUT_INR` | `500` | `integer` | Minimum net wallet balance in INR required for a clipper to submit a UPI payout withdrawal request. Enforced in server actions. | `[CONFIRM or ADJUST]` |
| `PAYOUT_CYCLE` | `"weekly"` | `string` (`"weekly"` \| `"biweekly"`) | Scheduled frequency for batch processing approved UPI payout requests. Displayed in UI copy. | `[CONFIRM or ADJUST]` |
| `VIEW_HOLD_DAYS` | `7` | `integer` (days) | Counting maturation window: days after submission to CIRCLE on which the clip's verified views are snapshotted and finalized. Each clip is counted exactly once on this day. | **LOCKED (7 days)** |
| `MIN_VIEWS_TO_QUALIFY` | `1000` | `integer` (views) | Minimum verified views a clip must achieve on day `VIEW_HOLD_DAYS` to qualify for earnings. | `[CONFIRM or ADJUST]` |
| `MAX_PAYABLE_VIEWS_PER_CLIP` | `null` (set per campaign) | `integer \| null` | Global ceiling fallback if a campaign does not specify a `per_clip_view_cap`. Leave as `null` to mandate per-campaign configuration. | `[CONFIRM]` |
| `PER_CLIPPER_ANNUAL_CAP_INR` | `[FROM CA]` | `integer \| null` | Annual gross earnings ceiling per clipper per financial year to prevent triggering mandatory TDS / PAN reporting thresholds until tax guidance is confirmed. Enforced in the earnings function. | `[FROM CA: e.g. 20000 or null]` |
| `PLATFORMS_V1` | `["youtube_shorts", "instagram_reels"]` | `string[]` | Allowed vertical video platforms in v1. Validated strictly on submission URLs. | **LOCKED (v1)** |
| `CA_SIGNOFF_DONE` | `false` | `boolean` | Compliance safety latch. While `false`: (1) shows *"Payouts are processed manually by the CIRCLE team"* across payout UI, and (2) strictly blocks marking campaigns as `live` in production. Must be set to `true` only after CA review of GST & TDS obligations. | **Set to `true` only after CA review** |
| `PROMO_SLOTS_ENABLED` | `false` | `boolean` | Flag controlling the weekly promoted campaign auction system. While `false`, nothing about promotion appears in the UI. | `[TOGGLE as desired]` |
| `PROMO_SLOT_COUNT` | `3` | `integer` | Number of top sponsored positions available on `/clipping/campaigns` and the hub live strip. | `[CONFIRM or ADJUST]` |
| `PROMO_MIN_BID_INR` | `[PLACEHOLDER]` | `integer \| null` | Minimum bid in INR for a 1-week promoted slot. | `[PLACEHOLDER: DECIDE e.g. 1000]` |
| `PROMO_BID_CLOSE` | `"Friday 18:00 IST"` | `string` | Weekly auction close cutoff. Slots run Monday 00:00 to Sunday 23:59 Asia/Kolkata for the following week. | **LOCKED** |

---

## 2. Implementation Reference (`lib/config/clipping.ts`)

In Part 15, these settings will be exposed as a strictly typed TypeScript module:

```ts
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
```
