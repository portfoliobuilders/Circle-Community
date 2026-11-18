import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { pageMetadata } from "@/lib/seo";
import { CheckCircle2 } from "lucide-react";

export const metadata: Metadata = pageMetadata(
  "Clipping & PR Platform Rules",
  "Official compliance guidelines, ASCI influencer disclosure standards, anti-fraud policies, and banned categories for CIRCLE clipping and PR campaigns.",
  "/clipping/rules"
);

export const instant = false;

export default function ClippingRulesPage() {
  return (
    <main className="py-16 sm:py-24 space-y-20 sm:space-y-28">
      {/* 1. Hero */}
      <section>
        <Container>
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-widest text-lime font-semibold">
              Compliance & Safety Standards
            </span>
            <h1 className="font-display mt-4 text-display-sm sm:text-display font-medium uppercase tracking-tight text-white">
              Platform Rules & Editorial Guidelines
            </h1>
            <p className="mt-6 text-lead text-silver leading-relaxed max-w-2xl">
              CIRCLE enforces strict standards on ASCI ad disclosures, copyright protection, follower authenticity, and anti-fraud view counting.
            </p>
          </div>
        </Container>
      </section>

      {/* 2. Core Rule Sections */}
      <section className="border-t border-border pt-16 sm:pt-20">
        <Container>
          <div className="max-w-4xl space-y-16">
            {/* Rule 1: ASCI Ad Disclosure */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-lime font-bold uppercase tracking-wider">RULE 01</span>
                <span className="text-xs text-border-strong">/</span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase">
                  Mandatory ASCI Influencer Disclosures
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-silver leading-relaxed">
                In compliance with the Advertising Standards Council of India (ASCI) code for influencer marketing, all commercial content commissioned through CIRCLE must be unequivocally identified as advertising:
              </p>
              <div className="rounded-2xl border border-border bg-card p-6 space-y-3 text-xs text-silver">
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-lime shrink-0 mt-0.5" />
                  <span><strong>Native Platform Labels:</strong> Instagram posts must activate the native &quot;Paid partnership with...&quot; label. YouTube Shorts must check &quot;Altered or synthetic content / paid promotion&quot;.</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-lime shrink-0 mt-0.5" />
                  <span><strong>Prominent Caption Hashtags:</strong> The primary caption must feature <code>#ad</code>, <code>#collab</code>, <code>#partnership</code>, or <code>#sponsored</code> within the first two lines, prior to any &quot;more&quot; link.</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-lime shrink-0 mt-0.5" />
                  <span><strong>Zero Stealth Advertising:</strong> Posts styled as organic consumer news or unendorsed reviews that conceal commercial sponsorship are disqualified and permanently flagged.</span>
                </p>
              </div>
            </div>

            {/* Rule 2: Anti-Fraud & Single Snapshot Rule */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-lime font-bold uppercase tracking-wider">RULE 02</span>
                <span className="text-xs text-border-strong">/</span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase">
                  Single-Snapshot View Verification & Anti-Bot Policy
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-silver leading-relaxed">
                CIRCLE employs a single-snapshot verification model to guarantee fair compensation and eliminate view tampering:
              </p>
              <div className="rounded-2xl border border-border bg-card p-6 space-y-3 text-xs text-silver">
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-lime shrink-0 mt-0.5" />
                  <span><strong>Day 7 Single Count:</strong> Views are recorded exactly once, on Day 7 post-submission (VIEW_HOLD_DAYS). Subsequent view accumulation is not payable.</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-lime shrink-0 mt-0.5" />
                  <span><strong>Automated Velocity Audits:</strong> Clips exhibiting artificial 10x traffic spikes without commensurate watch duration or comment ratios are automatically held for audit.</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-lime shrink-0 mt-0.5" />
                  <span><strong>Zero Scraping:</strong> YouTube metrics are queried directly via the official Google YouTube Data API v3. Instagram verifications require native mobile screen recordings of account Insights.</span>
                </p>
              </div>
            </div>

            {/* Rule 3: Follower Floor & Maturation in PR */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-lime font-bold uppercase tracking-wider">RULE 03</span>
                <span className="text-xs text-border-strong">/</span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase">
                  Social Media PR Standards (10K+ Follower Standard)
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-silver leading-relaxed">
                Social Media PR bookings require strict creator qualification and post permanence:
              </p>
              <div className="rounded-2xl border border-border bg-card p-6 space-y-3 text-xs text-silver">
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-lime shrink-0 mt-0.5" />
                  <span><strong>Admin-Audited Followers:</strong> Self-reported numbers are never accepted. Accounts must possess at least 10,000 verified followers confirmed via bio-code matching and manual inspection.</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-lime shrink-0 mt-0.5" />
                  <span><strong>90-Day Follower Expiry:</strong> Verifications expire every 90 days (PR_FOLLOWER_RECHECK_DAYS) and must be re-checked prior to payment release.</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-lime shrink-0 mt-0.5" />
                  <span><strong>7-Day Live Maturation Lock:</strong> PR deliverables must stay live, public, and unedited for 7 consecutive days (PR_LIVE_DAYS). Deleting or archiving the post prior to Day 7 voids payment.</span>
                </p>
                <p className="flex items-start gap-2">
                  <CheckCircle2 className="size-4 text-lime shrink-0 mt-0.5" />
                  <span><strong>Max 1 Revision Round:</strong> When draft approval is enabled, brand owners are legally restricted to at most one round of revisions (PR_MAX_REVISIONS = 1).</span>
                </p>
              </div>
            </div>

            {/* Rule 4: Prohibited Categories */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-red-400 font-bold uppercase tracking-wider">RULE 04</span>
                <span className="text-xs text-border-strong">/</span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase">
                  Strictly Prohibited Campaign Categories
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-silver leading-relaxed">
                The following categories are rejected at admin review and prohibited under CIRCLE terms of service:
              </p>
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 space-y-3 text-xs text-silver">
                <p>1. <strong>Political & Election Propaganda:</strong> Party election campaigns, political candidates, legislative lobbying, or astroturfed political narratives.</p>
                <p>2. <strong>Betting & Gambling:</strong> Real-money gaming, sports betting syndicates, fantasy gambling apps, or casino games.</p>
                <p>3. <strong>Crypto & Unregulated Financial Schemes:</strong> Cryptocurrencies, token pre-sales, high-yield investment programs (HYIPs), or get-rich-quick guarantees.</p>
                <p>4. <strong>Unproven Health & Medical Cures:</strong> Unapproved supplements, miracle remedies, unsubstantiated medical claims, or anti-vaccination content.</p>
                <p>5. <strong>Adult Content:</strong> Explicit sexual services, pornography, or age-inappropriate media.</p>
                <p>6. <strong>Defamation & Smear Hit Pieces:</strong> Attacks on private individuals, corporate competitors, or manufactured fake news stories.</p>
              </div>
            </div>

            {/* Rule 5: Copyright & Reversals */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-lime font-bold uppercase tracking-wider">RULE 05</span>
                <span className="text-xs text-border-strong">/</span>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase">
                  Copyright Ownership & Ledger Reversals
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-silver leading-relaxed">
                Campaign owners warrant full copyright and distribution rights. If a campaign is flagged for copyright infringement, uncounted views are voided immediately. Reversals write dual offsetting rows in `clip_wallet_ledger` (<code>reversal</code> and <code>fee_reversal</code>) to net balances accurately to zero.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-border pt-16 pb-8">
        <Container>
          <div className="text-center max-w-2xl mx-auto space-y-6">
            <h2 className="font-display text-2xl sm:text-4xl font-medium uppercase tracking-tight text-white">
              Questions regarding compliance?
            </h2>
            <p className="text-xs sm:text-sm text-silver leading-relaxed">
              Read our full FAQ knowledge base or check our interactive earnings calculator.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <PillLink href="/clipping/faq">Read the FAQ</PillLink>
              <PillLink href="/clipping/calculator" variant="secondary">
                Open calculator
              </PillLink>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
