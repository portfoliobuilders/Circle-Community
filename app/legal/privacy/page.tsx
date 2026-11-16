import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Privacy",
  "Draft privacy notes for CIRCLE. This page needs legal review before it is treated as policy.",
);

const headings = [
  "Who we are",
  "Data collected",
  "Purpose",
  "Retention",
  "Your rights",
  "Contact",
];

export default function PrivacyPage() {
  return (
    <>
      <h1 className="font-display text-display-sm font-medium tracking-tight uppercase">
        Privacy
      </h1>
      <p className="mt-4 text-silver">
        Headings only. The privacy notice is not written yet.
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
