import type { Metadata } from "next";
import { Suspense } from "react";

import { Container } from "@/components/site/container";
import { unsubscribeNewsletter } from "@/lib/actions/support";
import { noIndex } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: noIndex,
};

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <Container className="py-24">
      <h1 className="font-display text-display-sm font-medium uppercase">Newsletter</h1>
      <Suspense fallback={<p className="mt-4 max-w-xl text-silver">Processing unsubscribe...</p>}>
        <UnsubscribeContent searchParams={searchParams} />
      </Suspense>
    </Container>
  );
}

async function UnsubscribeContent({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token ? await unsubscribeNewsletter(token) : "invalid";

  return (
    <p className="mt-4 max-w-xl text-silver">
      {result === "unsubscribed"
        ? "You are unsubscribed. We will not send news to that address."
        : "That unsubscribe link is not valid."}
    </p>
  );
}
