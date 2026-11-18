import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { SocialLink } from "@/components/site/social-link";
import { faqSeed } from "@/lib/content/faqs";
import { servicePath, servicesFor } from "@/lib/content/agency-services";
import { pageMetadata } from "@/lib/seo";
import { social } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Membership",
  "CIRCLE membership is free. No subscription paywalls. Transparent 10% platform fee applies only to completed marketplace deals.",
  "/membership",
);

const freeItems = [
  "Profile and verified directory listing",
  "Access to open collab briefs (10% platform fee on completed deals)",
  "Access to video clipping campaigns (10% performance fee upon payout)",
  "Free community webinars and bootcamps",
  "Partner discounts on studios, gear, and software",
  "Points, badges, and monthly leaderboards",
  "Annual community awards eligibility",
];

const neverCharge = [
  "Joining CIRCLE or browsing directory listings",
  "Creating or maintaining a creator profile",
  "Applying or pitching for collabs",
  "Attending community learning webinars",
  "Profile identity verification",
];

const excerptIds = [
  "00000000-0000-4000-8000-000000000001",
  "00000000-0000-4000-8000-000000000006",
  "00000000-0000-4000-8000-000000000003",
  "00000000-0000-4000-8000-000000000009",
];

export default function MembershipPage() {
  const faqs = faqSeed.filter((faq) => excerptIds.includes(faq.id));
  const paid = [...servicesFor("brand"), ...servicesFor("creator")];

  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Membership</p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display">
        Membership is free
      </h1>
      <p className="mt-6 max-w-2xl text-lead text-silver">
        No monthly subscriptions and no paywalled listings. Transparent 10% platform fee applies only to completed marketplace deals.
      </p>
      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-display text-title-sm font-medium">Free for every member</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-silver">
            {freeItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-border p-6 sm:p-8">
          <h2 className="font-display text-title-sm font-medium">
            Optional paid services
          </h2>
          <p className="mt-3 text-small text-silver">
            Portfolix Media and Portfolix Tech. Each price is &quot;Quote on request&quot;.
          </p>
          <ul className="mt-4 space-y-2">
            {paid.map((service) => (
              <li key={service.slug}>
                <Link href={servicePath(service)} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                  {service.title}
                </Link>
                <span className="block text-small text-silver">Quote on request</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="mt-12 rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="font-display text-title-sm font-medium">Transparent marketplace fees</h2>
        <p className="mt-2 text-silver">
          Joining CIRCLE and maintaining a directory profile is free. When deals complete, CIRCLE charges a clear 10% platform fee to protect transactions:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-silver">
          <li><strong>Brand collabs:</strong> 10% platform fee deducted on completed creator payouts.</li>
          <li><strong>Video clipping:</strong> 10% platform fee deducted from verified locked clip earnings.</li>
          <li><strong>Campaign owners:</strong> 10% service fee on campaign budgets covering automated view auditing.</li>
        </ul>
      </section>
      <section className="mt-12">
        <h2 className="font-display text-title-sm font-medium">What CIRCLE will never charge you for</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-silver">
          {neverCharge.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="mt-12">
        <h2 className="font-display text-title-sm font-medium">Common questions</h2>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer_md },
            })),
          }}
        />
        <ul className="mt-4 divide-y divide-border border-y border-border">
          {faqs.map((faq) => (
            <li key={faq.id} className="py-4">
              <h3 className="font-medium">{faq.question}</h3>
              <p className="mt-2 text-silver">{faq.answer_md}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4">
          <Link href="/help" className="text-small text-silver underline">All questions</Link>
        </p>
      </section>
      <div className="mt-10">
        <PillLink href="/signup">Create free account</PillLink>
      </div>
      <div className="mt-8 flex flex-col items-start gap-3">
        <SocialLink
          href={social.whatsappChannel.href}
          className="justify-center rounded-full border border-border px-5 no-underline hover:bg-surface hover:no-underline"
        >
          Join WhatsApp Channel
        </SocialLink>
        <SocialLink
          href={social.instagram.href}
          className="justify-center rounded-full border border-border px-5 no-underline hover:bg-surface hover:no-underline"
        >
          Follow on Instagram
        </SocialLink>
      </div>
    </Container>
  );
}
