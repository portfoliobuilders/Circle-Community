import type { Metadata } from "next";
import Link from "next/link";

import { GiveawayForm } from "@/components/giveaways/giveaway-form";
import { Container } from "@/components/site/container";
import { noIndex } from "@/lib/seo";

export const metadata: Metadata = {
  title: "List a giveaway",
  description: "Share your social giveaway with the CIRCLE community.",
  robots: noIndex,
};

export default function NewGiveawayPage() {
  return (
    <Container className="py-16 sm:py-24">
      <div className="mb-6">
        <Link
          href="/giveaways"
          className="inline-flex min-h-11 items-center text-small text-silver hover:text-text transition-colors"
        >
          ← Back to all giveaways
        </Link>
      </div>

      <p className="text-small tracking-[0.18em] text-silver uppercase">Community marketplace</p>
      <h1 className="font-display mt-3 text-display-sm font-medium tracking-tight uppercase sm:text-display">
        List a giveaway
      </h1>
      <p className="mt-4 max-w-xl text-silver">
        Creators and brands: list your giveaway here to reach our community. Participants enter directly on your linked social post.
      </p>

      <div className="mt-8 rounded-2xl border border-border bg-surface/50 p-5 max-w-xl text-small text-silver space-y-2">
        <p className="font-medium text-text">Listing guidelines:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Provide a working <code className="text-text">https://</code> link to your live Instagram Reel, post, or YouTube Short.</li>
          <li>Clearly specify the prize and any eligibility or deadline details.</li>
          <li>Ensure compliance with ASCI guidelines (#giveaway disclosure).</li>
          <li>Hosts conduct their own random draw and fulfill prizes directly. CIRCLE does not hold or ship prizes.</li>
        </ul>
      </div>

      <div className="mt-10">
        <GiveawayForm />
      </div>
    </Container>
  );
}
