import type { Metadata } from "next";
import Link from "next/link";

import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Grievance officer",
  "How to reach CIRCLE's grievance officer. The officer's details are still placeholders.",
  "/legal/grievance",
);

export default function GrievancePage() {
  return (
    <>
      <h1 className="font-display text-display-sm font-medium tracking-tight uppercase">
        Grievance officer
      </h1>
      <p className="mt-4 text-silver">
        {site.operator} will publish a grievance officer for the Digital Personal Data Protection Act, 2023. The fields below are not filled in yet.
      </p>
      <dl className="mt-8 space-y-4 text-silver">
        <div>
          <dt className="text-small text-text">Name</dt>
          <dd>[GRIEVANCE OFFICER NAME]</dd>
        </div>
        <div>
          <dt className="text-small text-text">Designation</dt>
          <dd>[DESIGNATION]</dd>
        </div>
        <div>
          <dt className="text-small text-text">Email</dt>
          <dd>[GRIEVANCE EMAIL]</dd>
        </div>
        <div>
          <dt className="text-small text-text">Address</dt>
          <dd>{site.address}</dd>
        </div>
      </dl>
      <p className="mt-8 text-silver">
        We aim to acknowledge a grievance within [24 hours] and to resolve it within [15 days]. Confirm both numbers with counsel before they are treated as commitments.
      </p>
      <p className="mt-4">
        <Link href="/contact" className="text-text underline">
          Write through the contact form
        </Link>
      </p>
    </>
  );
}
