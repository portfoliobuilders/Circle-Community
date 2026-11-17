import type { Metadata } from "next";
import { Suspense } from "react";

import { RegisterButton } from "@/components/events/register-button";
import { Container } from "@/components/site/container";
import { listEvents } from "@/lib/data/marketplace";
import { formatKolkata } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Events",
  "Meetups, webinars, and bootcamps on CIRCLE. Learning events are free.",
  "/events",
);

export default function EventsPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Calendar</p>
      <h1 className="font-display mt-4 text-display-sm font-medium tracking-tight uppercase">Events</h1>
      <p className="mt-4 max-w-2xl text-silver">Meetups, webinars, and bootcamps. Registration is free.</p>
      <Suspense fallback={<p className="mt-8 text-silver">Loading events.</p>}>
        <EventList />
      </Suspense>
    </Container>
  );
}

async function EventList() {
  const { rows, error } = await listEvents();
  return (
    <>
      {error ? <p className="mt-8 text-silver">{error}</p> : null}
      {!error && rows.length === 0 ? <p className="mt-8 text-silver">No events scheduled yet.</p> : null}
      <ul className="mt-8 divide-y divide-border border-y border-border">
        {rows.map((event) => (
          <li key={event.id} className="grid gap-3 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <p className="text-small text-silver">{event.kind}</p>
              <h2 className="font-display mt-1 text-lead font-medium">{event.title}</h2>
              <p className="mt-2 text-silver">{event.summary}</p>
              <p className="mt-2 text-small text-silver">
                {formatKolkata(event.starts_at)}
                {event.city ? ` · ${event.city}` : ""}
              </p>
            </div>
            <RegisterButton eventId={event.id} />
          </li>
        ))}
      </ul>
    </>
  );
}
