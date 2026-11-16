"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { SocialLink } from "@/components/site/social-link";
import { submitContact } from "@/lib/actions/support";
import { site, social } from "@/lib/site";
import { contactSchema, contactTopics, type ContactInput } from "@/lib/validation/support";

const inputClass =
  "mt-2 w-full min-h-11 rounded-2xl border border-border bg-bg px-4 text-text";

export function ContactForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<ContactInput["topic"]>("General question");
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      topic: "General question",
      message: "",
      consent: false,
      company_website: "",
    },
  });
  async function onSubmit(values: ContactInput) {
    setError(null);
    const result = await submitContact(values);
    if (result.status === "error") {
      setError(result.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-title-sm font-medium">Message received</h2>
        <p className="mt-3 text-silver">
          We aim to reply within {site.responseTime}.
        </p>
        <p className="mt-4">
          <SocialLink href={social.whatsappChannel.href}>
            Join the WhatsApp Channel
          </SocialLink>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="company-website">Company website</label>
        <input id="company-website" tabIndex={-1} autoComplete="off" {...form.register("company_website")} />
      </div>
      <div>
        <label htmlFor="contact-name" className="text-small font-medium">Name</label>
        <input id="contact-name" className={inputClass} autoComplete="name" {...form.register("name")} />
        <FieldError message={form.formState.errors.name?.message} />
      </div>
      <div>
        <label htmlFor="contact-email" className="text-small font-medium">Email</label>
        <input id="contact-email" type="email" autoComplete="email" className={inputClass} {...form.register("email")} />
        <FieldError message={form.formState.errors.email?.message} />
      </div>
      <div>
        <label htmlFor="contact-phone" className="text-small font-medium">Phone (optional)</label>
        <input id="contact-phone" type="tel" autoComplete="tel" className={inputClass} {...form.register("phone")} />
      </div>
      <div>
        <label htmlFor="contact-topic" className="text-small font-medium">Topic</label>
        <select
          id="contact-topic"
          className={inputClass}
          {...form.register("topic", {
            onChange: (event) => setTopic(event.target.value),
          })}
        >
          {contactTopics.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>
      {topic === "Report a problem" ? (
        <p className="text-small text-silver">
          To report a member, service, or collab, use the Report button on that
          page. The reporting flow is not on the site yet. Use this form for
          other problems.
        </p>
      ) : null}
      <div>
        <label htmlFor="contact-message" className="text-small font-medium">Message</label>
        <textarea id="contact-message" rows={6} className={`${inputClass} py-3`} {...form.register("message")} />
        <FieldError message={form.formState.errors.message?.message} />
      </div>
      <label className="flex min-h-11 items-start gap-3 text-small text-silver">
        <input type="checkbox" className="mt-1 size-4" {...form.register("consent")} />
        <span>
          I agree to CIRCLE storing this message so the team can reply. Read the{" "}
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
        {form.formState.isSubmitting ? "Sending message" : "Send message"}
      </button>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-2 text-small text-silver">{message}</p>;
}
