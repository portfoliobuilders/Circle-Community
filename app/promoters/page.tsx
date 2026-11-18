import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/site/container";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Promoters",
  "A creator with 1,000 or more followers can be marked as a CIRCLE promoter. The count stays labelled self-reported until it is verified.",
  "/promoters",
);

export default function PromotersPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Promoters</p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase">
        Creators above 1,000 followers
      </h1>
      <div className="mt-6 max-w-2xl space-y-4 text-silver">
        <p>
          A creator profile with a follower count of 1,000 or more is marked Promoter on the directory. The count stays labelled self-reported until a reviewer confirms it. CIRCLE never asks for a social password.
        </p>
        <p>What that mark includes:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>The Promoter label on the directory and on the profile.</li>
          <li>The profile stays in the category and campaign filters brands use.</li>
          <li>You can ask CIRCLE for social promotion. Dedicated media support is arranged through the contact form. It is not automatic and it has no published rate.</li>
        </ul>
        <p>
          The mark is not a cash payment, a guaranteed collab, or a commission. Affiliate terms, when a brand lists them, are written by that brand.
        </p>
      </div>
      <Link href="/directory" className="mt-8 inline-flex min-h-11 items-center rounded-full bg-lime px-5 text-sm font-medium text-bg">
        Browse promoter profiles
      </Link>
    </Container>
  );
}
