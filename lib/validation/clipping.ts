import { z } from "zod";
import { CLIPPING_CONFIG } from "@/lib/config/clipping";

export const platformTypeSchema = z.enum(["youtube_shorts", "instagram_reels"]);

export const linkPlatformSchema = z.object({
  platform: platformTypeSchema,
  handle: z
    .string()
    .trim()
    .min(1, "Handle is required")
    .max(80, "Handle cannot exceed 80 characters")
    .transform((val) => val.replace(/^@/, "").toLowerCase()),
});

export const createCampaignSchema = z.object({
  title: z
    .string()
    .trim()
    .min(4, "Title must be at least 4 characters")
    .max(120, "Title cannot exceed 120 characters"),
  summary: z
    .string()
    .trim()
    .min(10, "Summary must be at least 10 characters")
    .max(200, "Summary cannot exceed 200 characters"),
  brief_md: z
    .string()
    .trim()
    .min(20, "Brief instructions must be at least 20 characters")
    .max(20000, "Brief is too long (max 20,000 characters)"),
  rules_md: z.string().trim().max(10000).default(""),
  category: z
    .string()
    .trim()
    .min(2, "Category is required")
    .max(50, "Category too long"),
  language: z.string().trim().default("en"),
  platforms: z
    .array(platformTypeSchema)
    .min(1, "Select at least one deliverable platform"),
  rate_inr_per_1k: z.coerce
    .number()
    .int("Rate must be an integer INR")
    .min(CLIPPING_CONFIG.clipRateMinInrPer1k, `Rate must be at least ₹${CLIPPING_CONFIG.clipRateMinInrPer1k} per 1K views`)
    .max(CLIPPING_CONFIG.clipRateMaxInrPer1k, `Rate cannot exceed ₹${CLIPPING_CONFIG.clipRateMaxInrPer1k} per 1K views`),
  budget_inr: z.coerce
    .number()
    .int("Budget must be an integer INR")
    .min(1000, "Minimum campaign budget is ₹1,000"),
  per_clip_view_cap: z.coerce
    .number()
    .int("View cap must be an integer")
    .min(1000, "Per-clip view cap must be at least 1,000 views")
    .default(100000),
  per_clipper_cap_inr: z.coerce
    .number()
    .int()
    .positive()
    .nullable()
    .optional(),
  min_views_to_qualify: z.coerce
    .number()
    .int()
    .min(0)
    .default(1000),
  source_links: z
    .array(
      z.object({
        title: z.string().trim().min(1, "Source title required"),
        url: z.string().trim().url("Valid URL required"),
        platform: z.string().optional(),
      })
    )
    .min(1, "Provide at least one source footage link"),
  asset_folder_url: z
    .string()
    .trim()
    .url("Valid asset folder URL required")
    .optional()
    .or(z.literal("")),
  required_caption: z.string().trim().max(500).optional().or(z.literal("")),
  required_hashtags: z
    .union([z.string(), z.array(z.string())])
    .transform((val) => {
      if (Array.isArray(val)) return val;
      return val
        .split(/[,\s]+/)
        .map((t) => t.trim().replace(/^#/, ""))
        .filter(Boolean);
    })
    .default([]),
  required_mention: z
    .string()
    .trim()
    .max(80)
    .transform((val) => val.replace(/^@/, ""))
    .optional()
    .or(z.literal("")),
  rights_confirmed: z.literal(true, {
    message: "You must confirm you have the legal right to commission edits from this footage.",
  }),
});

export const submitClipSchema = z.object({
  campaign_id: z.string().uuid("Invalid campaign ID"),
  platform_account_id: z.string().uuid("Please select your verified platform account"),
  post_url: z.string().trim().min(5, "Enter a valid video URL").max(500),
});

export const reviewSubmissionSchema = z.object({
  submission_id: z.string().uuid("Invalid submission ID"),
  status: z.enum(["approved", "rejected"]),
  reject_reason: z.string().trim().max(500).optional(),
});

export const payoutRequestSchema = z.object({
  amount_inr: z.coerce
    .number()
    .int("Amount must be a whole rupee value")
    .min(CLIPPING_CONFIG.minPayoutInr, `Minimum withdrawal is ₹${CLIPPING_CONFIG.minPayoutInr}`),
  upi_id: z
    .string()
    .trim()
    .min(3, "UPI ID is required")
    .max(100, "UPI ID too long")
    .regex(/^[\w.-]+@[\w.-]+$/, "Enter a valid UPI ID (e.g. yourname@okhdfcbank, mobile@upi)"),
});

export const adminFundCampaignSchema = z.object({
  campaign_id: z.string().uuid("Invalid campaign ID"),
  funded_ref: z
    .string()
    .trim()
    .min(4, "Bank UTR or reference number is required")
    .max(100, "Reference is too long"),
});

export const adminVerifyInstagramSnapshotSchema = z.object({
  submission_id: z.string().uuid("Invalid submission ID"),
  views: z.coerce.number().int().min(0, "Views cannot be negative"),
  likes: z.coerce.number().int().min(0).optional(),
  comments: z.coerce.number().int().min(0).optional(),
  evidence_path: z.string().trim().optional(),
});

export const adminVerifyFollowersSchema = z.object({
  platform_account_id: z.string().uuid("Invalid platform account ID"),
  followers: z.coerce.number().int().min(0, "Follower count cannot be negative"),
});
