export const site = {
  name: "CIRCLE",
  domain: "circlecommunity.in",
  url: "https://circlecommunity.in",
  tagline: "Where creativity connects",
  description:
    "CIRCLE is a free community for creators, influencers, freelancers, service providers, and brands. Find collabs, services, events, and free learning.",
  operator: "Portfolix Enterprise Pvt Ltd",
  operatorDetail:
    "Operated by Portfolix Enterprise Pvt Ltd, Kochi, India, with Portfolix.Media and Portfolix.Tech.",
} as const;

export const social = {
  instagram: {
    label: "Instagram",
    href: "https://www.instagram.com/circlecommunity.in",
  },
  whatsappChannel: {
    label: "WhatsApp Channel",
    href: "https://whatsapp.com/channel/0029Vb9Cri0J3jupnagNCe2D",
  },
  whatsappCommunity: {
    label: "WhatsApp Community",
    href: "https://chat.whatsapp.com/H5JBFr973TtAlF6hvpLsy5",
  },
  linkedin: { label: "LinkedIn", href: "[LINKEDIN_URL]" },
  youtube: { label: "YouTube", href: "[YOUTUBE_URL]" },
  email: { label: "Email", href: "info@circlecommunity.in" },
} as const;

export const primaryNav = [
  { href: "/#community", label: "Community" },
  { href: "/#collabs", label: "Collabs" },
  { href: "/#services", label: "Services" },
  { href: "/#events", label: "Events" },
  { href: "/learn", label: "Learn" },
  { href: "/brands", label: "For Brands" },
  { href: "/about", label: "About" },
] as const;

export const legalNav = [
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/community-guidelines", label: "Community guidelines" },
] as const;

export const offerings = [
  {
    title: "Collabs & bids",
    body: "Brands post a fixed budget or an open bid. Creators apply, or send a bid and a pitch.",
  },
  {
    title: "Barter collabs",
    body: "Trade a product or service for content. No cash changes hands on the brief.",
  },
  {
    title: "Services directory",
    body: "Find photographers, videographers, studios, podcast setups, writers, editors, and models.",
  },
  {
    title: "Events & awards",
    body: "Monthly meetups, community events, and periodic creator awards.",
  },
  {
    title: "Free webinars & bootcamps",
    body: "Learn AI tools, earning from home, becoming a creator, and running collabs.",
  },
  {
    title: "Perks & discounts",
    body: "Partner discounts on studios, gear, and tools, negotiated by CIRCLE.",
  },
  {
    title: "Recognition & leaderboards",
    body: "Points, badges, and monthly leaderboards for creators and brands.",
  },
  {
    title: "Trust & safety",
    body: "Verification levels, reporting, and removal of fake listings, fake collabs, and fraud.",
  },
] as const;

export const collabSteps = [
  {
    step: "01",
    title: "A brand posts the brief",
    body: "Fixed budget, open bid, or barter. Ad disclosure (#ad / #collab) is on by default.",
  },
  {
    step: "02",
    title: "Creators apply or bid",
    body: "Send an application, or a bid amount with a pitch. Brands can see rates when a creator has made them visible.",
  },
  {
    step: "03",
    title: "Both sides confirm the work",
    body: "The brand accepts one or more people. Payment, when there is any, is made directly between the parties. CIRCLE does not hold funds.",
  },
] as const;

export const upcomingEvents = [
  {
    title: "[PLACEHOLDER] Monthly meetup",
    type: "Meetup",
    when: "[PLACEHOLDER date]",
    where: "[PLACEHOLDER venue]",
  },
  {
    title: "[PLACEHOLDER] Community event",
    type: "Community",
    when: "[PLACEHOLDER date]",
    where: "[PLACEHOLDER city]",
  },
  {
    title: "[PLACEHOLDER] Free webinar",
    type: "Webinar",
    when: "[PLACEHOLDER date]",
    where: "Online",
  },
] as const;

export const learnSessions = [
  {
    title: "[PLACEHOLDER] AI tools for creators",
    kind: "Webinar",
    when: "[PLACEHOLDER date]",
  },
  {
    title: "[PLACEHOLDER] Earning from home",
    kind: "Bootcamp",
    when: "[PLACEHOLDER dates]",
  },
  {
    title: "[PLACEHOLDER] Becoming a content creator",
    kind: "Webinar",
    when: "[PLACEHOLDER date]",
  },
  {
    title: "[PLACEHOLDER] Doing collabs",
    kind: "Bootcamp",
    when: "[PLACEHOLDER dates]",
  },
] as const;

export const brandServices = [
  "Influencer marketing",
  "Influencer negotiation",
  "Social media marketing",
  "Ad campaigns and ad management",
  "Ad video production",
  "UGC content",
] as const;

export const creatorServices = [
  "Profile audit and optimisation",
  "Social media management — collabs, messages, posting, and growth",
] as const;

export const values = [
  {
    title: "Connection",
    body: "Creators, freelancers, service providers, and brands in one place.",
  },
  {
    title: "Collaboration",
    body: "Fixed collabs, open bids, and barter, with the terms written down.",
  },
  {
    title: "Creativity",
    body: "Photo, video, writing, editing, performance, and the spaces that hold the work.",
  },
  {
    title: "Innovation",
    body: "Free sessions on AI tools and practical ways to earn.",
  },
  {
    title: "Opportunity",
    body: "Collabs, services, perks, and awards. Membership stays free.",
  },
  {
    title: "Community",
    body: "Meetups, events, and recognition for people who show up.",
  },
] as const;

export function isPlaceholder(value: string) {
  return value.startsWith("[") && value.endsWith("]");
}
