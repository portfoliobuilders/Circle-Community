import "server-only";

import { missingTable } from "@/lib/format";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAnonClient, createSessionClient } from "@/lib/supabase/server";

export type ProfileCard = {
  id: string;
  role: string;
  display_name: string;
  city: string | null;
  bio: string | null;
  offers_services: boolean;
  service_title: string | null;
  platforms: string | null;
  category: string | null;
  content_summary: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  other_url: string | null;
  open_to_collab: boolean;
  open_to_ads: boolean;
  open_to_giveaway: boolean;
  open_to_affiliate: boolean;
  follower_count: number | null;
  follower_status: string;
  rates_visible: boolean;
  price_from_inr: number | null;
};

export type ProfileRow = ProfileCard & {
  date_of_birth: string | null;
};

export type CollabRow = {
  id: string;
  brand_id: string;
  title: string;
  summary: string;
  kind: "fixed" | "open_bid" | "barter";
  budget_inr: number | null;
  barter_offer: string | null;
  ad_disclosure: boolean;
  status: string;
  created_at: string;
};

export type ApplicationRow = {
  id: string;
  collab_id: string;
  creator_id: string;
  pitch: string;
  bid_inr: number | null;
  status: string;
  created_at: string;
};

export type EventRow = {
  id: string;
  title: string;
  summary: string;
  kind: string;
  starts_at: string;
  city: string | null;
};

const unavailable = "These tables are not on the database yet. Apply the latest Supabase migration.";

export async function listProfileCards(): Promise<{ rows: ProfileCard[]; error: string | null }> {
  if (!isSupabaseConfigured()) return { rows: [], error: "Supabase is not configured." };
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("profile_cards")
    .select("id, role, display_name, city, bio, category, content_summary, instagram_url, youtube_url, other_url, open_to_collab, open_to_ads, open_to_giveaway, open_to_affiliate, offers_services, service_title, platforms, follower_count, follower_status, rates_visible, price_from_inr")
    .order("created_at", { ascending: false });
  if (error) return { rows: [], error: missingTable(error) ? unavailable : "The directory could not be loaded." };
  return { rows: (data ?? []) as ProfileCard[], error: null };
}

export async function getProfileCard(id: string) {
  if (!isSupabaseConfigured()) return { row: null, error: "Supabase is not configured." };
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("profile_cards")
    .select("id, role, display_name, city, bio, category, content_summary, instagram_url, youtube_url, other_url, open_to_collab, open_to_ads, open_to_giveaway, open_to_affiliate, offers_services, service_title, platforms, follower_count, follower_status, rates_visible, price_from_inr")
    .eq("id", id)
    .maybeSingle();
  if (error) return { row: null, error: missingTable(error) ? unavailable : "That profile could not be loaded." };
  return { row: data as ProfileCard | null, error: null };
}

export async function getOwnProfile() {
  if (!isSupabaseConfigured()) return { userId: null, profile: null, error: "Supabase is not configured." };
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { userId: null, profile: null, error: null };
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, role, display_name, city, bio, date_of_birth, category, content_summary, instagram_url, youtube_url, other_url, open_to_collab, open_to_ads, open_to_giveaway, open_to_affiliate, offers_services, service_title, price_from_inr, platforms, follower_count, follower_status, rates_visible")
    .eq("id", data.user.id)
    .maybeSingle();
  if (error) return { userId: data.user.id, profile: null, error: missingTable(error) ? unavailable : "Your profile could not be loaded." };
  return { userId: data.user.id, profile: profile as ProfileRow | null, error: null };
}

export async function listCollabs() {
  if (!isSupabaseConfigured()) return { rows: [] as CollabRow[], error: "Supabase is not configured." };
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("collabs")
    .select("id, brand_id, title, summary, kind, budget_inr, barter_offer, ad_disclosure, status, created_at")
    .order("created_at", { ascending: false });
  if (error) return { rows: [], error: missingTable(error) ? unavailable : "Collabs could not be loaded." };
  return { rows: (data ?? []) as CollabRow[], error: null };
}

export async function getCollab(id: string) {
  if (!isSupabaseConfigured()) return { row: null, error: "Supabase is not configured." };
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("collabs")
    .select("id, brand_id, title, summary, kind, budget_inr, barter_offer, ad_disclosure, status, created_at")
    .eq("id", id)
    .maybeSingle();
  if (error) return { row: null, error: missingTable(error) ? unavailable : "That collab could not be loaded." };
  return { row: data as CollabRow | null, error: null };
}

export async function listApplications(collabId: string) {
  if (!isSupabaseConfigured()) return { rows: [] as ApplicationRow[] };
  const supabase = await createSessionClient();
  const { data } = await supabase
    .from("applications")
    .select("id, collab_id, creator_id, pitch, bid_inr, status, created_at")
    .eq("collab_id", collabId)
    .order("created_at", { ascending: false });
  return { rows: (data ?? []) as ApplicationRow[] };
}

export async function listEvents() {
  if (!isSupabaseConfigured()) return { rows: [] as EventRow[], error: "Supabase is not configured." };
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("events")
    .select("id, title, summary, kind, starts_at, city")
    .order("starts_at", { ascending: true });
  if (error) return { rows: [], error: missingTable(error) ? unavailable : "Events could not be loaded." };
  return { rows: (data ?? []) as EventRow[], error: null };
}

export async function listPointTotals() {
  if (!isSupabaseConfigured()) return { rows: [] as { profile_id: string; points: number }[], error: "Supabase is not configured." };
  const supabase = createAnonClient();
  const { data, error } = await supabase.from("point_events").select("profile_id, points");
  if (error) return { rows: [], error: missingTable(error) ? unavailable : "Points could not be loaded." };
  const totals = new Map<string, number>();
  for (const row of data ?? []) {
    totals.set(row.profile_id, (totals.get(row.profile_id) ?? 0) + row.points);
  }
  return {
    rows: [...totals.entries()].map(([profile_id, points]) => ({ profile_id, points })).sort((a, b) => b.points - a.points),
    error: null,
  };
}

export type GiveawayRow = {
  id: string;
  owner_id: string;
  title: string;
  summary: string;
  prize: string;
  ends_at: string | null;
  social_url: string;
  status: string;
};

export async function listGiveaways() {
  if (!isSupabaseConfigured()) return { rows: [] as GiveawayRow[], error: "Supabase is not configured." };
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("giveaways")
    .select("id, owner_id, title, summary, prize, ends_at, social_url, status")
    .eq("status", "open")
    .order("created_at", { ascending: false });
  if (error) return { rows: [], error: missingTable(error) ? unavailable : "Giveaways could not be loaded." };
  return { rows: (data ?? []) as GiveawayRow[], error: null };
}

export type AffiliateRow = {
  id: string;
  brand_id: string;
  title: string;
  summary: string;
  terms: string;
  destination_url: string;
  status: string;
};

export async function listAffiliates() {
  if (!isSupabaseConfigured()) return { rows: [] as AffiliateRow[], error: "Supabase is not configured." };
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("affiliate_offers")
    .select("id, brand_id, title, summary, terms, destination_url, status")
    .eq("status", "open")
    .order("created_at", { ascending: false });
  if (error) return { rows: [], error: missingTable(error) ? unavailable : "Affiliate offers could not be loaded." };
  return { rows: (data ?? []) as AffiliateRow[], error: null };
}

export type ChallengeRow = {
  id: string;
  title: string;
  summary: string;
  audience: string;
  status: string;
};

export async function listChallenges() {
  if (!isSupabaseConfigured()) return { rows: [] as ChallengeRow[], error: "Supabase is not configured." };
  const supabase = createAnonClient();
  const { data, error } = await supabase
    .from("challenges")
    .select("id, title, summary, audience, status")
    .eq("status", "open")
    .order("created_at", { ascending: false });
  if (error) return { rows: [], error: missingTable(error) ? unavailable : "Challenges could not be loaded." };
  return { rows: (data ?? []) as ChallengeRow[], error: null };
}

export async function listBrandOpportunity() {
  const { rows, error } = await listCollabs();
  if (error) return { rows: [] as { brand_id: string; collabs: number }[], error };
  const totals = new Map<string, number>();
  for (const row of rows) totals.set(row.brand_id, (totals.get(row.brand_id) ?? 0) + 1);
  return {
    rows: [...totals.entries()].map(([brand_id, collabs]) => ({ brand_id, collabs })).sort((a, b) => b.collabs - a.collabs),
    error: null,
  };
}
