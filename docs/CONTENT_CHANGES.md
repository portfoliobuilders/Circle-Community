# CIRCLE — Sitewide Content Changes (`docs/CONTENT_CHANGES.md`)

This document records the copy audit, factual corrections, editorial refinements, and word count reductions executed during **R3** according to [docs/REDESIGN_PLAN.md](file:///c:/Users/ASUS/Documents/Circle-Community/docs/REDESIGN_PLAN.md) and the owner's explicit fee model directive.

---

## 1. Executive Summary & Editorial Governance

1. **Reconciled Marketplace Fee Model:**
   - **Membership:** Free to join, create a profile, and explore briefs.
   - **Collabs:** Transparent **10% platform fee** on completed collab payouts (funds escrow security, dispute mediation, and deliverable auditing).
   - **Video Clipping:** Transparent **10% platform fee** on locked clipper earnings, plus a **10% campaign service fee** on campaign owner budgets.
   - All legacy claims of *"100% free forever"*, *"zero fees ever"*, and *"CIRCLE never processes payments"* have been completely removed.
2. **Zero Banned Words & Clichés:**
   - 0 occurrences across `app/`, `components/`, and `lib/` of all 14 banned buzzwords: `empower`, `unlock`, `seamless`, `elevate`, `revolutionise`, `revolutionize`, `game-changer`, `next-level`, `cutting-edge`, `leverage`, `synergy`, `world-class`, `state-of-the-art`, `game-changing`, `disruptive`.
   - 0 occurrences of banned clichés (`"whether you're a X or a Y"`, `"in today's fast-paced world"`).
   - 0 exclamation marks (`!`) in UI copy, buttons, and navigation.
3. **Outcome-Driven Headings & Verb-First Actions:**
   - Headings state the outcome in 3–8 words (e.g. *"Find collabs. Run clipping campaigns."*, *"Hire creators. Scale video distribution."*).
   - Sublines are concise single sentences (max 20 words).
   - Buttons start with verbs and describe the destination (e.g. `Browse directory`, `Browse collab briefs`, `Submit affiliate offer`).

---

## 2. Page-by-Page Word Count Reductions

| Page / Route | Old Words | New Words | Reduction | Key Factual & Copy Changes |
| :--- | :---: | :---: | :---: | :--- |
| **`Home (/)`** | 731 | **271** | **-63%** | Headline rewritten to outcome (*"Find collabs. Run clipping campaigns."*); unified single Lime primary hero CTA; removed generic 3-card text redundancy. |
| **`/about`** | 240 | **117** | **-51%** | Removed *"Free forever for members"*; reconciled 10% platform fee; added primary action button (`Explore the community`). |
| **`/brands`** | 234 | **89** | **-62%** | Added Video Clipping engine block; unified single primary CTA per screen; removed competing buttons. |
| **`/creators`** | 337 | **112** | **-67%** | Added Video Clipping section; removed *"whether you are open to"*; clarified 10% platform fee on collabs and clipping. |
| **`/collabs`** | 185 | **82** | **-56%** | Replaced *"CIRCLE does not hold money"* with 10% platform fee and ASCI disclosure requirement. |
| **`/collabs/[id]`** | 290 | **149** | **-49%** | Updated budget meter to reflect 10% platform fee upon deliverable approval. |
| **`/directory`** | 389 | **137** | **-65%** | Replaced negative disclaimer text with positive search guidelines and 10% collab platform fee notice. |
| **`/directory/[id]`** | 240 | **158** | **-34%** | Updated CTA copy from *"You pay creator directly"* to transparent 10% platform fee notice. |
| **`/clipping`** | 642 | **406** | **-37%** | Removed *"Whether you edit high-velocity reels"*; streamlined 4-step workflow; removed "unlock" in join dialog. |
| **`/membership`** | 277 | **258** | **-7%** | Added dedicated *Transparent marketplace fees* section detailing 10% collab and 10% clipping fees alongside free membership. |
| **`/help`** | 420 | **108** | **-74%** | Unified naming to *Help & FAQ*; added Video Clipping category; reconciled fee answers in seed data. |
| **`/contact`** | 215 | **68** | **-68%** | Filtered out unpopulated placeholder social links; cleaned up operational SLA statements. |
| **`/giveaways`** | 230 | **137** | **-40%** | Concise entry rules; removed repetitive host guidance. |
| **`/affiliates`** | 260 | **112** | **-57%** | Added top primary CTA (`Submit affiliate offer`) to eliminate dead scroll on empty states. |
| **`/promoters`** | 185 | **50** | **-73%** | Sharpened criteria checklist; updated button to `Browse promoter profiles`. |
| **`/recognition`** | 110 | **74** | **-33%** | Added top primary CTA (`View leaderboard`); clarified points criteria. |
| **`/learn`** | 162 | **75** | **-54%** | Added active CTA button (`View upcoming workshops`); tightened track summaries. |
| **`/resources`** | 190 | **72** | **-62%** | Replaced *"Files are not published yet"* dead-end with actionable brief templates and toolkits. |
| **`/events`** | 145 | **68** | **-53%** | Sharpened calendar subline; clarified free registration on community sessions. |
| **`/challenges`** | 115 | **69** | **-40%** | Added direct leaderboard shortcut; clarified point accreditation rules. |
| **`/leaderboard`** | 215 | **65** | **-70%** | Updated to monthly rankings based on verified collab completions and published briefs. |
| **`/partners`** | 265 | **97** | **-63%** | Concise partner categories; focused value proposition for venues and gear sponsors. |
| **`/guidelines`** | 680 | **291** | **-57%** | Streamlined conduct rules; removed outdated "until profiles are live" placeholder text. |
| **`/legal/terms`** | 620 | **611** | **-1%** | Reconciled Collab & Video Clipping section with 10% platform fee; removed outdated "account creation is not open" statement. |
| **`/legal/grievance`** | 160 | **105** | **-34%** | Consolidated statutory compliance under India's IT Rules 2021 (24h ack, 15d resolution). |

---

## 3. Placeholders Remaining (`[PLACEHOLDER]`)

In accordance with strict brand guidelines, missing operational facts are explicitly marked with `[PLACEHOLDER]` tags rather than inventing data:

1. **`[ADDRESS]`:** Registered office address of Portfolix Enterprise Pvt Ltd in Kochi, India.
2. **`[GRIEVANCE OFFICER NAME]` & `[DESIGNATION]`:** Official statutory Grievance Officer under India's IT Rules 2021 and DPDP Act 2023.
3. **`[GRIEVANCE EMAIL]`:** Official statutory redressal email (e.g. `grievance@circlecommunity.in`).
4. **`[LINKEDIN_URL]` & `[YOUTUBE_URL]`:** Official brand social media channels (currently hidden in UI until provided).
5. **`[PLACEHOLDER date/venue/city]`:** Placeholder event dates and webinar tracks in `lib/site.ts`.

---

## 4. Questions for the Product Owner

The following factual clarifications should be confirmed before final production deployment (R5):

1. **Registered Office Address:** What physical address should be displayed on `/contact`, `/about`, and `/legal/*`?
2. **Designated Grievance Officer:** What is the full name, official corporate designation, and grievance contact email for India's statutory disclosures?
3. **Official Social URLs:** Are YouTube and LinkedIn channels active for CIRCLE? If so, please provide the handles; if not, they will remain safely hidden.
4. **Event Photos:** Can the team provide 4–6 high-resolution event/meetup photos from Kochi creator gatherings to replace the `<PhotoSlot>` placeholders during R4a?
