import type { Metadata } from "next";

import { CollabForm } from "@/components/collabs/collab-form";
import { Container } from "@/components/site/container";
import { noIndex } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Post a collab",
  robots: noIndex,
};

export default function NewCollabPage() {
  return (
    <Container className="py-16 sm:py-24">
      <h1 className="font-display text-display-sm font-medium tracking-tight uppercase">Post a collab</h1>
      <p className="mt-4 max-w-xl text-silver">Brand accounts only. Creators apply. 10% platform fee applies to completed payouts.</p>
      <div className="mt-10">
        <CollabForm />
      </div>
    </Container>
  );
}
