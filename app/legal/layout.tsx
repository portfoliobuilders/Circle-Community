import type { ReactNode } from "react";

import { Container } from "@/components/site/container";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <Container className="py-16 sm:py-24">
      <p
        role="status"
        className="rounded-2xl border border-border bg-surface px-4 py-3 text-small text-silver"
      >
        Draft — needs legal review
      </p>
      <div className="mt-10 max-w-2xl">{children}</div>
    </Container>
  );
}
