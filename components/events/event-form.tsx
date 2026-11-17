"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { publishEvent } from "@/lib/actions/marketplace";
import { eventSchema } from "@/lib/validation/account";
import type { z } from "zod";

type Values = z.infer<typeof eventSchema>;
const field = "mt-2 w-full min-h-11 rounded-2xl border border-border bg-bg px-4";

export function EventForm() {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(eventSchema),
    defaultValues: { title: "", summary: "", kind: "meetup", starts_at: "", city: "" },
  });

  async function onSubmit(values: Values) {
    const result = await publishEvent(values);
    setMessage(result.message);
    if (result.status === "success") form.reset();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 grid max-w-xl gap-5" noValidate>
      <div>
        <label htmlFor="event-title" className="text-small font-medium">Title</label>
        <input id="event-title" className={field} {...form.register("title")} />
      </div>
      <div>
        <label htmlFor="event-kind" className="text-small font-medium">Kind</label>
        <select id="event-kind" className={field} {...form.register("kind")}>
          <option value="meetup">Meetup</option>
          <option value="webinar">Webinar</option>
          <option value="bootcamp">Bootcamp</option>
          <option value="community">Community</option>
        </select>
      </div>
      <div>
        <label htmlFor="event-when" className="text-small font-medium">Starts</label>
        <input id="event-when" type="datetime-local" className={field} {...form.register("starts_at")} />
      </div>
      <div>
        <label htmlFor="event-city" className="text-small font-medium">City or online</label>
        <input id="event-city" className={field} {...form.register("city")} />
      </div>
      <div>
        <label htmlFor="event-summary" className="text-small font-medium">Summary</label>
        <textarea id="event-summary" rows={4} className={`${field} py-3`} {...form.register("summary")} />
      </div>
      {message ? <p className="text-small text-silver">{message}</p> : null}
      <button type="submit" disabled={form.formState.isSubmitting} className="inline-flex min-h-11 w-fit items-center rounded-full bg-lime px-5 text-sm font-medium text-bg disabled:opacity-60">
        {form.formState.isSubmitting ? "Publishing" : "Publish event"}
      </button>
    </form>
  );
}
