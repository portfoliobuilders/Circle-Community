import { z } from "zod";
import { CLIPPING_CONFIG } from "@/lib/config/clipping";
import { platformTypeSchema } from "./clipping";

export const deliverableTypeSchema = z.enum(["reel", "post", "carousel", "story", "short"]);
export const pricingModeSchema = z.enum(["fixed", "quote"]);
export const subjectTypeSchema = z.enum(["brand", "individual"]);

export const createPrCampaignSchema = z
  .object({
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
      .refine(
        (val) => {
          const lower = val.toLowerCase();
          return !CLIPPING_CONFIG.pr.bannedCategories.some((banned) => lower.includes(banned));
        },
        {
          message: "Campaign category is prohibited under CIRCLE editorial and advertising policy.",
        }
      ),
    language: z.string().trim().default("en"),
    platforms: z
      .array(platformTypeSchema)
      .min(1, "Select at least one deliverable platform"),
    deliverable_type: deliverableTypeSchema,
    pricing_mode: pricingModeSchema,
    fee_per_post_inr: z.coerce.number().int().min(500, "Minimum fee per post is ₹500").optional(),
    slots: z.coerce.number().int().min(1, "Campaign must offer at least 1 page slot"),
    budget_inr: z.coerce.number().int().min(1000, "Minimum campaign budget is ₹1,000"),
    min_followers: z.coerce
      .number()
      .int()
      .min(CLIPPING_CONFIG.pr.minFollowers, `Minimum follower floor is ${CLIPPING_CONFIG.pr.minFollowers.toLocaleString("en-IN")}`),
    max_followers: z.coerce.number().int().optional().nullable(),
    niches: z.array(z.string()).default([]),
    cities: z.array(z.string()).default([]),
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
    required_link: z.string().trim().url("Valid URL required").optional().or(z.literal("")),
    content_approval_required: z.boolean().default(true),
    subject_type: subjectTypeSchema,
    subject_consent_confirmed: z.boolean().optional(),
    rights_confirmed: z.literal(true, {
      message: "You must confirm you have authorized rights and consent to commission this promotion.",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.pricing_mode === "fixed") {
      if (!data.fee_per_post_inr || data.fee_per_post_inr <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fee_per_post_inr"],
          message: "Fixed pricing requires a fee per post (minimum ₹500).",
        });
      }
      const calculatedBudget = (data.fee_per_post_inr || 0) * data.slots;
      if (data.budget_inr !== calculatedBudget) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["budget_inr"],
          message: `In fixed mode, budget must equal fee per post × slots (₹${calculatedBudget.toLocaleString("en-IN")}).`,
        });
      }
    }

    if (data.subject_type === "individual" && !data.subject_consent_confirmed) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["subject_consent_confirmed"],
        message: "Promoting an individual requires confirming written legal consent from that individual.",
      });
    }

    if (data.max_followers && data.max_followers < data.min_followers) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["max_followers"],
        message: "Maximum followers cannot be lower than minimum followers.",
      });
    }
  });

export const applyPrSchema = z.object({
  campaign_id: z.string().uuid("Invalid campaign ID"),
  platform_account_id: z.string().uuid("Please select your verified platform account"),
  pitch: z
    .string()
    .trim()
    .min(20, "Pitch must be at least 20 characters explaining how you will present the story")
    .max(2000, "Pitch cannot exceed 2,000 characters")
    .refine(
      (val) => {
        // Prevent sharing raw emails or phone numbers prior to acceptance
        const phoneRegex = /(\+?\d{1,4}[-.\s]?)?(\d{10}|\d{3}[-.\s]\d{3}[-.\s]\d{4})/;
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
        return !phoneRegex.test(val) && !emailRegex.test(val);
      },
      {
        message: "Contact details (phone/email) are prohibited in pitch. All communication remains on CIRCLE.",
      }
    ),
  quote_inr: z.coerce.number().int().positive("Quote must be a positive rupee value").optional().nullable(),
});

export const acceptPrSchema = z.object({
  application_id: z.string().uuid("Invalid application ID"),
});

export const rejectPrSchema = z.object({
  application_id: z.string().uuid("Invalid application ID"),
  reason: z.string().trim().max(500).optional(),
});

export const uploadPrDraftSchema = z.object({
  deliverable_id: z.string().uuid("Invalid deliverable ID"),
  draft_path: z.string().trim().min(3, "Valid storage draft path required"),
});

export const reviewPrDraftSchema = z.object({
  deliverable_id: z.string().uuid("Invalid deliverable ID"),
  decision: z.enum(["approved", "changes_requested"]),
  feedback: z.string().trim().max(1000).optional(),
});

export const submitPrPostUrlSchema = z.object({
  deliverable_id: z.string().uuid("Invalid deliverable ID"),
  post_url: z.string().trim().url("Valid post URL required").max(500),
});

export const adminVerifyPrLiveSchema = z.object({
  deliverable_id: z.string().uuid("Invalid deliverable ID"),
  is_compliant: z.boolean(),
  notes: z.string().trim().max(500).optional(),
});
