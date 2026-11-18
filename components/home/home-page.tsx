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
            <span className="block">Your people.</span>
            <span className="block">Your ideas.</span>
            <span className="block">Your circle.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lead text-silver">
            CIRCLE connects creators, influencers, freelancers, service
            providers, and brands. Build a profile, find collabs, learn for
            free, and show up for the people doing the work.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <PillLink href="/join">Join the circle</PillLink>
            <PillLink href="/directory" variant="secondary">
              Find creators
            </PillLink>
          </div>
        </Container>
      </section>

      <section className="border-t border-border">
        <Container className="py-12 sm:py-16">
          <h2 className="font-display max-w-3xl text-title font-medium tracking-tight uppercase sm:text-display-sm">
            Start with the work
          </h2>
          <p className="mt-4 max-w-2xl text-silver">
            Find a creator, post a brief, or read how the community works. Membership stays free.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <li>
              <Link href="/directory" className="flex min-h-11 items-center rounded-2xl border border-border px-5 hover:bg-surface">
                Find creators
              </Link>
            </li>
            <li>
              <Link href="/collabs" className="flex min-h-11 items-center rounded-2xl border border-border px-5 hover:bg-surface">
                Open collabs
              </Link>
            </li>
            <li>
              <Link href="/giveaways" className="flex min-h-11 items-center rounded-2xl border border-border px-5 hover:bg-surface">
                Community giveaways
              </Link>
            </li>
            <li>
              <Link href="/journal" className="flex min-h-11 items-center rounded-2xl border border-border px-5 hover:bg-surface">
                Read the journal
              </Link>
            </li>
          </ul>
        </Container>
      </section>

      <section id="community" className="scroll-mt-32 border-t border-border">
        <Container className="py-16 sm:py-24">
          <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
            Who we bring together
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            <article>
              <h3 className="font-display text-title-sm font-medium">
                Creators
              </h3>
              <p className="mt-3 text-silver">
                Influencers and creators list platforms, follower counts, and
                rates, then apply or bid for brand collabs.
              </p>
              <Link
                href="/creators"
                className="mt-4 inline-flex min-h-11 items-center text-small text-text underline-offset-4 hover:underline"
              >
                See what creators get
              </Link>
            </article>
            <article>
              <h3 className="font-display text-title-sm font-medium">
                Freelancers and service providers
              </h3>
              <p className="mt-3 text-silver">
                Photographers, videographers, script writers, editors, models,
                studio floors, and podcast setups. List a service with a price
                from and a city.
              </p>
              <Link
                href="/directory"
                className="mt-4 inline-flex min-h-11 items-center text-small text-text underline-offset-4 hover:underline"
              >
                Browse the directory
              </Link>
            </article>
            <article>
              <h3 className="font-display text-title-sm font-medium">Brands</h3>
              <p className="mt-3 text-silver">
                Post a fixed budget, an open bid, or a barter. Browse creators
                and the rates they choose to show.
              </p>
              <Link
                href="/brands"
                className="mt-4 inline-flex min-h-11 items-center text-small text-text underline-offset-4 hover:underline"
              >
                See what brands get
              </Link>
            </article>
          </div>
          <p className="mt-10 max-w-2xl text-small text-silver">
            One account can be a creator and a service provider. Brand accounts
            are separate.
          </p>
        </Container>
      </section>

      <section id="services" className="scroll-mt-32 border-t border-border">
        <Container className="py-16 sm:py-24">
          <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
            What you get
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
              Open the collab board
            </PillLink>
          </p>
        </Container>
      </section>

      <section id="events" className="scroll-mt-32 border-t border-border">
        <Container className="py-16 sm:py-24">
          <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
            Events
          </h2>
          <p className="mt-4 max-w-2xl text-silver">
            Meetups, webinars, and bootcamps are listed when the team publishes them. Nothing is scheduled until it appears there.
          </p>
          <p className="mt-8">
            <PillLink href="/events" variant="secondary">
              See events
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
            <ul className="mt-4 max-w-xl list-disc space-y-2 pl-5 text-silver">
              <li>Collabs: apply, bid, or barter.</li>
              <li>Giveaways: list community prizes or discover opportunities.</li>
              <li>Free webinars and bootcamps.</li>
              <li>Partner perks on studios, gear, and tools.</li>
              <li>Points, badges, and leaderboards for real work.</li>
            </ul>
          </div>
          <PillLink href="/join">Join free</PillLink>
        </Container>
      </section>

      <section className="border-t border-border bg-surface">
        <Container className="grid gap-8 py-16 sm:py-20 lg:grid-cols-[1.4fr_auto] lg:items-center">
          <div>
            <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
              For brands
            </h2>
            <p className="mt-4 max-w-xl text-silver">
              Post a collab, browse creators, or ask Portfolix.Media and
              Portfolix.Tech to run the work with you. The community stays
              free. Agency services are quoted separately.
            </p>
          </div>
          <PillLink href="/brands" variant="secondary">
            Read the brand page
          </PillLink>
        </Container>
      </section>

      <section className="border-t border-border">
        <Container className="py-16 sm:py-20">
          <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
            Join the circle
          </h2>
          <p className="mt-4 max-w-xl text-silver">
            Membership is free. There is no paywall. Create an account and open the board.
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
            FAQ
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
            Notes from CIRCLE. We only write after you confirm the email.
          </p>
          <div className="mt-6">
            <NewsletterForm source="home" tone="lime" />
          </div>
        </Container>
      </section>
    </>
  );
}
