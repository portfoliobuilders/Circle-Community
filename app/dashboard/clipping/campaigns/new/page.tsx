import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { noIndex } from "@/lib/seo";
import { CampaignCreateForm } from "@/components/clipping/dashboard/campaign-create-form";

export const metadata: Metadata = {
  title: "Launch a Clipping Campaign",
  description: "Create a pay-per-view video clipping campaign for YouTube Shorts and Instagram Reels.",
  robots: noIndex,
};

export default function NewCampaignPage() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/clipping/campaigns"
            className="text-xs uppercase tracking-widest text-silver hover:text-text transition"
          >
            ← Back to Campaigns Hub
          </Link>
        </div>
        <h1 className="font-display mt-2 text-display-sm font-medium uppercase tracking-tight text-text sm:text-display">
          Launch a Campaign
        </h1>
        <p className="mt-2 text-base text-silver">
          Set your rates, define hook guidelines, and let hundreds of vertical video editors amplify your message on YouTube Shorts and Instagram Reels.
        </p>
      </div>

      <div className="mt-10 max-w-3xl">
        <CampaignCreateForm />
      </div>
    </Container>
  );
}
