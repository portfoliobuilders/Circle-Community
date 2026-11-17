export type PostKind = "blog" | "news" | "update";

export type Post = {
  slug: string;
  kind: PostKind;
  title: string;
  summary: string;
  published: string;
  publishedIso: string;
  sections: { heading: string; body: string }[];
};

export const postKinds = {
  blog: { href: "/blog", label: "Blog", singular: "Blog" },
  news: { href: "/news", label: "News", singular: "News" },
  update: { href: "/updates", label: "Updates", singular: "Update" },
} as const;

export const posts: Post[] = [
  {
    slug: "write-the-brief",
    kind: "blog",
    title: "What to put in a collab brief",
    summary: "A brief is a fixed budget, an open bid, or a barter. Say what you need and how the creator gets paid.",
    published: "16 November 2026",
    publishedIso: "2026-11-16",
    sections: [
      {
        heading: "Pick one kind",
        body: "A fixed collab has a budget in whole rupees. An open bid asks creators to name their price. A barter names the product or service and has no cash budget. Mixing those in one brief makes the offer unclear.",
      },
      {
        heading: "Say what the work is",
        body: "Name the platform, the number of posts or the deliverable, and the date you need it. If you need usage rights, whitelisting, or extra edits, write that in the brief. If it is not written, it is not agreed.",
      },
      {
        heading: "Payment and the label",
        body: "You pay the creator directly. CIRCLE shows the budget and does not hold the money. Ad disclosure stays on. The live post should carry #ad or #collab.",
      },
    ],
  },
  {
    slug: "before-you-apply",
    kind: "blog",
    title: "What to check before you apply",
    summary: "Read the kind of collab, the budget or the barter, and whether your profile says you do that work.",
    published: "16 November 2026",
    publishedIso: "2026-11-16",
    sections: [
      {
        heading: "Read the offer",
        body: "A fixed brief already has a rupee amount. An open bid is where you enter yours, as a whole number. A barter should say what you receive. If that line is missing, ask in the pitch instead of guessing.",
      },
      {
        heading: "Match it to your profile",
        body: "Your category, the content you describe, and the work you marked yourself open to are what a brand reads. A starting price appears only if you turned it on. Follower counts stay labelled self-reported until a reviewer confirms them.",
      },
      {
        heading: "Who can apply",
        body: "Collabs are for people who are 18 or older. The brand pays you directly. CIRCLE does not take a fee on the collab in v1.",
      },
    ],
  },
  {
    slug: "read-the-follower-label",
    kind: "blog",
    title: "How to read a follower count",
    summary: "The number is the creator’s own figure until CIRCLE marks it verified. The label tells you which.",
    published: "16 November 2026",
    publishedIso: "2026-11-16",
    sections: [
      {
        heading: "Two labels",
        body: "Self-reported means the creator typed the count. Verified means a reviewer has confirmed it. CIRCLE does not ask for a social password. Verification uses a code in the bio, not a login to the account.",
      },
      {
        heading: "The promoter mark",
        body: "A creator profile at 1,000 followers or more can show the Promoter mark. The same label still applies. Self-reported and verified are not the same thing, and the mark is not a guarantee of a collab.",
      },
    ],
  },
  {
    slug: "mark-a-paid-post",
    kind: "blog",
    title: "When a post needs a paid label",
    summary: "A collab, a gifted giveaway, and a paid affiliate mention should be labelled on the network where they go live.",
    published: "16 November 2026",
    publishedIso: "2026-11-16",
    sections: [
      {
        heading: "Collabs",
        body: "Every collab brief on CIRCLE keeps #ad or #collab on. That follows the ASCI influencer guidelines. The label belongs on the social post, not only inside CIRCLE.",
      },
      {
        heading: "Giveaways and affiliates",
        body: "A giveaway listed here sends people to the host’s social post to enter. An affiliate offer uses the terms and the tracking link the brand wrote. If the mention is paid or gifted, label it on that network. CIRCLE does not set the commission and does not pay it.",
      },
    ],
  },
  {
    slug: "directory-is-open",
    kind: "news",
    title: "The creator directory is open",
    summary: "Brands can filter by category and by the work a creator says they are open to.",
    published: "16 November 2026",
    publishedIso: "2026-11-16",
    sections: [
      {
        heading: "What you can filter",
        body: "Categories include automobile, comedy, education, finance, parenting, beauty, fitness, food, gaming, tech, and travel, plus lifestyle, fashion, music, and other. You can also filter for collabs, ads, giveaways, or affiliate offers.",
      },
      {
        heading: "What a match is",
        body: "A match is a creator who saved that category and that kind of work on their profile. It is not a ranking and it is not a sales forecast. Profiles appear after a creator saves one. Empty filters stay empty until then.",
      },
    ],
  },
  {
    slug: "giveaways-and-affiliate-listings",
    kind: "news",
    title: "Giveaways and affiliate offers can be listed",
    summary: "Hosts list a giveaway with the social post where people enter. Brands list an affiliate offer with their own terms.",
    published: "16 November 2026",
    publishedIso: "2026-11-16",
    sections: [
      {
        heading: "Giveaways",
        body: "A creator or a brand with an account can list a title, a prize, the details, an optional end time, and an https link to the social post. Entry happens on that post. CIRCLE does not run the draw.",
      },
      {
        heading: "Affiliate offers",
        body: "A brand account writes the product, the terms, and the tracking link. There is no commission rate published by CIRCLE. A promotion for CIRCLE or a Portfolix service is quoted through the contact form.",
      },
    ],
  },
  {
    slug: "leaderboard-challenges-promoters",
    kind: "news",
    title: "Points, challenges, and the promoter mark",
    summary: "The leaderboard counts confirmed points for creators and posted collabs for brands. Challenges wait for an admin to publish them.",
    published: "16 November 2026",
    publishedIso: "2026-11-16",
    sections: [
      {
        heading: "Points",
        body: "Creator points come from a completed collab, an event they attended, or a task an admin has confirmed. Likes and logins do not count. Points have no cash value. Brands are listed by how many collabs they have posted, not by money spent.",
      },
      {
        heading: "Promoters",
        body: "A creator with 1,000 or more followers can show the Promoter mark. The follower label stays self-reported until it is verified. Social promotion from CIRCLE is requested through the contact form. It is not automatic.",
      },
    ],
  },
  {
    slug: "2026-11-16",
    kind: "update",
    title: "16 November 2026",
    summary: "Directory filters, giveaways, affiliate listings, the leaderboard, challenges, guides, and the promoter mark.",
    published: "16 November 2026",
    publishedIso: "2026-11-16",
    sections: [
      {
        heading: "What changed",
        body: "Creator profiles can now store a category, a content summary, social links, a starting price, and whether the creator is open to collabs, ads, giveaways, or affiliate offers. The directory can be filtered on those fields. Giveaways, affiliate offers, the leaderboard, challenges, guides, and the promoter page are public.",
      },
      {
        heading: "What did not change",
        body: "Membership stays free. CIRCLE still does not take collab payment. Follower counts stay labelled. These pages show real rows only. There is no sample creator list.",
      },
    ],
  },
];

export function postsByKind(kind: PostKind) {
  return posts.filter((post) => post.kind === kind);
}

export function findPost(kind: PostKind, slug: string) {
  return posts.find((post) => post.kind === kind && post.slug === slug);
}
