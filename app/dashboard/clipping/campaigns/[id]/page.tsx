import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { noIndex } from "@/lib/seo";
import { getOwnProfile } from "@/lib/data/marketplace";
import {
  getCampaignById,
  getCampaignSubmissions,
  getPrApplicationsForCampaign,
} from "@/lib/clipping/data";
import { formatInr } from "@/lib/format";
import { OwnerSubmissionsReviewer } from "@/components/clipping/dashboard/owner-submissions-reviewer";
import { OwnerPrCampaignManager } from "@/components/clipping/dashboard/owner-pr-campaign-manager";

export const metadata: Metadata = {
  title: "Review Campaign Deliverables",
  description: "Review, approve, and track submissions and deliverables from creators.",
  robots: noIndex,
};

export const instant = false;

export default async function CampaignDeliverablesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await getOwnProfile();

  if (!userId) {
    return (
      <Container className="py-16 text-center">
        <h1 className="font-display text-title font-medium uppercase text-text">Sign In Required</h1>
        <p className="mt-2 text-silver">Please sign in to manage campaign deliverables.</p>
        <Link
          href={`/login?next=/dashboard/clipping/campaigns/${id}`}
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-lime px-6 text-sm font-medium text-bg"
        >
          Sign In
        </Link>
      </Container>
    );
  }

  const campaign = await getCampaignById(id);
  if (!campaign) {
    notFound();
  }

  const isSocialPr = campaign.campaign_type === "social_pr";
  const prApplications = isSocialPr ? await getPrApplicationsForCampaign(id) : [];
  const submissions = !isSocialPr ? await getCampaignSubmissions(id) : [];

  return (
    <Container className="py-12 sm:py-16">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard/clipping/campaigns"
              className="text-xs uppercase tracking-widest text-silver hover:text-text transition"
            >
              ← Campaigns Hub
            </Link>
            <span className="text-xs text-border-strong">/</span>
            <span className="text-xs uppercase tracking-widest text-lime">
              {isSocialPr ? "PR Applications & Posts" : "Clip Submissions"}
            </span>
          </div>
          <h1 className="font-display mt-2 text-display-sm font-medium uppercase tracking-tight text-text sm:text-display">
            {campaign.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-silver">
            {isSocialPr ? (
              <>
                <span>
                  Format:{" "}
                  <strong className="text-text capitalize">
                    {campaign.deliverable_type ?? "Post"}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Compensation:{" "}
                  <strong className="text-text">
                    {campaign.pricing_mode === "quote"
                      ? "Quote Mode"
                      : `${formatInr(campaign.fee_per_post_inr ?? 0)} / post`}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  Slots: <strong className="text-text">{campaign.slots ?? 1}</strong>
                </span>
                <span>•</span>
                <span>
                  Min Followers:{" "}
                  <strong className="text-text">
                    {(campaign.min_followers ?? 10000).toLocaleString("en-IN")}+
                  </strong>
                </span>
              </>
            ) : (
              <>
                <span>
                  Rate: <strong className="text-text">{formatInr(campaign.rate_inr_per_1k)}</strong> / 1K views
                </span>
                <span>•</span>
                <span>
                  Budget: <strong className="text-text">{formatInr(campaign.budget_inr)}</strong>
                </span>
              </>
            )}
            <span>•</span>
            <span className="capitalize">
              Status: <strong className="text-lime">{campaign.status}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/clipping/campaigns"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-surface px-5 text-sm font-medium text-text transition hover:border-border-strong"
          >
            All Campaigns
          </Link>
        </div>
      </div>

      <div className="mt-10">
        {isSocialPr ? (
          <OwnerPrCampaignManager
            campaign={campaign}
            initialApplications={prApplications}
          />
        ) : (
          <OwnerSubmissionsReviewer
            initialSubmissions={submissions}
            campaignTitle={campaign.title}
          />
        )}
      </div>
    </Container>
  );
}
