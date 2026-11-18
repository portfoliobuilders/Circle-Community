# CIRCLE — Third-Party Motion Components Registry & Licensing Audit (M2 Implemented)

> **Document Status:** Complete & Implemented in `components/ui-motion/` (M2)  
> **Installed Package:** `motion: ^14.14.0` (React 19 native via `motion/react`)  
> **Authors:** Senior UI/UX Designer, Senior Motion Designer, Staff Front-End Engineer  
> **Prerequisites:** `AGENTS.md`, `docs/PROJECT_BRIEF.md`, `docs/REDESIGN_AUDIT.md`, `docs/REDESIGN_PLAN.md`, `docs/MOTION_SPEC.md`  
> **Policy:** All motion components are copied into `components/ui-motion/` as owned, editable source code. Never installed as black-box dependencies. Every component is restyled to CIRCLE's tokens, audited for commercial licensing, stripped of AI-template flashy artifacts, and equipped with a reduced-motion fallback.

---

## 1. Third-Party Component Licensing Audit Table

All candidate components have been verified against their respective GitHub source repositories and licensing terms. 

| Library / Source | Component Name | Canonical Source URL | Upstream Licence | Date Copied / Evaluated | Target Codebase File | Upstream Dependencies Stripped | Commercial Deployment & Redistribution Audit |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **uselayouts** | `Sliding Tabs` | `https://github.com/naymurdev/ui-layouts` | MIT License | 18 Nov 2026 | `components/ui-motion/sliding-tabs.tsx` | Stripped unneeded utility wrappers; mapped to `motion/react` + `cn`. | **APPROVED.** Permissive MIT license allows commercial use, modification, and bundling in end-products. |
| **uselayouts** / **animate-ui** | `Scroll Header` | `https://github.com/animate-ui/animate-ui` | MIT / MIT + Commons Clause | 18 Nov 2026 | `components/ui-motion/compacting-header.tsx` | Stripped `backdrop-blur-md` and glassmorphism styling; pure CSS border lock. | **APPROVED.** Commons Clause allows unlimited commercial end-products; prohibits reselling as raw UI kit. |
| **animate-ui** | `Drawer / Sheet` | `https://github.com/animate-ui/animate-ui` | MIT + Commons Clause | 18 Nov 2026 | `components/ui-motion/mobile-menu-sheet.tsx` | Stripped third-party drawer runtime; converted to pure `motion/react` overlay. | **APPROVED.** Free for commercial applications and client websites. |
| **uselayouts** | `Bento Grid` | `https://github.com/naymurdev/ui-layouts` | MIT License | 18 Nov 2026 | `components/ui-motion/bento-grid.tsx` | Stripped radial gradients, neon glows, and 3D perspective tilts. | **APPROVED.** Permissive MIT license. |
| **motion.dev** | `layoutId Card Transition` | `https://motion.dev/docs/react-layout-animations` | MIT License | 18 Nov 2026 | `components/ui-motion/shared-element.tsx` | Native Motion primitive; zero extra third-party code. | **APPROVED.** Standard permissive MIT license. |
| **uselayouts** | `Expandable Card` | `https://github.com/naymurdev/ui-layouts` | MIT License | 18 Nov 2026 | `components/ui-motion/expandable-card.tsx` | Stripped light-theme styles, external modal dialog dependencies. | **APPROVED.** Permissive MIT license. |
| **reactbits** / **uselayouts** | `Magnetic Button` | `https://github.com/DavidHDev/react-bits` | MIT + Commons Clause | 18 Nov 2026 | `components/ui-motion/magnetic-button.tsx` | Stripped large 40px displacement; capped to strict 4px pull with desktop check. | **APPROVED.** Free for commercial use in websites and applications. |
| **animate-ui** | `Switch / Toggle` | `https://github.com/animate-ui/animate-ui` | MIT + Commons Clause | 18 Nov 2026 | `components/ui-motion/animated-toggle.tsx` | Stripped non-standard theme variables; replaced with CIRCLE tokens. | **APPROVED.** Free for commercial applications. |
| **animate-ui** | `Copy Button` | `https://github.com/animate-ui/animate-ui` | MIT + Commons Clause | 18 Nov 2026 | `components/ui-motion/copy-button.tsx` | Stripped icon packs; standardized on `lucide-react` (1.5px stroke). | **APPROVED.** Free for commercial applications. |
| **animate-ui** | `Number Ticker` | `https://github.com/animate-ui/animate-ui` | MIT + Commons Clause | 18 Nov 2026 | `components/ui-motion/number-ticker.tsx` | Replaced western number formatter with Indian numbering (`en-IN`). | **APPROVED.** Free for commercial applications. |
| **animate-ui** | `Circular Progress` | `https://github.com/animate-ui/animate-ui` | MIT + Commons Clause | 18 Nov 2026 | `components/ui-motion/progress-ring.tsx` | Stripped drop-shadow glows and gradient strokes; solid Graphite + Lime. | **APPROVED.** Free for commercial applications. |
| **uselayouts** | `Shimmer Skeleton` | `https://github.com/naymurdev/ui-layouts` | MIT License | 18 Nov 2026 | `components/ui-motion/skeleton-shimmer.tsx` | Stripped white gradients; dark editorial Charcoal sweep `#171717` to `#242424`. | **APPROVED.** Permissive MIT license. |
| **uselayouts** | `Sticky Scroll Reveal` | `https://github.com/naymurdev/ui-layouts` | MIT License | 18 Nov 2026 | `components/ui-motion/sticky-scroll-steps.tsx` | Stripped neon cards, scroll-jacking, and heavy backgrounds. | **APPROVED.** Permissive MIT license. |
| **motion.dev** | `SVG Path Length Draw` | `https://motion.dev/docs/react-svg-animation` | MIT License | 18 Nov 2026 | `components/ui-motion/draw-line.tsx` | Native Motion SVG primitive; zero external dependencies. | **APPROVED.** Standard permissive MIT license. |
| **reactbits** | `Split Text Word Reveal` | `https://github.com/DavidHDev/react-bits` | MIT + Commons Clause | 18 Nov 2026 | `components/ui-motion/text-reveal-word.tsx` | Stripped endless loop options; restricted to single-run H1 headlines. | **APPROVED.** Free for commercial applications. |
| **animate-ui** | `Accordion` | `https://github.com/animate-ui/animate-ui` | MIT + Commons Clause | 18 Nov 2026 | `components/ui-motion/animated-accordion.tsx` | Stripped bulky radix container; lightweight pure Motion layout height. | **APPROVED.** Free for commercial applications. |
| **reactbits** / **motion** | `Infinite Marquee` | `https://github.com/DavidHDev/react-bits` | MIT + Commons Clause | 18 Nov 2026 | `components/ui-motion/category-marquee.tsx` | Stripped gradient side-masks; pure border chips with off-screen pause. | **APPROVED.** Free for commercial applications. |

---

## 2. Component Modification & Restyling Register

Every component listed above is adapted under the following strict engineering requirements:

### 2.1 Color Tokenization
- **Surfaces:** Base background set to Obsidian (`#080808`). Card containers and dialogs set to Deep Charcoal (`#171717`).
- **Borders:** Replaced all 1px gray borders and blurry glow borders with solid Graphite (`#242424`).
- **Typography:** Headings set to Space Grotesk (`font-display font-medium` or `font-semibold`), body text to Inter (`font-sans`), secondary labels to Ice Silver (`#C7CBD1`).
- **Highlights:** Electric Lime (`#C6FF00`) applied strictly to primary interactive states (active indicator pill, button fill, progress ring stroke, copy checkmark).

### 2.2 Physics Tokenization
- Hard-coded durations (e.g. `duration: 0.3`, `duration: 1.2`) replaced with `duration.fast` (150ms), `duration.base` (250ms), or `duration.slow` (450ms) from `lib/motion.ts`.
- Generic spring configurations replaced with `springs.micro` (tactile micro-interactions) or `springs.layout` (spatial re-flows).

### 2.3 Stripped Flashy AI-Template Tells
- Removed all `backdrop-blur-md`, `backdrop-blur-xl`, and semi-transparent glass cards.
- Removed all CSS box-shadow glows (`box-shadow: 0 0 25px rgba(...)`).
- Removed all 3D perspective tilts (`perspective: 1000px`, `rotateX`, `rotateY`).
- Removed all floating background canvas/particle loops.

### 2.4 Accessibility & Reduced Motion Hardening
- Every component queries `useReducedMotion()`. When active, animations collapse to instantaneous state changes or subtle opacity fades (`duration.fast`).
- Marquees and ambient orbits stop completely or display static flex wrapping.
- All interactive elements meet the minimum 44px tap target standard on mobile.
- All hover states are matched 1:1 on `:focus-visible` with a distinct Lime focus outline (`ring-2 ring-lime ring-offset-2 ring-offset-bg`).

---

## 3. Prohibited & Rejected Candidate Libraries

The following third-party libraries and candidates were formally evaluated and rejected:

1. **Anime.js:**
   - *Reason for Rejection:* Evaluated for SVG path morphing. CIRCLE's visual architecture consists of clean geometric circles, orbital rings, and connecting lines—all of which are handled natively by `motion` (`motion.path`, `pathLength`). Adding Anime.js would introduce a redundant 17KB gzipped secondary animation engine.
2. **GSAP (GreenSock):**
   - *Reason for Rejection:* Commercial licensing restrictions (Business Green required for certain distributions), non-React-native DOM manipulation, and large bundle weight (~60KB+).
3. **Aceternity UI (Selected Components):**
   - *Reason for Rejection:* Components like `SparklesCore`, `LampContainer`, `BackgroundBeams`, `MeteorEffect`, `3DCardPin`, and `Spotlight` are strictly banned under the anti-AI-template mandate. The few clean utility patterns (tabs, bento) are already available with cleaner MIT licensing in `uselayouts` and `animate-ui`.
4. **Three.js / React Three Fiber / OGL:**
   - *Reason for Rejection:* 150KB–600KB+ runtime weight, massive mobile GPU consumption, zero accessibility, and inconsistent with CIRCLE's high-contrast editorial identity.
5. **Lottie:**
   - *Reason for Rejection:* Bloated canvas runtime; enforces third-party illustration styles that degrade CIRCLE's minimalist geometric design system.
