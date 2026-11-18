import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ApplicationActions } from "@/components/collabs/application-actions";
import { ApplyForm } from "@/components/collabs/apply-form";
import { ReportForm } from "@/components/reports/report-form";
import { Container } from "@/components/site/container";
import { getCollab, getOwnProfile, listApplications } from "@/lib/data/marketplace";
import { formatInr, formatKolkata } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { row } = await getCollab(id);
  if (!row) return pageMetadata("Collab", "A CIRCLE collab.", "/collabs");
  return pageMetadata(row.title, row.summary, `/collabs/${id}`);
}

export default function CollabDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<Container className="py-16"><p className="text-silver">Loading the collab.</p></Container>}>
      <CollabDetail params={params} />
    </Suspense>
  );
}

async function CollabDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { row, error } = await getCollab(id);
  if (!row && !error) notFound();
  if (!row) {
    return (
      <Container className="py-16">
        <p className="text-silver">{error}</p>
      </Container>
    );
  }

  const { userId, profile } = await getOwnProfile();
  const isBrand = profile?.id === row.brand_id;
  const { rows: applications } = isBrand || profile?.role === "creator" ? await listApplications(id) : { rows: [] };

  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">{row.kind.replace("_", " ")}</p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase">{row.title}</h1>
      <p className="mt-4 max-w-2xl whitespace-pre-wrap text-silver">{row.summary}</p>
      <dl className="mt-8 space-y-2 text-silver">
        {row.budget_inr != null ? <div>Budget: {formatInr(row.budget_inr)} · 10% platform fee on completed payout</div> : null}
        {row.barter_offer ? <div>Barter offer: {row.barter_offer}</div> : null}
        <div>ASCI disclosure (#ad / #collab) required on all published deliverables</div>
        <div>Posted {formatKolkata(row.created_at)} · {row.status}</div>
      </dl>
      {profile?.role === "creator" && row.status === "open" ? (
        <div className="mt-10">
          <h2 className="font-display text-title-sm font-medium">Apply</h2>
          <div className="mt-4">
            <ApplyForm collabId={row.id} kind={row.kind} />
          </div>
        </div>
      ) : null}
      {!userId ? (
        <p className="mt-8 text-silver">
          <Link className="text-text underline" href="/login">Sign in</Link> to apply or to review applications.
        </p>
      ) : null}
      {isBrand ? (
        <section className="mt-10">
          <h2 className="font-display text-title-sm font-medium">Applications</h2>
          {applications.length === 0 ? <p className="mt-3 text-silver">No applications yet.</p> : null}
          <ul className="mt-4 space-y-4">
            {applications.map((application) => (
              <li key={application.id} className="rounded-2xl border border-border p-4">
                <p className="text-small text-silver">{application.status}{application.bid_inr != null ? ` · ${formatInr(application.bid_inr)}` : ""}</p>
                <p className="mt-2 whitespace-pre-wrap">{application.pitch}</p>
                {application.status === "pending" ? (
                  <ApplicationActions applicationId={application.id} collabId={row.id} />
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <ReportForm targetType="collab" targetId={row.id} />
    </Container>
  );
}
