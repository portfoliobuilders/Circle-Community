import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import { AccountSignupForm } from "@/components/auth/account-signup-form";
import { SignupForm } from "@/components/auth/signup-form";
import { Container } from "@/components/site/container";
import { noIndex, pageMetadata } from "@/lib/seo";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  ...pageMetadata("Create account", "Create a free CIRCLE account. Membership has no paywall.", "/signup"),
  robots: noIndex,
};

export default function SignupPage() {
  const ready = isSupabaseConfigured();
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Account</p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase">
        {ready ? "Create a free account" : "Request a free account"}
      </h1>
      <p className="mt-4 max-w-xl text-silver">
        {ready
          ? "Membership is free. This creates a login. It does not ask for a social media password."
          : "Supabase is not configured, so this form only asks the team to hold your place."}
      </p>
      <div className="mt-10">
        <Suspense fallback={<p className="text-silver">Loading the form.</p>}>
          {ready ? <AccountSignupForm /> : <SignupForm />}
        </Suspense>
      </div>
      {ready ? (
        <p className="mt-6 text-small text-silver">
          Already registered? <Link className="text-text underline" href="/login">Sign in</Link>
        </p>
      ) : null}
    </Container>
  );
}
