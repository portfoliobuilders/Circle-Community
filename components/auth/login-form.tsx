"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { signInAccount } from "@/lib/actions/account";
import { loginSchema } from "@/lib/validation/account";
import type { z } from "zod";

type Values = z.infer<typeof loginSchema>;
const field = "mt-2 w-full min-h-11 rounded-2xl border border-border bg-bg px-4";

export function LoginForm() {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: Values) {
    setMessage(null);
    const result = await signInAccount(values);
    if (result?.status === "error") setMessage(result.message);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid max-w-xl gap-5" noValidate>
      <div>
        <label htmlFor="login-email" className="text-small font-medium">Email</label>
        <input id="login-email" type="email" autoComplete="email" className={field} {...form.register("email")} />
      </div>
      <div>
        <label htmlFor="login-password" className="text-small font-medium">Password</label>
        <input id="login-password" type="password" autoComplete="current-password" className={field} {...form.register("password")} />
      </div>
      {message ? <p className="text-small text-silver">{message}</p> : null}
      <button type="submit" disabled={form.formState.isSubmitting} className="inline-flex min-h-11 w-fit items-center rounded-full bg-lime px-5 text-sm font-medium text-bg disabled:opacity-60">
        {form.formState.isSubmitting ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
