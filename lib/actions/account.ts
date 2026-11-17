"use server";

import { redirect } from "next/navigation";

import { rateLimit } from "@/lib/rate-limit";
import { clientIp } from "@/lib/request";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";
import { accountSchema, loginSchema, profileSchema } from "@/lib/validation/account";
import type { FormState } from "@/lib/actions/support";

async function limited(scope: string) {
  const ip = await clientIp();
  return rateLimit(`${scope}:${ip}`);
}

export async function signUpAccount(input: unknown): Promise<FormState> {
  if (!(await limited("signup"))) {
    return { status: "error", message: "Too many attempts from this network. Try again later." };
  }
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Supabase is not configured, so an account cannot be created." };
  }
  const parsed = accountSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Check the form and try again." };
  if (parsed.data.company_website) return { status: "success", message: "Check your email to confirm the account." };

  const supabase = await createSessionClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        display_name: parsed.data.name,
        role: parsed.data.role,
        date_of_birth: parsed.data.role === "creator" ? parsed.data.date_of_birth : "",
      },
    },
  });
  if (error) return { status: "error", message: "That account could not be created. Try a different email." };
  if (data.session) redirect("/dashboard");
  return { status: "success", message: "Check your email to confirm the account, then sign in." };
}

export async function signInAccount(input: unknown): Promise<FormState> {
  if (!(await limited("login"))) {
    return { status: "error", message: "Too many attempts from this network. Try again later." };
  }
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Supabase is not configured, so sign-in is unavailable." };
  }
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Check the email and password." };

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });
  if (error) {
    return { status: "error", message: "Email or password is wrong, or the email is not confirmed yet." };
  }
  redirect("/dashboard");
}

export async function signOutAccount() {
  if (!isSupabaseConfigured()) redirect("/");
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function saveProfile(input: unknown): Promise<FormState> {
  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Supabase is not configured." };
  }
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) return { status: "error", message: "Check the profile and try again." };

  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { status: "error", message: "Sign in to save your profile." };

  const { error } = await supabase
    .from("profiles")
    .update({
      display_name: parsed.data.display_name,
      city: parsed.data.city || null,
      bio: parsed.data.bio || null,
      platforms: parsed.data.platforms || null,
      category: parsed.data.category || null,
      content_summary: parsed.data.content_summary || null,
      instagram_url: parsed.data.instagram_url || null,
      youtube_url: parsed.data.youtube_url || null,
      other_url: parsed.data.other_url || null,
      open_to_collab: parsed.data.open_to_collab ?? true,
      open_to_ads: parsed.data.open_to_ads ?? false,
      open_to_giveaway: parsed.data.open_to_giveaway ?? false,
      open_to_affiliate: parsed.data.open_to_affiliate ?? false,
      follower_count: parsed.data.follower_count ? Number(parsed.data.follower_count) : null,
      rates_visible: parsed.data.rates_visible,
      price_from_inr: parsed.data.price_from_inr ? Number(parsed.data.price_from_inr) : null,
      offers_services: parsed.data.offers_services,
      service_title: parsed.data.offers_services ? parsed.data.service_title || null : null,
    })
    .eq("id", data.user.id);

  if (error) return { status: "error", message: "The profile could not be saved." };
  return { status: "success", message: "Profile saved." };
}
