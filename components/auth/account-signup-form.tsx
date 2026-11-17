"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { signUpAccount } from "@/lib/actions/account";
import { accountSchema } from "@/lib/validation/account";
import type { z } from "zod";

type Values = z.infer<typeof accountSchema>;

const field = "mt-2 w-full min-h-11 rounded-2xl border border-border bg-bg px-4";

export function AccountSignupForm() {
  const requested = useSearchParams().get("role");
  const role = requested === "brand" ? "brand" : "creator";
  const [message, setMessage] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const form = useForm<Values>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role,
      date_of_birth: "",
      adult: false,
      consent: false,
      company_website: "",
    },
  });

  async function onSubmit(values: Values) {
    setMessage(null);
    const result = await signUpAccount({ ...values, role });
    if (result.status === "error") {
      setMessage(result.message);
      return;
    }
    setDone(true);
    setMessage(result.message);
  }

  if (done) return <p className="max-w-xl rounded-2xl border border-border bg-surface p-6 text-silver">{message}</p>;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-xl gap-5" noValidate>
      <div className="absolute -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="account-website">Company website</label>
        <input id="account-website" tabIndex={-1} autoComplete="off" {...form.register("company_website")} />
      </div>
      <p className="text-small text-silver">Role: {role}. Brand accounts are separate from creator accounts.</p>
      <div>
        <label htmlFor="account-name" className="text-small font-medium">Name</label>
        <input id="account-name" autoComplete="name" className={field} {...form.register("name")} />
      </div>
      <div>
        <label htmlFor="account-email" className="text-small font-medium">Email</label>
        <input id="account-email" type="email" autoComplete="email" className={field} {...form.register("email")} />
      </div>
      <div>
        <label htmlFor="account-password" className="text-small font-medium">Password</label>
        <input id="account-password" type="password" autoComplete="new-password" className={field} {...form.register("password")} />
      </div>
      {role === "creator" ? (
        <>
          <div>
            <label htmlFor="account-dob" className="text-small font-medium">Date of birth</label>
            <input id="account-dob" type="date" className={field} {...form.register("date_of_birth")} />
          </div>
          <label className="flex min-h-11 items-start gap-3 text-small text-silver">
            <input type="checkbox" className="mt-1 size-4" {...form.register("adult")} />
            <span>I confirm I am 18 or older. Under-18 users cannot apply to collabs.</span>
          </label>
        </>
      ) : null}
      <label className="flex min-h-11 items-start gap-3 text-small text-silver">
        <input type="checkbox" className="mt-1 size-4" {...form.register("consent")} />
        <span>
          I agree to the <Link className="text-text underline" href="/legal/terms">Terms</Link>,{" "}
          <Link className="text-text underline" href="/legal/privacy">Privacy Policy</Link>, and{" "}
          <Link className="text-text underline" href="/guidelines">Community guidelines</Link>.
        </span>
      </label>
      {message ? <p className="text-small text-silver">{message}</p> : null}
      <button type="submit" disabled={form.formState.isSubmitting} className="inline-flex min-h-11 w-fit items-center rounded-full bg-lime px-5 text-sm font-medium text-bg disabled:opacity-60">
        {form.formState.isSubmitting ? "Creating account" : "Create free account"}
      </button>
    </form>
  );
}
