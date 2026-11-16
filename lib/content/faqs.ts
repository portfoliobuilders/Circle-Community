export const faqCategories = [
  "Getting started",
  "Collabs & bids",
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
    question: "Is CIRCLE really free?",
    answer_md:
      "Yes. Joining is free, and there is no member paywall. Collab budgets are shown on the brief. When money is involved, the brand pays the creator directly. CIRCLE does not process payments in v1.",
    sort: 10,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000002",
    category: "Getting started",
    question: "Who can join?",
    answer_md:
      "Creators, influencers, freelancers, and service providers — photographers, videographers, script writers, editors, models, studio floors, podcast setups, and others — plus brands. One account can be a creator and a service provider. Brand accounts are separate.",
    sort: 20,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000003",
    category: "Getting started",
    question: "Can I join if I'm under 18?",
    answer_md:
      "You can take part in the community. You cannot apply to collabs. Collabs require an 18+ confirmation and a date of birth. v1 does not support verifiable parental consent for minors under India's DPDP Act.",
    sort: 30,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000004",
    category: "Safety & verification",
    question: "How do I get verified?",
    answer_md:
      "Verification uses a code you place in your bio. CIRCLE does not use the Instagram API for this, and it never asks for a social media password. Follower counts stay labelled self-reported until a reviewer confirms the number they see.",
    sort: 40,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000005",
    category: "Collabs & bids",
    question: "How do fixed, open-bid and barter collabs work?",
    answer_md:
      "Fixed: a brand posts a requirement and a budget in INR. Creators apply. The brand accepts one or more people.\n\nOpen bid: creators send a bid amount and a pitch. The brand picks.\n\nBarter: a product or service in exchange for content. No cash.\n\nAd disclosure (#ad / #collab) is on by default, in line with ASCI influencer guidelines. Brands see a creator's rates only when that creator has made them visible.",
    sort: 50,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000006",
    category: "Collabs & bids",
    question: "Does CIRCLE handle payments?",
    answer_md:
      "No. In v1 the brand pays the creator directly. CIRCLE records the agreement and the completion. It does not hold funds.",
    sort: 60,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000007",
    category: "Points & badges",
    question: "How are points and leaderboards calculated?",
    answer_md:
      "Points come only from verified events: completed collabs, events you attended, and tasks an admin has approved. Logins, likes, and other raw activity do not earn points. Leaderboards are monthly, for creators and for brands.",
    sort: 70,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000008",
    category: "Safety & verification",
    question: "How do I report a fake profile or scam collab?",
    answer_md:
      "Use the Report button on the profile, service, collab, or application. CIRCLE reviews reports and can remove fake listings, fake collabs, and fraud. For anything else, use the contact form and choose “Report a problem”.",
    sort: 80,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000009",
    category: "Events & learning",
    question: "Are webinars and bootcamps free?",
    answer_md:
      "Yes. Learning on CIRCLE is free. Sessions cover AI tools, earning from home, becoming a content creator, and doing collabs.",
    sort: 90,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000010",
    category: "Brands",
    question: "How do brands post a collab?",
    answer_md:
      "A brand posts a requirement as a fixed budget, an open bid, or a barter. Creators apply or bid. The brand accepts. Payment, when there is any, goes directly from the brand to the creator.",
    sort: 100,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000011",
    category: "Brands",
    question: "What paid services do Portfolix Media and Portfolix Tech offer?",
    answer_md:
      "These are lead-capture services, separate from free membership. For brands: influencer marketing, influencer negotiation, social media marketing, ad campaigns and ad management, ad video production, and UGC content. For creators: profile audit and optimisation, and social media management (collabs, messages, posting, growth). CIRCLE never asks for or stores a social media password. Prices are quoted separately and are not listed on the site.",
    sort: 110,
    published: true,
  },
  {
    id: "00000000-0000-4000-8000-000000000012",
    category: "Account & privacy",
    question: "How do I delete my account?",
    answer_md:
      "Account deletion from settings is not on the site yet. Email info@circlecommunity.in from the address on your account and ask for deletion. Do not send a social media password.",
    sort: 120,
    published: true,
  },
];
