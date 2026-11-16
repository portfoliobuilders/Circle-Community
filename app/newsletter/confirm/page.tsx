import type { Metadata } from "next";

import { Container } from "@/components/site/container";
import { confirmNewsletter } from "@/lib/actions/support";

export const metadata: Metadata = {
  title: "Confirm newsletter",
  robots: { index: false, follow: false },
};

export default async function ConfirmNewsletterPage({
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

  return (
    <Container className="py-24">
      <h1 className="font-display text-display-sm font-medium uppercase">Newsletter</h1>
      <p className="mt-4 max-w-xl text-silver">{copy}</p>
    </Container>
  );
}
