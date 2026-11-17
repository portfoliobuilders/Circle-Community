"use server";

import { revalidatePath } from "next/cache";

import type { FormState } from "@/lib/actions/support";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";
import { requireAdmin } from "@/lib/auth/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";
import { z } from "zod";

import {
  affiliateSchema,
  applicationSchema,
  challengeSchema,
  collabSchema,
  eventSchema,
  giveawaySchema,
  reportSchema,
} from "@/lib/validation/account";

const statusSchema = z.object({
  application_id: z.string().uuid(),
  collab_id: z.string().uuid(),
  status: z.enum(["accepted", "declined"]),
});

async function limited(scope: string) {
  const ip = await clientIp();
  return rateLimit(`${scope}:${ip}`);
}

export async function createCollab(input: unknown): Promise<FormState> {
  if (!(await limited("collab"))) return { status: "error", message: "Too many posts. Try again later." };
  if (!isSupabaseConfigured()) return { status: "error", message: "Supabase is not configured." };
  const parsed = collabSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Check the brief and try again." };

  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { status: "error", message: "Sign in with a brand account to post a collab." };

  const budget = parsed.data.kind === "barter" ? null : parsed.data.budget_inr ? Number(parsed.data.budget_inr) : null;
  const { error } = await supabase.from("collabs").insert({
    brand_id: data.user.id,
    title: parsed.data.title,
    summary: parsed.data.summary,
    kind: parsed.data.kind,
    budget_inr: budget,
    barter_offer: parsed.data.kind === "barter" ? parsed.data.barter_offer : null,
    ad_disclosure: true,
  });
  if (error) return { status: "error", message: "Only a brand profile can post a collab." };
  revalidatePath("/collabs");
  return { status: "success", message: "Collab posted. The brand pays the creator directly. CIRCLE does not hold the money." };
}

export async function applyToCollab(input: unknown): Promise<FormState> {
  if (!(await limited("apply"))) return { status: "error", message: "Too many applications. Try again later." };
  if (!isSupabaseConfigured()) return { status: "error", message: "Supabase is not configured." };
  const parsed = applicationSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Check the application and try again." };

  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { status: "error", message: "Sign in as a creator who is 18 or older to apply." };

  const { error } = await supabase.from("applications").insert({
    collab_id: parsed.data.collab_id,
    creator_id: data.user.id,
    pitch: parsed.data.pitch,
    bid_inr: parsed.data.kind === "open_bid" ? Number(parsed.data.bid_inr) : null,
  });
  if (error) {
    return { status: "error", message: "The application was not saved. Creators must be 18 or older, and the collab must still be open." };
  }
  revalidatePath(`/collabs/${parsed.data.collab_id}`);
  return { status: "success", message: "Application sent. Payment, if any, is between you and the brand." };
}

export async function setApplicationStatus(input: unknown): Promise<FormState> {
  if (!isSupabaseConfigured()) return { status: "error", message: "Supabase is not configured." };
  const parsed = statusSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Choose accept or decline." };
  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("applications")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.application_id);
  if (error) return { status: "error", message: "That status could not be saved." };
  revalidatePath(`/collabs/${parsed.data.collab_id}`);
  return { status: "success", message: "Status saved." };
}

export async function registerForEvent(eventId: string): Promise<FormState> {
  if (!isSupabaseConfigured()) return { status: "error", message: "Supabase is not configured." };
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { status: "error", message: "Sign in to register." };
  const { error } = await supabase.from("event_registrations").insert({
    event_id: eventId,
    profile_id: data.user.id,
  });
  if (error) return { status: "error", message: "Registration could not be saved." };
  revalidatePath("/events");
  return { status: "success", message: "You are registered. This event is free." };
}

export async function publishEvent(input: unknown): Promise<FormState> {
  const gate = await requireAdmin();
  if (!gate.ok) return { status: "error", message: "Only an admin can publish an event." };
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Check the event and try again." };
  const supabase = await createSessionClient();
  const { error } = await supabase.from("events").insert({
    title: parsed.data.title,
    summary: parsed.data.summary,
    kind: parsed.data.kind,
    starts_at: new Date(parsed.data.starts_at).toISOString(),
    city: parsed.data.city || null,
  });
  if (error) return { status: "error", message: "The event could not be saved." };
  revalidatePath("/events");
  return { status: "success", message: "Event published." };
}

export async function submitReport(input: unknown): Promise<FormState> {
  if (!(await limited("report"))) return { status: "error", message: "Too many reports. Try again later." };
  if (!isSupabaseConfigured()) return { status: "error", message: "Supabase is not configured." };
  const parsed = reportSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Check the report and try again." };
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { status: "error", message: "Sign in to report." };
  const { error } = await supabase.from("reports").insert({
    reporter_id: data.user.id,
    target_type: parsed.data.target_type,
    target_id: parsed.data.target_id,
    message: parsed.data.message,
  });
  if (error) return { status: "error", message: "The report could not be saved." };
  return { status: "success", message: "Report received. The team reviews reports of fake profiles and fake collabs." };
}

export async function createGiveaway(input: unknown): Promise<FormState> {
  if (!(await limited("giveaway"))) return { status: "error", message: "Too many listings. Try again later." };
  if (!isSupabaseConfigured()) return { status: "error", message: "Supabase is not configured." };
  const parsed = giveawaySchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Check the giveaway and use an https social link." };
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { status: "error", message: "Sign in to list a giveaway." };
  const { error } = await supabase.from("giveaways").insert({
    owner_id: data.user.id,
    title: parsed.data.title,
    summary: parsed.data.summary,
    prize: parsed.data.prize,
    ends_at: parsed.data.ends_at ? new Date(parsed.data.ends_at).toISOString() : null,
    social_url: parsed.data.social_url,
  });
  if (error) return { status: "error", message: "The giveaway could not be saved." };
  revalidatePath("/giveaways");
  return { status: "success", message: "Giveaway listed. People enter on the social link, not on CIRCLE." };
}

export async function createAffiliate(input: unknown): Promise<FormState> {
  if (!(await limited("affiliate"))) return { status: "error", message: "Too many listings. Try again later." };
  if (!isSupabaseConfigured()) return { status: "error", message: "Supabase is not configured." };
  const parsed = affiliateSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Check the offer and use an https link." };
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { status: "error", message: "Sign in with a brand account to list an affiliate offer." };
  const { error } = await supabase.from("affiliate_offers").insert({
    brand_id: data.user.id,
    title: parsed.data.title,
    summary: parsed.data.summary,
    terms: parsed.data.terms,
    destination_url: parsed.data.destination_url,
  });
  if (error) return { status: "error", message: "Only a brand profile can list an affiliate offer." };
  revalidatePath("/affiliates");
  return { status: "success", message: "Offer listed. You pay the creator under the terms you wrote. CIRCLE does not take a commission in v1." };
}

export async function publishChallenge(input: unknown): Promise<FormState> {
  const gate = await requireAdmin();
  if (!gate.ok) return { status: "error", message: "Only an admin can publish a challenge." };
  const parsed = challengeSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Check the challenge and try again." };
  const supabase = await createSessionClient();
  const { error } = await supabase.from("challenges").insert(parsed.data);
  if (error) return { status: "error", message: "The challenge could not be saved." };
  revalidatePath("/challenges");
  return { status: "success", message: "Challenge published. Points are added only after you confirm the work." };
}
