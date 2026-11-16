import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Community guidelines",
  "Draft community guidelines for CIRCLE. This page needs legal review before it is treated as policy.",
);

const headings = [
  "Be honest",
  "Collabs and disclosure",
  "Harassment and spam",
  "Reporting",
  "Removal",
];

export default function CommunityGuidelinesPage() {
  return (
    <>
      <h1 className="font-display text-display-sm font-medium tracking-tight uppercase">
        Community guidelines
      </h1>
      <p className="mt-4 text-silver">
        Headings only. The guidelines are not written yet.
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
