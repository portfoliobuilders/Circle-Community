"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createCollab } from "@/lib/actions/marketplace";
import { collabSchema } from "@/lib/validation/account";
import type { z } from "zod";

type Values = z.infer<typeof collabSchema>;
const field = "mt-2 w-full min-h-11 rounded-2xl border border-border bg-bg px-4";

export function CollabForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [kind, setKind] = useState<Values["kind"]>("fixed");
  const form = useForm<Values>({
    resolver: zodResolver(collabSchema),
    defaultValues: { title: "", summary: "", kind: "fixed", budget_inr: "", barter_offer: "" },
  });

  async function onSubmit(values: Values) {
    const result = await createCollab(values);
    setMessage(result.message);
    if (result.status === "success") form.reset();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-xl gap-5" noValidate>
      <p className="text-small text-silver">Ad disclosure (#ad / #collab) is required. CIRCLE does not take payment.</p>
      <div>
        <label htmlFor="collab-title" className="text-small font-medium">Title</label>
        <input id="collab-title" className={field} {...form.register("title")} />
      </div>
      <div>
        <label htmlFor="collab-kind" className="text-small font-medium">Type</label>
        <select
          id="collab-kind"
          className={field}
          {...form.register("kind", {
            onChange: (event) => setKind(event.target.value as Values["kind"]),
          })}
        >
          <option value="fixed">Fixed budget</option>
          <option value="open_bid">Open bid</option>
          <option value="barter">Barter</option>
        </select>
      </div>
      {kind !== "barter" ? (
        <div>
          <label htmlFor="collab-budget" className="text-small font-medium">
            {kind === "fixed" ? "Budget in rupees" : "Budget in rupees, optional"}
          </label>
          <input id="collab-budget" inputMode="numeric" className={field} {...form.register("budget_inr")} />
        </div>
      ) : (
        <div>
          <label htmlFor="collab-barter" className="text-small font-medium">What you offer</label>
          <input id="collab-barter" className={field} {...form.register("barter_offer")} />
        </div>
      )}
      <div>
        <label htmlFor="collab-summary" className="text-small font-medium">Brief</label>
        <textarea id="collab-summary" rows={5} className={`${field} py-3`} {...form.register("summary")} />
      </div>
      {message ? <p className="text-small text-silver">{message}</p> : null}
      <button type="submit" disabled={form.formState.isSubmitting} className="inline-flex min-h-11 w-fit items-center rounded-full bg-lime px-5 text-sm font-medium text-bg disabled:opacity-60">
        {form.formState.isSubmitting ? "Posting collab" : "Post collab"}
      </button>
    </form>
  );
}
