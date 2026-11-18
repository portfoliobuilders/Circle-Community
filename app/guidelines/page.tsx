import type { Metadata } from "next";
import Link from "next/link";

import { LegalBanner } from "@/components/legal/legal-banner";
import { LegalSection } from "@/components/legal/legal-section";
import { Container } from "@/components/site/container";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Community guidelines",
  "Rules for profiles, collabs, listings, and what CIRCLE will remove.",
  "/guidelines",
);

const toc = [
  "Our standard",
  "Profiles",
  "Collabs",
  "Service listings",
  "Not allowed",
  "Minors",
  "Enforcement",
  "How to report",
];

export default function GuidelinesPage() {
  return (
    <Container className="py-16 sm:py-24">
      <LegalBanner />
      <div className="mt-10 max-w-2xl">
        <h1 className="font-display text-display-sm font-medium tracking-tight uppercase">
          Community guidelines
        </h1>
        <p className="mt-4 text-silver">
          Plain rules for how people use CIRCLE. This draft is not a substitute for legal review.
        </p>
        <nav aria-label="On this page" className="mt-8">
          <ul className="space-y-2 text-small">
            {toc.map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="text-silver underline-offset-4 hover:text-text hover:underline"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <LegalSection title="Our standard">
          <p>Be respectful. Be honest. Credit other people&apos;s work. Do not pretend a collab, a follower count, or a portfolio piece is something it is not.</p>
        </LegalSection>
        <LegalSection title="Profiles">
          <p>Use your real identity. Self-reported follower counts must be honest. Bought or inflated followers are grounds for removal. One person, one account. A brand account must represent a real business.</p>
        </LegalSection>
        <LegalSection title="Collabs">
          <p>Brands state the budget type honestly: fixed, open bid, or barter. Pay what you agreed, on the terms you agreed. Do not disguise unpaid spec work as a trial. Creators deliver what they agreed and mark ads with #ad or #collab. Do not demand an off-platform fee to be selected.</p>
        </LegalSection>
        <LegalSection title="Service listings">
          <p>Portfolios show your own work. &quot;Price from&quot; is a real starting price, not a lure.</p>
        </LegalSection>
        <LegalSection title="Not allowed">
          <p>Scams, fake collabs, harassment, hate, sexual content, spam and mass DMs, impersonation, sharing someone else&apos;s personal data, buying or selling followers or engagement, and misleading health or finance claims.</p>
        </LegalSection>
        <LegalSection title="Minors">
          <p>Under-18 users cannot take collabs. Nobody may solicit minors for work, content, or contact.</p>
        </LegalSection>
        <LegalSection title="Enforcement">
          <p>The ladder is a warning, then content removal, then suspension, then permanent removal. Fraud and harassment can be removed immediately, without the earlier steps. Appeal through <Link className="text-text underline" href="/contact">contact</Link> with the topic &quot;Report a problem&quot; within 14 days.</p>
        </LegalSection>
        <LegalSection title="How to report">
          <p>
            Use the Report button on any live profile, collab brief, or clipping campaign. You can also reach our moderation team via <Link className="text-text underline" href="/contact">contact</Link> by selecting &quot;Report a problem&quot;.
          </p>
        </LegalSection>
      </div>
    </Container>
  );
}
