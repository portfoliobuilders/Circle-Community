import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Bell, Video, Briefcase } from "lucide-react";

import { Container } from "@/components/site/container";
import { SocialLink } from "@/components/site/social-link";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { pageMetadata } from "@/lib/seo";
import { social } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Join CIRCLE",
  "Free membership for creators, video clippers, and brands. 10% platform fee on completed deals.",
  "/join",
);

export default function JoinPage() {
  return (
    <Container className="py-16 sm:py-24">
      {/* 1. Statement Header */}
      <div className="max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-widest text-silver">
          Onboarding · Free Community
        </span>
        <h1 className="font-display mt-4 text-3xl sm:text-5xl font-bold tracking-tight uppercase text-white">
          Membership is free
        </h1>
        <p className="mt-4 text-base sm:text-lg text-silver leading-relaxed">
          Select your role to register your account. Free to join with a transparent 10% platform fee on completed marketplace deals.
        </p>
      </div>

      {/* 2. Interactive Role Selector (2 Large High-Contrast Cards) */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Creator & Clipper Role Card */}
        <div className="rounded-2xl border border-lime/40 bg-surface/80 p-6 sm:p-8 flex flex-col justify-between hover:border-lime transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="size-10 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center text-lime">
                <Video className="size-5" />
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-lime font-semibold">
                Creator & Clipper
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase">
              Join as Creator
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-silver leading-relaxed">
              For content creators, video clippers, editors, and photographers looking for brand briefs and performance payouts.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-silver">
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Apply or bid for fixed, barter, and open collabs</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Earn per 1,000 verified views on clipping campaigns</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Free webinars on rate cards and AI creator tools</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <Link
              href="/signup?role=creator"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-lime px-5 text-xs font-bold text-bg hover:bg-lime/90 transition-colors"
            >
              <span>Select Creator Account</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>

        {/* Brand & Agency Role Card */}
        <div className="rounded-2xl border border-border bg-surface/50 p-6 sm:p-8 flex flex-col justify-between hover:border-silver/60 transition-all">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="size-10 rounded-xl bg-bg border border-border flex items-center justify-center text-silver">
                <Briefcase className="size-5" />
              </div>
              <span className="font-mono text-xs uppercase tracking-wider text-silver">
                Brand & Agency
              </span>
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase">
              Join as Brand
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-silver leading-relaxed">
              For consumer brands, startups, agencies, and founders seeking verified creators and viral vertical video distribution.
            </p>

            <ul className="mt-6 space-y-2.5 text-xs text-silver">
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Post targeted collab briefs with custom requirements</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Launch performance video clipping campaigns</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-lime shrink-0" />
                <span>Filter verified creators with self-reported checks</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <Link
              href="/signup?role=brand"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-border bg-bg px-5 text-xs font-semibold text-white hover:bg-surface transition-colors"
            >
              <span>Select Brand Account</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Community Channels Strip */}
      <section className="mt-14 rounded-2xl border border-border bg-surface/30 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-lime font-semibold">
              Community Channels
            </span>
            <h3 className="font-display text-lg font-bold text-white mt-1">
              Join CIRCLE WhatsApp & Instagram
            </h3>
            <p className="text-xs text-silver mt-0.5">
              Instant alerts for live collab briefs, clipping budgets, and creator meetups.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <SocialLink
              href={social.whatsappChannel.href}
              className="rounded-full border border-border bg-bg px-4 text-xs font-medium text-silver hover:text-white"
            >
              WhatsApp Channel
            </SocialLink>
            <SocialLink
              href={social.instagram.href}
              className="rounded-full border border-border bg-bg px-4 text-xs font-medium text-silver hover:text-white"
            >
              Instagram
            </SocialLink>
          </div>
        </div>
      </section>

      {/* 4. Newsletter Strip */}
      <section className="mt-12 max-w-md">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="size-3.5 text-lime" />
          <span className="font-mono text-xs uppercase tracking-wider text-silver">Weekly Digest</span>
        </div>
        <h3 className="font-display text-base font-semibold text-white">Subscribe to open briefs</h3>
        <p className="mt-1 text-xs text-silver">
          We send curated opportunities weekly. Confirm the email before delivery starts.
        </p>
        <div className="mt-4">
          <NewsletterForm source="join" tone="secondary" />
        </div>
      </section>
    </Container>
  );
}
