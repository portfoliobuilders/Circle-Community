export const faqCategories = [
  "Getting started",
  "Collabs & bids",
  "Video clipping",
  "Brands",
  "Events & learning",
  "Points & badges",
  "Safety & verification",
  "Account & privacy",
] as const;

export type FaqCategory = (typeof faqCategories)[number];

export type Faq = {
  id: string;
  category: FaqCategory;
  question: string;
  answer_md: string;
  sort: number;
  published: boolean;
};

export const faqSeed: Faq[] = [
  {
    id: "00000000-0000-4000-8000-000000000001",
    category: "Getting started",
    question: "Is CIRCLE free to join?",
    answer_md:
      "Yes. Joining CIRCLE, creating a profile, and browsing briefs is free. There are no monthly subscription paywalls. For marketplace transactions (Collabs and Video Clipping), CIRCLE charges a transparent 10% platform fee on completed payouts to maintain fraud security, deliverable verification, and platform infrastructure.",
    sort: 10,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    category: "Getting started",
    question: "Who can join CIRCLE?",
    answer_md:
      "Creators, video clippers, influencers, and creative service providers (photographers, videographers, script writers, editors, studio owners), along with brands. Creators and service providers share a single account. Brand accounts are separate.",
    sort: 20,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    category: "Getting started",
    question: "Can I join if I am under 18?",
    answer_md:
      "You can participate in community learning and events. You cannot enter paid collabs or clipping campaigns. Paid participation requires an 18+ confirmation and date of birth in compliance with India's DPDP Act.",
    sort: 30,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    category: "Safety & verification",
    question: "How does creator verification work?",
    answer_md:
      "Verification uses a one-time security code placed in your public social bio. CIRCLE never asks for your social media password or account login credentials. Follower numbers remain labelled self-reported until manually confirmed by our review team.",
    sort: 40,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000005",
    category: "Collabs & bids",
    question: "How do fixed, open-bid, and barter collabs work?",
    answer_md:
      "Fixed collabs offer a preset budget in INR. Open bids allow creators to propose their custom rate and pitch. Barter collabs offer products or services in exchange for content. ASCI disclosure tags (#ad / #collab) are enabled by default on all briefs.",
    sort: 50,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000006",
    category: "Collabs & bids",
    question: "What are the platform fees on collabs?",
    answer_md:
      "CIRCLE charges a 10% platform fee on completed collab payouts. This fee supports escrow security, contract verification, and platform operations. There are no upfront fees to apply or post briefs.",
    sort: 60,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000007",
    category: "Video clipping",
    question: "How does video clipping work?",
    answer_md:
      "Brands upload source video footage and set a payout rate per 100K verified views. Clippers edit engaging short-form vertical videos, publish them on social platforms, and submit live post links. Once view thresholds are verified, earnings are locked to your wallet minus a 10% platform fee.",
    sort: 65,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000008",
    category: "Points & badges",
    question: "How are points and leaderboards calculated?",
    answer_md:
      "Points come only from verified activities: approved collab completions, clipping milestones, event attendance, and verified tasks. Logins and raw engagement do not award points. Leaderboards reset monthly for creators and brands.",
    sort: 70,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000009",
    category: "Safety & verification",
    question: "How do I report a fake profile or scam brief?",
    answer_md:
      "Select the Report action on any profile, service card, collab brief, or campaign. Our moderation team reviews reports daily and permanently removes fraudulent accounts.",
    sort: 80,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000010",
    category: "Events & learning",
    question: "Are community webinars and workshops free?",
    answer_md:
      "Yes. All educational webinars, masterclasses, and bootcamps hosted by CIRCLE are free for members. Topics include short-form video editing, rate negotiation, and AI creator tools.",
    sort: 90,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000011",
    category: "Brands",
    question: "How do brands hire creators on CIRCLE?",
    answer_md:
      "Brands can post a collab brief (fixed budget, open bid, or barter), launch a performance video clipping campaign with a guaranteed view rate, or explore verified creator profiles in the directory.",
    sort: 100,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000012",
    category: "Brands",
    question: "What managed agency services does Portfolix offer?",
    answer_md:
      "Portfolix offers managed campaign planning, creator negotiation, paid ad production, and UGC management for brands requiring turnkey execution. Managed agency services are quoted individually based on deliverable scope.",
    sort: 110,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000013",
    category: "Account & privacy",
    question: "How do I request account deletion?",
    answer_md:
      "Submit an account deletion request to info@circlecommunity.in from your registered email address. We permanently remove your profile data within 30 days in accordance with data privacy regulations.",
    sort: 120,
    published: true,
  },
];
