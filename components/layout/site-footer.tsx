import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/site/container";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { isPlaceholder, site, social } from "@/lib/site";

const platformLinks = [
  { href: "/directory", label: "Creator Directory" },
  { href: "/collabs", label: "Collab Briefs" },
  { href: "/clipping", label: "Video Clipping Hub" },
  { href: "/clipping/campaigns", label: "Funded Campaigns" },
  { href: "/events", label: "Community Events" },
  { href: "/learn", label: "Free Academy" },
  { href: "/help", label: "Help & FAQ" },
];

const communityLinks = [
  { href: "/giveaways", label: "Community Giveaways" },
  { href: "/affiliates", label: "Affiliate Offers" },
  { href: "/promoters", label: "1K+ Promoters" },
  { href: "/partners", label: "Partner Perks" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/journal", label: "Journal & Updates" },
  { href: "/resources", label: "Creator Toolkit" },
];

const legalLinks = [
  { href: "/legal/terms", label: "Terms of Service" },
  { href: "/legal/privacy", label: "Privacy Policy" },
  { href: "/legal/cookies", label: "Cookie Policy" },
  { href: "/legal/grievance", label: "Grievance Redressal" },
  { href: "/guidelines", label: "Community Guidelines" },
];

const activeSocials = [
  social.instagram,
  social.whatsappChannel,
  social.whatsappCommunity,
  social.linkedin,
  social.youtube,
].filter((item) => !isPlaceholder(item.href));

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-bg text-text">
      {/* 1. Full-Width Newsletter Strip */}
      <div className="border-b border-border bg-surface/30 py-10 md:py-12">
        <Container className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-md">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-lime">
              Stay Connected
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
              Subscribe to CIRCLE updates
            </h3>
            <p className="text-xs sm:text-sm text-silver mt-1.5 leading-relaxed">
              Weekly verified brand collabs, funded video clipping briefs, and community workshop alerts.
            </p>
          </div>
          <div className="w-full md:w-auto md:min-w-[360px]">
            <NewsletterForm source="footer" tone="lime" />
          </div>
        </Container>
      </div>

      {/* 2. Main 4-Column Balanced Navigation */}
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1: Brand & Operator Summary */}
          <div className="flex flex-col gap-4">
            <Link href="/" aria-label="CIRCLE Home" className="w-fit">
              <Image
                src="/brand/logo-white.png"
                alt="CIRCLE"
                width={120}
                height={36}
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-xs text-silver leading-relaxed max-w-xs mt-1">
              {site.tagline}. An invite-free creator and brand collaboration network.
            </p>
            <p className="text-xs text-silver/80 leading-relaxed max-w-xs">
              {site.operatorDetail}
            </p>
            <div className="mt-2 text-xs font-mono">
              <a
                href={social.email.href}
                className="text-silver hover:text-white transition-colors underline underline-offset-4"
              >
                {social.email.href.replace(/^mailto:/, "")}
              </a>
            </div>
          </div>

          {/* Column 2: Platform Engine */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="mt-4 space-y-2.5">
              {platformLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs text-silver hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Community & Opportunities */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
              Community
            </h4>
            <ul className="mt-4 space-y-2.5">
              {communityLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs text-silver hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal & Compliance */}
          <div>
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-white">
              Trust & Legal
            </h4>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs text-silver hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t border-border/60">
              <span className="block font-mono text-[11px] uppercase tracking-wider text-silver/70 mb-2">
                Connect
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                {activeSocials.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border bg-surface px-2.5 py-1 text-[11px] text-silver hover:text-white hover:border-silver/40 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Base Copyright Strip */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-silver/60">
          <p>© 2026 Portfolix Enterprise Pvt Ltd. All rights reserved.</p>
          <p className="text-[11px]">Designed for high-retention performance</p>
        </div>
      </Container>
    </footer>
  );
}
