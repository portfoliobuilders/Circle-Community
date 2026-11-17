"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createGiveaway } from "@/lib/actions/marketplace";
import { giveawaySchema } from "@/lib/validation/account";
import type { z } from "zod";

type Values = z.infer<typeof giveawaySchema>;
const field = "mt-2 w-full min-h-11 rounded-2xl border border-border bg-bg px-4";

export function GiveawayForm() {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(giveawaySchema),
    defaultValues: { title: "", summary: "", prize: "", ends_at: "", social_url: "" },
  });

  async function onSubmit(values: Values) {
    const result = await createGiveaway(values);
    setMessage(result.message);
    if (result.status === "success") form.reset();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-xl gap-5" noValidate>
      <p className="text-small text-silver">People enter on the social post. CIRCLE only lists it and links there. Use an https link.</p>
      <div>
        <label htmlFor="giveaway-title" className="text-small font-medium">Title</label>
        <input id="giveaway-title" className={field} {...form.register("title")} />
      </div>
      <div>
        <label htmlFor="giveaway-prize" className="text-small font-medium">Prize</label>
        <input id="giveaway-prize" className={field} {...form.register("prize")} />
      </div>
      <div>
        <label htmlFor="giveaway-summary" className="text-small font-medium">Details</label>
        <textarea id="giveaway-summary" rows={4} className={`${field} py-3`} {...form.register("summary")} />
      </div>
      <div>
        <label htmlFor="giveaway-ends" className="text-small font-medium">Ends (optional)</label>
        <input id="giveaway-ends" type="datetime-local" className={field} {...form.register("ends_at")} />
      </div>
      <div>
        <label htmlFor="giveaway-url" className="text-small font-medium">Social post link</label>
        <input id="giveaway-url" className={field} placeholder="https://" {...form.register("social_url")} />
      </div>
      {message ? <p className="text-small text-silver">{message}</p> : null}
      <button type="submit" disabled={form.formState.isSubmitting} className="inline-flex min-h-11 w-fit items-center rounded-full bg-lime px-5 text-sm font-medium text-bg disabled:opacity-60">
        {form.formState.isSubmitting ? "Listing giveaway" : "List giveaway"}
      </button>
    </form>
  );
}
