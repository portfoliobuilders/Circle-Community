# CIRCLE — Clipping & Social Media PR Feature Implementation Plan (Parts 15–18, PR1–PR2)

> **Status:** Revised — Pending Approval  
> **Target Release:** CIRCLE Clipping & Social Media PR v1  
> **Author:** Senior Product Designer & Staff Software Engineer  
> **Prerequisites:** Audit of Parts 0–13 completed; `AGENTS.md` and `docs/PROJECT_BRIEF.md` compliant.

---

## 0. Overrides to the Part 15–18 Prompts

> [!IMPORTANT]
> **Precedence Rule:** If any subsequent prompt in Parts 15–18 disagrees with the architectural and business rules in this section, **this section wins without stopping to ask**.

1. **Dual-Sided Fee Model (Replaces "Clippers Pay Nothing"):**
   - **Owner Fee:** `OWNER_FEE_PCT = 10`. Charged on top of the campaign budget. Invoice total = `budget_inr + 10%`. 100% of the `budget_inr` goes exclusively to clipper earnings.
   - **Clipper Fee:** `CLIPPER_FEE_PCT = 10`. Deducted from gross earnings when a clip locks on its counting day.
   - **No other fees:** Zero joining fee, zero submission fee, zero payout withdrawal fee.
   - **Integer-Only Maths:**
     - `gross = floor(payable_views / 1000 * rate_inr_per_1k)`
     - `fee = floor(gross * 10 / 100)`
     - `net = gross - fee`
     - Campaign budget is reserved and tracked against `gross`.
     - All caps (per-clip view cap, per-clipper budget cap, annual clipper cap) evaluate against `gross`.
   - **Ledger Entries & Reversals:**
     - When a clip becomes payable on day `VIEW_HOLD_DAYS`, two rows are written in a single database transaction:
       - `'earning'` (`+gross`, `ref_type = 'clip_submission'`)
       - `'fee'` (`-fee`, `ref_type = 'clip_submission'`)
     - **Reversal Rule:** Reversing a clip writes two rows in one transaction: `'reversal'` (`-gross`) and `'fee_reversal'` (`+fee`). With `unique(type, ref_type, ref_id)`, `'reversal'` and `'fee_reversal'` avoid constraint collision, fully restore the campaign budget, and net the clipper's wallet balance to zero for that clip.
     - Clipper wallet balance = `SUM(amount_inr)` = `net`.
     - `MIN_PAYOUT_INR` applies strictly to the `net` balance.
   - **Rate Display Rule:** Everywhere a clipper sees a rate, show the net rate first: *"₹X per 1,000 views after CIRCLE's 10% fee"*, with the gross rate beside it. The calculator and earnings table display gross, fee, and net clearly. Campaign owners see: budget, 10% fee, invoice total, and views the budget buys.
2. **Rate Range:**
   - `CLIP_RATE_MIN_INR_PER_1K = 10`, `CLIP_RATE_MAX_INR_PER_1K = 200`.
   - The campaign owner chooses any integer rate within this range. There is **no fixed or recommended rate** displayed anywhere on the platform.
3. **Clipper Eligibility (Replaces "Verification Level ≥ 2"):**
   - A clipper is eligible to join campaigns and submit clips when:
     1. Age is 18+ (verified via `profiles.date_of_birth <= now() - interval '18 years'`).
     2. Account status is active.
     3. They possess an approved, verified row in `creator_platforms` for the platform they are submitting on (`youtube_shorts` or `instagram_reels`).
   - Remove every mention of "verification level ≥ 2".
4. **Single-Snapshot Counting Rule:**
   - `VIEW_HOLD_DAYS = 7` (confirmed).
   - Each clip is counted **exactly once**, on day 7 post-submission (based on `clip_submissions.created_at`, not a clipper-supplied timestamp). The verified view count on that single day is final; subsequent views are not payable.
5. **Promoted Slots System:**
   - Weekly sealed-bid auction for 3 sponsored positions (`PROMO_SLOT_COUNT = 3`) on `/clipping/campaigns` and the hub live strip, running Monday 00:00 to Sunday 23:59 IST.
   - Bidding closes Friday 18:00 IST for the following week.
   - Controlled by `PROMO_SLOTS_ENABLED` (defaults to `false`; with the flag off, no promotional bidding or labels appear).
   - Build order: schema, bidding UI in the owner dashboard, and admin settle screen in Part 15; hub live strip placement in Part 17.
6. **Email-Only Notifications:**
   - Transactional email via Resend (`lib/email.ts`) + dashboard status steppers only. Do not build an in-app notification center or notification table.
7. **Database-Driven Rate Limiting:**
   - Enforce 24-hour write limits directly in server actions via PostgreSQL row counts (`WHERE created_at > now() - interval '24 hours'`). Do not rely on `lib/rate-limit.ts` for clipping.
8. **No Analytics Event Dispatching in Part 17:**
   - No third-party or client-side analytics library is installed in the codebase, as disclosed on `/legal/cookies` and `/legal/privacy`. Skip client-side analytics events.
9. **Social Media PR (Pay-Per-Post Campaign Engine):**
   - **Second Campaign Type Under Clipping:** `clip_campaigns` supports two distinct campaign models: `campaign_type in ('clipping', 'social_pr')`. Clipping is pay-per-view (vertical video edits from long-form footage, paid per 1,000 verified views across many small clippers); Social Media PR is pay-per-post (established pages and influencers paid a fixed or quoted fee per published deliverable).
   - **Shared Architecture:** PR reuses `clip_campaigns` (title, brief, rules, category, dates, status flow, admin approval, upfront invoice funding gate, report flags, `admin_actions`), `creator_platforms` (handles, bio-code verification), `clip_wallet_ledger` (double ledger row `'earning'` and `'fee'`), `clip_payout_requests` (UPI batch payouts), and `clip_fraud_flags`.
   - **10K+ Follower Floor & Admin Verification:** Accounts participating in PR must have `admin_verified_followers >= 10000` (`PR_MIN_FOLLOWERS = 10000`). Follower counts must be verified manually by CIRCLE admins and recorded with `followers_verified_at` and `followers_verified_by`. Verification is valid for 90 days (`PR_FOLLOWER_RECHECK_DAYS = 90`) and re-checked before each payout.
   - **Dual-Sided 10% PR Fee:**
     - `PR_OWNER_FEE_PCT = 10`: Owner pays 10% fee invoiced on top of campaign budget. Invoice total = `budget_inr + 10%`.
     - `PR_CREATOR_FEE_PCT = 10`: CIRCLE retains 10% platform fee from each locked post fee. Net = `gross - 10%`.
     - Creators always see the net fee first: *"₹X after CIRCLE's 10% fee"*, with gross fee displayed beside it.
   - **Upfront Funding & 7-Day Live Maturation:**
     - Campaign owners pay CIRCLE upfront via offline bank transfer (same invoice mechanism as clipping). Campaign cannot go live until `funded_at` and `funded_ref` are set.
     - Once creator submits the live post URL, CIRCLE confirms it is live and properly disclosed. The post must remain live, public, and unedited with required disclosures for 7 days (`PR_LIVE_DAYS = 7`).
     - On day 7, fee locks and two ledger rows are written atomically: `'earning'` (`+gross`) and `'fee'` (`-fee`) with `ref_type = 'pr_deliverable'`.
     - If the post is deleted, archived, made private, or disclosure is removed prior to day 7: payment fails, the campaign slot reopens, and repeat offenses trigger account fraud flags.
   - **Content Approval Protocol:** When `content_approval_required = true`, creators upload drafts to private bucket `pr-drafts`. Campaign owners may approve or request at most one revision (`PR_MAX_REVISIONS = 1`).
   - **ASCI Disclosure Mandatory:** Every post must feature the platform's native paid-partnership label plus `#ad` or `#collab`. Posts lacking disclosure are disqualified from payment.
   - **Banned Categories & Consent:** Banned categories (political, betting, crypto/investment, unproven health claims, adult, defamation/smear, fake news) are rejected at admin approval. Campaigns promoting an individual require written consent timestamped in `subject_consent_confirmed_at`.
   - **On-Platform Communication:** Campaign owners cannot view applicants' phone numbers or email addresses prior to acceptance. All brief clarifications happen strictly on-platform.
   - **Feature Flag Control:** `PR_ENABLED = false` controls all PR routes and UI. While false, all PR routes return 404.

---

## 1. Resolved Decisions & Open Regulatory Items

### 1.1 Owner Decisions (Locked)
1. **Fee Model & Display:** 10% owner fee invoiced on top of campaign budget; 10% clipper fee deducted from locked gross earnings. Clippers always see the net rate first with the gross rate beside it.
2. **Instagram Verification Target & SLA:** 3 working days target. A clip unverified by payout cutoff rolls to the next cycle; never paid on unverified views.
3. **Budget Depletion Order:** First come, first served by lock time. No prorating. When `budget_reserved_inr` reaches `budget_inr`, the payout is capped at the remaining balance and the campaign status transitions to `'ended'`.
4. **Creator Platform Verification:** Part 15 includes `creator_platforms` with bio-code verification (72-hour code expiry) and an admin approval queue (`/admin/clipping/verifications`).
5. **Campaign Pause, Early End & Copyright:**
   - On pause/early end: No new submissions. Clips approved prior to pause are counted on day 7 post-submission and paid from funded budget.
   - On confirmed copyright claim: Campaign removed. Unlocked earnings voided; locked earnings paid. Unspent budget refund is an admin decision recorded in `admin_actions`.
6. **Promoted Slots:** Campaign owners bid for 3 weekly sponsored slots. Sealed bids; winners pay by invoice before Monday; forfeiture moves next bidder up.
7. **Social Media PR (Pay-Per-Post Campaign Engine):** Second campaign type inside Clipping (`campaign_type = 'social_pr'`). Reuses wallet, ledger, payouts, fraud flags, and admin tools from Parts 15–16.
8. **PR Follower Verification (10K+ Floor):** Follower counts must be verified by admin via bio-code verification. Admin records verified count. Re-checked every 90 days (`PR_FOLLOWER_RECHECK_DAYS = 90`) and before each payout.
9. **PR Upfront Escrow & 7-Day Live Hold:** Owner pays CIRCLE upfront via manual invoice (`budget + 10% owner fee`). Creator is paid only after the post remains live, public, and unedited for 7 days (`PR_LIVE_DAYS = 7`).
10. **PR Fee Parity:** Same 10% / 10% dual fee model as clipping (`PR_OWNER_FEE_PCT = 10`, `PR_CREATOR_FEE_PCT = 10`). Net fee displayed first to creators.
11. **PR ASCI Ad Compliance & Banned Categories:** Native paid-partnership tool + `#ad` or `#collab` strictly required. Zero tolerance for political, betting, crypto, unproven health claims, adult, defamation, or fake news. Promoting an individual requires written consent.

### 1.2 Open Questions for the Chartered Accountant (CA)
1. **GST Treatment of Dual 10% Fees:**  
   - **Owner Fee (10%):** Does Portfolix raise a tax invoice with 18% GST solely on the 10% owner fee, or on the gross invoice amount (budget + fee)? How is the budget portion treated in Portfolix's books (pure agent / disbursement vs principal)?
   - **Creator/Clipper Fee (10%):** How is the 10% platform fee deducted from creators accounted for under GST? Since creators are individual unregistered suppliers, does Portfolix have reverse-charge mechanism (RCM) GST obligations?
2. **TDS & Annual Payout Thresholds:**  
   - Under Sections 194R, 194C, or 194J, what is the annual earnings ceiling before Portfolix must collect PAN and deduct TDS?
   - Confirmation of `PER_CLIPPER_ANNUAL_CAP_INR` (enforced in earnings function to stop payouts before reaching TDS limits while PAN collection is omitted).
   - `CA_SIGNOFF_DONE` remains `false` until these items are formalized.
3. **Tax Treatment of Social Media PR Pay-Per-Post Fees:**
   - Under Section 194J (professional / technical services) or 194C (advertising / contractor work), does a fixed fee per PR post (e.g. ₹5,000–₹50,000) alter TDS obligations compared to micro-earnings from clipping views?
   - Confirm whether PR creators exceeding ₹30,000 per financial year mandate PAN collection and TDS deduction before payout execution.

---

## 2. Product Summary (Restated Architecture)

The **CIRCLE Clipping & Social Media PR Engine** operates two complementary campaign formats within a unified financial and verification architecture:

### 2.1 Campaign Model A: Video Clipping (Pay-Per-View)
- **Objective:** Broad organic reach via user-generated vertical edits (YouTube Shorts, Instagram Reels) created from long-form source footage.
- **Participants:** Many community clippers (18+, verified social handle via bio-code).
- **Pricing:** Dynamic rate per 1,000 verified views (`10`–`200` INR/1K views) set by the campaign owner.
- **Counting & Maturation:** Single snapshot on Day 7 (`VIEW_HOLD_DAYS = 7`). Automated YouTube API queries; manual Instagram insights audit (3-day target SLA).
- **Earnings:** `gross = floor(payable_views / 1000 * rate_inr_per_1k)`. Platform fee: 10%. Net: `gross - fee`.
- **Payout:** Automated accrual to `clip_wallet_ledger`; weekly UPI payouts when net balance `>= MIN_PAYOUT_INR` (₹500).

### 2.2 Campaign Model B: Social Media PR (Pay-Per-Post)
- **Objective:** High-credibility, authoritative broadcast distribution for brand announcements, personal milestones, product launches, or viral stories across established pages.
- **Participants:** Established creators and meme/niche pages with `>= 10,000` admin-verified followers (`PR_MIN_FOLLOWERS = 10000`).
- **Pricing:** Fixed fee per post set by the owner, or quote mode where creators pitch and quote their rate.
- **Deliverables:** Instagram Reel, Feed Post, Carousel, Story, or YouTube Short.
- **Review Pipeline:** Optional draft upload to `pr-drafts` private bucket; owner approval or 1 revision request (`PR_MAX_REVISIONS = 1`).
- **Verification & Maturation:** Post URL submitted; verified live with ASCI paid-partnership tag + `#ad`/`#collab`. Fee held for 7 days live post-submission (`PR_LIVE_DAYS = 7`).
- **Earnings & Ledger:** On Day 7, if post remained live and unedited, fee locks into `clip_wallet_ledger` (`'earning'` gross + `'fee'` 10% platform fee, `ref_type = 'pr_deliverable'`).
- **Safety Gates:** Banned categories (political, betting, crypto, health claims, adult, defamation); mandatory written consent for individual subjects (`subject_consent_confirmed_at`). Offline owner funding before live.

### Shared Operating & Financial Loop:
1. **Creation & Invoicing:** Owner configures campaign parameters → Portfolix invoices owner for `budget_inr + 10% owner_fee` → Admin verifies payment UTR and marks campaign `funded` (`funded_at`, `funded_ref`).
2. **Execution & Moderation:** Creators participate based on eligibility → Submissions/Deliverables tracked and verified.
3. **Double Ledger Row:** Every successful payout event (clipping view snapshot or PR deliverable completion) writes two atomic rows to `clip_wallet_ledger`: `'earning'` (`+gross`) and `'fee'` (`-fee`).
4. **Unified Wallet & Payout Engine:** All creator earnings accumulate into a single wallet balance (`SUM(amount_inr) = net`). Creators request UPI withdrawals via `clip_payout_requests`, processed in weekly admin banking runs.
5. **Auditing & Governance:** Every admin action (funding, approvals, verifications, adjustments, disputes) appends an immutable record to `admin_actions`. Open fraud flags block wallet withdrawals.

---

## 3. Site Audit & Fee Copy Update Audit

### 3.1 Every Route Under `app/` and Sitemap Status

| Route Path | Type | Purpose | In `sitemap.ts`? |
| :--- | :--- | :--- | :--- |
| `/` (`app/page.tsx`) | Public | Community homepage (offerings, audience blocks, FAQ, newsletter) | **YES** |
| `/about` (`app/about/page.tsx`) | Public | About CIRCLE, values, operator details (Portfolix) | **YES** |
| `/brands` (`app/brands/page.tsx`) | Public | Brands hub: creator discovery, collab briefs, agency offerings, lead form | **YES** |
| `/brands/services/[slug]` | Public | Detail pages for brand agency services (influencer marketing, ads, UGC) | **YES** |
| `/creators` (`app/creators/page.tsx`) | Public | Creators hub: collabs, perks, free learning, creator agency services | **YES** |
| `/creators/services/[slug]` | Public | Detail pages for creator agency services (profile audit, SMM) | **YES** |
| `/directory` (`app/directory/page.tsx`) | Public | Public creator & service provider directory with filter controls | **YES** |
| `/directory/[id]` | Public | Individual creator/freelancer public profile card & rates view | NO (dynamic profiles) |
| `/collabs` (`app/collabs/page.tsx`) | Public | Marketplace collab board (fixed, open bid, barter) | **YES** |
| `/collabs/[id]` | Public | Detailed collab brief view with creator application submission | NO (dynamic listings) |
| `/collabs/new` | Member | Collab creation form for verified brand profiles | NO (action screen) |
| `/clipping` (`app/clipping/page.tsx`) | Public | Unified hub with 2 pathways: Pay-per-view Clipping & Pay-per-post Social PR | **YES** |
| `/clipping/campaigns` | Public | Public discovery board with type filter (`All` · `Clipping` · `Social PR`) | **YES** |
| `/clipping/campaigns/[slug]` | Public | Campaign detail adapting to type (clipping submission vs PR application/pitch) | NO (dynamic listings) |
| `/clipping/social-pr` | Public | **[NEW] Social media PR guide: 10K+ qualifications, pricing, disclosure, FAQ** | **YES** |
| `/clipping/how-it-works` | Public | Dual workflow guide: clipping per-view pipeline & PR pay-per-post pipeline | **YES** |
| `/clipping/for-brands` | Public | Brand guide: reach at scale per view vs credible pages per post, budget tools | **YES** |
| `/clipping/calculator` | Public | Interactive gross, 10% fee, and net payout estimator | **YES** |
| `/clipping/rules` | Public | Platform rules: ASCI ad disclosures, anti-bot, copyright & banned PR categories | **YES** |
| `/clipping/faq` | Public | Categorized FAQ covering clipping view counting and PR delivery/escrow | **YES** |
| `/clipping/guides` | Public | MDX knowledgebase hub for clippers and PR creators | **YES** |
| `/clipping/guides/[slug]` | Public | Long-form creator economy articles | **YES** |
| `/clipping/leaderboard` | Public | Monthly verified views and creator rankings | **YES** |
| `/events` (`app/events/page.tsx`) | Public | Community events calendar (meetups, webinars, bootcamps) & registration | **YES** |
| `/learn` (`app/learn/page.tsx`) | Public | Free webinar and bootcamp curriculum overview | **YES** |
| `/giveaways` (`app/giveaways/page.tsx`) | Public | Community giveaway listings submitted by creators | **YES** |
| `/affiliates` (`app/affiliates/page.tsx`) | Public | Brand-sponsored affiliate and referral opportunities | **YES** |
| `/challenges` (`app/challenges/page.tsx`) | Public | Community challenges awarding platform points | **YES** |
| `/leaderboard` (`app/leaderboard/page.tsx`)| Public | Monthly points leaderboards for creators and brands | **YES** |
| `/recognition` (`app/recognition/page.tsx`)| Public | Creator badges, rewards, and awards overview | **YES** |
| `/promoters` (`app/promoters/page.tsx`) | Public | Explanation of promoter badge status for accounts with 1K+ followers | **YES** |
| `/partners` (`app/partners/page.tsx`) | Public | Partner perks directory and partnership application form | **YES** |
| `/resources` (`app/resources/page.tsx`) | Public | Curated creator tools, templates, and production resources | **YES** |
| `/journal` (`app/journal/page.tsx`) | Public | Editorial feed aggregating blog, news, and release update posts | **YES** |
| `/blog` (`app/blog/page.tsx`) | Public | Editorial articles listing | **YES** |
| `/blog/[slug]` | Public | Individual blog post reader | **YES** |
| `/news` (`app/news/page.tsx`) | Public | Creator economy news listing | **YES** |
| `/news/[slug]` | Public | Individual news post reader | **YES** |
| `/updates` (`app/updates/page.tsx`) | Public | Platform changelog & product release updates | **YES** |
| `/updates/[slug]` | Public | Individual update post reader | **YES** |
| `/guides` (`app/guides/page.tsx`) | Public | Educational how-to guides directory | **YES** |
| `/guides/[slug]` | Public | Individual guide tutorial page | **YES** |
| `/membership` (`app/membership/page.tsx`)| Public | Free membership tier breakdown vs optional paid agency services | **YES** |
| `/help` (`app/help/page.tsx`) | Public | Categorized, searchable FAQ center and support gateway | **YES** |
| `/contact` (`app/contact/page.tsx`) | Public | General inquiry and support contact form | **YES** |
| `/guidelines` (`app/guidelines/page.tsx`)| Public | Official community conduct and collab guidelines | **YES** |
| `/legal/terms` (`app/legal/terms/page.tsx`)| Public | Terms of Service agreement | **YES** |
| `/legal/privacy` (`app/legal/privacy/page.tsx`)| Public | Privacy Policy compliant with India's DPDP Act | **YES** |
| `/legal/cookies` (`app/legal/cookies/page.tsx`)| Public | Cookie disclosure policy | **YES** |
| `/legal/grievance` (`app/legal/grievance/page.tsx`)| Public | Statutory Grievance Redressal Officer contact details (IT Rules) | **YES** |
| `/legal/community-guidelines` | Public | *Stub/Duplicate* (sets canonical to `/guidelines`) | NO (redundant stub) |
| `/join` (`app/join/page.tsx`) | Public | Onboarding route prompting user to choose Creator vs Brand signup | NO (auth flow) |
| `/login` (`app/login/page.tsx`) | Public | Sign-in page (email + password) | NO (auth flow) |
| `/signup` (`app/signup/page.tsx`) | Public | Registration page with age verification checkbox and DOB picker | NO (auth flow) |
| `/newsletter/confirm` | Public | Email double opt-in confirmation handler | NO (utility token) |
| `/newsletter/unsubscribe` | Public | Newsletter unsubscribe confirmation handler | NO (utility token) |
| `/dashboard` (`app/dashboard/page.tsx`) | Member | Member dashboard (profile edit, rate visibility, sign out) | NO (`robots: noIndex`) |
| `/dashboard/settings` | Member | User preferences (newsletter toggle) | NO (`robots: noIndex`) |
| `/dashboard/clipping` | Member | **[NEW] Creator hub: Clipping submissions, PR applications/drafts, wallet** | NO (`robots: noIndex`) |
| `/dashboard/clipping/campaigns`| Member | **[NEW] Owner hub: Create campaigns (Clipping/PR), applicant reviews, bids** | NO (`robots: noIndex`) |
| `/admin` (`app/admin/page.tsx`) | Admin | Minimal admin index page linking all admin modules | NO (`robots: noIndex`) |
| `/admin/messages` | Admin | Review contact form submissions and update ticket status | NO (`robots: noIndex`) |
| `/admin/faqs` | Admin | FAQ authoring and publishing editor | NO (`robots: noIndex`) |
| `/admin/events` | Admin | Event scheduling and publisher form | NO (`robots: noIndex`) |
| `/admin/challenges` | Admin | Platform challenge creator | NO (`robots: noIndex`) |
| `/admin/clipping` | Admin | **[NEW] Admin queue: approvals, follower audit, live check, payouts** | NO (`robots: noIndex`) |
| `/auth/callback` (`route.ts`) | System | Supabase OAuth & magic link callback route handler | NO (API endpoint) |

### 3.2 Audit of Fee Claims & Required Text Updates Across the Site

To comply with the transparent dual-fee policy (*"Free to join. CIRCLE keeps 10% of creator earnings; campaign owners pay a 10% service fee on campaign budgets."*), the following files and locations will be adjusted in Parts 15, 17, and PR2:

1. **`docs/PROJECT_BRIEF.md` (Lines 36–37, 45):**  
   - *Current text:* "No payments processed in v1. Collab budgets are displayed; payment happens directly between parties."  
   - *Update:* Keep this rule intact for Collabs, but append: *"For Video Clipping & Social Media PR only, campaign owners fund budgets upfront to Portfolix (+ 10% owner fee), and Portfolix pays creators via UPI with a 10% platform fee deducted on locked earnings and deliverables."*
2. **`app/membership/page.tsx` (Lines 30–36, 58–65, 86–92):**  
   - In "What CIRCLE will never charge you for": retain *"Joining clipping campaigns, applying for PR campaigns, and submitting deliverables"*.
   - In "Common questions": update FAQ excerpt to explain that membership, collabs, and community events are free, while clipping earnings and PR deliverable fees carry a 10% platform fee upon lock.
   - Add new section: **"What CIRCLE earns"**: *"Free to join. For video clipping and social media PR campaigns, CIRCLE charges campaign owners a 10% service fee on their budget, and retains a 10% platform fee from creators' locked earnings to cover view and follower verification, fraud prevention, content review, and UPI payout administration."*
3. **`lib/content/faqs.ts` & `app/help/page.tsx`:**  
   - FAQ "Is CIRCLE really free?": Clarify that joining CIRCLE, directory listings, and brand collabs are 100% free of platform commissions; clipping campaigns and social media PR campaigns carry a transparent 10% platform fee on locked earnings.
   - Clipping & PR FAQs: Add explicit Q&A: *"What fees does CIRCLE charge for clipping and PR?"* -> *"Free to join and apply. CIRCLE retains 10% of locked earnings/deliverables, and charges campaign owners a 10% service fee on campaign budgets."*
4. **Planned Clipping Pages (`/clipping`, `/clipping/social-pr`, `/clipping/for-brands`, `/clipping/calculator`, `/clipping/rules`, `/clipping/faq`):**  
   - Display net earnings/fees prominently: *"₹X per 1,000 views / ₹X per post after CIRCLE's 10% fee (Gross: ₹Y)"*.
   - Calculator displays: Gross Earnings, CIRCLE 10% Fee, Net Payout.
   - PR Landing page explicitly highlights: *"Creators with 10K+ verified followers earn a fixed fee per post. Paid upfront by brand, released after 7 days live. Net fee paid directly to your UPI."*

---

## 4. Sitemap Diff

```
CURRENT SITEMAP                                     PROPOSED SITEMAP (with Clipping & Social Media PR)
==============================================      ==============================================
/                                                   /
├── /about                                          ├── /about
├── /brands                                         ├── /brands                             [CHANGED: added Clipping & PR block]
│   └── /brands/services/[slug]                     │   └── /brands/services/[slug]
├── /creators                                       ├── /creators                           [CHANGED: added Clipping & PR block]
│   └── /creators/services/[slug]                   │   └── /creators/services/[slug]
├── /directory                                      ├── /directory
│   └── /directory/[id]                             │   └── /directory/[id]
├── /collabs                                        ├── /collabs
│   ├── /collabs/new                                │   ├── /collabs/new
│   └── /collabs/[id]                               │   └── /collabs/[id]
│                                                   ├── /clipping                           [NEW: Hub - 2 pathways: Clipping & PR]
│                                                   │   ├── /clipping/campaigns             [NEW: Filter board: All · Clipping · Social PR]
│                                                   │   │   └── /clipping/campaigns/[slug]  [NEW: Campaign brief, terms, submit/apply]
│                                                   │   ├── /clipping/social-pr             [NEW: Social PR guide: 10K+, pay, ASCI, FAQ]
│                                                   │   ├── /clipping/how-it-works          [NEW: Dual workflow: per-view & per-post]
│                                                   │   ├── /clipping/for-brands            [NEW: Brand workflow: scale vs authority]
│                                                   │   ├── /clipping/calculator            [NEW: Interactive gross/fee/net estimator]
│                                                   │   ├── /clipping/rules                 [NEW: ASCI disclosure, anti-bot, banned PR]
│                                                   │   ├── /clipping/faq                   [NEW: Dedicated clipping & PR FAQ]
│                                                   │   ├── /clipping/guides                [NEW: MDX knowledgebase hub]
│                                                   │   │   └── /clipping/guides/[slug]     [NEW: 6 long-form SEO/AEO/GEO articles]
│                                                   │   └── /clipping/leaderboard           [NEW: Monthly verified views ranking]
├── /events                                         ├── /events
├── /learn                                          ├── /learn
├── /giveaways                                      ├── /giveaways
├── /affiliates                                     ├── /affiliates
├── /challenges                                     ├── /challenges
├── /leaderboard                                    ├── /leaderboard
├── /recognition                                    ├── /recognition
├── /promoters                                      ├── /promoters
├── /partners                                       ├── /partners
├── /resources                                      ├── /resources
├── /journal                                        ├── /journal
│   ├── /blog & /blog/[slug]                        │   ├── /blog & /blog/[slug]
│   ├── /news & /news/[slug]                        │   ├── /news & /news/[slug]
│   └── /updates & /updates/[slug]                  │   └── /updates & /updates/[slug]
├── /guides & /guides/[slug]                        ├── /guides & /guides/[slug]
├── /membership                                     ├── /membership                         [CHANGED: added fee breakdown]
├── /help                                           ├── /help                               [CHANGED: added Clipping & PR FAQ]
├── /contact                                        ├── /contact
├── /guidelines                                     ├── /guidelines
├── /legal/*                                        ├── /legal/*
├── /join, /login, /signup                          ├── /join, /login, /signup
├── /dashboard                                      ├── /dashboard
│   └── /dashboard/settings                         │   ├── /dashboard/settings
│                                                   │   ├── /dashboard/clipping             [NEW: Creator hub - Clips, PR tab & wallet]
│                                                   │   └── /dashboard/clipping/campaigns   [NEW: Owner hub - Create Clip/PR, manage]
└── /admin/*                                        └── /admin                              [NEW: Minimal admin index hub]
    ├── /admin/messages                                 ├── /admin/messages
    ├── /admin/faqs                                     ├── /admin/faqs
    ├── /admin/events                                   ├── /admin/events
    ├── /admin/challenges                               ├── /admin/challenges
                                                        └── /admin/clipping                 [NEW: Admin review, verify, promo & payouts]
```

---

## 5. Placement in Existing Pages (Factual Copy)

1. **Header Navigation (`lib/site.ts` & `PrimaryNav`):**  
   Add `Clipping` to `primaryNav` between `Collabs` and `Events`.
2. **Homepage (`components/home/home-page.tsx`):**  
   - *Quick Links Strip:* Add `Clipping` card alongside Directory, Collabs, and Journal.
   - *Offerings Grid:* Add `"Clipping & Social PR"` with description: *"Produce vertical video edits or broadcast brand stories on 10K+ verified pages. Earn per view or per post."* linking to `/clipping`.
   - *Editorial Section:* Add section below collabs titled *"Clip. Post. Broadcast. Get paid."*, detailing the two operating models, linking to `/clipping/campaigns`, `/clipping/social-pr`, and `/clipping/for-brands`.
3. **Clipping Hub (`app/clipping/page.tsx`):**  
   Presents two distinct, equal-weight entryways:
   - **Path 1: Video Clipping (Pay-per-view):** Edit vertical shorts from source footage. Open to all active creators with verified handles. Earn per 1,000 verified views.
   - **Path 2: Social Media PR (Pay-per-post):** Share approved stories, reels, posts, or memes on established pages. Strictly for accounts with 10K+ admin-verified followers. Earn fixed fees per post.
4. **For Brands Page (`app/brands/page.tsx`):**  
   Insert a section before agency services titled *"Clipping & Social Media PR"*. Explains how brands can commission high-velocity video edits for organic reach or book 10K+ influencer pages for guaranteed broadcast coverage with upfront budget escrow. CTA: `Learn about clipping & PR` (`/clipping/for-brands`).
5. **For Creators Page (`app/creators/page.tsx`):**  
   Insert a section before creator services titled *"Earn with Video & PR"*. Explains how creators can earn via pay-per-view clipping, or unlock high-ticket pay-per-post PR bookings once they reach 10,000 verified followers. CTA: `Explore live campaigns` (`/clipping/campaigns`).
6. **Membership Page (`app/membership/page.tsx`):**  
   - Add to `neverCharge`: *"Joining clipping campaigns, applying for social media PR campaigns, and submitting deliverables"*.
   - Add new section **"What CIRCLE earns"** detailing the transparent 10% owner fee and 10% creator fee across clipping views and PR deliverables.
7. **Help Center (`app/help/page.tsx` & `lib/content/faqs.ts`):**  
   - Add `'Clipping'` to `faqCategories`.
   - Seed Q&As explaining view counting, follower verification (10K+ threshold, 90-day validity), 7-day live hold period, ASCI disclosure, the 10% platform fee, and UPI payouts.
8. **Site Footer (`components/layout/site-footer.tsx`):**  
   Add `Clipping` to `supportNav` in `lib/site.ts` in the *"Explore"* column.

---

## 6. Complete Data Model Specification

```
                     ┌──────────────────┐
                     │     profiles     │
                     └─────────┬────────┘
                               │
            ┌──────────────────┼────────────────────────┬──────────────────┐
            │ 1:N (owner)      │ 1:N (clipper/creator)  │ 1:N (creator)    │ 1:N (creator)
            │ (RESTRICT)       │ (RESTRICT)             │ (RESTRICT)       │ (CASCADE)
            ▼                  ▼                        ▼                  ▼
  ┌──────────────────┐ ┌────────────────┐     ┌─────────────────┐ ┌────────────────────┐
  │  clip_campaigns  │ │  clip_campaign │     │ pr_applications │ │ creator_platforms  │
  └─────────┬────────┘ │    _members    │     └────────┬────────┘ └─────────┬──────────┘
            │          └────────────────┘              │                    │
            ├──────────────────────────────────────────┼────────────────────┤
            │ 1:N (RESTRICT)                           │ 1:N (RESTRICT)     │ 1:N (RESTRICT)
            │ (clipping)                               │ (PR application)   │
            ▼                                          │                    │
  ┌──────────────────┐                                 │                    │
  │ clip_submissions │                                 │                    │
  └─────────┬────────┘                                 │                    │
            │                                          ▼ 1:1 (RESTRICT)     │
            │                                 ┌─────────────────┐           │
            │                                 │ pr_deliverables │           │
            │                                 └────────┬────────┘           │
            │                                          │                    │
            ▼                                          ▼                    │
┌──────────────────────┐ ┌─────────────┐      ┌─────────────────┐           │
│ clip_view_snapshots  │ │clip_earnings│      │ pr-drafts bucket│           │
└──────────────────────┘ └─────────────┘      └─────────────────┘           │
            │                   │                      │                    │
            └─────────────┬─────┴──────────────────────┘                    │
                          ▼                                                 │
            ┌───────────────────────────┐                                   │
            │     clip_wallet_ledger    │◀──────────────────────────────────┘
            │ (ref: submission or PR)   │
            └─────────────┬─────────────┘
                          │ 1:N (RESTRICT)
                          ▼
            ┌───────────────────────────┐     ┌──────────────────┐
            │    clip_payout_requests   │     │ clip_fraud_flags │
            └───────────────────────────┘     └──────────────────┘

       PROMOTED SLOTS TABLES:
┌──────────────────────┐           ┌──────────────────────┐
│   clip_promo_weeks   │─── 1:N ──▶│   clip_promo_bids    │
└──────────────────────┘           └──────────────────────┘
```

> **Retention & Cascade Rule:**  
> Financial and audit integrity strictly prohibits `ON DELETE CASCADE` from `profiles` or `clip_campaigns` onto `clip_submissions`, `clip_view_snapshots`, `clip_earnings`, `pr_applications`, `pr_deliverables`, `clip_wallet_ledger`, `clip_payout_requests`, or `clip_fraud_flags`. `ON DELETE RESTRICT` is enforced across all operational tables. Account deletion anonymises the profile record while preserving immutable financial audit rows.

### 6.1 Database Tables

#### 1. `creator_platforms`
- `id`: `uuid primary key default gen_random_uuid()`
- `profile_id`: `uuid not null references public.profiles(id) on delete cascade`
- `platform`: `text not null check (platform in ('youtube_shorts', 'instagram_reels'))`
- `handle`: `text not null` (stored lowercase)
- `platform_account_id`: `text` (channel ID or Instagram username)
- `verification_code`: `text not null`
- `code_expires_at`: `timestamptz not null default (now() + interval '72 hours')`
- `verified`: `boolean not null default false`
- `verified_at`: `timestamptz`
- `admin_verified_followers`: `integer check (admin_verified_followers is null or admin_verified_followers >= 0)`
- `followers_verified_at`: `timestamptz`
- `followers_verified_by`: `uuid references public.profiles(id) on delete set null`
- `created_at`: `timestamptz not null default now()`
- *Partial Unique Index:* `create unique index creator_platforms_verified_unique on public.creator_platforms(platform, handle) where verified = true;`

#### 2. `clip_campaigns`
- `id`: `uuid primary key default gen_random_uuid()`
- `slug`: `text not null unique check (char_length(slug) between 3 and 100)`
- `owner_id`: `uuid not null references public.profiles(id) on delete restrict`
- `campaign_type`: `text not null default 'clipping' check (campaign_type in ('clipping', 'social_pr'))`
- `title`: `text not null check (char_length(title) between 4 and 120)`
- `summary`: `text not null check (char_length(summary) <= 200)`
- `brief_md`: `text not null`
- `rules_md`: `text not null`
- `category`: `text not null`
- `language`: `text not null default 'en'`
- `source_links`: `jsonb not null default '[]'::jsonb`
- `asset_folder_url`: `text`
- `platforms`: `text[] not null check (platforms <@ array['youtube_shorts', 'instagram_reels']::text[])`
- `rate_inr_per_1k`: `integer check (rate_inr_per_1k is null or (rate_inr_per_1k between 10 and 200))` (clipping only)
- `budget_inr`: `integer not null check (budget_inr > 0)`
- `owner_fee_inr`: `integer not null default 0 check (owner_fee_inr >= 0)` (10% of budget_inr)
- `budget_reserved_inr`: `integer not null default 0 check (budget_reserved_inr >= 0 and budget_reserved_inr <= budget_inr)`
- `budget_paid_inr`: `integer not null default 0 check (budget_paid_inr >= 0 and budget_paid_inr <= budget_inr)`
- `per_clip_view_cap`: `integer check (per_clip_view_cap is null or per_clip_view_cap >= 1000)` (clipping only)
- `per_clipper_cap_inr`: `integer check (per_clipper_cap_inr is null or per_clipper_cap_inr > 0)`
- `min_views_to_qualify`: `integer not null default 1000 check (min_views_to_qualify >= 0)` (clipping only)
- `deliverable_type`: `text check (deliverable_type in ('reel', 'post', 'carousel', 'story', 'short'))` (social_pr only)
- `fee_per_post_inr`: `integer check (fee_per_post_inr is null or fee_per_post_inr > 0)` (social_pr fixed mode)
- `slots`: `integer check (slots is null or slots >= 1)` (social_pr only)
- `pricing_mode`: `text check (pricing_mode in ('fixed', 'quote'))` (social_pr only)
- `min_followers`: `integer default 10000 check (min_followers is null or min_followers >= 10000)` (social_pr floor)
- `max_followers`: `integer check (max_followers is null or max_followers >= min_followers)`
- `niches`: `text[] not null default '{}'::text[]`
- `cities`: `text[] not null default '{}'::text[]`
- `required_caption`: `text`
- `required_hashtags`: `text[] not null default '{}'::text[]`
- `required_mention`: `text`
- `required_link`: `text`
- `content_approval_required`: `boolean not null default false` (social_pr only)
- `subject_type`: `text check (subject_type in ('brand', 'individual'))` (social_pr only)
- `subject_consent_confirmed_at`: `timestamptz`
- `disclosure_required`: `boolean not null default true check (disclosure_required)`
- `rights_confirmed_at`: `timestamptz`
- `starts_at`: `timestamptz`
- `ends_at`: `timestamptz`
- `status`: `text not null default 'draft' check (status in ('draft', 'pending_review', 'approved', 'funded', 'live', 'paused', 'ended', 'removed'))`
- `funded_at`: `timestamptz`
- `funded_ref`: `text`
- `cover_path`: `text`
- `created_at`: `timestamptz not null default now()`
- *Check Constraints:*
  - `constraint clip_campaigns_rights_check check (status = 'draft' or rights_confirmed_at is not null)`
  - `constraint clip_campaigns_funded_check check (status != 'live' or (funded_at is not null and funded_ref is not null))`
  - `constraint clip_campaigns_type_config_check check (`
    `(campaign_type = 'clipping' and rate_inr_per_1k is not null and per_clip_view_cap is not null) or `
    `(campaign_type = 'social_pr' and deliverable_type is not null and pricing_mode is not null and slots is not null and (min_followers is null or min_followers >= 10000))`
  `)`
  - `constraint clip_campaigns_pr_budget_check check (`
    `campaign_type != 'social_pr' or `
    `(pricing_mode = 'fixed' and fee_per_post_inr is not null and budget_inr = fee_per_post_inr * slots) or `
    `(pricing_mode = 'quote' and budget_inr > 0)`
  `)`
  - `constraint clip_campaigns_subject_consent_check check (`
    `campaign_type != 'social_pr' or subject_type != 'individual' or status = 'draft' or subject_consent_confirmed_at is not null`
  `)`

#### 3. `clip_campaign_members`
- `campaign_id`: `uuid not null references public.clip_campaigns(id) on delete restrict`
- `profile_id`: `uuid not null references public.profiles(id) on delete restrict`
- `joined_at`: `timestamptz not null default now()`
- `status`: `text not null default 'active' check (status in ('active', 'removed'))`
- *Primary Key:* `(campaign_id, profile_id)`

#### 4. `clip_submissions` (Clipping Pay-Per-View Only)
- `id`: `uuid primary key default gen_random_uuid()`
- `campaign_id`: `uuid not null references public.clip_campaigns(id) on delete restrict`
- `clipper_id`: `uuid not null references public.profiles(id) on delete restrict`
- `platform`: `text not null check (platform in ('youtube_shorts', 'instagram_reels'))`
- `post_url`: `text not null`
- `post_id_normalised`: `text not null`
- `platform_account_id`: `uuid not null references public.creator_platforms(id) on delete restrict`
- `posted_at`: `timestamptz not null default now()`
- `status`: `text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'removed', 'disqualified'))`
- `reject_reason`: `text`
- `reviewed_by`: `uuid references public.profiles(id) on delete set null`
- `reviewed_at`: `timestamptz`
- `created_at`: `timestamptz not null default now()`
- *Unique Constraint:* `unique(platform, post_id_normalised)`

#### 5. `pr_applications` (Social Media PR Only)
- `id`: `uuid primary key default gen_random_uuid()`
- `campaign_id`: `uuid not null references public.clip_campaigns(id) on delete restrict`
- `creator_id`: `uuid not null references public.profiles(id) on delete restrict`
- `platform_account_id`: `uuid not null references public.creator_platforms(id) on delete restrict`
- `pitch`: `text not null check (char_length(pitch) between 20 and 2000)`
- `quote_inr`: `integer check (quote_inr is null or quote_inr > 0)` (null in fixed pricing mode)
- `status`: `text not null default 'applied' check (status in ('applied', 'accepted', 'rejected', 'withdrawn', 'cancelled'))`
- `created_at`: `timestamptz not null default now()`
- *Unique Constraint:* `unique(campaign_id, creator_id)`

#### 6. `pr_deliverables` (Social Media PR Only)
- `id`: `uuid primary key default gen_random_uuid()`
- `application_id`: `uuid not null unique references public.pr_applications(id) on delete restrict`
- `draft_path`: `text` (Supabase storage path in private bucket `pr-drafts`)
- `draft_status`: `text not null default 'none' check (draft_status in ('none', 'submitted', 'approved', 'changes_requested'))`
- `revision_count`: `integer not null default 0 check (revision_count between 0 and 1)`
- `post_url`: `text`
- `post_id_normalised`: `text`
- `posted_at_submitted`: `timestamptz`
- `live_checks`: `jsonb not null default '[]'::jsonb` (array of daily check records: `{ timestamp, is_live, disclosure_present, checked_by }`)
- `status`: `text not null default 'pending' check (status in ('pending', 'live_verified', 'payable', 'paid', 'failed'))`
- `fail_reason`: `text`
- `locked_at`: `timestamptz`
- `created_at`: `timestamptz not null default now()`
- *Unique Constraint:* `unique(post_id_normalised)`

#### 7. `clip_view_snapshots` (Append-Only, Clipping Only)
- `id`: `uuid primary key default gen_random_uuid()`
- `submission_id`: `uuid not null references public.clip_submissions(id) on delete restrict`
- `views`: `bigint not null check (views >= 0)`
- `likes`: `bigint check (likes >= 0)`
- `comments`: `bigint check (comments >= 0)`
- `source`: `text not null check (source in ('youtube_api', 'admin_verified', 'clipper_reported'))`
- `is_live`: `boolean not null default true`
- `evidence_path`: `text`
- `captured_by`: `uuid references public.profiles(id) on delete set null`
- `captured_at`: `timestamptz not null default now()`

#### 8. `clip_earnings` (Clipping Only)
- `submission_id`: `uuid primary key references public.clip_submissions(id) on delete restrict`
- `verified_views`: `bigint not null default 0`
- `payable_views`: `bigint not null default 0`
- `gross_amount_inr`: `integer not null default 0 check (gross_amount_inr >= 0)`
- `fee_amount_inr`: `integer not null default 0 check (fee_amount_inr >= 0)`
- `net_amount_inr`: `integer not null default 0 check (net_amount_inr >= 0)`
- `status`: `text not null default 'accruing' check (status in ('accruing', 'payable', 'paid', 'void'))`
- `locked_at`: `timestamptz`
- `updated_at`: `timestamptz not null default now()`

#### 9. `clip_wallet_ledger` (Append-Only, Unified for Clipping & PR)
- `id`: `uuid primary key default gen_random_uuid()`
- `profile_id`: `uuid not null references public.profiles(id) on delete restrict`
- `type`: `text not null check (type in ('earning', 'fee', 'payout', 'adjustment', 'reversal', 'fee_reversal'))`
- `amount_inr`: `integer not null check (amount_inr <> 0)` (positive for earnings/fee_reversal, negative for fee/payout/reversal)
- `ref_type`: `text not null check (ref_type in ('clip_submission', 'pr_deliverable', 'payout_request', 'admin_adjustment'))`
- `ref_id`: `uuid not null`
- `note`: `text`
- `created_by`: `uuid references public.profiles(id) on delete set null`
- `created_at`: `timestamptz not null default now()`
- *Unique Constraint:* `unique(type, ref_type, ref_id)`

#### 10. `clip_payout_requests` (Unified for Clipping & PR)
- `id`: `uuid primary key default gen_random_uuid()`
- `profile_id`: `uuid not null references public.profiles(id) on delete restrict`
- `amount_inr`: `integer not null check (amount_inr > 0)`
- `upi_id_encrypted`: `text not null`
- `status`: `text not null default 'requested' check (status in ('requested', 'processing', 'paid', 'failed', 'rejected'))`
- `paid_ref`: `text`
- `paid_at`: `timestamptz`
- `processed_by`: `uuid references public.profiles(id) on delete set null`
- `created_at`: `timestamptz not null default now()`

#### 11. `clip_fraud_flags` (Unified for Clipping & PR)
- `id`: `uuid primary key default gen_random_uuid()`
- `submission_id`: `uuid references public.clip_submissions(id) on delete restrict`
- `deliverable_id`: `uuid references public.pr_deliverables(id) on delete restrict`
- `rule`: `text not null`
- `detail`: `jsonb not null default '{}'::jsonb`
- `status`: `text not null default 'open' check (status in ('open', 'cleared', 'confirmed'))`
- `created_at`: `timestamptz not null default now()`
- *Check Constraint:* `constraint fraud_flags_target_check check ((submission_id is not null and deliverable_id is null) or (submission_id is null and deliverable_id is not null))`

#### 12. `clip_promo_weeks` (Promoted Slots)
- `week_start`: `date primary key` (Monday of the target week)
- `status`: `text not null default 'open' check (status in ('open', 'closed', 'settled'))`
- `bidding_closed_at`: `timestamptz`
- `settled_at`: `timestamptz`
- `created_at`: `timestamptz not null default now()`

#### 13. `clip_promo_bids` (Promoted Slots)
- `id`: `uuid primary key default gen_random_uuid()`
- `week_start`: `date not null references public.clip_promo_weeks(week_start) on delete restrict`
- `campaign_id`: `uuid not null references public.clip_campaigns(id) on delete restrict`
- `owner_id`: `uuid not null references public.profiles(id) on delete restrict`
- `bid_inr`: `integer not null check (bid_inr > 0)`
- `status`: `text not null default 'placed' check (status in ('placed', 'won', 'lost', 'paid', 'forfeited'))`
- `slot_position`: `integer check (slot_position between 1 and 3)`
- `paid_ref`: `text`
- `paid_at`: `timestamptz`
- `created_at`: `timestamptz not null default now()`
- *Unique Constraint:* `unique(week_start, campaign_id)`

#### 14. `admin_actions` (Insert-Only Audit Trail)
- `id`: `uuid primary key default gen_random_uuid()`
- `admin_id`: `uuid not null references public.profiles(id) on delete restrict`
- `action`: `text not null` (e.g., `'approve_campaign'`, `'fund_campaign'`, `'pause_campaign'`, `'remove_campaign'`, `'verify_platform'`, `'verify_followers'`, `'verify_snapshot'`, `'verify_pr_delivery'`, `'resolve_flag'`, `'mark_payout_paid'`, `'mark_payout_failed'`, `'refund_budget'`, `'settle_promo_week'`, `'mark_promo_paid'`)
- `target_type`: `text not null`
- `target_id`: `uuid not null`
- `detail`: `jsonb not null default '{}'::jsonb`
- `created_at`: `timestamptz not null default now()`

#### 15. Storage Buckets & Policies
1. **`clip-evidence` (Private):** Stores clipper native Insights screen recordings for Instagram view audits.
2. **`pr-drafts` (Private):** Stores PR deliverable drafts (video, image, carousel assets) for campaigns requiring owner content approval.
   - *Select/Download Policy:* Creator assigned to the accepted application, campaign owner, or admin (`auth.uid() = creator_id OR auth.uid() = owner_id OR is_admin()`).
   - *Insert/Upload Policy:* Creator assigned to the accepted application (`auth.uid() = creator_id`).
   - *Update/Delete Policy:* Creator while `draft_status in ('none', 'changes_requested')`, or admin.

#### 16. Revenue Query / View (`clip_platform_revenue_view`)
To support invoicing and CA tax reporting, this view aggregates platform fee revenue across both Clipping and Social Media PR:
```sql
create view public.clip_platform_revenue_view with (security_invoker = false) as
select
  c.id as campaign_id,
  c.title as campaign_title,
  c.owner_id,
  c.campaign_type,
  date_trunc('month', c.funded_at) as revenue_month,
  c.owner_fee_inr as owner_fee_earned_inr,
  coalesce(sum(case 
    when l.type = 'fee' then abs(l.amount_inr) 
    when l.type = 'fee_reversal' then -abs(l.amount_inr) 
    else 0 
  end), 0) as creator_fees_earned_inr,
  (c.owner_fee_inr + coalesce(sum(case 
    when l.type = 'fee' then abs(l.amount_inr) 
    when l.type = 'fee_reversal' then -abs(l.amount_inr) 
    else 0 
  end), 0)) as total_platform_fee_inr
from public.clip_campaigns c
left join (
  select id, campaign_id, 'clip_submission' as ref_type from public.clip_submissions
  union all
  select d.id, a.campaign_id, 'pr_deliverable' as ref_type
  from public.pr_deliverables d
  join public.pr_applications a on a.id = d.application_id
) items on items.campaign_id = c.id
left join public.clip_wallet_ledger l on l.ref_id = items.id and l.ref_type = items.ref_type and l.type in ('fee', 'fee_reversal')
where c.status in ('funded', 'live', 'ended')
group by c.id, c.title, c.owner_id, c.campaign_type, c.funded_at, c.owner_fee_inr;
```

---

## 7. Promoted Slots Auction Specification

The Promoted Slots system governs weekly paid placement for the top 3 positions on `/clipping/campaigns` and the hub live strip. All of the following rules are strictly enforced:

1. **Eligibility to Bid:** Only campaigns with status `funded` or `live` whose `ends_at` is beyond the target week can bid.
2. **One Bid Per Campaign:** Exactly one active bid per campaign per week (`unique(week_start, campaign_id)`).
3. **Bid Escalation Only:** An owner can raise their bid up until the Friday 18:00 IST cutoff, but can **never lower or retract it**.
4. **Tie-Breaking Rule:** In the event of identical bid amounts, ties are broken strictly by `created_at ASC` (**the earlier bid wins**).
5. **Pay-Your-Bid:** Winners pay their own submitted bid amount via offline invoice before Monday 00:00 IST; admins confirm payment and record the UTR in `paid_ref`.
6. **Separation from Budget:** The promotional bid is completely separate from the campaign's video clipping budget and is **not shared with clippers**.
7. **No Refunds Once Week Starts:** No refunds are issued once the promotional week commences.
8. **Forfeiture on Status Change:** A paused or removed campaign immediately loses its promoted slot with no refund, unless an admin manually decides otherwise (which must be logged in `admin_actions`).
9. **Confidentiality & Access Control:** Sealed bidding is strictly enforced via Row Level Security (RLS). Bids are readable **only by the bidder and admins**. Other campaign owners cannot see competitor bids.
10. **Settlement & Forfeiture Advance:** If a winning bidder fails to pay by Monday 00:00 IST, their bid is marked `'forfeited'`, and the next highest bidder is automatically advanced into that slot.
11. **Auction Settlement Transaction:** Settle logic executes within an atomic database function utilizing PostgreSQL row locks (`SELECT FOR UPDATE`), logging all state transitions to `admin_actions`.
12. **Feature Flag Control:** Controlled by `PROMO_SLOTS_ENABLED = false`. When disabled, all promotional UI, bidding controls, and tags are hidden.

---

## 8. Risk List & Mitigation Matrix

| Risk Domain | Potential Vulnerability | Technical & Operational Mitigation |
| :--- | :--- | :--- |
| **Copyright & IP** | Brand or creator submits unowned raw footage causing DMCA strikes on clippers. | 1. Mandatory checkbox requiring rights affirmation timestamp (`rights_confirmed_at`).<br>2. Campaign source links restricted to verified channels/folders.<br>3. Admin manual approval required before marking campaign `funded` or `live`.<br>4. Reused Report system with `'copyright'` reason.<br>5. On confirmed claim: campaign removed, unlocked earnings voided, locked earnings honored, unspent budget refund logged in `admin_actions`. |
| **Bot / Fake Views** | Clipper purchases views/bots to inflate counts. | 1. Views counted **once**, on day `VIEW_HOLD_DAYS` (7) post-submission.<br>2. Automated fraud rule flags 10x velocity jumps.<br>3. Zero-engagement views flagged for review.<br>4. Open fraud flags block ledger accrual. |
| **Instagram Verification** | Instagram lacks public view API; scraping violates terms. | 1. Zero scraping policy.<br>2. Clippers upload native Insights screen recordings to private bucket `clip-evidence`.<br>3. Admin verifies against live post within target SLA of 3 working days.<br>4. Unverified clips roll into the next payout cycle; never paid on unverified views. |
| **Budget Depletion** | High-velocity submissions or concurrent quote acceptances exceed campaign budget. | 1. Strict atomic row locks in PostgreSQL (`SELECT FOR UPDATE`) on `clip_campaigns`.<br>2. First-come, first-served by lock time. Payouts capped at remaining budget. Campaign transitions to `'ended'` when budget is exhausted. |
| **Payout Errors** | Duplicate webhook or execution leads to double payouts. | 1. Append-only ledger (`clip_wallet_ledger`). Balance is `SUM(amount_inr)`.<br>2. Idempotency guaranteed via `unique(type, ref_type, ref_id)`.<br>3. Max one open payout request per clipper. |
| **Minors** | Under-18 participation violates contract capacity and DPDP Act. | 1. Server action checks `profiles.date_of_birth <= now() - interval '18 years'`.<br>2. Verified social account required (`creator_platforms`). |
| **Tax & Financial** | Unresolved TDS/GST thresholds. | 1. `CA_SIGNOFF_DONE = false` blocks creating live campaigns in production.<br>2. Earnings function enforces `PER_CLIPPER_ANNUAL_CAP_INR = [FROM CA]`.<br>3. Offline Portfolix bank invoicing with manual audit trail. |
| **PR: Bought Followers** | Page with purchased/fake followers applies for high fixed fees. | 1. Follower count must be verified by admin (`creator_platforms.admin_verified_followers >= 10000`).<br>2. Bio-code account verification proves page ownership.<br>3. Admin checks recent engagement (likes/comments ratio) before approving follower count.<br>4. Follower verification expires after `PR_FOLLOWER_RECHECK_DAYS = 90` and is re-checked before each payout.<br>5. Community reports trigger manual audit. |
| **PR: Undisclosed Ads** | Creator publishes post without ASCI-mandated disclosures, inviting regulatory action. | 1. Campaign requirements mandate platform paid-partnership label plus `#ad` or `#collab`.<br>2. Verified on initial post submission (admin queue or YouTube API).<br>3. Checked daily during the 7-day maturation window.<br>4. If disclosure is missing or removed before Day 7: deliverable fails, slot reopens, zero payout, repeat offenses trigger fraud flags. |
| **PR: Defamation / Smear** | Malicious campaign targets a competitor, brand, or individual with hit-piece posts. | 1. All PR campaigns require admin approval prior to invoicing.<br>2. Banned categories strictly enforced (`political`, `betting`, `crypto_investment`, `health_claims`, `adult`, `defamation`).<br>3. Promoting an individual requires explicit written consent timestamped in `subject_consent_confirmed_at`.<br>4. Fake news formats disguised as investigative journalism are rejected. |
| **PR: Political Misuse** | Political parties or candidates attempt to astroturf election narratives across meme pages. | 1. Zero tolerance for political, election, or legislative advocacy content in `PR_BANNED_CATEGORIES`.<br>2. Admin campaign vetting rejects political content at review.<br>3. Immediate campaign removal, forfeiture of budget, and account suspension if bypassed. |
| **PR: Post Deletion / Archival** | Creator deletes or archives post immediately after getting paid. | 1. Payout is not immediate: fees are held in escrow for `PR_LIVE_DAYS = 7` days.<br>2. Automated/admin daily checks verify post remains public and live.<br>3. Post deleted or archived before Day 7 receives zero payout; slot reopens to another creator.<br>4. Repeat deletions flag the creator's account for permanent suspension. |
| **PR: Owner Non-Payment** | Brand approves deliverables but refuses to pay creators. | 1. 100% upfront escrow: owner must fund the campaign budget + 10% owner fee before the campaign can transition to `live`.<br>2. Admin verifies bank UTR in `funded_ref` and `funded_at`.<br>3. Funds are held safely in Portfolix custody and guaranteed upon verified 7-day delivery. |
| **PR: Creator No-Show** | Creator accepts booking but never submits draft or live post URL. | 1. Deadlines enforced on draft submissions and post publishing.<br>2. If inactive, owner or admin can cancel application; reserved slot and budget immediately return to the campaign.<br>3. Repeat abandonment flags the creator's profile. |

---

## 9. Phased Build Order (Parts 15–18, PR1–PR2)

### Part 15 — Schema, Creator Platforms, Campaign & Submission Flows, Promo Bidding
- **Scope:**
  - Create `lib/config/clipping.ts` reflecting `CLIPPING_CONFIG.md`.
  - Migration for:
    - `creator_platforms` (with bio-code verification)
    - `clip_campaigns` (with `owner_fee_inr` and check constraints)
    - `clip_campaign_members`
    - `clip_submissions`
    - `clip_promo_weeks` & `clip_promo_bids`
    - `admin_actions`
    - `clip_platform_revenue_view`
  - Admin bio-code verification queue for creator platforms (72h code expiry).
  - Server-side zod validators for canonical YouTube Shorts and Instagram Reels URLs.
  - Multi-step campaign creation wizard for brand dashboard (`/dashboard/clipping/campaigns/new`) with live budget math (budget + 10% owner fee = invoice total).
  - Campaign owner promo slot bidding UI (`/dashboard/clipping/campaigns/[id]/promote`).
  - Public campaign discovery board (`/clipping/campaigns`) and detail page (`/clipping/campaigns/[slug]`) displaying net rate first.
  - Clipper campaign join and clip submission modal (`<SubmitClipModal>`).
  - Database-driven daily rate limiting (row counting in server actions).
  - Admin campaign review, funding approval, and promo auction settle dashboard (`/admin/clipping`).
- **Reuse:**
  - `requireAdmin()`, `createSessionClient()`.
  - Profile check and adult DOB gate.
  - `<ReportForm>` extended with `'copyright'` and `'stolen_clip'` reasons.
  - `sendEmail()` for status notifications (submission received, campaign approved).

### Part 16 — View Verification, Single-Count Earnings Engine, Payouts & Anti-Fraud
- **Scope:**
  - Migration for `clip_view_snapshots`, `clip_earnings`, `clip_wallet_ledger` (with `'fee'` and `'fee_reversal'` types), `clip_payout_requests`, `clip_fraud_flags`, and bucket `clip-evidence` with RLS.
  - YouTube Data API v3 snapshot batch worker (`videos.list`).
  - Instagram manual verification queue (3-day target SLA).
  - Single-snapshot earnings lock function run on day 7 post-submission, enforcing `PER_CLIPPER_ANNUAL_CAP_INR`, writing both `'earning'` and `'fee'` ledger rows atomically.
  - Clipper wallet & payout request UI in `/dashboard/clipping` (enforcing `MIN_PAYOUT_INR` against net balance).
  - Admin payout queue with CSV export for bank UPI runs and UTR logging.
  - +10 community points integration on first payable clip.
- **Acceptance Checks:**
  - Running the earnings job twice creates no duplicate ledger rows.
  - Two concurrent earnings calculations cannot push `budget_reserved_inr` above `budget_inr`.
  - A `'clipper_reported'` snapshot alone never produces earnings.
  - A deleted or flagged clip cannot become payable; a reversal restores the budget and nets the wallet to zero for that clip (by atomically inserting `'reversal'` for `-gross` and `'fee_reversal'` for `+fee`).
  - Wallet balance always equals the sum of ledger rows (`SUM(amount_inr)` = `net`).
  - The UPI ID never appears in logs, client bundles, or API responses unmasked.
- **Reuse:**
  - `point_events` ledger pattern.
  - `sendEmail()` for payout confirmation and rejection notices.

### Part PR2 — Social Media PR Campaign Engine (Build After Part 16)
> [!IMPORTANT]
> **Build Sequence:** PR2 is built in a dedicated part **after Part 16 is completed**, because PR directly reuses the wallet, append-only ledger (`clip_wallet_ledger`), payout engine (`clip_payout_requests`), fraud flags (`clip_fraud_flags`), and admin tools from Parts 15–16 without duplicating any code or tables.
- **Scope:**
  - Database Migration:
    - Add PR columns to `clip_campaigns` (`campaign_type`, `deliverable_type`, `fee_per_post_inr`, `slots`, `pricing_mode`, `min_followers`, `max_followers`, `niches`, `cities`, `required_link`, `content_approval_required`, `subject_type`, `subject_consent_confirmed_at`).
    - Add follower verification columns to `creator_platforms` (`admin_verified_followers`, `followers_verified_at`, `followers_verified_by`).
    - Create `pr_applications` and `pr_deliverables` tables with strict RLS and foreign key restrictions (`ON DELETE RESTRICT`).
    - Update `clip_wallet_ledger` ref_type check constraint to include `'pr_deliverable'`.
    - Create private storage bucket `pr-drafts` with RLS policies (creator, owner, admin access only).
    - Database check constraints: PR campaigns require valid deliverable types, slots `>= 1`, min_followers `>= 10000`, fixed mode budget integrity (`budget_inr = fee_per_post_inr * slots`), quote mode budget > 0, and individual consent timestamp before leaving draft.
  - Server Actions (Zod-validated, role-checked, database rate-limited):
    - Create/edit PR campaign.
    - Apply or submit quote (`pitch`, optional `quote_inr`, verified platform handle with `admin_verified_followers >= campaign.min_followers`).
    - Withdraw application.
    - Accept/reject application (atomic database transaction with `SELECT FOR UPDATE` row locks; strictly prevents exceeding slots or funded budget).
    - Upload draft deliverable to `pr-drafts`.
    - Approve draft or request revision (enforcing max `PR_MAX_REVISIONS = 1`).
    - Submit live post URL (enforcing platform account ownership and URL canonicalisation).
    - Admin verify live deliverable and ASCI disclosure.
    - Admin verify creator platform follower counts.
  - Daily Live Verification Job:
    - Daily cron iterating all active deliveries in `pending` or `live_verified` status.
    - Verifies post is still live and disclosure remains intact (YouTube API for Shorts; admin verification queue for Instagram).
    - On Day 7 (`PR_LIVE_DAYS = 7`): marks deliverable `payable` and atomically inserts `'earning'` (`+gross`) and `'fee'` (`-fee`) rows into `clip_wallet_ledger` in one idempotent transaction.
    - Deleted, archived, or disclosure-stripped posts transition to `failed`; campaign slot reopens; repeat offenders receive fraud flags.
  - Member & Admin Dashboards:
    - Owner PR creation wizard (type choice → brief → subject & consent confirmation → pricing mode & slots → requirements → review with budget, 10% fee, invoice total).
    - Owner applicants table (follower counts, platform handle, niche, pitch, quote) with accept/reject controls.
    - Owner draft review interface and delivery tracking status stepper.
    - Creator PR dashboard tab: live applications, draft uploaders, deliverable status tracker, and wallet earnings (net fee displayed first: *"₹X after CIRCLE's 10% fee"*).
    - Admin queues: PR campaign approval (with category & consent validation), follower verification queue (recording observed follower counts), and deliverable verification queue.
  - Feature Flag Switch:
    - Wire `PR_ENABLED` switch: while `false`, all PR routes return 404, PR components are unrendered, and `/clipping` shows clipping only.
- **Acceptance Checks:**
  - A creator with `< 10,000` verified followers, an unverified count, or a count older than `PR_FOLLOWER_RECHECK_DAYS = 90` cannot apply, even if calling the server action directly.
  - Accepting applicants concurrently never exceeds slots or campaign budget.
  - A post deleted, archived, or with disclosure stripped before Day `PR_LIVE_DAYS = 7` is never paid; slot reopens cleanly.
  - Running the daily maturation job twice creates no duplicate ledger rows (idempotent).
  - Campaign owners cannot see applicant contact details (phone, email) before acceptance. Quotes are visible only to the applicant creator, campaign owner, and admins.
  - A campaign in a banned category or promoting an individual without consent cannot leave `pending_review`.
  - With `PR_ENABLED = false`, every PR route returns 404.

### Part 17 — Public Pages, SEO, AEO & GEO Optimization
- **Scope:**
  - Build public pages (factual copy, net rate displayed first, fee breakdown on calculator, no earnings promises):
    - `/clipping` (Unified Hub with live strip, featuring dual pathways: "Clipping — paid per view" and "Social media PR — paid per post (10K+ followers)")
    - `/clipping/social-pr` (**[NEW]** Public PR page: what it is, qualification criteria, fixed fee model, ASCI disclosure rules, banned categories, FAQ)
    - `/clipping/campaigns` (Public discovery board with type filter: `All` · `Clipping` · `Social PR`, with PR cards showing fee per post, slots left, min followers, and platform)
    - `/clipping/campaigns/[slug]` (Adapts seamlessly to campaign type: clipping video submission vs PR application/pitch)
    - `/clipping/how-it-works` (Explains both pipelines: 4-step clipping workflow and 5-step PR workflow)
    - `/clipping/for-brands` (Guides owners to choose: reach at scale per view vs authoritative broadcast on 10K+ pages)
    - `/clipping/calculator` (Interactive gross, 10% fee, and net payout estimator)
    - `/clipping/rules` (ASCI disclosure standards, anti-bot rules, banned PR categories)
    - `/clipping/faq` (Dedicated 14+ question clipping and PR FAQ)
    - `/clipping/guides` & `/clipping/guides/[slug]` (6 original articles)
    - `/clipping/leaderboard` (Monthly verified views and creator rankings)
  - Navigation updates: Header nav item, mobile drawer, footer column, home page sections, and blocks on `/brands`, `/creators`, and `/membership` (with "What CIRCLE earns" section).
  - Build minimal `/admin/page.tsx` index landing page linking all admin modules.
  - SEO & Structured Data: `sitemap.ts` updates, JSON-LD (`FAQPage`, `HowTo`, `Article`, `Organization`, `BreadcrumbList`).
  - GEO & AEO: `public/llms.txt`, direct 40–60 word answer summaries, robots.ts. Skip analytics event instrumentation.
- **Reuse:**
  - `pageMetadata()` and `noIndex` from `lib/seo.ts`.
  - `<LeadForm audience="brand" service_slug="clipping">`.
  - `<OrbitDecor>` for geometric branding.
  - `<Container>` and layout primitives.

### Part 18 — Motion Design, Interactive Visuals & Responsive Verification
- **Scope:**
  - Motion tokens in `lib/motion.ts` (durations, easing, shared variants).
  - Interactive SVG orbit hero on `/clipping`.
  - Scroll-linked 4-step sequence on `/clipping/how-it-works`.
  - Animated budget progress rings and live calculator sliders with ARIA live regions.
  - Viewport verification at 375px and 1440px across all new public pages and dashboard screens (Clipping and PR flows).
  - Accessibility audit (WCAG AA, `prefers-reduced-motion`, touch targets ≥44px).
- **Reuse:**
  - Tailwind v4 theme configuration and CSS variables.
  - Existing Radix/Base-UI modal dialogs and sheets.

---

## 10. Social Media PR Specification

### 10.1 Feature Overlap Audit: Collabs vs Clipping vs Social Media PR
A rigorous audit confirms that Social Media PR introduces zero duplication with either the existing Collabs marketplace or the Video Clipping engine:

| Architecture Dimension | Collabs (`app/collabs`) | Video Clipping (`app/clipping`) | Social Media PR (`app/clipping`) |
| :--- | :--- | :--- | :--- |
| **Relationship Model** | 1 brand ↔ 1 creator (1:1 per brief) | 1 owner ↔ many editors (1:N unbounded) | 1 owner ↔ many established pages (1:N slots) |
| **Payment Flow** | **Off-platform:** Brand pays creator directly. CIRCLE holds zero funds, charges zero fees, and has no escrow. | **In-platform escrow:** Owner funds budget upfront (+10% owner fee). CIRCLE pays clippers via UPI (-10% platform fee). | **In-platform escrow:** Owner funds budget upfront (+10% owner fee). CIRCLE pays creators via UPI (-10% platform fee). |
| **Pricing Unit** | Informational budget (Fixed, Open bid, Barter) | Pay-per-view (₹10–₹200 per 1,000 verified views) | Pay-per-post (Fixed fee or accepted quote per deliverable) |
| **Audience Eligibility** | Open to all registered creators (18+). Self-reported followers. | Open to all registered creators (18+) with verified handle. | Strictly accounts with **≥ 10,000 admin-verified followers** (`PR_MIN_FOLLOWERS = 10000`). |
| **Follower Verification** | Self-reported (optional bio-code verification). | Bio-code verifies account ownership; follower count not gating. | Bio-code verification + **Admin recorded follower count** with 90-day validity window (`PR_FOLLOWER_RECHECK_DAYS = 90`). |
| **Content Approval** | Offline between brand and creator. | No draft approval; clippers edit from approved source footage. | Optional on-platform draft review in `pr-drafts` bucket with max 1 revision (`PR_MAX_REVISIONS = 1`). |
| **Maturation Window** | None. Completed upon mutual agreement. | 7 days post-submission (`VIEW_HOLD_DAYS = 7`) for single view count snapshot. | 7 days live post-submission (`PR_LIVE_DAYS = 7`). Post must remain live, public, and unedited with ad disclosure. |
| **Payout Mechanism** | None inside CIRCLE. | Unified wallet ledger (`clip_wallet_ledger`) and UPI payout queue (`clip_payout_requests`). | Reuses `clip_wallet_ledger` (`ref_type = 'pr_deliverable'`) and `clip_payout_requests`. |
| **Compliance & Oversight**| Basic ASCI disclosure reminder. | ASCI ad disclosure + copyright report system. | ASCI paid-partnership tag + `#ad`/`#collab` mandatory; zero tolerance for banned categories; signed consent for individuals. |

**Audit Conclusion:**
- PR **does not duplicate Collabs**: Collabs is a zero-fee, peer-to-peer connection board where CIRCLE never touches money. PR is a managed, escrow-backed multi-slot campaign engine.
- PR **reuses the Clipping infrastructure**: PR reuses `clip_campaigns`, `creator_platforms`, `clip_wallet_ledger`, `clip_payout_requests`, `clip_fraud_flags`, and `admin_actions`. No secondary ledger or payout system is created.

### 10.2 Campaign Configuration & Product Rules
A Social Media PR campaign allows a brand or verified individual to distribute an announcement, story, or promotion across multiple high-reach pages simultaneously.

- **Campaign Fields:**
  - `campaign_type`: `'social_pr'`
  - `deliverable_type`: `'reel'` | `'post'` | `'carousel'` | `'story'` | `'short'`
  - `pricing_mode`: `'fixed'` (owner sets fee per post) | `'quote'` (creators quote; owner accepts)
  - `fee_per_post_inr`: Required in fixed mode (`check (fee_per_post_inr > 0)`). Null in quote mode.
  - `slots`: Number of pages wanted (`slots >= 1`).
  - `budget_inr`: In fixed mode, exactly equals `fee_per_post_inr * slots`. In quote mode, owner defines total budget ceiling.
  - `owner_fee_inr`: `floor(budget_inr * 10 / 100)`. Portfolix invoices owner for `budget_inr + owner_fee_inr`.
  - `min_followers`: Floor is `PR_MIN_FOLLOWERS = 10000` (cannot be set lower).
  - `max_followers`: Optional upper ceiling.
  - `niches`: Target categories (e.g. `tech`, `business`, `lifestyle`, `memes`, `finance`).
  - `languages`: Target languages (default `['en']`).
  - `cities`: Optional geographical focus (e.g. `['Kochi', 'Bengaluru']`).
  - `required_caption`: Exact text or hooks required in the caption.
  - `required_hashtags`: Array of mandatory hashtags.
  - `required_mention`: Social account to tag/collaborate with.
  - `required_link`: Optional bio or story link.
  - `content_approval_required`: Boolean (`true` = creator must submit draft before posting; `false` = creator posts directly following brief).
  - `subject_type`: `'brand'` | `'individual'`.
  - `subject_consent_confirmed_at`: Mandatory timestamp if `subject_type = 'individual'`.
  - `status`: Follows unified lifecycle: `draft` → `pending_review` → `approved` → `funded` → `live` → `ended`.

### 10.3 Follower Verification Pipeline
To guarantee real reach and prevent fraud, follower counts are never self-reported:
1. **Bio-Code Ownership Check:** Creator links their account in `creator_platforms` and inserts a 6-character verification code into their bio (expires in 72h).
2. **Admin Follower Audit:** A CIRCLE admin inspects the account, verifies the code, audits recent posts for normal engagement (likes/comments ratio to detect bot followers), records the exact follower count in `creator_platforms.admin_verified_followers`, and sets `followers_verified_at = now()`.
3. **90-Day Validity Window:** Follower verifications remain valid for `PR_FOLLOWER_RECHECK_DAYS = 90`. Accounts whose verification is older than 90 days must be re-checked before applying to PR campaigns.
4. **Pre-Payout Check:** The payout batch worker automatically verifies that `followers_verified_at` is within 90 days before releasing UPI payouts.

### 10.4 Budgeting & Reservation Engine
- **Fixed Mode:**
  - `fee_per_post_inr` is fixed (e.g. ₹5,000).
  - `slots` is fixed (e.g. 5 pages).
  - `budget_inr = fee_per_post_inr * slots` (₹25,000).
  - Owner pays invoice of ₹27,500 (₹25,000 budget + ₹2,500 owner fee).
  - When an applicant is accepted, `budget_reserved_inr` increases by `fee_per_post_inr`.
- **Quote Mode:**
  - Owner funds total budget (e.g. ₹50,000) + 10% fee.
  - Creators pitch with a requested `quote_inr`.
  - Owner can accept quotes until `budget_reserved_inr + quote_inr > budget_inr` or `slots` is exhausted.
- **Concurrency Protection:**
  - Acceptance is executed in a PostgreSQL transaction utilizing `SELECT FOR UPDATE` on `clip_campaigns`.
  - Check constraint and transaction logic strictly guarantee that `budget_reserved_inr <= budget_inr` and accepted application count `<= slots`.

### 10.5 Creator Application & Quoting Workflow
1. Creator browses `/clipping/campaigns` filtered by `Social media PR`.
2. Eligibility check: Age 18+, active account, approved `creator_platforms` row with `admin_verified_followers >= campaign.min_followers`, verified within 90 days, no open fraud flags.
3. Creator submits application: selects verified social account, writes a brief pitch (20–2000 chars), and enters `quote_inr` (if quote mode).
4. **Anti-Circumvention Policy:** Campaign owners cannot view applicants' phone numbers or email addresses prior to acceptance. All queries regarding the brief happen on-platform.
5. Owner reviews applicants in dashboard: views handle, verified follower count, niche, pitch, and quote.
6. Owner accepts or declines. Upon acceptance, the slot is reserved, and a `pr_deliverables` record is created.

### 10.6 Content Approval & 1-Round Revision Protocol
If `content_approval_required = true`:
1. Creator uploads draft file (video, image, or text caption) to private Supabase storage bucket `pr-drafts`. `pr_deliverables.draft_status` transitions to `'submitted'`.
2. Campaign owner reviews draft in `/dashboard/clipping/campaigns/[id]`:
   - **Option A (Approve):** `draft_status` transitions to `'approved'`. Creator is notified to publish.
   - **Option B (Request Changes):** Owner provides specific feedback. `draft_status` transitions to `'changes_requested'`. `revision_count` increments to `1`.
3. Creator submits revised draft.
4. **Max Revision Rule:** `PR_MAX_REVISIONS = 1`. Owner cannot request a second revision; owner must either approve the revised draft or cancel the application (reopening the slot).

### 10.7 Post Submission & 7-Day Maturation Engine (`PR_LIVE_DAYS = 7`)
1. **Publishing:** Creator posts the approved deliverable to their verified account.
2. **ASCI Ad Disclosure:** Post must feature the platform's native paid-partnership label (Instagram / YouTube) plus `#ad` or `#collab` in the caption.
3. **Submission:** Creator inputs the public post URL in `/dashboard/clipping`. URL is normalized and validated against `creator_platforms.platform_account_id`.
4. **Live & Disclosure Verification:**
   - For YouTube Shorts: Automated API check verifies video is public, embeddable, and tags are present.
   - For Instagram: Admin queue verifies post is live, matches approved draft, and displays paid partnership tag.
   - Deliverable status transitions to `'live_verified'`.
5. **7-Day Maturation Window:** The post must stay live, public, and unedited for 7 full days (`PR_LIVE_DAYS = 7`).
   - Daily cron job verifies post remains active.
   - If the post is deleted, archived, made private, or disclosure is removed before Day 7: deliverable is marked `'failed'`, creator receives zero payout, campaign budget reservation is restored, slot reopens, and repeat offenses trigger fraud flags.

### 10.8 Ledger & Payout Integration
On Day 7 post-submission, if the post remained live and compliant:
1. Deliverable status transitions to `'payable'`.
2. Atomic database transaction writes two rows to `clip_wallet_ledger`:
   - `'earning'`: `+gross_fee_inr`, `ref_type = 'pr_deliverable'`, `ref_id = pr_deliverables.id`
   - `'fee'`: `-fee_inr` (10%), `ref_type = 'pr_deliverable'`, `ref_id = pr_deliverables.id`
3. Campaign `budget_paid_inr` increments by `gross_fee_inr`, and `budget_reserved_inr` decrements accordingly.
4. Creator wallet balance increases by `net_fee_inr`.
5. Creator withdraws balance via standard UPI payout request when `wallet balance >= MIN_PAYOUT_INR` (₹500).

### 10.9 Banned Categories & Subject Consent Safeguards
To safeguard CIRCLE's brand and community, strict editorial boundaries are enforced at the database and administrative levels:
- **Prohibited Categories (`PR_BANNED_CATEGORIES`):**
  1. *Political & Election:* No party political broadcasts, election campaigns, partisan advocacy, or government policy astroturfing.
  2. *Betting & Gambling:* No real-money gaming, betting apps, casinos, or sports betting tips.
  3. *Crypto & Investment Schemes:* No cryptocurrency tokens, high-yield investment programs (HYIPs), get-rich-quick schemes, or unregulated financial advice.
  4. *Unproven Health Claims:* No medical cures, unregulated supplements, miracle weight-loss formulas, or anti-scientific medical claims.
  5. *Adult Content:* No sexually explicit material, adult dating, or age-restricted adult products.
  6. *Defamation & Smear Campaigns:* No content attacking, defaming, or disparaging any individual, brand, or competitor. No fake news formats masquerading as independent journalism.
- **Subject Consent Verification:**
  - If a campaign promotes an individual (`subject_type = 'individual'`), the owner must confirm written legal consent from that individual.
  - The check constraint `clip_campaigns_subject_consent_check` blocks transitioning out of `draft` until `subject_consent_confirmed_at` is timestamped.

### 10.10 Communication Policy
To prevent circumvention, harassment, and off-platform disputes:
- Campaign owners cannot see creator phone numbers, WhatsApp details, or email addresses prior to accepting an application.
- All pre-acceptance questions about the brief happen via on-platform messaging on the campaign page.
- Post-acceptance, all draft reviews and revision requests are tracked in the dashboard.
- Any attempt to solicit off-platform payment without CIRCLE escrow violates community rules and leads to account suspension.
