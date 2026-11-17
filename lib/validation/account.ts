import { z } from "zod";

import { creatorCategories } from "@/lib/content/categories";
import { isAdultDob } from "@/lib/format";

const categorySlugs = creatorCategories.map((item) => item.slug) as [
  (typeof creatorCategories)[number]["slug"],
  ...(typeof creatorCategories)[number]["slug"][],
];

const optionalHttps = z
  .string()
  .trim()
  .max(300)
  .optional()
  .or(z.literal(""))
  .refine((value) => !value || value.startsWith("https://"), { message: "Use a full https link." });

export const accountSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name.").max(80),
    email: z.string().trim().email("Enter a valid email.").max(200),
    password: z.string().min(8, "Use at least 8 characters.").max(72),
    role: z.enum(["creator", "brand"]),
    date_of_birth: z.string().trim().optional().or(z.literal("")),
    adult: z.boolean(),
    consent: z.boolean().refine((value) => value, { message: "Consent is required." }),
    company_website: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.role !== "creator") return;
    if (!value.adult) {
      ctx.addIssue({ code: "custom", path: ["adult"], message: "Confirm that you are 18 or older." });
    }
    if (!value.date_of_birth || !isAdultDob(value.date_of_birth)) {
      ctx.addIssue({
        code: "custom",
        path: ["date_of_birth"],
        message: "Creators must be 18 or older. Enter a valid date of birth.",
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email.").max(200),
  password: z.string().min(8, "Enter your password.").max(72),
});

export const profileSchema = z
  .object({
    display_name: z.string().trim().min(2, "Enter your name.").max(80),
    city: z.string().trim().max(80).optional().or(z.literal("")),
    bio: z.string().trim().max(500).optional().or(z.literal("")),
    platforms: z.string().trim().max(200).optional().or(z.literal("")),
    category: z.enum(categorySlugs).optional().or(z.literal("")),
    content_summary: z.string().trim().max(1000).optional().or(z.literal("")),
    instagram_url: optionalHttps,
    youtube_url: optionalHttps,
    other_url: optionalHttps,
    open_to_collab: z.boolean().optional(),
    open_to_ads: z.boolean().optional(),
    open_to_giveaway: z.boolean().optional(),
    open_to_affiliate: z.boolean().optional(),
    follower_count: z.string().trim().optional().or(z.literal("")),
    rates_visible: z.boolean(),
    price_from_inr: z.string().trim().optional().or(z.literal("")),
    offers_services: z.boolean(),
    service_title: z.string().trim().max(80).optional().or(z.literal("")),
  })
  .superRefine((value, ctx) => {
    if (value.follower_count && !/^\d+$/.test(value.follower_count)) {
      ctx.addIssue({ code: "custom", path: ["follower_count"], message: "Enter a whole number." });
    }
    if (value.price_from_inr && !/^\d+$/.test(value.price_from_inr)) {
      ctx.addIssue({ code: "custom", path: ["price_from_inr"], message: "Enter rupees as a whole number." });
    }
    if (value.offers_services && (value.service_title ?? "").trim().length < 2) {
      ctx.addIssue({ code: "custom", path: ["service_title"], message: "Name the service." });
    }
    if (value.offers_services && !value.price_from_inr) {
      ctx.addIssue({ code: "custom", path: ["price_from_inr"], message: "Enter a real starting price in rupees." });
    }
  });

export const collabSchema = z
  .object({
    title: z.string().trim().min(4, "Add a title.").max(120),
    summary: z.string().trim().min(20, "Describe the collab in at least 20 characters.").max(2000),
    kind: z.enum(["fixed", "open_bid", "barter"]),
    budget_inr: z.string().trim().optional().or(z.literal("")),
    barter_offer: z.string().trim().max(200).optional().or(z.literal("")),
  })
  .superRefine((value, ctx) => {
    const budget = value.budget_inr ?? "";
    if (budget && !/^\d+$/.test(budget)) {
      ctx.addIssue({ code: "custom", path: ["budget_inr"], message: "Enter the budget in whole rupees." });
    }
    if (value.kind === "fixed" && !/^\d+$/.test(budget)) {
      ctx.addIssue({ code: "custom", path: ["budget_inr"], message: "A fixed collab needs a budget in rupees." });
    }
    if (value.kind === "barter" && budget) {
      ctx.addIssue({ code: "custom", path: ["budget_inr"], message: "A barter collab has no cash budget." });
    }
    if (value.kind === "barter" && (value.barter_offer ?? "").trim().length < 2) {
      ctx.addIssue({ code: "custom", path: ["barter_offer"], message: "Say what is offered in exchange." });
    }
  });

export const applicationSchema = z.object({
  collab_id: z.string().uuid(),
  pitch: z.string().trim().min(20, "Use at least 20 characters.").max(2000),
  bid_inr: z.string().trim().optional().or(z.literal("")),
  kind: z.enum(["fixed", "open_bid", "barter"]),
}).superRefine((value, ctx) => {
  if (value.kind === "open_bid" && !/^\d+$/.test(value.bid_inr ?? "")) {
    ctx.addIssue({ code: "custom", path: ["bid_inr"], message: "Enter your bid in whole rupees." });
  }
  if (value.kind !== "open_bid" && value.bid_inr) {
    ctx.addIssue({ code: "custom", path: ["bid_inr"], message: "Only an open bid takes a bid amount." });
  }
});

export const eventSchema = z.object({
  title: z.string().trim().min(4).max(120),
  summary: z.string().trim().min(10).max(1000),
  kind: z.enum(["meetup", "webinar", "bootcamp", "community"]),
  starts_at: z.string().trim().min(8, "Choose a date and time."),
  city: z.string().trim().max(80).optional().or(z.literal("")),
});

const httpsUrl = z.string().trim().url("Use a full https link.").max(300).refine((value) => value.startsWith("https://"), {
  message: "Use an https link.",
});

export const giveawaySchema = z.object({
  title: z.string().trim().min(4).max(120),
  summary: z.string().trim().min(20).max(2000),
  prize: z.string().trim().min(2).max(200),
  ends_at: z.string().trim().optional().or(z.literal("")),
  social_url: httpsUrl,
});

export const affiliateSchema = z.object({
  title: z.string().trim().min(4).max(120),
  summary: z.string().trim().min(20).max(2000),
  terms: z.string().trim().min(10).max(1000),
  destination_url: httpsUrl,
});

export const challengeSchema = z.object({
  title: z.string().trim().min(4).max(120),
  summary: z.string().trim().min(20).max(2000),
  audience: z.enum(["creator", "brand", "anyone"]),
});

export const reportSchema = z.object({
  target_type: z.enum(["profile", "collab"]),
  target_id: z.string().uuid(),
  message: z.string().trim().min(20, "Use at least 20 characters.").max(1000),
});
