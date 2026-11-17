import { Suspense } from "react";
import { AdminDenied } from "@/components/admin/admin-denied";
import { EventForm } from "@/components/events/event-form";
import { Container } from "@/components/site/container";
import { requireAdmin } from "@/lib/auth/admin";
import { noIndex } from "@/lib/seo";

export const metadata = {
  title: "Events",
  robots: noIndex,
};

export default function AdminEventsPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-16">
          <p className="text-silver">Loading event administration...</p>
        </Container>
      }
    >
      <AdminEventsBody />
    </Suspense>
  );
}

async function AdminEventsBody() {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return (
      <Container>
        <AdminDenied reason={gate.reason} />
      </Container>
    );
  }
  return (
    <Container className="py-16">
      <h1 className="font-display text-title font-medium uppercase">Publish an event</h1>
      <p className="mt-4 max-w-xl text-silver">Only events you enter here appear on the public calendar.</p>
      <EventForm />
    </Container>
  );
}
