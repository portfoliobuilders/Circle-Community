# CIRCLE — Implementation Plan: Part R3 (Sitewide Content Rewrite)

> **Document Status:** Complete & Waiting for User Approval  
> **Role:** Senior Editor, Lead Copywriter & UX Writer for an Indian Creator/Brand Community  
> **Prerequisites:** `AGENTS.md`, `docs/PROJECT_BRIEF.md`, `docs/CLIPPING_PLAN.md`, `docs/REDESIGN_AUDIT.md`, and `docs/REDESIGN_PLAN.md`.  
> **Scope:** Text and copy changes ONLY across all public pages, content files (`lib/content/*`), site metadata (`lib/site.ts`), and SEO tags. **No layout changes** (layout transformations occur in R4a–R4d).

---

## 1. Editorial Vision & Brand Voice

CIRCLE is an invite-free Indian community connecting creators, freelancers, video clippers, and brands. The copy must read like an editorial publication—direct, confident, and factual—never like a boilerplate SaaS template.

### Core Editorial Rules
1. **Outcome-Driven Headlines:** Strictly 3–8 words, verb-first or outcome-first.  
   * *Before:* "Empowering Content Creators and Forward-Thinking Brands Across India"  
   * *After:* "Find collabs. Keep your rates."
2. **Subline Formula:** Exactly one sentence, maximum 20 words.
3. **Section Body Prose Limit:** Maximum 40 words per section (excluding deep guides, legal policies, and FAQ answers).
4. **Verb-First Button Labels:** Buttons must start with an active verb describing the immediate outcome ("Browse campaigns", "Post a collab", "Join CIRCLE", "Filter creators").  
   * *Banned Button Copy:* "Learn more", "Click here", "Get started", "Explore", "Submit".
5. **Radical Truth in Data:**  
   * No invented member counts, fake follower numbers, fake brand logos, or fabricated testimonials.
   * Format all currency as integer INR with Indian numbering commas: `₹1,00,000`, `₹15,000`, `₹1,500` (never decimals `1500.00`).
   * Unconfirmed business details remain clearly labelled as `[PLACEHOLDER]` and are logged in the Owner Questions list.
6. **Tone & Localization:**  
   * Indian English spelling conventions (`monetisation`, `optimisation`, `programmes`).
   * Active voice, second person ("you" / "your"), plain conversational English accessible to non-native speakers.
7. **Absolute Zero Banned Words & Symbols:**  
   * **Banned Buzzwords:** `empower`, `unlock`, `seamless`, `elevate`, `revolutionise`, `revolutionize`, `next-level`, `game-changer`, `game-changing`, `cutting-edge`, `leverage`, `synergy`, `world-class`, `disruptive`, `state-of-the-art`.
   * **Banned Clichés:** `"in today's fast-paced world"`, `"whether you're an X or a Y"`, `"at CIRCLE, we believe"`.
   * **Banned Characters:** Unicode emoji anywhere in UI strings.
   * **Banned Punctuation:** Exclamation marks (`!`) in UI copy, buttons, and navigation.

---

## 2. Factual Reconciliation (The 3 Pillar Truths)

The R1 audit highlighted critical contradictions in how fees and payments were described. R3 strictly enforces the factual truth across all 58 routes and content files:

| Pillar | Factual Rule | Where It Applies | Required Rewrite Pattern |
| :--- | :--- | :--- | :--- |
| **1. Collabs & Marketplace** | **Fixed 10% Platform Fee:** CIRCLE charges a transparent 10% platform fee on collab deals. Brands and creators contract with transparent terms. | `/collabs`, `/collabs/[id]`, `/directory`, Home, `/help` | State clearly: *"10% fixed platform fee on collabs. Creators keep 90% of their deal value."* Never say *"100% free forever"* or *"CIRCLE takes zero fees"*. |
| **2. Membership** | **Free Forever to Join:** Creating an account, joining the community, and listing in the directory has zero subscription fee. | `/membership`, `/join`, `/about`, Nav | State clearly: *"Free membership. No monthly fees, no paywalled directory listings."* |
| **3. Video Clipping** | **Dual-Sided 10% Fee:** Video clipping is an escrowed performance marketplace. CIRCLE retains 10% from locked clipper earnings on Day 7, and invoices a 10% platform service fee on campaign owner budgets. | `/clipping`, `/clipping/campaigns`, `/membership`, `/brands`, `/help` | State clearly: *"Transparent 10% performance fee on clipping earnings upon payout; 10% campaign service fee for brand budgets."* |

---

## 3. SEO, AEO & Metadata Architecture

Search and Answer Engine Optimisation (AEO) requires high-density, factual context that LLMs and web crawlers can extract without fluff:

1. **Title Formula:** `[Outcome / Action] | CIRCLE` (Maximum 60 characters).  
   * Example: `Creator Collabs & Video Clipping | CIRCLE`
2. **Meta Description Formula:** Strictly 120–155 characters summarizing who, what, and how much.  
   * Example: `Join CIRCLE free. Discover verified creator collabs, monetize short-form videos with clipping campaigns, and connect with Indian brands.`
3. **Server-Rendered AEO Anchor Block:** Keep a 40–60 word factual summary in the raw server HTML near the top of key landing pages (`/`, `/collabs`, `/clipping`, `/directory`, `/membership`, `/brands`, `/creators`).

---

## 4. Page-by-Page Rewrite Inventory

### 4.1 Global Shell & System Files
- **`lib/site.ts`**:  
  - Clean `tagline`: *"Find collabs. Keep your rates."*  
  - Clean `description`: Factual 140-character summary.  
  - Clarify operator: *"Operated by Portfolix Enterprise Pvt Ltd, Kochi, India."*
- **`lib/content/faqs.ts`**:  
  - Update *"Is CIRCLE really free?"* to accurately distinguish free collabs/membership from the 10% video clipping fee.  
  - Update *"Does CIRCLE handle payments?"* to explain direct peer-to-peer payments for collabs vs automated ledger payouts for video clipping.  
  - Add 3 dedicated Video Clipping FAQs under a new category `"Video clipping"`.
- **`lib/content/agency-services.ts`**:  
  - Polish all 8 agency service scopes (Influencer marketing, negotiation, social media, ad video production, UGC, profile audit, management) to eliminate developer placeholders and state transparent quote-based scopes.

### 4.2 Batch A: Identity & Onboarding Core
1. **Home (`app/page.tsx` & `components/home/home-page.tsx`)**:  
   - Current Words: ~730 → Target: **≤ 350 words** (≥ 50% cut).  
   - Hero: *"Find collabs. Keep your rates."* + 1 subline.  
   - Primary CTA: *"Join the circle"*.  
   - Replace long paragraphs with punchy benefit labels and step captions.
2. **`/join` (`app/join/page.tsx`)**:  
   - Eliminate developer note (*"The post-signup screen is not built yet"*).  
   - Target: **≤ 110 words**. Primary CTA: *"Select role to register"*.
3. **`/membership` (`app/membership/page.tsx`)**:  
   - Reconcile fee structure into an honest breakdown.  
   - Target: **≤ 150 words**. Primary CTA: *"Join free"*.
4. **`/login` & `/signup` (`app/login/page.tsx`, `app/signup/page.tsx`)**:  
   - Direct, reassuring microcopy with explicit terms notice.

### 4.3 Batch B: Marketplace & Clipping Engine
5. **`/collabs` & `/collabs/new`**:  
   - Clear brief feed intro, filter microcopy, and posting instructions.  
   - Target: **≤ 100 words**. Primary CTA: *"Post a collab"*.
6. **`/collabs/[id]`**:  
   - Structured deliverable labels, ASCI compliance notice, peer-to-peer payment reminder.
7. **`/directory` & `/directory/[id]`**:  
   - Filter labels, verified badges, rate card microcopy.  
   - Target: **≤ 160 words**. Primary CTA: *"Filter creators"*.
8. **`/clipping` (`app/clipping/page.tsx`)**:  
   - Concise hero: *"Turn viral views into cash."* + 1 subline.  
   - Explain Day 7 lock, view verification, and 10% fee clearly.  
   - Target: **≤ 300 words**. Primary CTA: *"Browse campaigns"*.
9. **`/clipping/campaigns` & `[slug]`**:  
   - Streamlined submission instructions, rights confirmation, and payout schedule notice.
10. **`/brands` (`app/brands/page.tsx`)**:  
    - Clear 3-way work model: Self-serve collabs (free), Video clipping (performance), Managed campaigns (quoted).  
    - Target: **≤ 140 words**. Primary CTA: *"Find creators"*.

### 4.4 Batch C: Community, Content & Learning
11. **`/creators` (`app/creators/page.tsx`)**:  
    - Factual growth paths; embed clipping callout. Target: **≤ 160 words**.
12. **`/events` (`app/events/page.tsx`)**:  
    - Remove *"Nothing is scheduled"* plain text; add friendly alert subscription copy. Target: **≤ 80 words**.
13. **`/learn` & `/guides` (`app/learn/page.tsx`, `app/guides/page.tsx`)**:  
    - Topic-driven course track labels and reading times. Target: **≤ 100 words**.
14. **`/journal` (`/blog`, `/news`, `/updates`)**:  
    - Editorial magazine microcopy and category tags.
15. **`/challenges` & `/leaderboard` (`app/challenges/page.tsx`, `app/leaderboard/page.tsx`)**:  
    - Verified event points criteria; remove unverified claims.

### 4.5 Batch D: Support, Operations & Legal
16. **`/about` (`app/about/page.tsx`)**:  
    - Transparent operator disclosure for Portfolix Enterprise Pvt Ltd. Target: **≤ 130 words**.
17. **`/partners`, `/giveaways`, `/affiliates`, `/promoters`**:  
    - Clean partner perk copy, ASCI giveaway guidelines, promoter criteria.
18. **`/help` & `/contact` (`app/help/page.tsx`, `app/contact/page.tsx`)**:  
    - Unified "Help & FAQ" header. Clean support SLAs.
19. **`/guidelines` & `/legal/*` (`terms`, `privacy`, `cookies`, `grievance`)**:  
    - Keep statutory draft notice banner.  
    - Clean up readability without altering legal meaning. Replace unpopulated grievance tags with compliant statutory fallback copy.
20. **404 Page (`app/_not-found.tsx`)**:  
    - Direct, friendly redirection with search and directory shortcuts.

---

## 5. Output Artifact: `docs/CONTENT_CHANGES.md`

Upon execution, we will create `docs/CONTENT_CHANGES.md` containing:
1. Complete table of all 58 pages: Old Word Count → New Word Count (showing percentage reduction).
2. Key facts corrected per page (fees, payment models, operator info).
3. Remaining `[PLACEHOLDER]` tags and why they remain.
4. Final compiled list of questions for the platform owner.

---

## 6. Acceptance Criteria

- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run lint` passes with zero errors and zero warnings.
- [ ] `npm run build` succeeds (all 89 routes generated).
- [ ] Automated regex search for all 15 banned words (`empower`, `unlock`, `seamless`, etc.) returns **0 hits** across `app/`, `components/`, `content/`, and `lib/content/`.
- [ ] Total visible word count on Home (`/`) reduced by **at least 45%** (from 731 to ~330 words).
- [ ] No fake numbers, testimonials, or unauthorized statistics introduced.
