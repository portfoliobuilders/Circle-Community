"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { subscribeNewsletter } from "@/lib/actions/support";
import { newsletterSchema, type NewsletterInput } from "@/lib/validation/support";

const inputClass =
  "mt-2 w-full min-h-11 rounded-2xl border border-border bg-bg px-4 text-text";

type NewsletterFormProps = {
  source: string;
  tone?: "lime" | "secondary";
};

export function NewsletterForm({ source, tone = "secondary" }: NewsletterFormProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const form = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
      consent: false,
      source,
      company_website: "",
    },
  });

  async function onSubmit(values: NewsletterInput) {
    setMessage(null);
    const result = await subscribeNewsletter(values);
    if (result.status === "error") {
      setMessage(result.message);
      return;
    }
    setDone(true);
    setMessage(
      result.message === "confirmed"
        ? "This address is already confirmed."
        : "Check your email and confirm the subscription. We will not send news until you do.",
    );
  }

  if (done) {
    return <p className="text-small text-silver">{message}</p>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md" noValidate>
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={`${source}-company`}>Company website</label>
        <input
          id={`${source}-company`}
          tabIndex={-1}
          autoComplete="off"
          {...form.register("company_website")}
        />
      </div>
      <label htmlFor={`${source}-email`} className="text-small font-medium">
        Email
      </label>
      <input
        id={`${source}-email`}
        type="email"
        autoComplete="email"
        className={inputClass}
        {...form.register("email")}
      />
      {form.formState.errors.email ? (
        <p className="mt-2 text-small text-silver">{form.formState.errors.email.message}</p>
      ) : null}
      <label className="mt-4 flex min-h-11 items-start gap-3 text-small text-silver">
        <input type="checkbox" className="mt-1 size-4" {...form.register("consent")} />
        <span>Send me CIRCLE news. I can unsubscribe from any email.</span>
      </label>
      {form.formState.errors.consent ? (
        <p className="mt-2 text-small text-silver">{form.formState.errors.consent.message}</p>
      ) : null}
      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className={
          tone === "lime"
            ? "mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-5 text-sm font-medium text-bg disabled:opacity-60"
            : "mt-4 inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-text disabled:opacity-60"
        }
      >
        {form.formState.isSubmitting ? "Sending confirmation" : "Subscribe"}
      </button>
      {message ? <p className="mt-3 text-small text-silver">{message}</p> : null}
    </form>
  );
}
