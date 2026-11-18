import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/site/container";
import { noIndex } from "@/lib/seo";
import { getOwnProfile } from "@/lib/data/marketplace";
import { getCampaignSubmissions } from "@/lib/clipping/data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";
import { formatInr } from "@/lib/format";
import { OwnerSubmissionsReviewer } from "@/components/clipping/dashboard/owner-submissions-reviewer";

export const metadata: Metadata = {
  title: "Review Campaign Submissions",
  description: "Review, approve, and track vertical video clips submitted by creators.",
  robots: noIndex,
};

export default async function CampaignSubmissionsPage({
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
        <p className="mt-2 text-silver">Please sign in to review campaign submissions.</p>
        <Link
          href={`/login?next=/dashboard/clipping/campaigns/${id}`}
          className="mt-6 inline-flex min-h-11 items-center rounded-full bg-lime px-6 text-sm font-medium text-bg"
        >
          Sign In
        </Link>
      </Container>
    );
  }

  let campaignTitle = "Campaign";
  let campaignRate = 10;
  let campaignBudget = 0;
  let campaignStatus = "live";

  if (isSupabaseConfigured()) {
    const supabase = await createSessionClient();
    const { data: camp } = await supabase
      .from("clip_campaigns")
      .select("title, rate_inr_per_1k, budget_inr, status, owner_id")
      .eq("id", id)
      .single();

    if (!camp) {
      notFound();
    }
    campaignTitle = camp.title;
    campaignRate = camp.rate_inr_per_1k;
    campaignBudget = camp.budget_inr;
    campaignStatus = camp.status;
  }

  const submissions = await getCampaignSubmissions(id);

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
            <span className="text-xs uppercase tracking-widest text-lime">Submissions</span>
          </div>
          <h1 className="font-display mt-2 text-display-sm font-medium uppercase tracking-tight text-text sm:text-display">
            {campaignTitle}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-silver">
            <span>
              Rate: <strong className="text-text">{formatInr(campaignRate)}</strong> / 1K views
            </span>
            <span>•</span>
            <span>
              Budget: <strong className="text-text">{formatInr(campaignBudget)}</strong>
            </span>
            <span>•</span>
            <span className="capitalize">
              Status: <strong className="text-lime">{campaignStatus}</strong>
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
        <OwnerSubmissionsReviewer
          initialSubmissions={submissions}
          campaignTitle={campaignTitle}
        />
      </div>
    </Container>
  );
}
