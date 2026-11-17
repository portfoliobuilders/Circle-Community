export type Guide = {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  sections: { heading: string; body: string }[];
};

export const guides: Guide[] = [
  {
    slug: "find-a-creator",
    title: "How a brand finds a creator on CIRCLE",
    summary: "Use the directory filters. A match is someone who listed that category and that kind of work.",
    updated: "16 November 2026",
    sections: [
      {
        heading: "What a match means",
        body: "CIRCLE suggests a creator when their profile category matches the campaign and they have said they are open to that work: a collab, an ad, a giveaway, or an affiliate. It is not a score, and it is not a promise of sales.",
      },
      {
        heading: "What you can read on the profile",
        body: "You can read the city, the category, the content they describe, the follower count, and the starting price if they chose to show it. Follower counts stay labelled self-reported until a reviewer marks them verified. CIRCLE never asks for a social password.",
      },
      {
        heading: "How you hire",
        body: "Post a collab with a fixed budget, an open bid, or a barter. Creators apply. You accept. You pay the creator directly. CIRCLE does not hold the money and does not calculate ad ROI.",
      },
    ],
  },
  {
    slug: "read-a-price",
    title: "How to read a creator's price",
    summary: "A starting price is a whole number of rupees. It appears only when the creator turns it on.",
    updated: "16 November 2026",
    sections: [
      {
        heading: "Price from",
        body: "The number is the creator's starting price in rupees, not a quote from CIRCLE and not a fee CIRCLE collects. If the price is hidden, ask through a collab brief. Do not treat a hidden price as zero.",
      },
      {
        heading: "What the price does not include",
        body: "Usage rights, whitelisting, and extra edits are part of the brief you write. If they are not in the brief, they are not agreed.",
      },
    ],
  },
  {
    slug: "giveaways",
    title: "How giveaways are listed",
    summary: "A giveaway on CIRCLE is a listing plus the link to the social post where people enter.",
    updated: "16 November 2026",
    sections: [
      {
        heading: "What we show",
        body: "The title, the prize described by the host, the end time if they set one, and the social link they provided. Entry happens on that social page, not inside CIRCLE.",
      },
      {
        heading: "Who can list one",
        body: "A creator or a brand with an account can list a giveaway. The host is responsible for running it and for any claim they make about the prize.",
      },
    ],
  },
  {
    slug: "affiliates",
    title: "Affiliate listings",
    summary: "A brand writes the offer and the link. CIRCLE does not set the commission.",
    updated: "16 November 2026",
    sections: [
      {
        heading: "Brand offers",
        body: "The brand describes the product, the terms, and the tracking link. Read those terms before you share the link. CIRCLE does not take a cut in v1 and does not pay the commission.",
      },
      {
        heading: "CIRCLE and Portfolix",
        body: "A promotion for CIRCLE or a Portfolix service is quoted separately. There is no published commission rate on this site. Ask through the contact form.",
      },
    ],
  },
  {
    slug: "ad-disclosure",
    title: "Mark a paid post",
    summary: "Collab briefs on CIRCLE require #ad or #collab.",
    updated: "16 November 2026",
    sections: [
      {
        heading: "The default",
        body: "Every collab brief keeps ad disclosure on. That follows the ASCI influencer guidelines. A giveaway or an affiliate post that is paid or gifted should be labelled the same way on the social network where it goes live.",
      },
    ],
  },
];

export function findGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
