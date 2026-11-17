# CIRCLE — Clipping Feature Implementation Plan (Parts 15–18)

> **Status:** Revised — Pending Approval  
> **Target Release:** CIRCLE Clipping v1  
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

### 1.2 Open Questions for the Chartered Accountant (CA)
1. **GST Treatment of Dual 10% Fees:**  
   - **Owner Fee (10%):** Does Portfolix raise a tax invoice with 18% GST solely on the 10% owner fee, or on the gross invoice amount (budget + fee)? How is the budget portion treated in Portfolix's books (pure agent / disbursement vs principal)?
   - **Clipper Fee (10%):** How is the 10% platform fee deducted from clippers accounted for under GST? Since clippers are individual unregistered suppliers, does Portfolix have reverse-charge mechanism (RCM) GST obligations?
2. **TDS & Annual Payout Thresholds:**  
   - Under Sections 194R, 194C, or 194J, what is the annual earnings ceiling before Portfolix must collect PAN and deduct TDS?
   - Confirmation of `PER_CLIPPER_ANNUAL_CAP_INR` (enforced in earnings function to stop payouts before reaching TDS limits while PAN collection is omitted).
   - `CA_SIGNOFF_DONE` remains `false` until these items are formalized.

---

## 2. Product Summary (Restated Architecture)

The **CIRCLE Clipping Engine** connects brands and verified creators (campaign owners) with community editors (clippers) to produce and publish vertical short-form video (YouTube Shorts and Instagram Reels).

### Core Operating Loop:
1. **Campaign Creation & Invoicing:**
   - Owner creates a campaign: title, brief, rules, category, language, allowed platforms (`youtube_shorts`, `instagram_reels`), rate per 1,000 views (`10`–`200` INR), total budget, per-clip view cap, optional per-clipper cap, start/end dates, hashtags/mentions/disclosures, and source footage links.
   - Mandatory rights affirmation checkbox timestamped in `rights_confirmed_at`.
   - Portfolix invoices owner for `budget_inr + 10% owner_fee`.
   - Admin marks campaign `funded` (logging bank UTR in `funded_ref` and `funded_at`). Only funded campaigns become public and joinable.
2. **Clipper Joining & Submission:**
   - Clippers must be 18+ and have a verified account in `creator_platforms` for the target platform.
   - Clipper joins campaign, unlocks source links, produces 15–60s vertical clips, posts to their verified channel with required tags and ASCI disclosure, and submits the post URL.
3. **Moderation:**
   - Owner or admin reviews the submission against the brief (`approved` or `rejected` with reason).
4. **Single-Snapshot View Verification:**
   - Exactly 7 days (`VIEW_HOLD_DAYS`) after submission to CIRCLE, the clip's views are verified:
     - **YouTube Shorts:** Automated batch query to YouTube Data API v3 (`videos.list`).
     - **Instagram Reels:** Clipper uploads native Insights screen recording to private bucket `clip-evidence`. Admin verifies against live post (3-day target SLA).
5. **Earnings Calculation & Double Ledger Row:**
   - If live and views `>= min_views_to_qualify`:
     - `payable_views = min(verified_views, per_clip_view_cap)`
     - `gross = floor(payable_views / 1000 * rate_inr_per_1k)`
     - `fee = floor(gross * 10 / 100)`
     - `net = gross - fee`
   - Subject to remaining campaign budget and annual clipper cap.
   - Atomic database transaction writes two ledger rows: `'earning'` (`+gross`) and `'fee'` (`-fee`).
6. **UPI Payouts:**
   - Clipper requests payout when net wallet balance `>= MIN_PAYOUT_INR` (default: ₹500).
   - Admin batch-pays via UPI banking, logs UTR in `clip_payout_requests`, and writes to `admin_actions`.

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
| `/admin` (`app/admin/page.tsx`) | Admin | **[NEW] Minimal admin index page linking all admin modules** | NO (`robots: noIndex`) |
| `/admin/messages` | Admin | Review contact form submissions and update ticket status | NO (`robots: noIndex`) |
| `/admin/faqs` | Admin | FAQ authoring and publishing editor | NO (`robots: noIndex`) |
| `/admin/events` | Admin | Event scheduling and publisher form | NO (`robots: noIndex`) |
| `/admin/challenges` | Admin | Platform challenge creator | NO (`robots: noIndex`) |
| `/auth/callback` (`route.ts`) | System | Supabase OAuth & magic link callback route handler | NO (API endpoint) |

### 3.2 Audit of Fee Claims & Required Text Updates Across the Site

To comply with the new fee policy (*"Free to join. CIRCLE keeps 10% of clip earnings."*), the following files and locations will be adjusted in Parts 15 & 17:

1. **`docs/PROJECT_BRIEF.md` (Lines 36–37, 45):**  
   - *Current text:* "No payments processed in v1. Collab budgets are displayed; payment happens directly between parties."  
   - *Update:* Keep this rule intact for Collabs, but append: *"For Video Clipping only, brands fund campaigns upfront to Portfolix (+ 10% owner fee), and Portfolix pays clippers via UPI with a 10% platform fee deducted on locked clip earnings."*
2. **`app/membership/page.tsx` (Lines 30–36, 58–65, 86–92):**  
   - In "What CIRCLE will never charge you for": retain *"Joining clipping campaigns and submitting clips"*.
   - In "Common questions": update FAQ excerpt to explain that membership, collabs, and community events are free, while clipping earnings carry a 10% platform fee upon lock.
   - Add new section: **"What CIRCLE earns"**: *"Free to join. For video clipping campaigns, CIRCLE charges campaign owners a 10% service fee on their budget, and retains a 10% platform fee from clippers' locked earnings to cover view verification, fraud prevention, and UPI payout administration."*
3. **`lib/content/faqs.ts` & `app/help/page.tsx`:**  
   - FAQ "Is CIRCLE really free?": Clarify that joining CIRCLE, directory listings, and brand collabs are 100% free of platform commissions; clipping campaigns carry a transparent 10% platform fee on locked earnings.
   - Clipping FAQs: Add explicit Q&A: *"What fees does CIRCLE charge for clipping?"* -> *"Free to join and submit. CIRCLE retains 10% of locked clip earnings, and charges campaign owners a 10% service fee on campaign budgets."*
4. **Planned Clipping Pages (`/clipping`, `/clipping/for-brands`, `/clipping/calculator`, `/clipping/rules`, `/clipping/faq`):**  
   - Replace any draft references to "zero fees for clippers" with *"Free to join. CIRCLE keeps 10% of clip earnings."*
   - Display net rate prominently: *"₹X per 1,000 views after CIRCLE's 10% fee (Gross: ₹Y)"*.
   - Calculator displays: Gross Earnings, CIRCLE 10% Fee, Net Payout.

---

## 4. Sitemap Diff

```
CURRENT SITEMAP                                     PROPOSED SITEMAP (with Clipping)
==============================================      ==============================================
/                                                   /
├── /about                                          ├── /about
├── /brands                                         ├── /brands                             [CHANGED: added Clipping block]
│   └── /brands/services/[slug]                     │   └── /brands/services/[slug]
├── /creators                                       ├── /creators                           [CHANGED: added Clipping block]
│   └── /creators/services/[slug]                   │   └── /creators/services/[slug]
├── /directory                                      ├── /directory
│   └── /directory/[id]                             │   └── /directory/[id]
├── /collabs                                        ├── /collabs
│   ├── /collabs/new                                │   ├── /collabs/new
│   └── /collabs/[id]                               │   └── /collabs/[id]
│                                                   ├── /clipping                           [NEW: Hub - hero, overview, live strip]
│                                                   │   ├── /clipping/campaigns             [NEW: Public discovery & filter board]
│                                                   │   │   └── /clipping/campaigns/[slug]  [NEW: Campaign brief, terms & submission]
│                                                   │   ├── /clipping/how-it-works          [NEW: 4-step dual workflow guide]
│                                                   │   ├── /clipping/for-brands            [NEW: Brand workflow, budgeting & lead form]
│                                                   │   ├── /clipping/calculator            [NEW: Interactive gross/fee/net estimator]
│                                                   │   ├── /clipping/rules                 [NEW: Anti-bot, ASCI disclosure, copyright]
│                                                   │   ├── /clipping/faq                   [NEW: Dedicated 14+ question clipping FAQ]
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
├── /help                                           ├── /help                               [CHANGED: added Clipping FAQ category]
├── /contact                                        ├── /contact
├── /guidelines                                     ├── /guidelines
├── /legal/*                                        ├── /legal/*
├── /join, /login, /signup                          ├── /join, /login, /signup
├── /dashboard                                      ├── /dashboard
│   └── /dashboard/settings                         │   ├── /dashboard/settings
│                                                   │   ├── /dashboard/clipping             [NEW: Clipper dashboard - tabs & payouts]
│                                                   │   └── /dashboard/clipping/campaigns   [NEW: Owner dashboard - create, bids & manage]
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
   - *Offerings Grid:* Add `"Video clipping"` with description: *"Edit short clips from approved source videos for YouTube Shorts and Instagram Reels. Earn per 1,000 verified views."* linking to `/clipping`.
   - *Editorial Section:* Add section below collabs titled *"Clip. Post. Get paid per view."*, detailing the 4-step workflow, linking to `/clipping/campaigns` and `/clipping/for-brands`.
3. **For Brands Page (`app/brands/page.tsx`):**  
   Insert a section before agency services titled *"Launch a Clipping Campaign"*. Explains how brands can commission vertical edits from long-form video, set a budget cap, and pay only on verified view counts (+ 10% owner fee). CTA: `Learn about clipping campaigns` (`/clipping/for-brands`).
4. **For Creators Page (`app/creators/page.tsx`):**  
   Insert a section before creator services titled *"Video Clipping"*. Explains how creators can join live campaigns, edit vertical clips from approved footage, and receive weekly UPI payouts based on verified views (net after 10% platform fee). CTA: `Explore live campaigns` (`/clipping/campaigns`).
5. **Membership Page (`app/membership/page.tsx`):**  
   - Add to `neverCharge`: *"Joining clipping campaigns and submitting clips"*.
   - Add new section **"What CIRCLE earns"** detailing the 10% owner fee and 10% clipper fee on locked earnings.
6. **Help Center (`app/help/page.tsx` & `lib/content/faqs.ts`):**  
   - Add `'Clipping'` to `faqCategories`.
   - Seed clipping Q&As explaining view counting, verification, the 10% fee, and UPI payouts.
7. **Site Footer (`components/layout/site-footer.tsx`):**  
   Add `Clipping` to `supportNav` in `lib/site.ts` in the *"Explore"* column.

---

## 6. Complete Data Model Specification

```
                     ┌──────────────────┐
                     │     profiles     │
                     └─────────┬────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │ 1:N (owner)      │ 1:N (clipper)    │ 1:N (clipper)
            │ (RESTRICT)       │ (RESTRICT)       │ (CASCADE)
            ▼                  ▼                  ▼
  ┌──────────────────┐ ┌────────────────┐ ┌────────────────────┐
  │  clip_campaigns  │ │  clip_campaign │ │ creator_platforms  │
  └─────────┬────────┘ │    _members    │ └─────────┬──────────┘
            │          └────────────────┘           │
            │ 1:N (RESTRICT)                        │ 1:N (RESTRICT)
            ▼                                       │
  ┌─────────────────────────────────────────────────┴─┐
  │                  clip_submissions                 │
  └─────────────────────────┬─────────────────────────┘
                            │
            ┌───────────────┼───────────────┬────────────────┐
            │ 1:N (RESTRICT)│ 1:1 (RESTRICT)│ 1:N (RESTRICT) │ 1:N (RESTRICT)
            ▼               ▼               ▼                ▼
┌──────────────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────────┐
│ clip_view_snapshots  │ │clip_earnings│ │clip_wallet  │ │clip_fraud_flags│
└──────────────────────┘ └─────────────┘ │   _ledger   │ └────────────────┘
                                         └──────┬──────┘
                                                │ 1:N (RESTRICT)
                                                ▼
                                    ┌──────────────────────┐
                                    │ clip_payout_requests │
                                    └──────────────────────┘

       PROMOTED SLOTS TABLES:
┌──────────────────────┐           ┌──────────────────────┐
│   clip_promo_weeks   │─── 1:N ──▶│   clip_promo_bids    │
└──────────────────────┘           └──────────────────────┘
```

> **Retention & Cascade Rule:**  
> Financial and audit integrity strictly prohibits `ON DELETE CASCADE` from `profiles` or `clip_campaigns` onto `clip_submissions`, `clip_view_snapshots`, `clip_earnings`, `clip_wallet_ledger`, `clip_payout_requests`, or `clip_fraud_flags`. `ON DELETE RESTRICT` is enforced. Account deletion anonymises the profile record while preserving immutable financial audit rows.

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
- `created_at`: `timestamptz not null default now()`
- *Partial Unique Index:* `create unique index creator_platforms_verified_unique on public.creator_platforms(platform, handle) where verified = true;`

#### 2. `clip_campaigns`
- `id`: `uuid primary key default gen_random_uuid()`
- `slug`: `text not null unique check (char_length(slug) between 3 and 100)`
- `owner_id`: `uuid not null references public.profiles(id) on delete restrict`
- `title`: `text not null check (char_length(title) between 4 and 120)`
- `summary`: `text not null check (char_length(summary) <= 200)`
- `brief_md`: `text not null`
- `rules_md`: `text not null`
- `category`: `text not null`
- `language`: `text not null default 'en'`
- `source_links`: `jsonb not null default '[]'::jsonb`
- `asset_folder_url`: `text`
- `platforms`: `text[] not null check (platforms <@ array['youtube_shorts', 'instagram_reels']::text[])`
- `rate_inr_per_1k`: `integer not null check (rate_inr_per_1k between 10 and 200)`
- `budget_inr`: `integer not null check (budget_inr > 0)`
- `owner_fee_inr`: `integer not null default 0 check (owner_fee_inr >= 0)` (10% of budget_inr)
- `budget_reserved_inr`: `integer not null default 0 check (budget_reserved_inr >= 0 and budget_reserved_inr <= budget_inr)`
- `budget_paid_inr`: `integer not null default 0 check (budget_paid_inr >= 0 and budget_paid_inr <= budget_inr)`
- `per_clip_view_cap`: `integer not null check (per_clip_view_cap >= 1000)`
- `per_clipper_cap_inr`: `integer check (per_clipper_cap_inr is null or per_clipper_cap_inr > 0)`
- `min_views_to_qualify`: `integer not null default 1000 check (min_views_to_qualify >= 0)`
- `required_caption`: `text`
- `required_hashtags`: `text[] not null default '{}'::text[]`
- `required_mention`: `text`
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

#### 3. `clip_campaign_members`
- `campaign_id`: `uuid not null references public.clip_campaigns(id) on delete restrict`
- `profile_id`: `uuid not null references public.profiles(id) on delete restrict`
- `joined_at`: `timestamptz not null default now()`
- `status`: `text not null default 'active' check (status in ('active', 'removed'))`
- *Primary Key:* `(campaign_id, profile_id)`

#### 4. `clip_submissions`
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

#### 5. `clip_view_snapshots` (Append-Only)
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

#### 6. `clip_earnings`
- `submission_id`: `uuid primary key references public.clip_submissions(id) on delete restrict`
- `verified_views`: `bigint not null default 0`
- `payable_views`: `bigint not null default 0`
- `gross_amount_inr`: `integer not null default 0 check (gross_amount_inr >= 0)`
- `fee_amount_inr`: `integer not null default 0 check (fee_amount_inr >= 0)`
- `net_amount_inr`: `integer not null default 0 check (net_amount_inr >= 0)`
- `status`: `text not null default 'accruing' check (status in ('accruing', 'payable', 'paid', 'void'))`
- `locked_at`: `timestamptz`
- `updated_at`: `timestamptz not null default now()`

#### 7. `clip_wallet_ledger` (Append-Only)
- `id`: `uuid primary key default gen_random_uuid()`
- `profile_id`: `uuid not null references public.profiles(id) on delete restrict`
- `type`: `text not null check (type in ('earning', 'fee', 'payout', 'adjustment', 'reversal', 'fee_reversal'))`
- `amount_inr`: `integer not null check (amount_inr <> 0)` (positive for earnings/fee_reversal, negative for fee/payout/reversal)
- `ref_type`: `text not null check (ref_type in ('clip_submission', 'payout_request', 'admin_adjustment'))`
- `ref_id`: `uuid not null`
- `note`: `text`
- `created_by`: `uuid references public.profiles(id) on delete set null`
- `created_at`: `timestamptz not null default now()`
- *Unique Constraint:* `unique(type, ref_type, ref_id)`

#### 8. `clip_payout_requests`
- `id`: `uuid primary key default gen_random_uuid()`
- `profile_id`: `uuid not null references public.profiles(id) on delete restrict`
- `amount_inr`: `integer not null check (amount_inr > 0)`
- `upi_id_encrypted`: `text not null`
- `status`: `text not null default 'requested' check (status in ('requested', 'processing', 'paid', 'failed', 'rejected'))`
- `paid_ref`: `text`
- `paid_at`: `timestamptz`
- `processed_by`: `uuid references public.profiles(id) on delete set null`
- `created_at`: `timestamptz not null default now()`

#### 9. `clip_fraud_flags`
- `id`: `uuid primary key default gen_random_uuid()`
- `submission_id`: `uuid not null references public.clip_submissions(id) on delete restrict`
- `rule`: `text not null`
- `detail`: `jsonb not null default '{}'::jsonb`
- `status`: `text not null default 'open' check (status in ('open', 'cleared', 'confirmed'))`
- `created_at`: `timestamptz not null default now()`

#### 10. `clip_promo_weeks` (Promoted Slots)
- `week_start`: `date primary key` (Monday of the target week)
- `status`: `text not null default 'open' check (status in ('open', 'closed', 'settled'))`
- `bidding_closed_at`: `timestamptz`
- `settled_at`: `timestamptz`
- `created_at`: `timestamptz not null default now()`

#### 11. `clip_promo_bids` (Promoted Slots)
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
- *Unique Constraint:* `unique(week_start, campaign_id)` (one active bid per campaign per week; owner can raise until close, never lower)

#### 12. `admin_actions` (Insert-Only Audit Trail)
- `id`: `uuid primary key default gen_random_uuid()`
- `admin_id`: `uuid not null references public.profiles(id) on delete restrict`
- `action`: `text not null` (e.g., `'approve_campaign'`, `'fund_campaign'`, `'pause_campaign'`, `'remove_campaign'`, `'verify_platform'`, `'verify_snapshot'`, `'resolve_flag'`, `'mark_payout_paid'`, `'mark_payout_failed'`, `'refund_budget'`, `'settle_promo_week'`, `'mark_promo_paid'`)
- `target_type`: `text not null`
- `target_id`: `uuid not null`
- `detail`: `jsonb not null default '{}'::jsonb`
- `created_at`: `timestamptz not null default now()`

#### 13. Revenue Query / View (`clip_platform_revenue_view`)
To support invoicing and CA tax reporting, this view calculates platform fee revenue:
```sql
create view public.clip_platform_revenue_view with (security_invoker = false) as
select
  c.id as campaign_id,
  c.title as campaign_title,
  c.owner_id,
  date_trunc('month', c.funded_at) as revenue_month,
  c.owner_fee_inr as owner_fee_earned_inr,
  coalesce(sum(case 
    when l.type = 'fee' then abs(l.amount_inr) 
    when l.type = 'fee_reversal' then -abs(l.amount_inr) 
    else 0 
  end), 0) as clipper_fees_earned_inr,
  (c.owner_fee_inr + coalesce(sum(case 
    when l.type = 'fee' then abs(l.amount_inr) 
    when l.type = 'fee_reversal' then -abs(l.amount_inr) 
    else 0 
  end), 0)) as total_platform_fee_inr
from public.clip_campaigns c
left join public.clip_submissions s on s.campaign_id = c.id
left join public.clip_wallet_ledger l on l.ref_id = s.id and l.ref_type = 'clip_submission' and l.type in ('fee', 'fee_reversal')
where c.status in ('funded', 'live', 'ended')
group by c.id, c.title, c.owner_id, c.funded_at, c.owner_fee_inr;
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
| **Budget Depletion** | High-velocity submissions exceed campaign budget. | 1. Strict atomic row locks in PostgreSQL (`SELECT FOR UPDATE`) on `clip_campaigns`.<br>2. First-come, first-served by lock time. Payouts capped at remaining budget. Campaign transitions to `'ended'` when budget is exhausted. |
| **Payout Errors** | Duplicate webhook or execution leads to double payouts. | 1. Append-only ledger (`clip_wallet_ledger`). Balance is `SUM(amount_inr)`.<br>2. Idempotency guaranteed via `unique(type, ref_type, ref_id)`.<br>3. Max one open payout request per clipper. |
| **Minors** | Under-18 participation violates contract capacity and DPDP Act. | 1. Server action checks `profiles.date_of_birth <= now() - interval '18 years'`.<br>2. Verified social account required (`creator_platforms`). |
| **Tax & Financial** | Unresolved TDS/GST thresholds. | 1. `CA_SIGNOFF_DONE = false` blocks creating live campaigns in production.<br>2. Earnings function enforces `PER_CLIPPER_ANNUAL_CAP_INR = [FROM CA]`.<br>3. Offline Portfolix bank invoicing with manual audit trail. |

---

## 9. Phased Build Order (Parts 15–18)

### Part 15 — Schema, Creator Platforms, Campaign & Submission Flows, Promo Bidding
- **Scope:**
  - Create `lib/config/clipping.ts` reflecting `CLIPPING_CONFIG.md`.
  - Migration for:
    - `creator_platforms`
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

### Part 17 — Public Pages, SEO, AEO & GEO Optimization
- **Scope:**
  - Build public pages (factual copy, net rate displayed first, fee breakdown on calculator, no earnings promises):
    - `/clipping` (Hub with live strip, featuring Promoted slots when enabled)
    - `/clipping/how-it-works`
    - `/clipping/for-brands` (with lead capture form)
    - `/clipping/calculator` (calculating gross, 10% fee, net earnings)
    - `/clipping/rules`
    - `/clipping/faq`
    - `/clipping/guides` & `/clipping/guides/[slug]` (6 original articles)
    - `/clipping/leaderboard`
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
  - Viewport verification at 375px and 1440px across all new public pages.
  - Accessibility audit (WCAG AA, `prefers-reduced-motion`, touch targets ≥44px).
- **Reuse:**
  - Tailwind v4 theme configuration and CSS variables.
  - Existing Radix/Base-UI modal dialogs and sheets.
