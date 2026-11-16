import type { Metadata } from "next";

import { Container } from "@/components/site/container";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Resources",
  "The CIRCLE resource library is not published yet.",
);

export default function ResourcesPage() {
  return (
    <Container className="py-24">
      <h1 className="font-display text-display-sm font-medium uppercase">Resources</h1>
      <p className="mt-4 max-w-xl text-silver">
        The toolkit library is not published yet. [PLACEHOLDER]
      </p>
    </Container>
  );
}
