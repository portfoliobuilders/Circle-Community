import type { ReactNode } from "react";

import { LegalBanner } from "@/components/legal/legal-banner";
import { Container } from "@/components/site/container";

export default function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <Container className="py-16 sm:py-24">
      <LegalBanner />
      <div className="mt-10 max-w-2xl">{children}</div>
    </Container>
  );
}
