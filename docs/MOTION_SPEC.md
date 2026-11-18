# CIRCLE — Motion Specification & Component Architecture (M1)

> **Document Status:** Complete & Waiting for Approval  
> **Authors:** Senior UI/UX Designer, Senior Motion Designer, Staff Front-End Engineer  
> **Prerequisites:** `AGENTS.md`, `docs/PROJECT_BRIEF.md`, `docs/REDESIGN_AUDIT.md`, `docs/REDESIGN_PLAN.md`, `docs/THIRD_PARTY.md`  
> **Scope:** Defines the single animation runtime, physics tokens, picked component inventory, banned effects, shared-element transition architecture, page-by-page motion map, and performance budget for CIRCLE.

---

## 1. Executive Summary & Engine Decision

The audit in `docs/REDESIGN_AUDIT.md` exposed two conflicting extremes: raw production pages resemble a static wireframe of bordered rectangular text boxes (85%–95% text ratio), while experimental sections like `/clipping` relied on unpaused infinite SVG spinners and performance-heavy glassmorphism (`backdrop-blur-md`).

Motion at CIRCLE is not visual decoration or entertainment. It is **spatial clarification, feedback, and mechanical explanation**. It answers three specific questions for the user:
1. *Where did this element come from?* (Spatial context & hierarchy)
2. *Did the system register my action?* (Tactile micro-feedback)
3. *How do these parts connect?* (Marketplace mechanics & data relationships)

### 1.1 The Single Engine: Motion (`motion`)
- **Runtime Choice:** `motion` (React 19 native entrypoint via `motion/react`, v12+).
- **Architecture:** All animations sitewide run on the modern `motion` package. It provides native React 19 concurrent mode compatibility, layout projection (`layout`, `layoutId`), spring physics, gesture handling, scroll timeline binding (`useScroll`), and accessibility hooks (`useReducedMotion`).
- **Shared Source:** All picked components from third-party libraries (`uselayouts`, `animate-ui`, `reactbits`) are copied as raw source and refactored to consume `motion/react`.

### 1.2 Evaluation & Rejection of Secondary Engine (Anime.js)
The M1 prompt allows Anime.js strictly for a named effect that Motion cannot execute well (such as complex SVG path morphing with unequal vertex counts). We evaluated Anime.js against CIRCLE's visual element requirements:
- `<OrbitScene>`: Requires concentric orbital ring rotations, node hover translation, and subtle 3D perspective tilt. Motion handles this with hardware-accelerated `motion.div` and `useMotionValue` springs.
- `<ConnectionGraph>`: Requires progressive line-drawing between node coordinates. Motion executes this with `motion.path` and `pathLength: 0` to `pathLength: 1` using native SVG stroke dash projection.
- `<DataRingGroup>` / `<ProgressRing>`: Circular dashoffset progression is natively handled by `motion.circle` and `strokeDashoffset`.
- Badge/Icon Morphs: Done with clean cross-fade or rotation within `<AnimatePresence>` or spring icon transforms.

**Verdict: Anime.js is NOT included.** Motion natively satisfies 100% of CIRCLE's geometric line-drawing, SVG path tracking, and orbital mechanics. Loading Anime.js would add ~17KB gzipped and force visitors to download two separate animation runtimes. CIRCLE remains strictly a **single-engine** architecture.

### 1.3 Strictly Banned Animation Runtimes
The following dependencies are completely prohibited from being installed or imported:
- **GSAP / ScrollTrigger:** Proprietary licensing conflicts, heavy runtime overhead (~60KB+), unnecessary DOM-direct manipulation that clashes with React 19 reconciliation.
- **Three.js / React Three Fiber / OGL / Spline:** Massive bundle footprint (150KB–600KB+), battery drain on mobile, accessibility barriers, and inherently SaaS-generic.
- **Lottie / DotLottie:** Bloated JSON animation runtimes that introduce third-party illustration styles conflicting with CIRCLE's editorial geometry.
- **Canvas / WebGL Background Engines:** Banned under the anti-AI-template mandate.

---

## 2. Motion Design Tokens & Physics System (`lib/motion.ts`)

All motion components must import timings, curves, and spring parameters from a centralized `lib/motion.ts` module. Hard-coded durations or arbitrary CSS transition strings in component files are strictly banned.

### 2.1 Duration Tokens
| Token Name | Value | Use Case |
| :--- | :---: | :--- |
| `duration.instant` | `0ms` | Reduced motion active; instant responsive layout snapping. |
| `duration.fast` | `150ms` | Micro-interactions: button press, toggle flick, chip active state, icon morph, tooltip fade. |
| `duration.base` | `250ms` | UI state changes: dropdown menus, dialog popover, tab content cross-fade, accordion expand. |
| `duration.slow` | `450ms` | Viewport entrances: card reveals, section entry, SVG path line drawing, budget ring fills. |
| `duration.story` | `800ms` | Hero initialization: `<OrbitScene>` entrance, editorial chapter title reveals. |

### 2.2 Easing Curves (Cubic Bézier)
CIRCLE uses two curves for CSS/tween transitions:
```ts
export const easings = {
  // Snappy arrival: fast deceleration with a crisp stop. Never overshoots.
  entrance: [0.16, 1, 0.3, 1] as const, // cubic-bezier(0.16, 1, 0.3, 1)

  // Accelerating departure: quick, unobtrusive exit from the screen.
  exit: [0.7, 0, 0.84, 0] as const,     // cubic-bezier(0.7, 0, 0.84, 0)
};
```

### 2.3 Spring Configurations
Spring physics are used for tactile micro-interactions and layout transitions to avoid robotic linear movement:
```ts
export const springs = {
  // UI Micro-interactions: high stiffness, critically damped. Snappy and tactile, zero wobble.
  micro: {
    type: "spring" as const,
    stiffness: 400,
    damping: 28,
    mass: 1,
  },

  // Layout & Shared Elements (layoutId): smooth spatial transitions between cards and detail containers.
  layout: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 1,
  },

  // Magnetic Pull (Desktop primary buttons only): elastic resistance that returns immediately to center.
  magnetic: {
    type: "spring" as const,
    stiffness: 250,
    damping: 18,
    mass: 0.5,
  },
};
```

### 2.4 Stagger & Spatial Limits
- **Stagger Cadence:** `60ms` (`0.06s`) between successive child items in lists, navigation drawers, and bento grids.
- **Maximum Distance:** Entrances move a maximum of **12px** vertically (`y: 12` → `y: 0`). Large 40px–100px flying transforms are banned because they induce visual disorientation and layout instability.
- **Button Press Scale:** Exactly `0.98` (`scale: 0.98`). Deep shrinking (`scale: 0.90`) feels cartoonish and unstable.
- **Magnetic Displacement:** Maximum **4px** displacement from button center on desktop pointer hover (`maxPull = 4`). Completely disabled on touch screens.

---

## 3. Universal Motion Rules & Guardrails

1. **Hardware-Accelerated Properties Only:** Animate `transform` (translate, scale, rotate) and `opacity` only. Never animate `height`, `width`, `margin`, `padding`, `top`, `left`, or `border-width` with standard tweens. Height expansion for accordions and drawers must use Motion's internal layout projection (`layout="position"` or layout size projection).
2. **Intent-Driven Motion:** Every animation must have a direct explanatory purpose:
   - *State change:* Informing the user an item was added, filtered, or expanded.
   - *Spatial hierarchy:* Showing where a modal or drawer lives relative to the triggering button.
   - *Feedback:* Confirming a touch or click was registered within 50ms.
3. **Single Hero Focus Rule:** Max **one** attention-grabbing animation per viewport. If a hero section features `<OrbitScene>`, headlines and secondary CTAs use standard static or quiet fade-in. No competing movement.
4. **Single-Run Entrances:** All viewport-triggered reveals must run **once only** (`viewport: { once: true }`). Never re-trigger entrance animations when a user scrolls up and down a page.
5. **Off-Screen Pause:** Continuous ambient loops (such as `<OrbitScene>` orbital rings or `<CategoryMarquee>`) must disconnect or pause immediately when outside the active viewport using `useInView({ margin: "0px" })`.
6. **Focus & Keyboard Parity:** Every animation triggered by `:hover` must trigger identically on `:focus-visible`. Users navigating via keyboard or switch control must receive the same visual feedback.
7. **Touch Parity:** Touch devices get zero hover-only disclosures. All cards, rates, tooltips, and badges must display their critical information statically on touch screens without requiring a hover state.
8. **Universal Reduced Motion Architecture:** Every motion component must check `prefers-reduced-motion`. When active:
   - Durations collapse to `0ms` (instant state change) or a subtle 150ms opacity fade.
   - All translation (`x`, `y`), rotation, scale, and spring physics are disabled.
   - Marquees freeze into a standard flex-wrap grid.
   - Ambient orbital rotations freeze into an open, static architectural diagram.

---

## 4. Component Selection & Inventory

Components are selected strictly from `uselayouts`, `animate-ui`, and `reactbits` to solve specific deficits identified in `docs/REDESIGN_AUDIT.md` and `docs/REDESIGN_PLAN.md`. All picked components are copied into `components/ui-motion/` as owned source and restyled to CIRCLE's tokens.

| Category | Component Name | Source Library & Component | CIRCLE Problem Solved | Target Routes | Dependencies | Upstream Licence | Restyling to CIRCLE Tokens | Reduced-Motion Fallback |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Nav** | `<SlidingTabs>` | `uselayouts` (Sliding Tabs) | Replaces clunky tab rows with smooth sliding pill indicator; eliminates visual jump on filter select. | `/collabs`, `/directory`, `/journal`, `/events`, `/dashboard` | `motion`, `clsx`, `tailwind-merge` | MIT | Deep Charcoal surface (`#171717`), Graphite border (`#242424`), Lime pill indicator (`#C6FF00`), Inter 500 font. | Instant tab snap; no sliding motion. |
| **Nav** | `<CompactingHeader>` | `uselayouts` / `animate-ui` (Scroll Header) | Replaces 112px tall desktop header with compact 64px header on scroll; eliminates heavy `backdrop-blur-md`. | Global (`components/layout/site-header.tsx`) | `motion` | MIT | Solid Obsidian base (`#080808/95`), crisp Graphite bottom border (`#242424`), zero blur filter. | Static 64px header without height animation. |
| **Nav** | `<MobileMenuSheet>` | `animate-ui` (Drawer / Sheet) | Replaces unstyled vertical link list with staggered full-screen menu with 48px touch targets. | Global Mobile Shell | `motion`, `lucide-react` | MIT + Commons Clause | Solid Obsidian (`#080808`), White Space Grotesk links, 60ms stagger entrance. | Instant opacity fade; no slide-in. |
| **Layout** | `<BentoGrid>` | `uselayouts` (Bento Grid) | Eliminates AI-template 3-card equal-width grids across Home, `/about`, `/creators`, `/brands`. | `/`, `/about`, `/creators`, `/brands`, `/membership`, `/resources` | `motion` | MIT | Charcoal cards (`#171717`), Graphite borders (`#242424`), 16px radius, subtle 2px hover lift. | Static grid without hover translation. |
| **Layout** | `<SharedCardTransition>` | `motion/react` (`layoutId`) | Connects marketplace cards directly to detail headers; eliminates jarring full-page layout jumps. | `/collabs` → `[id]`, `/clipping` → `[slug]`, `/directory` → `[id]`, `/events` → modal | `motion` | MIT | Card background `#171717`, border `#242424`, smooth spring transition (`springs.layout`). | Plain Next.js link navigation; no shared transition. |
| **Layout** | `<ExpandableCard>` | `uselayouts` (Expandable Card) | Allows creators and brands to preview collab briefs and rate cards inline without leaving the list. | `/collabs`, `/directory` | `motion` | MIT | Obsidian modal background (`#080808`), Charcoal surface (`#171717`), Graphite borders (`#242424`). | Direct modal pop without spring expansion. |
| **Feedback** | `<MagneticButton>` | `reactbits` / `uselayouts` (Magnetic Button) | Gives primary Electric Lime CTAs physical tactile weight on desktop; guides pointer into primary action. | Primary CTA on Home, `/join`, Collab detail, Campaign detail | `motion` | MIT | Electric Lime pill (`#C6FF00`), Obsidian text (`#080808`), max 4px displacement, desktop-only. | Standard static button with `:hover` highlight. |
| **Feedback** | `<AnimatedToggle>` | `animate-ui` (Switch) | Replaces native checkbox toggles in Collab brief forms and filters with crisp spring micro-interaction. | `/collabs/new`, `/clipping/campaigns`, Filter bars | `motion` | MIT + Commons Clause | Track: Graphite (`#242424`) to Lime (`#C6FF00`); Knob: White (`#FFFFFF`), `springs.micro`. | Instant color switch; no spring travel. |
| **Feedback** | `<CopyButton>` | `animate-ui` (Copy Action) | Provides instant checkmark feedback when copying referral links, collab briefs, or grievance emails. | `/clipping/campaigns/[slug]`, `/affiliates`, `/contact` | `motion`, `lucide-react` | MIT + Commons Clause | Charcoal surface (`#171717`), Silver icon to Lime checkmark on copy with fast spring scale. | Icon swaps instantly with text "Copied". |
| **Data** | `<NumberTicker>` | `animate-ui` (Number Ticker) | Replaces static text numbers with smooth counter; formats integer INR (`₹1,500`) and follower counts. | Home data strip, `/clipping` campaign budgets, `/leaderboard` | `motion` | MIT + Commons Clause | Monospace or Space Grotesk numerals; formats with `Intl.NumberFormat('en-IN')`. Once on enter. | Renders final integer directly in HTML. |
| **Data** | `<ProgressRing>` | `animate-ui` (Circular Progress) | Replaces text percentages with geometric circular progress for clipping budget spent & goal progress. | `/clipping`, `/clipping/campaigns/[slug]`, `/dashboard` | `motion` | MIT + Commons Clause | SVG ring: Track Graphite (`#242424`), Fill Lime (`#C6FF00`), strokeWidth 4px, `springs.layout`. | SVG circle rendered at exact static stroke offset. |
| **Data** | `<SkeletonShimmer>` | `uselayouts` (Shimmer Skeleton) | Eliminates blank white/dark flash while Supabase data or images load. | Marketplace card feeds, creator directory | CSS + `motion` | MIT | Charcoal `#171717` base, linear sweep to `#242424`, 1.5s duration, zero blur glow. | Solid Charcoal `#171717` placeholder box. |
| **Story** | `<StickyScrollSteps>` | `uselayouts` (Sticky Scroll Reveal) | Replaces 731-word "How It Works" text blocks with sticky 3-step geometric visual explanation. | Home, `/collabs`, `/clipping`, `/brands` | `motion` | MIT | Obsidian background, Charcoal card (`#171717`), Step badges `01 //`, `02 //`, `03 //`, Lime active step. | Standard vertical stacked list of 3 steps. |
| **Story** | `<DrawLine>` / `<ConnectionGraph>` | `motion/react` (`pathLength`) | Visualizes the 3-way marketplace mechanics (Brand brief → Creator application → Payment) without walls of text. | Home, `/about`, `/clipping` | `motion` | MIT | 1.5px stroke Graphite `#242424`, active nodes Lime `#C6FF00`, draws once upon entering view. | Static SVG path fully visible from start. |
| **Story** | `<TextRevealWord>` | `reactbits` (Split Text Reveal) | Elegant, single-run word fade for main H1 headlines; establishes bold editorial magazine voice. | Hero H1 on Home, `/clipping`, `/about` | `motion` | MIT + Commons Clause | Space Grotesk headings, White text, 40ms stagger per word, `duration.base`, triggers once. | Standard server-rendered H1 text block. |
| **Content** | `<AnimatedAccordion>` | `animate-ui` (Accordion) | Cleans up dense FAQ blocks across `/help`, Home, `/clipping` with smooth height spring disclosure. | `/help`, Home, `/clipping`, Collab briefs | `motion`, `lucide-react` | MIT + Commons Clause | Graphite borders, Charcoal surface on open, 44px tap header, chevron rotation, `springs.micro`. | Standard HTML `<details>` / instant height toggle. |
| **Content** | `<CategoryMarquee>` | `reactbits` / `motion` (Infinite Marquee) | Showcases platform specialties (Photographers, Videographers, UGC, etc.) without overwhelming the page. | Home, `/directory`, `/brands` | `motion` | MIT + Commons Clause | Charcoal chips (`#171717`), Silver text, pauses on `:hover` and `:focus-within`. | Static flex-wrap wrapping row of category chips. |

---

## 5. Shared-Element Transitions (`layoutId`)

Shared-element transitions provide seamless spatial continuity between feed cards and detail pages, eliminating layout disorientation.

### 5.1 Approved Transition Pairs
1. **Collabs:** Collab Card in `/collabs` feed → Collab Brief Header in `/collabs/[id]`.
   - Shared Elements: `collab-card-[id]`, `collab-title-[id]`, `collab-budget-[id]`.
2. **Video Clipping:** Campaign Card in `/clipping/campaigns` → Campaign Hero & Budget Meter in `/clipping/campaigns/[slug]`.
   - Shared Elements: `campaign-card-[id]`, `campaign-title-[id]`, `campaign-budget-meter-[id]`.
3. **Creator Directory:** Creator Profile Card in `/directory` → Creator Profile Hero in `/directory/[id]`.
   - Shared Elements: `creator-avatar-[id]`, `creator-handle-[id]`, `creator-badge-[id]`.
4. **Events:** Event Card in `/events` → Event Registration Drawer / Modal.
   - Shared Elements: `event-date-[id]`, `event-card-[id]`.

### 5.2 Implementation Architecture
- **Motion Projection:** Wraps cards in `<motion.div layoutId={`card-${id}`} transition={springs.layout}>`.
- **Next.js App Router Coordination:** Handled via client wrapper components (`components/ui-motion/shared-element.tsx`) that preserve state during route pushes.
- **Immediate Fallback:** If `prefers-reduced-motion: reduce` is active, or if navigation triggers before client hydration completes, the component defaults to standard Next.js `<Link>` navigation with zero visual delay.

---

## 6. The Banned Visual & Motion List

The following effects, components, and patterns are **strictly prohibited** across the entire CIRCLE product. These patterns are the hallmark of AI-generated SaaS templates and degrade CIRCLE's high-contrast editorial authority:

### 6.1 Banned Backgrounds & Atmosphere
- **Aurora & Gradient Meshes:** Banned. CIRCLE sits on an authoritative, deep Obsidian base (`#080808`). No multi-colored ambient gradient blobs.
- **Spotlights & Lamp Effects:** Banned. Cone-shaped gradient overlays simulating spotlights are generic SaaS clichés.
- **Particles, Meteors, Stars & Dust:** Banned. Floating dots, canvas stars, and falling meteor lines are visual noise that communicates zero product information.
- **WebGL / Three.js / Canvas Backgrounds:** Banned. No 3D floating toruses, wireframe waves, or shader noise.

### 6.2 Banned Lighting & Surface Effects
- **Glow Borders & Neon Outlines:** Banned (`box-shadow: 0 0 20px #C6FF00`). Borders are strictly solid Graphite (`#242424`). Electric Lime is used for solid fills, never for blurry neon glows.
- **Glassmorphism & Heavy Backdrop Blurs:** Banned (`backdrop-blur-md`, `backdrop-blur-xl`). Full-width blurred overlays create scrolling composite lag. Surfaces must be solid Deep Charcoal (`#171717`) or Obsidian (`#080808`).
- **Beam & Laser Animations:** Banned. No moving light beams traveling along borders or connection paths.

### 6.3 Banned Interactive & Cursor Effects
- **3D Tilt on Hover:** Banned. Cards tilting in 3D perspective (`transform: perspective(1000px) rotateX(...)`) distort readable text and feel unstable.
- **Custom Cursors & Cursor Trails:** Banned. Custom dot cursors, trailing circles, or magnetic cursor overrides break OS accessibility and feel gimmicky.
- **Excessive Magnetic Pull:** Magnetic displacement is capped at **4px** on desktop primary buttons only. Buttons that fly 20px–50px toward the pointer are banned.

### 6.4 Banned Typography & Storytelling Animations
- **Typewriter Effect on Body Text:** Banned. Typewriters force users to wait to read text, damaging scannability and accessibility.
- **Cyber Glitch & Text Scramble:** Banned. Scrambling random characters before displaying text is a gaming/hacker cliché that undermines professional brand trust.
- **Infinite Loops on Readable Text:** Banned. Text must never pulse, bounce, shimmer, or rotate continuously.
- **Scroll-Jacking:** Banned. Never intercept the browser's native scroll speed, inertia, or direction. Scroll-triggered step sequences must advance naturally with native scroll position.

---

## 7. Page-by-Page Motion Map

Every public route from `docs/REDESIGN_PLAN.md` is assigned its specific motion components and its single designated **Hero Moment**.

| Route / Surface | Motion Components Used | Interaction Triggers | Single "Hero Moment" (Max 1 per screen) |
| :--- | :--- | :--- | :--- |
| **Site Header & Nav** | `<CompactingHeader>`, `<SlidingTabs>`, `<MobileMenuSheet>` | Scroll distance threshold (>40px), tab click, mobile hamburger tap. | Smooth header height compaction (112px → 64px) with border lock. |
| **Site Footer** | `<DrawLine>`, `<CopyButton>` | Viewport entry (footer line draw), copy click on email/socials. | Crisp 1.5px Graphite divider line draw on enter. |
| **Home (`/`)** | `<OrbitScene>`, `<CategoryMarquee>`, `<StickyScrollSteps>`, `<NumberTicker>`, `<AnimatedAccordion>` | Scroll position, hover/pause on marquee, accordion toggle. | **`<OrbitScene>` Ecosystem Engine:** Concentric geometric rings with connected Creator, Brand, and Clipper nodes subtly reacting to pointer. |
| **`/join`** | `<BentoGrid>`, `<MagneticButton>` | Pointer proximity on primary CTA, card hover. | Tactile `<MagneticButton>` pull on role selection cards. |
| **`/membership`** | `<BentoGrid>`, `<NumberTicker>` | Viewport entry on comparison matrix. | Synchronized `<NumberTicker>` rolling up platform fee breakdown (₹0 vs 10%). |
| **`/collabs`** | `<SlidingTabs>`, `<SharedCardTransition>`, `<ExpandableCard>` | Category filter switch, card tap. | Layout re-flow with spring physics on filter change; shared card transition to detail. |
| **`/collabs/[id]`** | `<SharedCardTransition>`, `<MagneticButton>`, `<AnimatedAccordion>` | Page mount, deliverable accordion toggle. | Shared-element expansion from card into full deliverable brief. |
| **`/collabs/new`** | `<AnimatedToggle>`, `<MagneticButton>` | Form step advancement, toggle switch. | Micro-spring snap on ASCI disclosure toggle and budget type selector. |
| **`/directory`** | `<SlidingTabs>`, `<SharedCardTransition>`, `<SkeletonShimmer>` | Filter tab change, profile card click. | Fluid grid re-flow when toggling between Photographers, Editors, and Studios. |
| **`/directory/[id]`** | `<SharedCardTransition>`, `<CopyButton>`, `<MagneticButton>` | Avatar load, copy rate card button. | Shared-element avatar & handle transition into profile banner. |
| **`/clipping`** | `<OrbitScene>`, `<NumberTicker>`, `<ProgressRing>`, `<StickyScrollSteps>` | Viewport entry, scroll-linked steps, calculator input. | **Dual Earnings Calculator:** Live `<NumberTicker>` and `<ProgressRing>` animating projected view milestones. |
| **`/clipping/campaigns`** | `<SlidingTabs>`, `<SharedCardTransition>`, `<ProgressRing>` | Search input, filter chips. | Concentric budget rings animating reserved vs available campaign funds. |
| **`/clipping/campaigns/[slug]`** | `<SharedCardTransition>`, `<AnimatedAccordion>`, `<CopyButton>` | Brief accordion expand, asset link copy. | Shared-element campaign hero expansion with live budget meter fill. |
| **`/brands`** | `<BentoGrid>`, `<ConnectionGraph>`, `<MagneticButton>` | Scroll-linked line draw on agency workflow. | **`<ConnectionGraph>`:** 3-way line draw showing Brand brief → Verified Creator → Direct Payout. |
| **`/creators`** | `<BentoGrid>`, `<CategoryMarquee>`, `<MagneticButton>` | Viewport entry on growth tracks, marquee hover. | Asymmetric Bento Grid entrance highlighting Collabs + Video Clipping. |
| **`/events`** | `<SlidingTabs>`, `<SharedCardTransition>` | Filter between Meetups, Webinars, and Bootcamps. | Smooth card-to-drawer transition on event registration tap. |
| **`/learn`** | `<BentoGrid>`, `<AnimatedAccordion>` | Track card hover, syllabus expand. | Tactile 2px hover lift on the 4 learning tracks with Space Grotesk index badges. |
| **`/guides` (+ sub-guides)** | `<TextRevealWord>`, `<AnimatedAccordion>` | Page enter, table-of-contents jump. | Single-run word reveal on the essential guide title. |
| **`/journal` (+ `/blog`, `/news`, `/updates`)** | `<SlidingTabs>`, `<SharedCardTransition>` | Feed tab switch (All, Blog, News, Updates). | Fluid shared-layout re-flow of article cards when switching editorial tabs. |
| **`/resources`** | `<BentoGrid>`, `<CopyButton>` | Category filter, download asset click. | Clean asymmetric toolkit shelf entrance with instant copy confirmation. |
| **`/challenges`** | `<BentoGrid>`, `<NumberTicker>` | Viewport entry on points balance. | Points badge spring pulse (`+500 pts`) when viewing verified challenge criteria. |
| **`/leaderboard`** | `<SlidingTabs>`, `<NumberTicker>` | Monthly snapshot switch, rank load. | **Top 3 Podium Entrance:** Staggered vertical spring rise of top 3 podium blocks with counter roll. |
| **`/promoters`** | `<DrawLine>`, `<MagneticButton>` | Viewport entry on criteria roadmap. | Circular outline draw around the 1K+ promoter mark emblem. |
| **`/recognition`** | `<BentoGrid>`, `<ProgressRing>` | Viewport entry on badge criteria. | Visual badge unlock meter filling smoothly with circular progress. |
| **`/partners`** | `<BentoGrid>`, `<MagneticButton>` | Viewport enter on perk categories. | Clean bento reveal of verified partner discounts. |
| **`/giveaways` (+ `/giveaways/new`)** | `<SlidingTabs>`, `<AnimatedToggle>` | Filter switch, rule form check. | High-contrast prize tag pulse on active giveaway listings. |
| **`/affiliates`** | `<CopyButton>`, `<MagneticButton>` | Copy referral link click. | Icon morph from link icon to Lime checkmark on copy. |
| **`/help`** | `<AnimatedAccordion>`, `<SlidingTabs>` | FAQ search query, category pill switch. | Smooth accordion expansion with zero layout shift on adjacent questions. |
| **`/contact`** | `<MagneticButton>`, `<CopyButton>` | Form submit hover, copy email click. | Magnetic draw on the primary "Send message" button. |
| **`/guidelines`** | `<DrawLine>`, `<AnimatedAccordion>` | Quick jump navigation tap. | Smooth indicator slide tracking current section in reading sidebar. |
| **`/legal/*` (Terms, Privacy, Cookies, Grievance)** | `<DrawLine>` | Page load. | Crisp 1.5px line draw below policy header; zero distracting movement. |
| **`/dashboard`** | `<SlidingTabs>`, `<NumberTicker>`, `<ProgressRing>` | Tab change, wallet update. | Wallet balance `<NumberTicker>` and verification status ring fill. |
| **`404 (Not Found)`** | `<OrbitScene>` (Static/Minimal) | Page mount. | Clean open circular ring with single disconnected node; return home CTA. |

---

## 8. Performance Budget, Bundle Constraints & SSR Integrity

### 8.1 Client Bundle Budget
- **Motion Runtime Overhead:** Strict ceiling of **≤ 60KB gzipped** across any route.
- **Tree-Shaking:** Components must import from `motion/react` (e.g. `import { motion, AnimatePresence } from "motion/react"`). Never import monolithic bundle packages.
- **Code-Splitting via `next/dynamic`:** Heavy visual components (`<OrbitScene>`, `<StickyScrollSteps>`) must be dynamically imported on landing routes to avoid blocking the initial JavaScript bundle for lightweight reading pages.

### 8.2 Core Web Vitals Guardrails (Mobile 375px)
- **Largest Contentful Paint (LCP < 2.5s):** The H1 headline, hero eyebrow, and primary CTA must render as pure server-rendered semantic HTML. Motion components must wrap or hydrate over these elements; they must **never** hide text behind `opacity: 0` before JavaScript executes.
- **Cumulative Layout Shift (CLS < 0.1):** 
  - Visual slots (`<PhotoSlot>`, `<OrbitScene>`, `<ProgressRing>`) must have hard-coded container dimensions (`aspect-video`, `h-64`, `size-12`) in standard Tailwind CSS before hydration.
  - No DOM elements may expand from `height: 0` during initial page load.
- **First Input Delay / Interaction to Next Paint (INP < 200ms):** Micro-interactions (toggles, button presses) must respond in under 50ms using CSS or lightweight spring handlers.

### 8.3 Server-Side Rendering (SSR) & Search Engine Optimization (SEO/AEO)
- **Zero Client Text Masking:** All body text, FAQs, collab requirements, and creator rate information must be present in the raw server HTML response.
- **Selective Client Boundary (`"use client"`):** Interactive motion wrappers (`<Reveal>`, `<SlidingTabs>`, `<AnimatedAccordion>`) are strictly leaf components. Parent layout shells and pages remain Server Components.
- **Structured Data:** FAQ accordions and Collab briefs retain standard Schema.org JSON-LD structured data in server components, independent of client motion states.
