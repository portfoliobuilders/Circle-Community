"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { publishChallenge } from "@/lib/actions/marketplace";
import { challengeSchema } from "@/lib/validation/account";
import type { z } from "zod";

type Values = z.infer<typeof challengeSchema>;
const field = "mt-2 w-full min-h-11 rounded-2xl border border-border bg-bg px-4";

export function ChallengeForm() {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(challengeSchema),
    defaultValues: { title: "", summary: "", audience: "anyone" },
  });

  async function onSubmit(values: Values) {
    const result = await publishChallenge(values);
    setMessage(result.message);
    if (result.status === "success") form.reset();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 grid max-w-xl gap-5" noValidate>
      <div>
        <label htmlFor="challenge-title" className="text-small font-medium">Title</label>
        <input id="challenge-title" className={field} {...form.register("title")} />
      </div>
      <div>
        <label htmlFor="challenge-audience" className="text-small font-medium">Who it is for</label>
        <select id="challenge-audience" className={field} {...form.register("audience")}>
          <option value="anyone">Anyone</option>
          <option value="creator">Creators</option>
          <option value="brand">Brands</option>
        </select>
      </div>
      <div>
        <label htmlFor="challenge-summary" className="text-small font-medium">What to do</label>
        <textarea id="challenge-summary" rows={4} className={`${field} py-3`} {...form.register("summary")} />
      </div>
      {message ? <p className="text-small text-silver">{message}</p> : null}
      <button type="submit" disabled={form.formState.isSubmitting} className="inline-flex min-h-11 w-fit items-center rounded-full bg-lime px-5 text-sm font-medium text-bg disabled:opacity-60">
        {form.formState.isSubmitting ? "Publishing" : "Publish challenge"}
      </button>
    </form>
  );
}
