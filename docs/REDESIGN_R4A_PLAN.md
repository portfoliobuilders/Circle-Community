# CIRCLE — Implementation Plan: Part R4a (Global Shell & Identity Core)

> **Document Status:** Complete & Waiting for User Approval  
> **Prepared by:** Senior UI/UX Designer, Senior Motion Designer, Staff Front-End Engineer  
> **Prerequisites:** `AGENTS.md`, `docs/PROJECT_BRIEF.md`, `docs/REDESIGN_PLAN.md` (approved), `docs/REDESIGN_AUDIT.md`, and `docs/REDESIGN_R3_PLAN.md`.  
> **Scope:** Batch R4a (6 pages/areas): Global SiteHeader, Global SiteFooter, MobileNav, Home (`/`), `/join`, and `/membership`.

---

## 1. Batch Scope & Objectives

Batch R4a transforms the core identity and navigation architecture of CIRCLE. We replace SaaS template artifacts (112px tall blurry headers, unbalanced 12-link footer columns, unstyled mobile lists, and repetitive 3-card grids) with the bespoke design system tokens and visual element library built in R2.

### Strict Design System & Motion Guardrails
1. **Header Height & Density:** Desktop header height reduced from 112px (`lg:min-h-28`) to crisp 64px (`h-16`). Background is solid high-contrast `bg-bg/95 border-b border-border` (no `backdrop-blur-md`).
2. **One Lime Button Per Screen Fold:** Electric Lime (`#C6FF00`) is reserved exclusively for the singular primary action on screen (e.g., `Join the circle`). All secondary buttons are dark outline or subtle ghost pills.
3. **Show the Product, Cut the Prose:** Walls of text on the Home page are replaced by `<OrbitScene>`, `<CategoryMarquee>`, and `<UIPreview>` frames rendering real production components.
4. **Motion with Purpose:** Entrances use `<Reveal>` with 12px rise and 60ms stagger. Continuous loops pause automatically off-screen. Full `prefers-reduced-motion` compliance.
5. **Fee Transparency:** Every mention of platform fees accurately reflects the owner decision: **10% fixed platform fee on completed collab deals** and **10% clipping performance fee**, with **free membership**.

---

## 2. Component-by-Component Specifications

### 2.1 SiteHeader (`components/layout/site-header.tsx`)
- **Desktop Dimensions:** Height locked to `h-16` (64px) with `py-0`.
- **Logo:** 40px height lockup on desktop (`/brand/logo-white.png`), 32px circular emblem on mobile (`/brand/emblem-white.png`).
- **Navigation Links:** 6 core links (`Directory`, `Collabs`, `Clipping`, `Events`, `Learn`, `Help`) styled with monospace uppercase subtle accents.
- **Actions:** Secondary outline `Sign in` button + Electric Lime `Join CIRCLE` pill (minimum 44px touch height).

### 2.2 SiteFooter (`components/layout/site-footer.tsx`)
- **Grid Layout:** 4 balanced columns on desktop (1 brand summary column + 3 structured link columns):
  1. *Brand:* White CIRCLE logo lockup, tagline, and operator details (`Portfolix Enterprise Pvt Ltd, Kochi, India`).
  2. *Platform:* Directory, Collabs, Video Clipping, Events, Learn, Help & FAQ.
  3. *Community:* Giveaways, Affiliates, Promoters, Partners, Journal, Resources.
  4. *Legal:* Terms of Service, Privacy Policy, Cookie Policy, Grievance Officer, Community Guidelines.
- **Full-Width Newsletter Strip:** Dedicated full-width banner above the footer base with instant validation.
- **Social Row:** Clean badges for active channels (Instagram, WhatsApp Channel, WhatsApp Community); placeholder channels (`[LINKEDIN_URL]`, `[YOUTUBE_URL]`) stay hidden until provided.

### 2.3 Mobile Navigation (`components/layout/mobile-nav.tsx`)
- Fullscreen mobile sheet with oversized Space Grotesk navigation typography.
- Direct role selector shortcuts (`Join as Creator`, `Join as Brand`, `Join as Video Clipper`).
- Guaranteed 48px touch targets and instant touch feedback.
- Zero horizontal overflow at 375px.

### 2.4 Home Page (`app/page.tsx` & `components/home/home-page.tsx`)
- **New Section Order:**
  1. **Hero Section:** Interactive `<OrbitScene>` SVG + `<StatementLine>` display text (`"Find collabs. Keep your rates."`) + 1 subline + singular primary Lime CTA (`Join the circle`) and secondary outline CTA (`Browse directory`).
  2. **Live Category Marquee:** `<CategoryMarquee>` continuous ticker displaying live creative categories from the brief (Photographers, Videographers, Script Writers, Editors, Studios, Podcast Setups, Models, UGC).
  3. **Marketplace Dual Showcase:** Asymmetric Bento Grid featuring `<UIPreview>` frames of a real mini Collab Card and a mini Clipping Campaign Card side by side.
  4. **How It Works:** `<StepSequence>` with 3 numbered steps (01 Brief, 02 Pitch, 03 Confirm & Disburse) and progressive connecting line.
  5. **Verified Stats Strip:** `<DataRingGroup>` with real integer counts and `<CountUp>` animations.
  6. **Community Moment:** Aspect-ratio locked `<PhotoSlot>` (`[PHOTO: Community Meetup, Kochi]`).
  7. **Frequently Asked Questions:** Curated accordion with schema-valid JSON-LD.
  8. **Final Call to Action:** High-contrast closure with singular lime button.
- **Word Count:** Capped at ≤ 320 words (currently 281 words).

### 2.5 `/join` (`app/join/page.tsx`)
- **New Section Order:**
  1. Statement Header: `"Membership is free"`.
  2. Interactive Role Selector: 2 large cards (`Creator & Video Clipper` vs `Brand`) with instant parameter routing to `/signup?role=creator` or `/signup?role=brand`.
  3. What You Get Bento Grid: 3 asymmetric cells highlighting Collabs (10% fee), Video Clipping (performance payouts), and Free Learning.
  4. Community Channels Strip: WhatsApp Channel & Instagram buttons.
- **Target Word Count:** ≤ 120 words.
- **Single Primary Action:** `Select role to register`.

### 2.6 `/membership` (`app/membership/page.tsx`)
- **New Section Order:**
  1. Statement Header & Subline.
  2. Value Comparison Bento Matrix (Free Community Member vs Video Clipper vs Brand/Agency Client).
  3. Dedicated Fee Transparency Strip (explaining zero subscription fees + 10% platform fee on completed collab deals + 10% performance clipping fee).
  4. Top FAQs Accordion.
- **Target Word Count:** ≤ 160 words.
- **Single Primary Action:** `Join free`.

---

## 3. Verification & Acceptance Plan

- [ ] `npm run typecheck` passes with zero errors.
- [ ] `npm run lint` passes with zero errors and zero warnings.
- [ ] `npm run build` succeeds across all routes.
- [ ] Visual verification at **375px (mobile)** and **1440px (desktop)** for all 6 pages/components.
- [ ] Reduced-motion emulation verification: ambient loops and orbits stop completely; entrances collapse to immediate opacity fades.
- [ ] Lighthouse mobile audits: Performance ≥ 90, Accessibility ≥ 95, SEO = 100 on Home.
- [ ] Commit: `git add -A; git commit -m "Redesign R4a"; git push`.
