import type { Metadata } from "next";
import { Suspense } from "react";

import { Container } from "@/components/site/container";
import { confirmNewsletter } from "@/lib/actions/support";
import { noIndex } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Confirm newsletter",
  robots: noIndex,
};

export default function ConfirmNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <Container className="py-24">
      <h1 className="font-display text-display-sm font-medium uppercase">Newsletter</h1>
      <Suspense fallback={<p className="mt-4 max-w-xl text-silver">Confirming subscription...</p>}>
        <ConfirmNewsletterContent searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

async function ConfirmNewsletterContent({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token ? await confirmNewsletter(token) : "invalid";
  const copy = {
    confirmed: "You are confirmed. News will only go to this address from now on.",
    expired: "That confirmation link has expired. Subscribe again to get a new one.",
    invalid: "That confirmation link is not valid.",
  }[result];

  return <p className="mt-4 max-w-xl text-silver">{copy}</p>;
}
