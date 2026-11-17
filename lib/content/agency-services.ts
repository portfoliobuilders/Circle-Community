export type AgencyAudience = "brand" | "creator";

export type AgencyService = {
  slug: string;
  audience: AgencyAudience;
  title: string;
  summary: string;
  who: string;
  included: string[];
  steps: { title: string; body: string }[];
  faqs: { question: string; answer: string }[];
};

const quotedLater =
  "Price, timing, and the exact deliverable list are quoted after we read your brief. They are not published here. [PLACEHOLDER]";

export const agencyServices: AgencyService[] = [
  {
    slug: "influencer-marketing",
    audience: "brand",
    title: "Influencer marketing",
    summary:
      "Portfolix plans creator campaigns for brands. CIRCLE records the enquiry. It does not run the campaign software or hold the budget.",
    who: "Brands that want creators to make and publish content for a product, a launch, or an ongoing campaign.",
    included: [
      "A written brief based on what you send: product, audience, and the kind of content you need.",
      "A shortlist of creator directions for you to approve. Follower counts stay labelled self-reported until verified.",
      "Coordination of the agreed collabs. Payment, when there is any, is arranged in the quote. CIRCLE does not hold funds in v1.",
      quotedLater,
    ],
    steps: [
      { title: "Send the brief", body: "Tell us the product, the platforms, and what the content needs to do." },
      { title: "We reply with a scope", body: "Portfolix says what it can take on. There is no public rate card." },
      { title: "You approve", body: "Work starts only after you accept the quote and the plan." },
    ],
    faqs: [
      {
        question: "Does CIRCLE take the campaign budget?",
        answer: "No. CIRCLE does not process payments in v1. Agency fees are quoted by Portfolix and paid directly.",
      },
      {
        question: "Will you ask for a creator's password?",
        answer: "No. We never ask for or store social media passwords.",
      },
    ],
  },
  {
    slug: "influencer-negotiation",
    audience: "brand",
    title: "Influencer negotiation",
    summary:
      "Portfolix helps a brand and a creator agree the scope and the fee. CIRCLE does not sit in the money flow.",
    who: "Brands that already know which creators they want and need help settling terms.",
    included: [
      "A read of the brief you provide: deliverables, usage, and deadlines.",
      "Negotiation of scope and fee with the creator, on your instruction.",
      "The agreed terms written back to you. The contract form is [PLACEHOLDER] until legal supplies it.",
      quotedLater,
    ],
    steps: [
      { title: "Share the creators and the brief", body: "Names, handles, and what you want them to deliver." },
      { title: "We negotiate", body: "We talk through scope and fee. You decide what to accept." },
      { title: "You confirm", body: "Nothing is booked until you approve the terms." },
    ],
    faqs: [
      {
        question: "Do you guarantee a fee?",
        answer: "No. The fee is whatever you and the creator agree. We do not publish sample rates.",
      },
      {
        question: "Can the creator be paid through CIRCLE?",
        answer: "Not in v1. Payment is direct between the parties.",
      },
    ],
  },
  {
    slug: "social-media-marketing",
    audience: "brand",
    title: "Social media marketing",
    summary:
      "Portfolix can run social marketing for a brand's own channels. This page only collects the enquiry.",
    who: "Brands that want help with posting, campaign ideas, and day-to-day social marketing.",
    included: [
      "A scope for the channels you name. Which networks and how often we post is [PLACEHOLDER] until the brief is agreed.",
      "Content and campaign work described in the quote, not a fixed package on this page.",
      "No login is collected on this form. We will never ask for your password.",
    ],
    steps: [
      { title: "Tell us the channels", body: "Which accounts, and what you want them to do." },
      { title: "We propose a scope", body: "You see the work and the fee before anything starts." },
      { title: "You approve access separately", body: "If a channel needs access, that is arranged outside this form. Never send a password here." },
    ],
    faqs: [
      {
        question: "Can I paste my password in the form?",
        answer: "No. Do not send passwords. We will not ask for them.",
      },
      {
        question: "Is there a monthly price on this page?",
        answer: "No. The fee is quoted after the scope is clear.",
      },
    ],
  },
  {
    slug: "ad-campaigns",
    audience: "brand",
    title: "Ad campaigns and ad management",
    summary:
      "Portfolix can plan and manage paid ad campaigns. Ad spend is paid to the ad platform by the brand, not through CIRCLE.",
    who: "Brands that want help setting up and managing paid ads.",
    included: [
      "Campaign structure based on the product and the outcome you describe.",
      "Management of the campaigns named in the quote. Platforms are [PLACEHOLDER] until we confirm which accounts you already have.",
      "Ad spend stays on your ad account. CIRCLE does not hold that money.",
    ],
    steps: [
      { title: "Describe the campaign", body: "Product, audience, and where you already advertise, if anywhere." },
      { title: "We quote the management", body: "The management fee and the suggested spend are separate, and both are quoted." },
      { title: "You approve", body: "Campaigns go live only after you accept." },
    ],
    faqs: [
      {
        question: "Do you mark up the ad spend?",
        answer: "Any fee is written in the quote. It is not listed on this page.",
      },
      {
        question: "Will CIRCLE charge the ad account?",
        answer: "No. You pay the platform from your own account.",
      },
    ],
  },
  {
    slug: "ad-video-production",
    audience: "brand",
    title: "Ad video production",
    summary:
      "Portfolix produces video for ads. Length, cast, locations, and usage are scoped per job.",
    who: "Brands that need a video made for paid placement or a campaign.",
    included: [
      "A production plan from your brief: what the video must say and where it will run.",
      "Shoot and edit as described in the quote. Duration and deliverable formats are [PLACEHOLDER] until scoped.",
      "Usage rights are written in the quote. They are not assumed on this page.",
    ],
    steps: [
      { title: "Send the product and the placement", body: "Where the video will run, and what it needs to show." },
      { title: "We scope the production", body: "You get the plan and the fee before a shoot is booked." },
      { title: "You approve the cut", body: "The finished film follows the approval steps in the quote." },
    ],
    faqs: [
      {
        question: "Is there a standard video price?",
        answer: "No. Production depends on the brief. The price is quoted, not listed here.",
      },
      {
        question: "Do you store platform passwords for the upload?",
        answer: "No. We never ask for or store social media passwords.",
      },
    ],
  },
  {
    slug: "ugc-content",
    audience: "brand",
    title: "UGC content",
    summary:
      "Portfolix commissions user-generated-style content from creators for a brand. Volume and usage are agreed in the quote.",
    who: "Brands that need creator-made content they can use in ads or on their own channels.",
    included: [
      "A brief for the content: product, talking points, and where it will be used.",
      "Creator-made assets as specified in the quote. The number of videos is [PLACEHOLDER] until you set the volume.",
      "Usage is limited to what the quote says. CIRCLE does not grant extra rights on this page.",
    ],
    steps: [
      { title: "Describe the content", body: "Product, platforms, and how you want to use the files." },
      { title: "We quote volume and usage", body: "You approve the creators' direction and the fee." },
      { title: "Files are delivered", body: "Delivery method is [PLACEHOLDER] and is confirmed in the quote." },
    ],
    faqs: [
      {
        question: "Are the creators paid through CIRCLE?",
        answer: "Not in v1. Fees in an agency job are part of the Portfolix quote and are paid directly.",
      },
      {
        question: "Can I send a password so you can post the content?",
        answer: "No. Do not send passwords.",
      },
    ],
  },
  {
    slug: "profile-audit",
    audience: "creator",
    title: "Profile audit and optimisation",
    summary:
      "Portfolix reviews a creator's public profile and recommends changes. The form asks for a handle and your goals. We will never ask for your password.",
    who: "Creators who want a review of a public profile and practical changes to make.",
    included: [
      "A review of the public profile you name.",
      "Written recommendations. The document format is [PLACEHOLDER] until the first audits set it.",
      "No login, no password, and no posting on your behalf in this service.",
    ],
    steps: [
      { title: "Send the handle and the goal", body: "Tell us which profile and what you want to improve." },
      { title: "We confirm we can review it", body: "The profile must be public. We do not ask you to sign in." },
      { title: "You receive the notes", body: "What you do with them is up to you." },
    ],
    faqs: [
      {
        question: "Do you need my password?",
        answer: "No. We will never ask for your password.",
      },
      {
        question: "Is the audit free?",
        answer: "Membership of CIRCLE is free. This audit is a Portfolix service and is quoted. The price is not listed here.",
      },
    ],
  },
  {
    slug: "social-media-management",
    audience: "creator",
    title: "Social media management",
    summary:
      "Portfolix can handle collabs, messages, posting, and growth for a creator. This page only collects the request. We will never ask for your password.",
    who: "Creators who want help running collabs, messages, posting, or growth on their accounts.",
    included: [
      "The work you ask for: collabs, messages, posting, or growth. The mix is agreed per creator.",
      "How account access is granted, if it is needed, is [PLACEHOLDER]. It is never a password sent through this form.",
      "CIRCLE does not become the owner of the account.",
    ],
    steps: [
      { title: "Send the handle and the goal", body: "Say which account and what you want done." },
      { title: "We scope the work", body: "You see the tasks and the fee before we start." },
      { title: "Access is arranged off this form", body: "If access is required, we will say how. Do not type a password here." },
    ],
    faqs: [
      {
        question: "Will you ask me to share my password?",
        answer: "No. We will never ask for your password.",
      },
      {
        question: "Does this include getting me brand deals?",
        answer: "Only if that is in the scope you approve. It is not an automatic promise.",
      },
    ],
  },
];

export function servicesFor(audience: AgencyAudience) {
  return agencyServices.filter((service) => service.audience === audience);
}

export function findService(slug: string) {
  return agencyServices.find((service) => service.slug === slug);
}

export function servicePath(service: AgencyService) {
  const root = service.audience === "brand" ? "/brands/services" : "/creators/services";
  return `${root}/${service.slug}`;
}
