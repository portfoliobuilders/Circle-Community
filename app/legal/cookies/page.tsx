import type { Metadata } from "next";
import Link from "next/link";

import { LegalSection } from "@/components/legal/legal-section";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Cookies",
  "Cookies CIRCLE actually sets: none for analytics, and Supabase auth cookies only after sign-in exists.",
  "/legal/cookies",
);

export default function CookiesPage() {
  return (
    <>
      <h1 className="font-display text-display-sm font-medium tracking-tight uppercase">
        Cookies
      </h1>
      <p className="mt-4 text-silver">
        This list was taken from the code in this repository, not from a generic template.
      </p>
      <LegalSection title="What is set today">
        <p>
          The public pages do not start an analytics tool. `@vercel/analytics`, Plausible, and Sentry are not dependencies, so they do not set cookies.
        </p>
        <p>
          `@supabase/ssr` is installed for a future sign-in. When a session exists, Supabase stores its auth cookies (names beginning with `sb-`) so you stay signed in. No session is created by browsing the marketing pages.
        </p>
      </LegalSection>
      <LegalSection title="Consent">
        <p>
          A cookie banner is not on the site yet, because there is no optional analytics cookie to accept or refuse. If an analytics tool is added, it will stay off until you accept, and this page will name it.
        </p>
        <p>
          Read the <Link className="text-text underline" href="/legal/privacy">privacy notice</Link> for the data the forms collect. That data is sent when you submit a form, not stored as a tracking cookie.
        </p>
      </LegalSection>
    </>
  );
}
