"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { submitPartnership } from "@/lib/actions/support";
import { partnerSchema, partnerTypes, type PartnerInput } from "@/lib/validation/support";

const inputClass =
  "mt-2 w-full min-h-11 rounded-2xl border border-border bg-bg px-4 text-text";

export function PartnerForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<PartnerInput>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      partnerType: "perk",
      message: "",
      consent: false,
      company_website: "",
    },
  });

  async function onSubmit(values: PartnerInput) {
    setError(null);
    const result = await submitPartnership(values);
    if (result.status === "error") {
      setError(result.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <p className="rounded-2xl border border-border bg-surface p-6 text-silver">
        Enquiry received. The team will reply from info@circlecommunity.in.
      </p>
    );
  }

  return (
    <form id="partner-form" onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="partner-website">Company website</label>
        <input id="partner-website" tabIndex={-1} autoComplete="off" {...form.register("company_website")} />
      </div>
      <div>
        <label htmlFor="partner-name" className="text-small font-medium">Name</label>
        <input id="partner-name" className={inputClass} autoComplete="name" {...form.register("name")} />
        <FieldError message={form.formState.errors.name?.message} />
      </div>
      <div>
        <label htmlFor="partner-email" className="text-small font-medium">Email</label>
        <input id="partner-email" type="email" autoComplete="email" className={inputClass} {...form.register("email")} />
        <FieldError message={form.formState.errors.email?.message} />
      </div>
      <div>
        <label htmlFor="partner-company" className="text-small font-medium">Organisation</label>
        <input id="partner-company" className={inputClass} {...form.register("company")} />
        <FieldError message={form.formState.errors.company?.message} />
      </div>
      <div>
        <label htmlFor="partner-phone" className="text-small font-medium">Phone (optional)</label>
        <input id="partner-phone" type="tel" className={inputClass} {...form.register("phone")} />
      </div>
      <div>
        <label htmlFor="partner-type" className="text-small font-medium">Partnership type</label>
        <select id="partner-type" className={inputClass} {...form.register("partnerType")}>
          {partnerTypes.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="partner-message" className="text-small font-medium">What you want to offer</label>
        <textarea id="partner-message" rows={6} className={`${inputClass} py-3`} {...form.register("message")} />
        <FieldError message={form.formState.errors.message?.message} />
      </div>
      <label className="flex min-h-11 items-start gap-3 text-small text-silver">
        <input type="checkbox" className="mt-1 size-4" {...form.register("consent")} />
        <span>
          I agree to CIRCLE storing this enquiry. Read the{" "}
          <Link href="/legal/privacy" className="text-text underline">privacy note</Link>.
        </span>
      </label>
      <FieldError message={form.formState.errors.consent?.message} />
      {error ? <p className="text-small text-silver">{error}</p> : null}
      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="inline-flex min-h-11 w-fit items-center justify-center rounded-full bg-lime px-5 text-sm font-medium text-bg disabled:opacity-60"
      >
        {form.formState.isSubmitting ? "Sending enquiry" : "Send enquiry"}
      </button>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-small text-silver">{message}</p>;
}
