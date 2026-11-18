import Link from "next/link";

import { NewsletterForm } from "@/components/forms/newsletter-form";
import { JsonLd } from "@/components/seo/json-ld";
import { OrbitDecor } from "@/components/orbit-decor";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { SocialLink } from "@/components/site/social-link";
import { faqSeed } from "@/lib/content/faqs";
import { collabSteps, offerings, social } from "@/lib/site";

const offeringHrefs: Record<string, string> = {
  "Collabs & bids": "/collabs",
  "Barter collabs": "/collabs",
  "Services directory": "/directory",
  "Events & awards": "/events",
  "Free webinars & bootcamps": "/learn",
  "Perks & discounts": "/partners",
  "Recognition & leaderboards": "/leaderboard",
  "Trust & safety": "/guidelines",
};
const homeFaqIds = [
  "00000000-0000-4000-8000-000000000001",
  "00000000-0000-4000-8000-000000000002",
  "00000000-0000-4000-8000-000000000003",
  "00000000-0000-4000-8000-000000000006",
  "00000000-0000-4000-8000-000000000004",
  "00000000-0000-4000-8000-000000000007",
];

export function HomePage() {
  const homeFaqs = homeFaqIds.flatMap((id) => {
    const faq = faqSeed.find((item) => item.id === id);
    return faq ? [faq] : [];
  });
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] overflow-hidden sm:block">
          <OrbitDecor className="absolute top-8 -right-10 size-[440px] lg:size-[520px]" />
        </div>
        <Container className="relative py-16 sm:py-24 lg:py-28">
          <p className="text-small tracking-[0.18em] text-silver uppercase">
            Free community · circlecommunity.in
          </p>
          <h1 className="font-display mt-5 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display lg:text-display-lg">
            <span className="block text-white">Find collabs.</span>
            <span className="block text-lime">Keep your rates.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lead text-silver">
            Connect with verified Indian creators and brands. Free to join with a transparent 10% platform fee on completed deals.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PillLink href="/join">Join the circle</PillLink>
            <PillLink href="/directory" variant="secondary">
              Browse directory
            </PillLink>
          </div>
        </Container>
      </section>

      <section className="border-t border-border">
        <Container className="py-12 sm:py-16">
          <h2 className="font-display max-w-3xl text-title font-medium tracking-tight uppercase sm:text-display-sm">
            Explore the marketplace
          </h2>
          <p className="mt-4 max-w-2xl text-silver">
            Discover verified creators, apply for open briefs, or launch clipping campaigns.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <li>
              <Link href="/directory" className="flex min-h-11 items-center rounded-2xl border border-border px-5 hover:bg-surface">
                Browse creators
              </Link>
            </li>
            <li>
              <Link href="/collabs" className="flex min-h-11 items-center rounded-2xl border border-border px-5 hover:bg-surface">
                View open collabs
              </Link>
            </li>
            <li>
              <Link href="/clipping" className="flex min-h-11 items-center rounded-2xl border border-border px-5 hover:bg-surface">
                Clipping campaigns
              </Link>
            </li>
            <li>
              <Link href="/journal" className="flex min-h-11 items-center rounded-2xl border border-border px-5 hover:bg-surface">
                Read journal
              </Link>
            </li>
          </ul>
        </Container>
      </section>

      <section id="community" className="scroll-mt-32 border-t border-border">
        <Container className="py-16 sm:py-24">
          <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
            The community
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            <article>
              <h3 className="font-display text-title-sm font-medium">
                Creators & clippers
              </h3>
              <p className="mt-3 text-silver">
                Showcase verified profiles, apply for paid brand collabs, and earn from viral clipping campaigns with a 10% fee.
              </p>
              <Link
                href="/creators"
                className="mt-4 inline-flex min-h-11 items-center text-small text-text underline-offset-4 hover:underline"
              >
                Browse creator paths
              </Link>
            </article>
            <article>
              <h3 className="font-display text-title-sm font-medium">
                Creative services
              </h3>
              <p className="mt-3 text-silver">
                List photography, video editing, or studio spaces with starting rates and city filters.
              </p>
              <Link
                href="/directory"
                className="mt-4 inline-flex min-h-11 items-center text-small text-text underline-offset-4 hover:underline"
              >
                Explore services
              </Link>
            </article>
            <article>
              <h3 className="font-display text-title-sm font-medium">Brands</h3>
              <p className="mt-3 text-silver">
                Post fixed briefs, open bids, or performance clipping campaigns to reach engaged audiences.
              </p>
              <Link
                href="/brands"
                className="mt-4 inline-flex min-h-11 items-center text-small text-text underline-offset-4 hover:underline"
              >
                Review brand solutions
              </Link>
            </article>
          </div>
        </Container>
      </section>

      <section id="services" className="scroll-mt-32 border-t border-border">
        <Container className="py-16 sm:py-24">
          <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
            Platform features
          </h2>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {offerings.map((item) => (
              <li key={item.title} className="bg-surface">
                <Link href={offeringHrefs[item.title] ?? "/"} className="block p-5 hover:bg-bg">
                  <h3 className="font-display text-lead font-medium">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-small text-silver">{item.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="collabs" className="scroll-mt-32 border-t border-border">
        <Container className="py-16 sm:py-24">
          <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
            How collabs work
          </h2>
          <ol className="mt-10 grid gap-8 lg:grid-cols-3">
            {collabSteps.map((item) => (
              <li key={item.step}>
                <p className="font-display text-small tracking-[0.16em] text-silver">
                  {item.step}
                </p>
                <h3 className="font-display mt-3 text-title-sm font-medium">
                  {item.title}
                </h3>
                <p className="mt-3 text-silver">{item.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10">
            <PillLink href="/collabs" variant="secondary">
              Browse collab briefs
            </PillLink>
          </p>
        </Container>
      </section>

      <section id="events" className="scroll-mt-32 border-t border-border">
        <Container className="py-16 sm:py-24">
          <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
            Community events
          </h2>
          <p className="mt-4 max-w-2xl text-silver">
            Join monthly creator meetups, live editing workshops, and industry masterclasses.
          </p>
          <p className="mt-8">
            <PillLink href="/events" variant="secondary">
              View upcoming events
            </PillLink>
          </p>
        </Container>
      </section>

      <section className="border-t border-border">
        <Container className="grid gap-8 py-16 sm:py-20 lg:grid-cols-[1.4fr_auto] lg:items-center">
          <div>
            <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
              For creators
            </h2>
            <p className="mt-4 max-w-xl text-silver">
              Apply for brand collabs, monetise viral clips, and join free community masterclasses.
            </p>
          </div>
          <PillLink href="/join" variant="secondary">Create account</PillLink>
        </Container>
      </section>

      <section className="border-t border-border bg-surface">
        <Container className="grid gap-8 py-16 sm:py-20 lg:grid-cols-[1.4fr_auto] lg:items-center">
          <div>
            <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
              For brands
            </h2>
            <p className="mt-4 max-w-xl text-silver">
              Launch self-serve briefs, run guaranteed view clipping campaigns, or request managed agency production.
            </p>
          </div>
          <PillLink href="/brands" variant="secondary">
            Explore brand options
          </PillLink>
        </Container>
      </section>

      <section className="border-t border-border">
        <Container className="py-16 sm:py-20">
          <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
            Join the community
          </h2>
          <p className="mt-4 max-w-xl text-silver">
            Free membership with zero subscription fees. Connect on official community channels:
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
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
      </section>

      <section id="faq" className="scroll-mt-32 border-t border-border">
        <Container className="py-16 sm:py-20">
          <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
            Frequently asked questions
          </h2>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: homeFaqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer_md },
              })),
            }}
          />
          <dl className="mt-8 divide-y divide-border border-y border-border">
            {homeFaqs.map((faq) => (
              <div key={faq.id} className="py-5">
                <dt className="font-medium">{faq.question}</dt>
                <dd className="mt-2 max-w-2xl text-silver whitespace-pre-wrap">{faq.answer_md}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6">
            <Link href="/help" className="text-small text-silver underline-offset-4 hover:text-text hover:underline">
              Read all questions
            </Link>
          </p>
        </Container>
      </section>

      <section className="border-t border-border">
        <Container className="py-16 sm:py-20">
          <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
            Newsletter
          </h2>
          <p className="mt-4 max-w-xl text-silver">
            Weekly digest of verified briefs, clipping campaigns, and event announcements.
          </p>
          <div className="mt-6">
            <NewsletterForm source="home" tone="lime" />
          </div>
        </Container>
      </section>
    </>
  );
}
