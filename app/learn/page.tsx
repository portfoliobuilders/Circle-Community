import type { Metadata } from "next";

import { Container } from "@/components/site/container";
import { pageMetadata } from "@/lib/seo";
import { learnSessions } from "@/lib/site";

const topics = [
  "AI tools",
  "Earning from home",
  "Becoming a content creator",
  "Doing collabs",
];

export const metadata: Metadata = pageMetadata(
  "Learn",
  "Free CIRCLE webinars and bootcamps on AI tools, earning from home, becoming a creator, and running collabs.",
);

export default function LearnPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">
        Learn
      </p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display">
        Free webinars and bootcamps
      </h1>
      <p className="mt-6 max-w-2xl text-lead text-silver">
        Learning on CIRCLE is free. Sessions are practical, and the schedule
        below is a placeholder until dates are published.
      </p>
      <h2 className="font-display mt-12 text-title-sm font-medium">
        What we teach
      </h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {topics.map((topic) => (
          <li
            key={topic}
            className="rounded-2xl border border-border bg-surface px-5 py-4"
          >
            {topic}
          </li>
        ))}
      </ul>
      <h2 className="font-display mt-12 text-title-sm font-medium">
        Sessions
      </h2>
      <p className="mt-2 text-small text-silver">Placeholder list</p>
      <ul className="mt-4 divide-y divide-border border-y border-border">
        {learnSessions.map((session) => (
          <li
            key={session.title}
            className="grid gap-1 py-5 sm:grid-cols-[8rem_1fr_auto] sm:items-baseline sm:gap-6"
          >
            <p className="text-small text-silver">{session.kind}</p>
            <h3 className="font-display text-lead font-medium">
              {session.title}
            </h3>
            <p className="text-small text-silver">{session.when}</p>
          </li>
        ))}
      </ul>
    </Container>
  );
}
