"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

import { submitContact } from "@/lib/actions/support";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(80),
  email: z.string().trim().email("Enter a valid email.").max(200),
  note: z.string().trim().max(500).optional().or(z.literal("")),
  adult: z.boolean(),
  consent: z.boolean().refine((value) => value, { message: "Consent is required." }),
  company_website: z.string().optional(),
});

type SignupValues = z.infer<typeof schema>;

const inputClass = "mt-2 w-full min-h-11 rounded-2xl border border-border bg-bg px-4";

export function SignupForm() {
  const requested = useSearchParams().get("role");
  const role = requested === "brand" ? "brand" : requested === "creator" ? "creator" : "member";
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<SignupValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", note: "", adult: false, consent: false, company_website: "" },
  });

  async function onSubmit(values: SignupValues) {
    setError(null);
    if (role !== "brand" && !values.adult) {
      setError("Creators and service providers must confirm they are 18 or older.");
      return;
    }
    const message = [
      `Account request. Role: ${role}.`,
      role === "brand" ? "Brand account." : `Confirmed 18+: ${values.adult ? "yes" : "no"}.`,
      values.note || "No extra note.",
      "Accounts are not created automatically. Please reply when sign-in opens.",
    ].join(" ");
    const result = await submitContact({
      name: values.name,
      email: values.email,
      phone: "",
      topic: "Other",
      message,
      consent: true,
      company_website: values.company_website ?? "",
    });
    if (result.status === "error") {
      setError(result.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <p className="rounded-2xl border border-border bg-surface p-6 text-silver">
        Request received. This does not create a login yet. We will use this email when accounts open.
      </p>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-xl gap-5" noValidate>
      <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="signup-website">Company website</label>
        <input id="signup-website" tabIndex={-1} autoComplete="off" {...form.register("company_website")} />
      </div>
      <p className="text-small text-silver">Role: {role}</p>
      <div>
        <label htmlFor="signup-name" className="text-small font-medium">Name</label>
        <input id="signup-name" autoComplete="name" className={inputClass} {...form.register("name")} />
        {form.formState.errors.name ? <p className="mt-2 text-small text-silver">{form.formState.errors.name.message}</p> : null}
      </div>
      <div>
        <label htmlFor="signup-email" className="text-small font-medium">Email</label>
        <input id="signup-email" type="email" autoComplete="email" className={inputClass} {...form.register("email")} />
        {form.formState.errors.email ? <p className="mt-2 text-small text-silver">{form.formState.errors.email.message}</p> : null}
      </div>
      {role !== "brand" ? (
        <label className="flex min-h-11 items-start gap-3 text-small text-silver">
          <input type="checkbox" className="mt-1 size-4" {...form.register("adult")} />
          <span>I confirm I am 18 or older. Under-18 users cannot apply to collabs.</span>
        </label>
      ) : null}
      <div>
        <label htmlFor="signup-note" className="text-small font-medium">What you do (optional)</label>
        <textarea id="signup-note" rows={4} className={`${inputClass} py-3`} {...form.register("note")} />
      </div>
      <label className="flex min-h-11 items-start gap-3 text-small text-silver">
        <input type="checkbox" className="mt-1 size-4" {...form.register("consent")} />
        <span>
          I agree to the <Link className="text-text underline" href="/legal/terms">Terms</Link>,{" "}
          <Link className="text-text underline" href="/legal/privacy">Privacy Policy</Link>, and{" "}
          <Link className="text-text underline" href="/guidelines">Community guidelines</Link>.
        </span>
      </label>
      {form.formState.errors.consent ? <p className="text-small text-silver">{form.formState.errors.consent.message}</p> : null}
      {error ? <p className="text-small text-silver">{error}</p> : null}
      <button type="submit" disabled={form.formState.isSubmitting} className="inline-flex min-h-11 w-fit items-center rounded-full bg-lime px-5 text-sm font-medium text-bg disabled:opacity-60">
        {form.formState.isSubmitting ? "Sending request" : "Request account"}
      </button>
    </form>
  );
}
