"use server";

import { createHash, randomBytes } from "node:crypto";

import { z } from "zod";

import { requireAdmin, currentUserId } from "@/lib/auth/admin";
import { sendEmail, teamInbox } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";
import { findService, servicePath } from "@/lib/content/agency-services";
import { site } from "@/lib/site";
import { createAdminClient } from "@/lib/supabase/admin";
import { hasServiceRole, isSupabaseConfigured } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";
import {
  contactSchema,
  faqWriteSchema,
  newsletterSchema,
  leadSchema,
  partnerSchema,
} from "@/lib/validation/support";

export type FormState = {
  status: "idle" | "success" | "error";
  message: string;
};

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function newToken() {
  return randomBytes(32).toString("hex");
}

async function limited(scope: string) {
  const ip = await clientIp();
  return rateLimit(`${scope}:${ip}`);
}

export async function submitContact(input: unknown): Promise<FormState> {
  if (!(await limited("contact"))) {
    return { status: "error", message: "Too many messages from this network. Try again later." };
  }

  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }
  if (parsed.data.company_website) return { status: "success", message: "received" };

  if (!isSupabaseConfigured() || !hasServiceRole()) {
    return {
      status: "error",
      message: "The contact form needs the Supabase secret key before it can save messages.",
    };
  }

  const userId = await currentUserId();
  const admin = createAdminClient();
  const { error } = await admin.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    topic: parsed.data.topic,
    message: parsed.data.message,
    user_id: userId,
  });

  if (error) return { status: "error", message: "We could not save that message." };

  await sendEmail({
    to: teamInbox(),
    subject: `CIRCLE contact: ${parsed.data.topic}`,
    text: `${parsed.data.name} <${parsed.data.email}>\nPhone: ${parsed.data.phone || "—"}\n\n${parsed.data.message}`,
  });

  return { status: "success", message: "received" };
}

export async function submitPartnership(input: unknown): Promise<FormState> {
  if (!(await limited("partnership"))) {
    return { status: "error", message: "Too many enquiries from this network. Try again later." };
  }

  const parsed = partnerSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }
  if (parsed.data.company_website) return { status: "success", message: "received" };

  if (!isSupabaseConfigured() || !hasServiceRole()) {
    return {
      status: "error",
      message: "The partnership form needs the Supabase secret key before it can save enquiries.",
    };
  }

  const admin = createAdminClient();
  const { error } = await admin.from("leads").insert({
    service_slug: "partnership",
    audience: "partner",
    name: parsed.data.name,
    company: parsed.data.company,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    message: parsed.data.message,
    consent: true,
    source_page: "/partners",
    partner_type: parsed.data.partnerType,
  });

  if (error) return { status: "error", message: "We could not save that enquiry." };

  await sendEmail({
    to: teamInbox(),
    subject: `CIRCLE partnership: ${parsed.data.partnerType}`,
    text: `${parsed.data.name} · ${parsed.data.company} <${parsed.data.email}>\n\n${parsed.data.message}`,
  });

  return { status: "success", message: "received" };
}

export async function submitLead(input: unknown): Promise<FormState> {
  if (!(await limited("lead"))) {
    return { status: "error", message: "Too many enquiries from this network. Try again later." };
  }

  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Check the form and try again." };
  }
  if (parsed.data.company_website) return { status: "success", message: "received" };

  const service =
    parsed.data.service_slug === "general" ? null : findService(parsed.data.service_slug);
  if (parsed.data.service_slug !== "general" && (!service || service.audience !== parsed.data.audience)) {
    return { status: "error", message: "That service is not on this form." };
  }

  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "The enquiry form is not connected to the database yet.",
    };
  }

  const sourcePage =
    service != null
      ? servicePath(service)
      : parsed.data.audience === "brand"
        ? "/brands"
        : "/creators";

  const admin = createAdminClient();
  const { error } = await admin.from("leads").insert({
    service_slug: parsed.data.service_slug,
    audience: parsed.data.audience,
    name: parsed.data.name,
    company: parsed.data.company || null,
    email: parsed.data.email,
    phone: parsed.data.phone || null,
    instagram_or_site: parsed.data.instagram_or_site || null,
    budget_range: parsed.data.budget_range || null,
    message: parsed.data.message,
    consent: true,
    source_page: sourcePage,
  });

  if (error) return { status: "error", message: "We could not save that enquiry." };

  const label = service?.title ?? "General enquiry";
  await sendEmail({
    to: teamInbox(),
    subject: `CIRCLE lead: ${label}`,
    text: `${parsed.data.name}${parsed.data.company ? ` · ${parsed.data.company}` : ""} <${parsed.data.email}>
Phone: ${parsed.data.phone || "—"}
Profile or site: ${parsed.data.instagram_or_site || "—"}
Budget: ${parsed.data.budget_range || "—"}
Page: ${sourcePage}

${parsed.data.message}`,
  });

  return { status: "success", message: "received" };
}

export async function subscribeNewsletter(input: unknown): Promise<FormState> {
  if (!(await limited("newsletter"))) {
    return { status: "error", message: "Too many attempts from this network. Try again later." };
  }

  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: "Enter a valid email and confirm consent." };
  }
  if (parsed.data.company_website) return { status: "success", message: "pending" };

  if (!isSupabaseConfigured() || !hasServiceRole()) {
    return {
      status: "error",
      message: "The newsletter needs the Supabase secret key before it can save subscribers.",
    };
  }

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("newsletter_subscribers")
    .select("status")
    .eq("email", parsed.data.email.toLowerCase())
    .maybeSingle();

  if (existing?.status === "confirmed") {
    return { status: "success", message: "confirmed" };
  }

  const confirmToken = newToken();
  const unsubscribeToken = newToken();
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const email = parsed.data.email.toLowerCase();

  const { error } = await admin.from("newsletter_subscribers").upsert(
    {
      email,
      status: "pending",
      source: parsed.data.source,
      confirm_token: hashToken(confirmToken),
      confirm_expires_at: expires,
      unsubscribe_token: hashToken(unsubscribeToken),
      confirmed_at: null,
    },
    { onConflict: "email" },
  );

  if (error) return { status: "error", message: "We could not save that subscription." };

  const confirmUrl = `${site.url}/newsletter/confirm?token=${confirmToken}`;
  const unsubscribeUrl = `${site.url}/newsletter/unsubscribe?token=${unsubscribeToken}`;
  const delivery = await sendEmail({
    to: email,
    subject: "Confirm your CIRCLE newsletter",
    text: `Confirm your subscription: ${confirmUrl}\n\nThis link expires in 7 days. We will not send news until you confirm.\n\nUnsubscribe: ${unsubscribeUrl}`,
  });

  if (!delivery.sent) {
    return {
      status: "error",
      message: "We saved the request but could not send the confirmation email.",
    };
  }

  return { status: "success", message: "pending" };
}

export async function confirmNewsletter(token: string) {
  if (!token || !isSupabaseConfigured() || !hasServiceRole()) return "invalid" as const;
  const admin = createAdminClient();
  const hashed = hashToken(token);
  const { data } = await admin
    .from("newsletter_subscribers")
    .select("id, status, confirm_expires_at")
    .eq("confirm_token", hashed)
    .maybeSingle();

  if (!data?.confirm_expires_at) return "invalid" as const;
  if (new Date(data.confirm_expires_at).getTime() < Date.now()) return "expired" as const;

  const { error } = await admin
    .from("newsletter_subscribers")
    .update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      confirm_token: null,
      confirm_expires_at: null,
    })
    .eq("id", data.id)
    .eq("confirm_token", hashed);

  if (error) return "invalid" as const;
  return "confirmed" as const;
}

export async function unsubscribeNewsletter(token: string) {
  if (!token || !isSupabaseConfigured() || !hasServiceRole()) return "invalid" as const;
  const admin = createAdminClient();
  const hashed = hashToken(token);
  const { data } = await admin
    .from("newsletter_subscribers")
    .select("id")
    .eq("unsubscribe_token", hashed)
    .maybeSingle();

  if (!data) return "invalid" as const;

  const { error } = await admin
    .from("newsletter_subscribers")
    .update({
      status: "unsubscribed",
      confirm_token: null,
      confirm_expires_at: null,
      unsubscribe_token: null,
    })
    .eq("id", data.id)
    .eq("unsubscribe_token", hashed);

  if (error) return "invalid" as const;
  return "unsubscribed" as const;
}

const statusSchema = z.enum(["new", "in_progress", "closed"]);

export async function updateMessageStatus(id: string, status: string): Promise<FormState> {
  const adminGate = await requireAdmin();
  if (!adminGate.ok) return { status: "error", message: "Not allowed." };
  const parsed = z.string().uuid().safeParse(id);
  const next = statusSchema.safeParse(status);
  if (!parsed.success || !next.success) {
    return { status: "error", message: "That update is not valid." };
  }

  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ status: next.data })
    .eq("id", parsed.data);

  if (error) return { status: "error", message: "Could not update that message." };
  return { status: "success", message: "Updated." };
}

export async function saveFaq(input: unknown): Promise<FormState> {
  const adminGate = await requireAdmin();
  if (!adminGate.ok) return { status: "error", message: "Not allowed." };
  const parsed = faqWriteSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Check the FAQ fields." };

  const supabase = await createSessionClient();
  const row = {
    category: parsed.data.category,
    question: parsed.data.question,
    answer_md: parsed.data.answer_md,
    sort: parsed.data.sort,
    published: parsed.data.published,
  };
  const query = parsed.data.id
    ? supabase.from("faqs").update(row).eq("id", parsed.data.id)
    : supabase.from("faqs").insert(row);
  const { error } = await query;
  if (error) return { status: "error", message: "Could not save that FAQ." };
  return { status: "success", message: "Saved." };
}

export async function setOwnNewsletter(enabled: boolean): Promise<FormState> {
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();
  if (!email) return { status: "error", message: "Sign in before changing the newsletter." };
  if (!isSupabaseConfigured() || !hasServiceRole()) {
    return { status: "error", message: "The newsletter needs the Supabase secret key before it can be changed." };
  }

  if (!enabled) {
    const admin = createAdminClient();
    await admin
      .from("newsletter_subscribers")
      .update({
        status: "unsubscribed",
        confirm_token: null,
        confirm_expires_at: null,
        unsubscribe_token: null,
      })
      .eq("email", email);
    return { status: "success", message: "unsubscribed" };
  }

  return subscribeNewsletter({
    email,
    consent: true,
    source: "dashboard-settings",
    company_website: "",
  });
}
