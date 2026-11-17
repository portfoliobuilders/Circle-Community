import type { Metadata } from "next";

import { Container } from "@/components/site/container";
import { unsubscribeNewsletter } from "@/lib/actions/support";
import { noIndex } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: noIndex,
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token ? await unsubscribeNewsletter(token) : "invalid";

  return (
    <Container className="py-24">
      <h1 className="font-display text-display-sm font-medium uppercase">Newsletter</h1>
      <p className="mt-4 max-w-xl text-silver">
        {result === "unsubscribed"
          ? "You are unsubscribed. We will not send news to that address."
          : "That unsubscribe link is not valid."}
      </p>
    </Container>
  );
}
