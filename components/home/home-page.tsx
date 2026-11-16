import Link from "next/link";

import { OrbitDecor } from "@/components/orbit-decor";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { SocialLink } from "@/components/site/social-link";
import {
  collabSteps,
  offerings,
  social,
  upcomingEvents,
} from "@/lib/site";

export function HomePage() {
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
            <PillLink href="/#community" variant="secondary">
              Explore the community
            </PillLink>
          </div>
        </Container>
      </section>

      <section id="community" className="scroll-mt-20 border-t border-border">
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

      <section id="services" className="scroll-mt-20 border-t border-border">
        <Container className="py-16 sm:py-24">
          <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
            What you get
          </h2>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {offerings.map((item) => (
              <li key={item.title} className="bg-surface p-5">
                <h3 className="font-display text-lead font-medium">
                  {item.title}
                </h3>
                <p className="mt-2 text-small text-silver">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="collabs" className="scroll-mt-20 border-t border-border">
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
        </Container>
      </section>

      <section id="events" className="scroll-mt-20 border-t border-border">
        <Container className="py-16 sm:py-24">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
              Upcoming events
            </h2>
            <p className="text-small text-silver">Placeholder schedule</p>
          </div>
          <ul className="mt-8 divide-y divide-border border-y border-border">
            {upcomingEvents.map((event) => (
              <li
                key={event.title}
                className="grid gap-2 py-5 sm:grid-cols-[8rem_1fr_auto] sm:items-baseline sm:gap-6"
              >
                <p className="text-small text-silver">{event.type}</p>
                <h3 className="font-display text-lead font-medium">
                  {event.title}
                </h3>
                <p className="text-small text-silver">
                  {event.when}
                  <span className="px-2" aria-hidden="true">
                    ·
                  </span>
                  {event.where}
                </p>
              </li>
            ))}
          </ul>
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
          <PillLink href="/brands">Read the brand page</PillLink>
        </Container>
      </section>

      <section className="border-t border-border">
        <Container className="py-16 sm:py-20">
          <h2 className="font-display text-title font-medium tracking-tight uppercase sm:text-display-sm">
            Join the circle
          </h2>
          <p className="mt-4 max-w-xl text-silver">
            Membership is free. There is no paywall. Follow along while
            accounts open.
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
    </>
  );
}
