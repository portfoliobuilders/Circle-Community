"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { saveProfile } from "@/lib/actions/account";
import { creatorCategories } from "@/lib/content/categories";
import type { ProfileRow } from "@/lib/data/marketplace";
import { followerLabel } from "@/lib/format";
import { profileSchema } from "@/lib/validation/account";
import type { z } from "zod";

type Values = z.infer<typeof profileSchema>;
const field = "mt-2 w-full min-h-11 rounded-2xl border border-border bg-bg px-4";

export function ProfileForm({ profile }: { profile: ProfileRow }) {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: profile.display_name,
      city: profile.city ?? "",
      bio: profile.bio ?? "",
      platforms: profile.platforms ?? "",
      category: (profile.category ?? "") as Values["category"],
      content_summary: profile.content_summary ?? "",
      instagram_url: profile.instagram_url ?? "",
      youtube_url: profile.youtube_url ?? "",
      other_url: profile.other_url ?? "",
      open_to_collab: profile.open_to_collab ?? true,
      open_to_ads: profile.open_to_ads ?? false,
      open_to_giveaway: profile.open_to_giveaway ?? false,
      open_to_affiliate: profile.open_to_affiliate ?? false,
      follower_count: profile.follower_count?.toString() ?? "",
      rates_visible: profile.rates_visible,
      price_from_inr: profile.price_from_inr?.toString() ?? "",
      offers_services: profile.offers_services,
      service_title: profile.service_title ?? "",
    },
  });

  async function onSubmit(values: Values) {
    const result = await saveProfile(values);
    setMessage(result.message);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-xl gap-5" noValidate>
      <p className="text-small text-silver">
        Account type: {profile.role}. Followers: {followerLabel(profile.follower_status)}. CIRCLE never asks for a social password.
      </p>
      <div>
        <label htmlFor="profile-name" className="text-small font-medium">Name</label>
        <input id="profile-name" className={field} {...form.register("display_name")} />
      </div>
      <div>
        <label htmlFor="profile-city" className="text-small font-medium">City</label>
        <input id="profile-city" className={field} {...form.register("city")} />
      </div>
      <div>
        <label htmlFor="profile-bio" className="text-small font-medium">Bio</label>
        <textarea id="profile-bio" rows={4} className={`${field} py-3`} {...form.register("bio")} />
      </div>
      {profile.role === "creator" ? (
        <>
          <div>
            <label htmlFor="profile-category" className="text-small font-medium">Category</label>
            <select id="profile-category" className={field} {...form.register("category")}>
              <option value="">Choose a category</option>
              {creatorCategories.map((item) => (
                <option key={item.slug} value={item.slug}>{item.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="profile-content" className="text-small font-medium">What you make</label>
            <textarea id="profile-content" rows={4} className={`${field} py-3`} {...form.register("content_summary")} />
          </div>
          <div>
            <label htmlFor="profile-instagram" className="text-small font-medium">Instagram link</label>
            <input id="profile-instagram" className={field} placeholder="https://" {...form.register("instagram_url")} />
          </div>
          <div>
            <label htmlFor="profile-youtube" className="text-small font-medium">YouTube link</label>
            <input id="profile-youtube" className={field} placeholder="https://" {...form.register("youtube_url")} />
          </div>
          <div>
            <label htmlFor="profile-other" className="text-small font-medium">Other social link</label>
            <input id="profile-other" className={field} placeholder="https://" {...form.register("other_url")} />
          </div>
          <fieldset className="grid gap-2">
            <legend className="text-small font-medium">Open to</legend>
            <label className="flex min-h-11 items-center gap-3 text-small text-silver"><input type="checkbox" className="size-4" {...form.register("open_to_collab")} /> Collabs</label>
            <label className="flex min-h-11 items-center gap-3 text-small text-silver"><input type="checkbox" className="size-4" {...form.register("open_to_ads")} /> Ads</label>
            <label className="flex min-h-11 items-center gap-3 text-small text-silver"><input type="checkbox" className="size-4" {...form.register("open_to_giveaway")} /> Giveaways</label>
            <label className="flex min-h-11 items-center gap-3 text-small text-silver"><input type="checkbox" className="size-4" {...form.register("open_to_affiliate")} /> Affiliate offers</label>
          </fieldset>
          <div>
            <label htmlFor="profile-platforms" className="text-small font-medium">Platforms</label>
            <input id="profile-platforms" className={field} {...form.register("platforms")} />
          </div>
          <div>
            <label htmlFor="profile-followers" className="text-small font-medium">Follower count</label>
            <input id="profile-followers" inputMode="numeric" className={field} {...form.register("follower_count")} />
            <p className="mt-2 text-small text-silver">Shown as {followerLabel(profile.follower_status)} until a reviewer confirms it.</p>
          </div>
          <label className="flex min-h-11 items-start gap-3 text-small text-silver">
            <input type="checkbox" className="mt-1 size-4" {...form.register("offers_services")} />
            <span>I also offer a service, such as photography, editing, or a studio.</span>
          </label>
          <div>
            <label htmlFor="profile-service" className="text-small font-medium">Service name</label>
            <input id="profile-service" className={field} {...form.register("service_title")} />
          </div>
          <div>
            <label htmlFor="profile-price" className="text-small font-medium">Price from, in rupees</label>
            <input id="profile-price" inputMode="numeric" className={field} {...form.register("price_from_inr")} />
          </div>
          <label className="flex min-h-11 items-start gap-3 text-small text-silver">
            <input type="checkbox" className="mt-1 size-4" {...form.register("rates_visible")} />
            <span>Show my starting price on the directory.</span>
          </label>
        </>
      ) : null}
      {message ? <p className="text-small text-silver">{message}</p> : null}
      <button type="submit" disabled={form.formState.isSubmitting} className="inline-flex min-h-11 w-fit items-center rounded-full bg-lime px-5 text-sm font-medium text-bg disabled:opacity-60">
        {form.formState.isSubmitting ? "Saving profile" : "Save profile"}
      </button>
    </form>
  );
}
