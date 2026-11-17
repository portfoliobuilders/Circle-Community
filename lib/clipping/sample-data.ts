import { CLIPPING_CONFIG } from "@/lib/config/clipping";
import type { Campaign, TopClip } from "./types";

function calculateNetRate(grossRate: number): number {
  const fee = Math.floor((grossRate * CLIPPING_CONFIG.clipperFeePct) / 100);
  return grossRate - fee;
}

export const sampleCampaigns: Campaign[] = [
  {
    id: "samp-camp-001",
    slug: "sample-tech-podcast-hooks",
    owner_id: "samp-owner-001",
    owner_name: "[BRAND: AudioByte Media]",
    owner_avatar_url: null,
    title: "Sample: Tech Podcast Hook & Debate Edits",
    summary:
      "Transform long-form engineering discussions into punchy 30-45s vertical clips highlighting hot takes and architecture debates.",
    brief_md: `### Campaign Objective
We are looking for skilled clippers to highlight the most insightful and contentious moments from our weekly audio tech podcast. 

### What We Want
- High-energy opening hooks within the first 3 seconds
- Dynamic kinetic subtitles matching the speaker
- Crisp cuts removing filler pauses
- Appropriate B-roll or motion graphics illustrating abstract concepts

### Submission Requirements
- Length: 25 to 55 seconds
- Vertical 9:16 aspect ratio (1080x1920)
- Clean audio levels with subtle background music`,
    rules_md: `1. Only clips generated from the approved podcast episodes will qualify.
2. Maintain brand neutral tone — do not alter quotes out of context.
3. ASCI ad disclosure (#ad or #collab) is mandatory in the primary caption.
4. One post per submission. Re-uploading identical clips across multiple accounts is disqualified.`,
    category: "Technology",
    language: "en",
    source_links: [
      {
        title: "Episode 42: The Future of Frontend Architectures",
        url: "https://example.com/source/ep42",
        platform: "youtube",
      },
    ],
    asset_folder_url: "https://example.com/assets/audiobyte",
    platforms: ["youtube_shorts", "instagram_reels"],
    rate_inr_per_1k: 80,
    budget_inr: 50000,
    owner_fee_inr: 5000,
    budget_reserved_inr: 32000,
    budget_paid_inr: 18000,
    per_clip_view_cap: 50000,
    per_clipper_cap_inr: 15000,
    min_views_to_qualify: 1000,
    required_caption: "Which architecture pattern do you prefer? Full breakdown on the channel.",
    required_hashtags: ["#tech", "#webdev", "#coding", "#ad"],
    required_mention: "@AudioByteShow",
    disclosure_required: true,
    rights_confirmed_at: "2026-10-15T10:00:00Z",
    starts_at: "2026-10-20T00:00:00Z",
    ends_at: "2026-12-31T23:59:59Z",
    status: "live",
    funded_at: "2026-10-18T14:30:00Z",
    funded_ref: "UTR-SAMP-1001",
    cover_path: null,
    created_at: "2026-10-15T09:00:00Z",
    budgetLeftInr: 18000,
    budgetUsedPct: 64,
    approvedClipCount: 28,
    netRateInrPer1k: calculateNetRate(80),
    isPromoted: false,
    ownerVerified: true,
  },
  {
    id: "samp-camp-002",
    slug: "sample-indie-gameplay-moments",
    owner_id: "samp-owner-002",
    owner_name: "[STUDIO: PixelForge Games]",
    owner_avatar_url: null,
    title: "Sample: Indie Roguelike Gameplay Moments",
    summary:
      "Showcase intense boss encounters, clutch escapes, and build synergies from our newly released PC tactical roguelike.",
    brief_md: `### Target Audience
Fast-paced gamers interested in tactical depth and roguelike mechanics.

### Editing Expectations
- Jump straight into the action or fail state
- Zoom-in focus on health bars and critical hit counters
- Custom sound effects on game climax moments
- Clear call to action to wishlist on Steam at the end`,
    rules_md: `1. Clips must feature direct in-game footage from the press pack.
2. No offensive overlay commentary or misleading thumbnails.
3. Must include game title tag and #ad disclosure.
4. Minimum 1080p resolution 60fps preferred.`,
    category: "Gaming",
    language: "en",
    source_links: [
      {
        title: "Beta Playtest Footage Pack 01",
        url: "https://example.com/source/pixelforge",
        platform: "drive",
      },
    ],
    platforms: ["youtube_shorts"],
    rate_inr_per_1k: 120,
    budget_inr: 75000,
    owner_fee_inr: 7500,
    budget_reserved_inr: 45000,
    budget_paid_inr: 25000,
    per_clip_view_cap: 80000,
    per_clipper_cap_inr: 25000,
    min_views_to_qualify: 1000,
    required_caption: "Would you have survived this run? Wishlist now.",
    required_hashtags: ["#indiegames", "#gaming", "#roguelike", "#ad"],
    required_mention: "@PixelForge",
    disclosure_required: true,
    rights_confirmed_at: "2026-10-22T08:00:00Z",
    starts_at: "2026-10-25T00:00:00Z",
    ends_at: "2026-12-15T23:59:59Z",
    status: "live",
    funded_at: "2026-10-24T11:00:00Z",
    funded_ref: "UTR-SAMP-1002",
    cover_path: null,
    created_at: "2026-10-22T07:30:00Z",
    budgetLeftInr: 30000,
    budgetUsedPct: 60,
    approvedClipCount: 34,
    netRateInrPer1k: calculateNetRate(120),
    isPromoted: false,
    ownerVerified: true,
  },
  {
    id: "samp-camp-003",
    slug: "sample-sustainable-fashion-lookbook",
    owner_id: "samp-owner-003",
    owner_name: "[BRAND: EcoThread Studio]",
    owner_avatar_url: null,
    title: "Sample: Sustainable Fashion Styling & Lookbooks",
    summary:
      "Create aesthetic vertical lookbooks, capsule wardrobe combinations, and sustainable fabric education clips.",
    brief_md: `### Aesthetic Direction
Minimalist, warm tones, slow-pacing with smooth transition cuts. Focus on organic textures and everyday wearability.

### Deliverables
- Clean typography overlay explaining sustainable fabrics (bamboo, linen, recycled cotton)
- 3 to 4 distinct outfit transitions per 30-second reel
- Calming Lo-Fi or indie pop royalty-free audio`,
    rules_md: `1. Only official lookbook video assets may be edited.
2. Maintain color fidelity (do not apply extreme filters or heavy distortion).
3. #collab and #sustainablefashion required in caption.`,
    category: "Lifestyle",
    language: "en",
    source_links: [
      {
        title: "Autumn Capsule Raw Footage",
        url: "https://example.com/source/ecothread",
        platform: "drive",
      },
    ],
    platforms: ["instagram_reels"],
    rate_inr_per_1k: 90,
    budget_inr: 40000,
    owner_fee_inr: 4000,
    budget_reserved_inr: 12000,
    budget_paid_inr: 5000,
    per_clip_view_cap: 35000,
    per_clipper_cap_inr: 10000,
    min_views_to_qualify: 1000,
    required_caption: "3 capsule looks for everyday comfort. Made with 100% organic linen.",
    required_hashtags: ["#sustainablefashion", "#capsulewardrobe", "#outfitideas", "#collab"],
    required_mention: "@EcoThreadIndia",
    disclosure_required: true,
    rights_confirmed_at: "2026-10-28T12:00:00Z",
    starts_at: "2026-11-01T00:00:00Z",
    ends_at: "2026-12-30T23:59:59Z",
    status: "live",
    funded_at: "2026-10-30T16:00:00Z",
    funded_ref: "UTR-SAMP-1003",
    cover_path: null,
    created_at: "2026-10-28T11:00:00Z",
    budgetLeftInr: 28000,
    budgetUsedPct: 30,
    approvedClipCount: 15,
    netRateInrPer1k: calculateNetRate(90),
    isPromoted: false,
    ownerVerified: false,
  },
  {
    id: "samp-camp-004",
    slug: "sample-personal-finance-breakdowns",
    owner_id: "samp-owner-004",
    owner_name: "[CREATOR: FinWise Insights]",
    owner_avatar_url: null,
    title: "Sample: Personal Finance & Tax Filing Simplifiers",
    summary:
      "Extract practical tax-saving tips, index fund comparisons, and budget frameworks from 40-minute educational webinars.",
    brief_md: `### Focus Topics
- New vs Old Tax Regime tradeoffs
- Compounding math explained simply
- Budgeting rules (50/30/20 breakdown)

### Requirements
- High-contrast visual numbers and chart highlights
- Clear disclaimer: 'Educational content only, not financial advice'
- Fast-paced 40-60 second duration`,
    rules_md: `1. Must display statutory disclaimer overlay on screen.
2. No get-rich-quick claims or promises of guaranteed stock returns.
3. Accurate subtitles without distorting tax provisions.
4. ASCI #collab disclosure required.`,
    category: "Finance",
    language: "hi",
    source_links: [
      {
        title: "Masterclass: Tax Strategies 2026",
        url: "https://example.com/source/finwise",
        platform: "youtube",
      },
    ],
    platforms: ["youtube_shorts", "instagram_reels"],
    rate_inr_per_1k: 150,
    budget_inr: 100000,
    owner_fee_inr: 10000,
    budget_reserved_inr: 65000,
    budget_paid_inr: 40000,
    per_clip_view_cap: 60000,
    per_clipper_cap_inr: 30000,
    min_views_to_qualify: 1000,
    required_caption: "Old tax regime vs New tax regime: which one saves you more? Complete comparison.",
    required_hashtags: ["#personalfinance", "#taxsaving", "#moneytips", "#collab"],
    required_mention: "@FinWiseOfficial",
    disclosure_required: true,
    rights_confirmed_at: "2026-10-10T15:00:00Z",
    starts_at: "2026-10-15T00:00:00Z",
    ends_at: "2026-12-31T23:59:59Z",
    status: "live",
    funded_at: "2026-10-12T10:00:00Z",
    funded_ref: "UTR-SAMP-1004",
    cover_path: null,
    created_at: "2026-10-10T14:00:00Z",
    budgetLeftInr: 35000,
    budgetUsedPct: 65,
    approvedClipCount: 42,
    netRateInrPer1k: calculateNetRate(150),
    isPromoted: false,
    ownerVerified: true,
  },
  {
    id: "samp-camp-005",
    slug: "sample-ai-tools-workflow-hacks",
    owner_id: "samp-owner-005",
    owner_name: "[PRODUCT: SynthFlow AI]",
    owner_avatar_url: null,
    title: "Sample: AI Workflow Hacks for Creative Freelancers",
    summary:
      "Highlight real-time screen workflows demonstrating how designers and editors cut turnaround times using generative tooling.",
    brief_md: `### Core Message
Show real before/after productivity jumps without exaggerated hype.

### Style Guide
- Split-screen before & after comparisons
- Clear cursor emphasis and key shortcut overlays
- Snappy 20-35 second runtime`,
    rules_md: `1. Only approved screen recordings from the launch webinar may be edited.
2. Must specify product version shown in footage.
3. #ad disclosure required.`,
    category: "Technology",
    language: "en",
    source_links: [
      {
        title: "Product Launch Keynote Footage",
        url: "https://example.com/source/synthflow",
        platform: "youtube",
      },
    ],
    platforms: ["youtube_shorts", "instagram_reels"],
    rate_inr_per_1k: 180,
    budget_inr: 120000,
    owner_fee_inr: 12000,
    budget_reserved_inr: 90000,
    budget_paid_inr: 60000,
    per_clip_view_cap: 75000,
    per_clipper_cap_inr: 40000,
    min_views_to_qualify: 1000,
    required_caption: "Cut hours off your client delivery workflow. Full demo on profile.",
    required_hashtags: ["#aitools", "#freelancer", "#productivity", "#ad"],
    required_mention: "@SynthFlowAI",
    disclosure_required: true,
    rights_confirmed_at: "2026-10-05T09:00:00Z",
    starts_at: "2026-10-10T00:00:00Z",
    ends_at: "2026-12-20T23:59:59Z",
    status: "live",
    funded_at: "2026-10-08T18:00:00Z",
    funded_ref: "UTR-SAMP-1005",
    cover_path: null,
    created_at: "2026-10-05T08:30:00Z",
    budgetLeftInr: 30000,
    budgetUsedPct: 75,
    approvedClipCount: 51,
    netRateInrPer1k: calculateNetRate(180),
    isPromoted: false,
    ownerVerified: true,
  },
  {
    id: "samp-camp-006",
    slug: "sample-functional-fitness-form-checks",
    owner_id: "samp-owner-006",
    owner_name: "[COACH: IronCore Athletics]",
    owner_avatar_url: null,
    title: "Sample: Functional Fitness & Lift Form Corrections",
    summary:
      "Clip posture mistakes, lift cues, and mobility drills from professional coach coaching clinics.",
    brief_md: `### Focus
Identify common lifting errors (e.g., knee cave, lower back rounding) and show coach cue corrections with stop-motion indicators.`,
    rules_md: `1. Retain anatomical cue voiceover. Do not replace audio with trending sounds that drown out the advice.
2. Include safety note: consult a coach before testing heavy loads.
3. ASCI #collab required.`,
    category: "Fitness",
    language: "en",
    source_links: [
      {
        title: "Kettlebell & Barbell Clinic Raw Tapes",
        url: "https://example.com/source/ironcore",
        platform: "drive",
      },
    ],
    platforms: ["instagram_reels"],
    rate_inr_per_1k: 50,
    budget_inr: 30000,
    owner_fee_inr: 3000,
    budget_reserved_inr: 15000,
    budget_paid_inr: 8000,
    per_clip_view_cap: 30000,
    per_clipper_cap_inr: 8000,
    min_views_to_qualify: 1000,
    required_caption: "Fix this one deadlift mistake before your next leg session.",
    required_hashtags: ["#fitness", "#deadliftform", "#gymtips", "#collab"],
    required_mention: "@IronCoreKochi",
    disclosure_required: true,
    rights_confirmed_at: "2026-11-01T14:00:00Z",
    starts_at: "2026-11-05T00:00:00Z",
    ends_at: "2026-12-28T23:59:59Z",
    status: "live",
    funded_at: "2026-11-03T11:00:00Z",
    funded_ref: "UTR-SAMP-1006",
    cover_path: null,
    created_at: "2026-11-01T13:00:00Z",
    budgetLeftInr: 15000,
    budgetUsedPct: 50,
    approvedClipCount: 19,
    netRateInrPer1k: calculateNetRate(50),
    isPromoted: false,
    ownerVerified: false,
  },
  {
    id: "samp-camp-007",
    slug: "sample-culinary-regional-recipes",
    owner_id: "samp-owner-007",
    owner_name: "[KITCHEN: Malabar Heritage]",
    owner_avatar_url: null,
    title: "Sample: Regional Spice Blends & Sizzle Reels",
    summary:
      "Edit fast-paced ASMR cooking sequences focusing on traditional Kerala spices, roasting sounds, and plating aesthetics.",
    brief_md: `### Sensory Focus
High-fidelity sound design: sizzling oil, crackling mustard seeds, mortar-pestle grinding. Vibrant color saturation on fresh herbs and spices.`,
    rules_md: `1. Natural audio must remain audible in the mix.
2. List key ingredients in subtitles.
3. Mandatory #collab tag.`,
    category: "Culinary",
    language: "en",
    source_links: [
      {
        title: "Traditional Spice Roasting Master Footage",
        url: "https://example.com/source/malabar",
        platform: "drive",
      },
    ],
    platforms: ["youtube_shorts", "instagram_reels"],
    rate_inr_per_1k: 70,
    budget_inr: 45000,
    owner_fee_inr: 4500,
    budget_reserved_inr: 21000,
    budget_paid_inr: 12000,
    per_clip_view_cap: 40000,
    per_clipper_cap_inr: 12000,
    min_views_to_qualify: 1000,
    required_caption: "The secret to authentic Malabar roast lies in the slow tempering process.",
    required_hashtags: ["#indianfood", "#foodasmr", "#keralarecipes", "#collab"],
    required_mention: "@MalabarHeritage",
    disclosure_required: true,
    rights_confirmed_at: "2026-11-02T09:00:00Z",
    starts_at: "2026-11-06T00:00:00Z",
    ends_at: "2026-12-25T23:59:59Z",
    status: "live",
    funded_at: "2026-11-04T13:30:00Z",
    funded_ref: "UTR-SAMP-1007",
    cover_path: null,
    created_at: "2026-11-02T08:15:00Z",
    budgetLeftInr: 24000,
    budgetUsedPct: 47,
    approvedClipCount: 22,
    netRateInrPer1k: calculateNetRate(70),
    isPromoted: false,
    ownerVerified: true,
  },
  {
    id: "samp-camp-008",
    slug: "sample-automotive-restoration-timelapses",
    owner_id: "samp-owner-008",
    owner_name: "[WORKSHOP: Vintage Gears]",
    owner_avatar_url: null,
    title: "Sample: Vintage Motorcycle Restoration Snaps",
    summary:
      "Transform 20-hour classic motorcycle rebuilds into satisfying 45-second timelapse transformations.",
    brief_md: `### Focus
Rust removal, engine block polishing, custom paint layering, and the final first engine kickstart.`,
    rules_md: `1. Include the model year and specs in the closing card.
2. ASCI #ad disclosure required.
3. Original workshop sound preferred for the engine rumble.`,
    category: "Automotive",
    language: "en",
    source_links: [
      {
        title: "1972 Roadster Rebuild Reel Archive",
        url: "https://example.com/source/vintagegears",
        platform: "drive",
      },
    ],
    platforms: ["youtube_shorts"],
    rate_inr_per_1k: 110,
    budget_inr: 60000,
    owner_fee_inr: 6000,
    budget_reserved_inr: 38000,
    budget_paid_inr: 22000,
    per_clip_view_cap: 50000,
    per_clipper_cap_inr: 20000,
    min_views_to_qualify: 1000,
    required_caption: "From barn find to showroom shine in 45 seconds.",
    required_hashtags: ["#restoration", "#motorcycle", "#vintagebikes", "#ad"],
    required_mention: "@VintageGearsWorkshop",
    disclosure_required: true,
    rights_confirmed_at: "2026-10-18T16:00:00Z",
    starts_at: "2026-10-22T00:00:00Z",
    ends_at: "2026-12-18T23:59:59Z",
    status: "live",
    funded_at: "2026-10-20T10:15:00Z",
    funded_ref: "UTR-SAMP-1008",
    cover_path: null,
    created_at: "2026-10-18T15:00:00Z",
    budgetLeftInr: 22000,
    budgetUsedPct: 63,
    approvedClipCount: 31,
    netRateInrPer1k: calculateNetRate(110),
    isPromoted: false,
    ownerVerified: false,
  },
  {
    id: "samp-camp-009",
    slug: "sample-startup-pitch-teardowns",
    owner_id: "samp-owner-009",
    owner_name: "[INCUBATOR: Delta Launchpad]",
    owner_avatar_url: null,
    title: "Sample: Seed Pitch Deck Teardowns & Investor Critiques",
    summary:
      "Edit key questions and feedback exchanges between founders and venture partners during live pitch demo days.",
    brief_md: `### Focus
Extract the pivotal slide critique (TAM calculations, unit economics, go-to-market barriers). High-tempo narrative pacing.`,
    rules_md: `1. Do not clip proprietary financials marked confidential.
2. Include founder name and company sector in intro.
3. ASCI #collab required.`,
    category: "Education",
    language: "en",
    source_links: [
      {
        title: "Demo Day Cohort 4 Pitch Recordings",
        url: "https://example.com/source/deltalaunchpad",
        platform: "youtube",
      },
    ],
    platforms: ["youtube_shorts", "instagram_reels"],
    rate_inr_per_1k: 160,
    budget_inr: 85000,
    owner_fee_inr: 8500,
    budget_reserved_inr: 42000,
    budget_paid_inr: 25000,
    per_clip_view_cap: 60000,
    per_clipper_cap_inr: 25000,
    min_views_to_qualify: 1000,
    required_caption: "The one slide that made or broke this seed round. What do you think of their unit economics?",
    required_hashtags: ["#startups", "#venturecapital", "#pitchdeck", "#collab"],
    required_mention: "@DeltaLaunchpad",
    disclosure_required: true,
    rights_confirmed_at: "2026-10-25T11:00:00Z",
    starts_at: "2026-10-28T00:00:00Z",
    ends_at: "2026-12-31T23:59:59Z",
    status: "live",
    funded_at: "2026-10-27T17:00:00Z",
    funded_ref: "UTR-SAMP-1009",
    cover_path: null,
    created_at: "2026-10-25T10:30:00Z",
    budgetLeftInr: 43000,
    budgetUsedPct: 49,
    approvedClipCount: 26,
    netRateInrPer1k: calculateNetRate(160),
    isPromoted: false,
    ownerVerified: true,
  },
];

export const sampleTopClips: Record<string, TopClip[]> = {
  "samp-camp-001": [
    {
      id: "clip-001",
      campaign_id: "samp-camp-001",
      platform: "youtube_shorts",
      post_url: "https://example.com/shorts/clip1",
      verified_views: 42500,
      gross_amount_inr: 3400,
      net_amount_inr: 3060,
      clipper_handle: "@editor_arjun",
      submitted_at: "2026-10-25T12:00:00Z",
    },
    {
      id: "clip-002",
      campaign_id: "samp-camp-001",
      platform: "instagram_reels",
      post_url: "https://example.com/reels/clip2",
      verified_views: 38200,
      gross_amount_inr: 3056,
      net_amount_inr: 2751,
      clipper_handle: "@cutsbyneha",
      submitted_at: "2026-10-27T15:30:00Z",
    },
    {
      id: "clip-003",
      campaign_id: "samp-camp-001",
      platform: "youtube_shorts",
      post_url: "https://example.com/shorts/clip3",
      verified_views: 29100,
      gross_amount_inr: 2328,
      net_amount_inr: 2096,
      clipper_handle: "@rahul_creates",
      submitted_at: "2026-10-29T18:10:00Z",
    },
  ],
  "samp-camp-002": [
    {
      id: "clip-004",
      campaign_id: "samp-camp-002",
      platform: "youtube_shorts",
      post_url: "https://example.com/shorts/clip4",
      verified_views: 65000,
      gross_amount_inr: 7800,
      net_amount_inr: 7020,
      clipper_handle: "@pixelclippers",
      submitted_at: "2026-10-28T09:00:00Z",
    },
    {
      id: "clip-005",
      campaign_id: "samp-camp-002",
      platform: "youtube_shorts",
      post_url: "https://example.com/shorts/clip5",
      verified_views: 41200,
      gross_amount_inr: 4944,
      net_amount_inr: 4450,
      clipper_handle: "@roguecuts",
      submitted_at: "2026-10-30T14:45:00Z",
    },
  ],
  "samp-camp-005": [
    {
      id: "clip-006",
      campaign_id: "samp-camp-005",
      platform: "instagram_reels",
      post_url: "https://example.com/reels/clip6",
      verified_views: 71000,
      gross_amount_inr: 12780,
      net_amount_inr: 11502,
      clipper_handle: "@designsnaps",
      submitted_at: "2026-10-18T11:20:00Z",
    },
  ],
};
