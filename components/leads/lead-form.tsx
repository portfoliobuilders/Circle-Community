"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";

import { SocialLink } from "@/components/site/social-link";
import { submitLead } from "@/lib/actions/support";
import { servicesFor, type AgencyAudience } from "@/lib/content/agency-services";
import { social } from "@/lib/site";
import { budgetRanges, leadSchema, type LeadInput } from "@/lib/validation/support";

const inputClass =
  "mt-2 w-full min-h-11 rounded-2xl border border-border bg-bg px-4 text-text";

type LeadFormProps = {
  audience: AgencyAudience;
  serviceSlug?: string;
};

export function LeadForm({ audience, serviceSlug = "general" }: LeadFormProps) {
  const formId = useId();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const services = servicesFor(audience);
  const lockedService = serviceSlug !== "general";
  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      audience,
      service_slug: serviceSlug,
      name: "",
      company: "",
      email: "",
      phone: "",
      instagram_or_site: "",
      budget_range: audience === "brand" ? "Not sure yet" : "",
      message: "",
      consent: false,
      company_website: "",
    },
  });

  async function onSubmit(values: LeadInput) {
    setError(null);
    const result = await submitLead({ ...values, audience, service_slug: serviceSlug === "general" ? values.service_slug : serviceSlug });
    if (result.status === "error") {
      setError(result.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-title-sm font-medium">Enquiry received</h2>
        <p className="mt-3 text-silver">
          The team has the details. We will reply by email. We will never ask for your password.
        </p>
        <p className="mt-4">
          <SocialLink href={social.whatsappChannel.href}>Join the WhatsApp Channel</SocialLink>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={`${formId}-company-website`}>Company website</label>
        <input
          id={`${formId}-company-website`}
          tabIndex={-1}
          autoComplete="off"
          {...form.register("company_website")}
        />
      </div>
      <input type="hidden" {...form.register("audience")} />
      {lockedService ? <input type="hidden" {...form.register("service_slug")} /> : null}

      <div>
        <label htmlFor={`${formId}-name`} className="text-small font-medium">Name</label>
        <input id={`${formId}-name`} className={inputClass} autoComplete="name" {...form.register("name")} />
        <FieldError message={form.formState.errors.name?.message} />
      </div>

      {audience === "brand" ? (
        <div>
          <label htmlFor={`${formId}-company`} className="text-small font-medium">Company</label>
          <input id={`${formId}-company`} className={inputClass} autoComplete="organization" {...form.register("company")} />
          <FieldError message={form.formState.errors.company?.message} />
        </div>
      ) : null}

      <div>
        <label htmlFor={`${formId}-email`} className="text-small font-medium">Email</label>
        <input id={`${formId}-email`} type="email" autoComplete="email" className={inputClass} {...form.register("email")} />
        <FieldError message={form.formState.errors.email?.message} />
      </div>
      <div>
        <label htmlFor={`${formId}-phone`} className="text-small font-medium">Phone (optional)</label>
        <input id={`${formId}-phone`} type="tel" autoComplete="tel" className={inputClass} {...form.register("phone")} />
      </div>
      <div>
        <label htmlFor={`${formId}-profile`} className="text-small font-medium">
          {audience === "creator" ? "Handle or profile link" : "Instagram or website (optional)"}
        </label>
        <input id={`${formId}-profile`} className={inputClass} {...form.register("instagram_or_site")} />
        <FieldError message={form.formState.errors.instagram_or_site?.message} />
      </div>

      {audience === "brand" && !lockedService ? (
        <div>
          <label htmlFor={`${formId}-service`} className="text-small font-medium">Service</label>
          <select id={`${formId}-service`} className={inputClass} {...form.register("service_slug")}>
            <option value="general">Not sure yet</option>
            {services.map((service) => (
              <option key={service.slug} value={service.slug}>{service.title}</option>
            ))}
          </select>
        </div>
      ) : null}

      {audience === "brand" ? (
        <div>
          <label htmlFor={`${formId}-budget`} className="text-small font-medium">Budget range</label>
          <select id={`${formId}-budget`} className={inputClass} {...form.register("budget_range")}>
            {budgetRanges.map((range) => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
          <p className="mt-2 text-small text-silver">This is your range, not a CIRCLE price. Fees are quoted separately.</p>
        </div>
      ) : null}

      <div>
        <label htmlFor={`${formId}-message`} className="text-small font-medium">
          {audience === "creator" ? "Goals" : "What you need"}
        </label>
        <textarea id={`${formId}-message`} rows={6} className={`${inputClass} py-3`} {...form.register("message")} />
        <FieldError message={form.formState.errors.message?.message} />
      </div>

      <label className="flex min-h-11 items-start gap-3 text-small text-silver">
        <input type="checkbox" className="mt-1 size-4" {...form.register("consent")} />
        <span>
          I agree to CIRCLE storing this enquiry so the team can reply. Read the{" "}
          <Link href="/legal/privacy" className="text-text underline">privacy note</Link>.
        </span>
      </label>
      <FieldError message={form.formState.errors.consent?.message} />
      {audience === "creator" ? (
        <p className="text-small text-text">We will never ask for your password.</p>
      ) : (
        <p className="text-small text-silver">Do not include a social media password. We never ask for one.</p>
      )}
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
