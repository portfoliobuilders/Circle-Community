import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Clipping & PR FAQ",
  "Frequently asked questions regarding CIRCLE's video clipping view verification, social media PR bookings, dual 10% fees, and weekly UPI payouts.",
  "/clipping/faq"
);

export const instant = false;

const faqCategories = [
  {
    category: "General Eligibility & Verification",
    items: [
      {
        q: "Who is eligible to participate in clipping campaigns?",
        a: "To participate, you must be at least 18 years old (validated against your CIRCLE profile date of birth to comply with the Indian DPDP Act), maintain an active CIRCLE account, and hold a verified social account in creator_platforms via our 72-hour bio-code verification system.",
      },
      {
        q: "Who is eligible to participate in Social Media PR campaigns?",
        a: "Social Media PR is strictly reserved for creators and established theme pages with at least 10,000 admin-verified followers. In addition to bio-code account ownership, an administrator conducts a manual engagement audit to verify authentic reach before approving your follower count.",
      },
      {
        q: "How does bio-code verification work?",
        a: "When you link your YouTube or Instagram handle, CIRCLE issues a unique 6-character verification code (e.g., CRC-91A4). You insert this code into your public profile bio. Once verified, you may remove the code from your bio.",
      },
      {
        q: "How often are follower counts re-checked?",
        a: "Admin follower verifications remain valid for 90 days (PR_FOLLOWER_RECHECK_DAYS). Accounts are audited again upon expiry and automatically checked prior to processing any UPI payout.",
      },
    ],
  },
  {
    category: "Video Clipping Mechanics",
    items: [
      {
        q: "When and how are video views counted for clipping?",
        a: "Views are verified exactly once, on Day 7 (VIEW_HOLD_DAYS) following the submission timestamp in clip_submissions. For YouTube Shorts, views are queried through the official Google YouTube Data API v3. For Instagram Reels, creators provide native Insights screen recordings for admin verification. Views occurring after Day 7 do not accrue additional payout.",
      },
      {
        q: "What is the per-clip view cap?",
        a: "Campaign owners define a per-clip view cap (e.g. 50,000 or 100,000 views) to prevent a single hyper-viral video from depleting the entire campaign budget. Views beyond the cap are not payable.",
      },
      {
        q: "Can I submit the same clip multiple times or across different accounts?",
        a: "No. Re-uploading identical clips across multiple accounts or submitting the same URL multiple times is prohibited and will trigger an automated fraud flag.",
      },
      {
        q: "What happens if a campaign runs out of budget before Day 7?",
        a: "Campaign budgets are reserved upon clip submission. Budget reservation ensures approved clips that mature on Day 7 are guaranteed payment from funded escrow.",
      },
    ],
  },
  {
    category: "Social Media PR Operations",
    items: [
      {
        q: "How does pricing work in Social Media PR?",
        a: "Campaigns operate in either Fixed Mode (owner sets a uniform fee per post) or Quote Mode (creators submit custom rate quotes based on their niche and reach, which the owner can accept).",
      },
      {
        q: "What is the content approval and revision protocol?",
        a: "If content approval is required, creators upload their draft video or image to private storage. Campaign owners can either approve the draft or request at most one revision (PR_MAX_REVISIONS = 1). Owners cannot request indefinite edits.",
      },
      {
        q: "What is the 7-day live maturation hold?",
        a: "Once a creator publishes an approved PR post and submits the URL, it must remain live, public, and unedited for 7 full days (PR_LIVE_DAYS). If the post is archived, deleted, or has its ad disclosures removed during this window, payment fails.",
      },
      {
        q: "Can a campaign owner contact creators directly via phone or WhatsApp?",
        a: "No. Prior to accepting an application, campaign owners cannot view applicant phone numbers or emails. All communications regarding the brief take place on-platform.",
      },
    ],
  },
  {
    category: "Fees, Escrow & Payouts",
    items: [
      {
        q: "What fees does CIRCLE charge?",
        a: "CIRCLE operates a transparent dual 10% fee model. Campaign owners pay a 10% service fee on top of their campaign budget (e.g. ₹50,000 budget + ₹5,000 fee = ₹55,000 total invoice). Creators have a 10% platform fee deducted from gross earnings upon Day 7 lock.",
      },
      {
        q: "When can creators withdraw their earnings?",
        a: "Earnings accrue to your wallet ledger upon Day 7 lock. Creators can request a payout at any time once their net wallet balance reaches the ₹500 minimum threshold (MIN_PAYOUT_INR). Payouts are settled weekly via UPI.",
      },
      {
        q: "What happens to unspent campaign budget?",
        a: "Any unused budget from unreached views or unaccepted PR slots is fully refunded to the campaign owner via bank transfer.",
      },
    ],
  },
];

export default function FaqPage() {
  const allFaqs = faqCategories.flatMap((c) => c.items);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="py-16 sm:py-24 space-y-16">
        <Container>
          <div className="max-w-3xl">
            <span className="font-mono text-xs uppercase tracking-widest text-lime font-semibold">
              Platform Knowledge Base
            </span>
            <h1 className="font-display mt-4 text-display-sm sm:text-display font-medium uppercase tracking-tight text-white">
              Clipping & PR FAQ
            </h1>
            <p className="mt-4 text-lead text-silver leading-relaxed max-w-2xl">
              Complete details on view counting, 10K+ follower verification, escrow protection, and weekly UPI payouts.
            </p>
          </div>

          <div className="mt-16 space-y-16 max-w-4xl">
            {faqCategories.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-6">
                <h2 className="font-display text-xl font-bold uppercase tracking-tight text-white border-b border-border pb-3">
                  {cat.category}
                </h2>
                <div className="divide-y divide-border">
                  {cat.items.map((item, itemIdx) => (
                    <details key={itemIdx} className="group py-4 text-sm">
                      <summary className="font-medium text-text cursor-pointer list-none flex justify-between items-center group-open:text-lime">
                        <span>{item.q}</span>
                        <span className="font-mono text-xs text-silver group-open:rotate-180 transition-transform">▼</span>
                      </summary>
                      <p className="mt-3 text-xs text-silver leading-relaxed pl-2 border-l border-lime/30">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-border bg-card p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 max-w-4xl">
            <div>
              <h3 className="font-display text-lg font-bold text-white uppercase">Still have questions?</h3>
              <p className="text-xs text-silver mt-1">
                Explore our full platform rules or test earnings in our interactive calculator.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <PillLink href="/clipping/rules">Read rules</PillLink>
              <PillLink href="/clipping/calculator" variant="secondary">
                Calculator
              </PillLink>
            </div>
          </div>
        </Container>
      </main>
    </>
  );
}
