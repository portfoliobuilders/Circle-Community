import { Suspense } from "react";
import type { Metadata } from "next";
import { AdminDenied } from "@/components/admin/admin-denied";
import { Container } from "@/components/site/container";
import { requireAdmin } from "@/lib/auth/admin";
import { noIndex } from "@/lib/seo";
import { getAdminClippingOverview } from "@/lib/clipping/data";
import { ClippingAdminPanel } from "@/components/admin/clipping-admin-panel";

export const metadata: Metadata = {
  title: "Clipping & PR Administration",
  robots: noIndex,
};

export default function AdminClippingPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-16">
          <p className="text-silver">Loading clipping administration operations...</p>
        </Container>
      }
    >
      <AdminClippingBody />
    </Suspense>
  );
}

async function AdminClippingBody() {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return (
      <Container className="py-16">
        <AdminDenied reason={gate.reason} />
      </Container>
    );
  }

  const initialData = await getAdminClippingOverview();

  return (
    <Container className="py-12 sm:py-16">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-silver">CIRCLE Administration</p>
          <h1 className="font-display mt-1 text-display-sm font-medium uppercase tracking-tight text-text sm:text-display">
            Clipping & PR Operations
          </h1>
        </div>
      </div>

      <div className="mt-10">
        <ClippingAdminPanel initialData={initialData} />
      </div>
    </Container>
  );
}
