"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createAffiliate } from "@/lib/actions/marketplace";
import { affiliateSchema } from "@/lib/validation/account";
import type { z } from "zod";

type Values = z.infer<typeof affiliateSchema>;
const field = "mt-2 w-full min-h-11 rounded-2xl border border-border bg-bg px-4";

export function AffiliateForm() {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(affiliateSchema),
    defaultValues: { title: "", summary: "", terms: "", destination_url: "" },
  });

  async function onSubmit(values: Values) {
    const result = await createAffiliate(values);
    setMessage(result.message);
    if (result.status === "success") form.reset();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-xl gap-5" noValidate>
      <p className="text-small text-silver">Write the terms yourself, including any commission. CIRCLE does not set a rate and does not pay it in v1.</p>
      <div>
        <label htmlFor="affiliate-title" className="text-small font-medium">Offer</label>
        <input id="affiliate-title" className={field} {...form.register("title")} />
      </div>
      <div>
        <label htmlFor="affiliate-summary" className="text-small font-medium">What the creator promotes</label>
        <textarea id="affiliate-summary" rows={4} className={`${field} py-3`} {...form.register("summary")} />
      </div>
      <div>
        <label htmlFor="affiliate-terms" className="text-small font-medium">Terms</label>
        <textarea id="affiliate-terms" rows={3} className={`${field} py-3`} {...form.register("terms")} />
      </div>
      <div>
        <label htmlFor="affiliate-url" className="text-small font-medium">Tracking link</label>
        <input id="affiliate-url" className={field} placeholder="https://" {...form.register("destination_url")} />
      </div>
      {message ? <p className="text-small text-silver">{message}</p> : null}
      <button type="submit" disabled={form.formState.isSubmitting} className="inline-flex min-h-11 w-fit items-center rounded-full bg-lime px-5 text-sm font-medium text-bg disabled:opacity-60">
        {form.formState.isSubmitting ? "Listing offer" : "List offer"}
      </button>
    </form>
  );
}
