import { z } from "zod";

import { faqCategories } from "@/lib/content/faqs";

export const contactTopics = [
  "General question",
  "Partnership / sponsorship",
  "Brand enquiry",
  "Report a problem",
  "Press",
  "Other",
] as const;

export const partnerTypes = [
  { value: "perk", label: "Member perk (studios, gear, tools)" },
  { value: "venue", label: "Venue hosting an event" },
  { value: "sponsor", label: "Sponsor of an award or event" },
  { value: "educator", label: "Educator running a webinar" },
] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.string().trim().email("Enter a valid email.").max(200),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  topic: z.enum(contactTopics),
  message: z
    .string()
    .trim()
    .min(20, "Use at least 20 characters.")
    .max(2000, "Keep it under 2000 characters."),
  consent: z.boolean().refine((value) => value, { message: "Consent is required." }),
  company_website: z.string().optional(),
});

export const partnerSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.string().trim().email("Enter a valid email.").max(200),
  company: z.string().trim().min(2, "Enter the organisation.").max(120),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  partnerType: z.enum(["perk", "venue", "sponsor", "educator"]),
  message: z
    .string()
    .trim()
    .min(20, "Use at least 20 characters.")
    .max(2000),
  consent: z.boolean().refine((value) => value, { message: "Consent is required." }),
  company_website: z.string().optional(),
});

export const budgetRanges = [
  "Not sure yet",
  "Under ₹50,000",
  "₹50,000–₹2,00,000",
  "₹2,00,000–₹5,00,000",
  "Above ₹5,00,000",
] as const;

export const leadSchema = z
  .object({
    audience: z.enum(["brand", "creator"]),
    service_slug: z.string().trim().min(2).max(80),
    name: z.string().trim().min(2, "Enter your name.").max(80),
    company: z.string().trim().max(120).optional().or(z.literal("")),
    email: z.string().trim().email("Enter a valid email.").max(200),
    phone: z.string().trim().max(30).optional().or(z.literal("")),
    instagram_or_site: z.string().trim().max(200).optional().or(z.literal("")),
    budget_range: z.string().trim().max(80).optional().or(z.literal("")),
    message: z
      .string()
      .trim()
      .min(20, "Use at least 20 characters.")
      .max(2000, "Keep it under 2000 characters."),
    consent: z.boolean().refine((value) => value, { message: "Consent is required." }),
    company_website: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.audience === "brand" && (value.company ?? "").trim().length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["company"],
        message: "Enter the company name.",
      });
    }
    if (value.audience === "creator" && (value.instagram_or_site ?? "").trim().length < 2) {
      ctx.addIssue({
        code: "custom",
        path: ["instagram_or_site"],
        message: "Enter the handle or profile link.",
      });
    }
  });

export const newsletterSchema = z.object({
  email: z.string().trim().email("Enter a valid email.").max(200),
  consent: z.boolean().refine((value) => value, { message: "Consent is required." }),
  source: z.string().trim().min(1).max(80),
  company_website: z.string().optional(),
});

export const faqWriteSchema = z.object({
  id: z.string().uuid().optional(),
  category: z.enum(faqCategories),
  question: z.string().trim().min(8).max(200),
  answer_md: z.string().trim().min(8).max(4000),
  sort: z.coerce.number().int().min(0).max(1000),
  published: z.boolean(),
});

export type LeadInput = z.infer<typeof leadSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type PartnerInput = z.infer<typeof partnerSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
