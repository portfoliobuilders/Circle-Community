"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { applyToCollab } from "@/lib/actions/marketplace";
import { applicationSchema } from "@/lib/validation/account";
import type { z } from "zod";

type Values = z.infer<typeof applicationSchema>;
const field = "mt-2 w-full min-h-11 rounded-2xl border border-border bg-bg px-4";

export function ApplyForm({ collabId, kind }: { collabId: string; kind: Values["kind"] }) {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { collab_id: collabId, pitch: "", bid_inr: "", kind },
  });

  async function onSubmit(values: Values) {
    const result = await applyToCollab({ ...values, collab_id: collabId, kind });
    setMessage(result.message);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-xl gap-5" noValidate>
      {kind === "open_bid" ? (
        <div>
          <label htmlFor="apply-bid" className="text-small font-medium">Your bid in rupees</label>
          <input id="apply-bid" inputMode="numeric" className={field} {...form.register("bid_inr")} />
        </div>
      ) : null}
      <div>
        <label htmlFor="apply-pitch" className="text-small font-medium">Pitch</label>
        <textarea id="apply-pitch" rows={5} className={`${field} py-3`} {...form.register("pitch")} />
      </div>
      {message ? <p className="text-small text-silver">{message}</p> : null}
      <button type="submit" disabled={form.formState.isSubmitting} className="inline-flex min-h-11 w-fit items-center rounded-full bg-lime px-5 text-sm font-medium text-bg disabled:opacity-60">
        {form.formState.isSubmitting ? "Sending application" : "Apply"}
      </button>
    </form>
  );
}
