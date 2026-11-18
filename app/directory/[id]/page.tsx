import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ReportForm } from "@/components/reports/report-form";
import { Container } from "@/components/site/container";
import { categoryLabel } from "@/lib/content/categories";
import { getProfileCard } from "@/lib/data/marketplace";
import { followerLabel, formatInr } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { row } = await getProfileCard(id);
  if (!row) return pageMetadata("Profile", "A CIRCLE profile.", "/directory");
  return pageMetadata(row.display_name, row.bio ?? "A CIRCLE profile.", `/directory/${id}`);
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<Container className="py-16"><p className="text-silver">Loading the profile.</p></Container>}>
      <ProfileDetail params={params} />
    </Suspense>
  );
}

async function ProfileDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { row, error } = await getProfileCard(id);
  if (!row && !error) notFound();
  if (!row) {
    return <Container className="py-16"><p className="text-silver">{error}</p></Container>;
  }

  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">{row.role === "brand" ? "Brand" : "Creator"}</p>
      <h1 className="font-display mt-4 text-display-sm font-medium tracking-tight uppercase">{row.display_name}</h1>
      <p className="mt-3 text-silver">
        {categoryLabel(row.category) ?? "Category not set"}
        {row.city ? ` · ${row.city}` : ""}
      </p>
      {row.follower_count != null ? (
        <p className="mt-2 text-silver">
          {row.follower_count.toLocaleString("en-IN")} followers · {followerLabel(row.follower_status)}
        </p>
      ) : null}
      {row.role === "creator" && (row.follower_count ?? 0) >= 1000 ? (
        <p className="mt-2 text-small">
          Promoter eligible. The follower count is {followerLabel(row.follower_status).toLowerCase()}.
        </p>
      ) : null}
      {row.content_summary ? <p className="mt-6 max-w-2xl whitespace-pre-wrap">{row.content_summary}</p> : null}
      {row.bio ? <p className="mt-4 max-w-2xl whitespace-pre-wrap text-silver">{row.bio}</p> : null}
      {row.platforms ? <p className="mt-4 text-silver">Platforms: {row.platforms}</p> : null}
      <ul className="mt-4 flex flex-wrap gap-4 text-small">
        {row.instagram_url?.startsWith("https://") ? <li><a className="underline underline-offset-4" href={row.instagram_url}>Instagram</a></li> : null}
        {row.youtube_url?.startsWith("https://") ? <li><a className="underline underline-offset-4" href={row.youtube_url}>YouTube</a></li> : null}
        {row.other_url?.startsWith("https://") ? <li><a className="underline underline-offset-4" href={row.other_url}>Other social</a></li> : null}
      </ul>
      <p className="mt-4 text-small text-silver">
        Open to{" "}
        {[
          row.open_to_collab ? "collabs" : null,
          row.open_to_ads ? "ads" : null,
          row.open_to_giveaway ? "giveaways" : null,
          row.open_to_affiliate ? "affiliate offers" : null,
        ].filter(Boolean).join(", ") || "nothing listed"}
        .
      </p>
      {row.offers_services && row.service_title ? (
        <p className="mt-4">
          {row.service_title}
          {row.price_from_inr != null ? ` · from ${formatInr(row.price_from_inr)}` : " · price hidden"}
        </p>
      ) : (
        <p className="mt-4 text-small text-silver">Starting price is hidden until this creator turns it on.</p>
      )}
      <p className="mt-8 max-w-2xl text-small text-silver">
        Offer work by posting a brief. Completed collab deals operate with a transparent 10% platform fee.
      </p>
      <Link href="/collabs/new" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-lime px-5 text-sm font-medium text-bg">
        Post a collab
      </Link>
      <ReportForm targetType="profile" targetId={row.id} />
    </Container>
  );
}
