import type { Metadata } from "next";
import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { Container } from "@/components/site/container";
import { noIndex, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata("Sign in", "Sign in to your free CIRCLE account.", "/login"),
  robots: noIndex,
};

export default function LoginPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Account</p>
      <h1 className="font-display mt-4 text-display-sm font-medium tracking-tight uppercase">Sign in</h1>
      <div className="mt-10">
        <LoginForm />
      </div>
      <p className="mt-6 text-small text-silver">
        No account yet? <Link className="text-text underline" href="/signup">Create a free account</Link>
      </p>
    </Container>
  );
}
