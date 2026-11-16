import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Terms",
  "Draft terms for CIRCLE. This page needs legal review before it is treated as policy.",
);

const headings = [
  "Using CIRCLE",
  "Accounts",
  "Collabs",
  "Payments",
  "Conduct",
  "Contact",
];

export default function TermsPage() {
  return (
    <>
      <h1 className="font-display text-display-sm font-medium tracking-tight uppercase">
        Terms
      </h1>
      <p className="mt-4 text-silver">
        Headings only. The terms are not written yet.
      </p>
      {headings.map((heading) => (
        <h2
          key={heading}
          className="font-display mt-10 text-title-sm font-medium"
        >
          {heading}
        </h2>
      ))}
    </>
  );
}
