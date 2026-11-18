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
  "Pricing, project milestones, and exact deliverables are provided in a custom quote following brief evaluation.";

export const agencyServices: AgencyService[] = [
  {
    slug: "influencer-marketing",
    audience: "brand",
    title: "Influencer marketing",
    summary:
      "Portfolix plans and coordinates creator marketing campaigns for brands.",
    who: "Brands seeking creator partnerships for product launches, seasonal pushes, or brand awareness.",
    included: [
      "Custom brief development aligning product messaging with targeted creator niches.",
      "Shortlist of vetted creators tailored to your audience profile.",
      "End-to-end campaign coordination and milestone tracking.",
      quotedLater,
    ],
    steps: [
      { title: "Submit brief", body: "Outline your product, timeline, key deliverables, and target audience." },
      { title: "Review scope", body: "Portfolix provides a tailored creator plan and transparent pricing." },
      { title: "Launch campaign", body: "Production begins upon quote approval and mutual agreement." },
    ],
    faqs: [
      {
        question: "How is the campaign budget handled?",
        answer: "Managed agency campaigns are quoted and contracted directly through Portfolix with clear milestone terms.",
      },
      {
        question: "Do you require creator social logins?",
        answer: "Never. We coordinate via official briefs and never request account passwords.",
      },
    ],
  },
  {
    slug: "influencer-negotiation",
    audience: "brand",
    title: "Influencer negotiation",
    summary:
      "Portfolix negotiates deliverable scopes, commercial rates, and licensing rights on your behalf.",
    who: "Brands that have identified creator candidates and require professional negotiation and contract framing.",
    included: [
      "Evaluation of proposed deliverables, usage rights, and exclusivity terms.",
      "Direct commercial negotiation based on industry benchmarks.",
      "Standardised terms sheet ready for formal sign-off.",
      quotedLater,
    ],
    steps: [
      { title: "Share creator list", body: "Provide handles, desired deliverables, and schedule expectations." },
      { title: "Negotiate terms", body: "We align scope, usage rights, and compensation within your parameters." },
      { title: "Confirm agreement", body: "Finalise terms with creator approval prior to execution." },
    ],
    faqs: [
      {
        question: "Do you guarantee specific rates?",
        answer: "Rates depend on creator agreement and market dynamics. We negotiate the best possible value for your scope.",
      },
      {
        question: "Are contracts handled securely?",
        answer: "Yes. All terms are documented in written agreements signed by both parties.",
      },
    ],
  },
  {
    slug: "social-media-marketing",
    audience: "brand",
    title: "Social media marketing",
    summary:
      "Portfolix manages organic content strategy and channel execution for brand accounts.",
    who: "Brands looking to expand their organic social footprint and community engagement.",
    included: [
      "Channel strategy across primary visual platforms.",
      "Content calendar planning and visual creative direction.",
      "Monthly performance reporting on engagement and growth.",
      quotedLater,
    ],
    steps: [
      { title: "Identify channels", body: "Share current social accounts and target quarterly goals." },
      { title: "Review proposal", body: "Receive a tailored scope of work covering posting frequency and assets." },
      { title: "Secure access", body: "Delegate access via official business manager roles. Passwords are never requested." },
    ],
    faqs: [
      {
        question: "How do you access brand accounts?",
        answer: "Access is granted strictly via Meta Business Suite, Google Workspace, or partner manager permissions.",
      },
      {
        question: "Is there a standard monthly retainer?",
        answer: "Retainers vary by posting cadence and asset creation needs, confirmed in your proposal.",
      },
    ],
  },
  {
    slug: "ad-campaigns",
    audience: "brand",
    title: "Ad campaigns and performance management",
    summary:
      "Portfolix structures and manages paid performance campaigns across digital ad networks.",
    who: "Brands requiring managed paid advertising with focused return on ad spend.",
    included: [
      "Campaign architecture and target audience segmentation.",
      "Creative testing matrix and ongoing bid optimisation.",
      "Transparent reporting; media spend billed directly through your own ad accounts.",
      quotedLater,
    ],
    steps: [
      { title: "Outline goals", body: "Specify target ROAS, target geographies, and monthly ad budget." },
      { title: "Define structure", body: "We present media strategy, creative requirements, and management fees." },
      { title: "Go live", body: "Campaigns launch after creative and audience approvals." },
    ],
    faqs: [
      {
        question: "Do you take a percentage markup on media spend?",
        answer: "Management fees are fixed or tiered transparently in your quote; media spend is paid directly to the ad network.",
      },
      {
        question: "Does CIRCLE bill my payment card?",
        answer: "No. Ad spend is charged directly to your business ad account.",
      },
    ],
  },
  {
    slug: "ad-video-production",
    audience: "brand",
    title: "Ad video production",
    summary:
      "Portfolix produces commercial vertical video assets tailored for performance advertising.",
    who: "Brands requiring high-converting short-form video creatives for social ad placements.",
    included: [
      "Concept development, script writing, and hook variations.",
      "Professional shoot coordination, editing, and sound design.",
      "Clear commercial usage rights specified in your production schedule.",
      quotedLater,
    ],
    steps: [
      { title: "Send creative brief", body: "Share product highlights, target formats, and campaign timelines." },
      { title: "Approve production plan", body: "Review script drafts and production milestones before filming." },
      { title: "Receive assets", body: "Final master files delivered in vertical (9:16) and square formats." },
    ],
    faqs: [
      {
        question: "What is the typical production timeline?",
        answer: "Standard production spans 7 to 14 working days from script sign-off, as detailed in your quote.",
      },
      {
        question: "Can we request revisions?",
        answer: "Every production includes two rounds of editorial review for text overlays, pacing, and color.",
      },
    ],
  },
  {
    slug: "ugc-content",
    audience: "brand",
    title: "UGC content production",
    summary:
      "Portfolix sources authentic creator-led video content for digital advertising and brand channels.",
    who: "Brands seeking relatable user-generated style testimonials, demonstrations, and unboxing videos.",
    included: [
      "Creative direction and talking point outlines for creators.",
      "Vetted creator talent matching your demographic profile.",
      "Raw and edited vertical video assets delivered with digital usage rights.",
      quotedLater,
    ],
    steps: [
      { title: "Define specifications", body: "Specify product quantity, creator profiles, and core benefits." },
      { title: "Talent selection", body: "Approve selected creators and script angles." },
      { title: "Asset delivery", body: "Review and download approved creator videos via secure digital drive." },
    ],
    faqs: [
      {
        question: "How are UGC creators compensated?",
        answer: "Creator compensation is included transparently in the agency quote and disbursed by Portfolix.",
      },
      {
        question: "Can we use UGC videos in paid ads?",
        answer: "Yes. Paid ad digital usage rights are included in the agreed production quote.",
      },
    ],
  },
  {
    slug: "profile-audit",
    audience: "creator",
    title: "Profile audit and growth review",
    summary:
      "Portfolix reviews your public creator profiles and delivers an actionable growth and rate-card assessment.",
    who: "Creators seeking an objective evaluation of their profile positioning, engagement, and pitch materials.",
    included: [
      "Review of public profile aesthetics, bio messaging, and content consistency.",
      "Rate-card benchmarking against current Indian creator economy standards.",
      "Structured written report with immediate tactical recommendations.",
      quotedLater,
    ],
    steps: [
      { title: "Submit handle", body: "Provide your public profile handle and current creator objectives." },
      { title: "Review process", body: "Our team evaluates public metrics, consistency, and brand appeal." },
      { title: "Receive report", body: "Get your actionable review document within 5 business days." },
    ],
    faqs: [
      {
        question: "Do you require my social media password?",
        answer: "Never. We evaluate public profile elements and never request private login credentials.",
      },
      {
        question: "How much does a profile audit cost?",
        answer: "Audit options and pricing are shared upon reviewing your profile niche and goals.",
      },
    ],
  },
  {
    slug: "social-media-management",
    audience: "creator",
    title: "Social media management for creators",
    summary:
      "Portfolix provides dedicated operational support for creator communications, collab pitches, and posting schedules.",
    who: "Full-time creators requiring administrative support for brand inbound enquiries and content organisation.",
    included: [
      "Inbound brand enquiry management and brief vetting.",
      "Content scheduling and posting coordination.",
      "Collab contract administration ensuring timely milestone delivery.",
      quotedLater,
    ],
    steps: [
      { title: "Discuss requirements", body: "Identify operational bottlenecks in your daily workflow." },
      { title: "Propose support scope", body: "Receive a defined management scope and monthly service retainer." },
      { title: "Establish workflows", body: "Integrate communication channels with zero password sharing." },
    ],
    faqs: [
      {
        question: "Will you ever ask for my account password?",
        answer: "Never. Workflow coordination is handled via shared workspaces and business delegate tools.",
      },
      {
        question: "Does management guarantee brand partnerships?",
        answer: "While we actively pitch and vet briefs on your behalf, partnerships depend on brand match and campaign schedules.",
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
