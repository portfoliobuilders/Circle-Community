export const creatorCategories = [
  { slug: "automobile", label: "Automobile" },
  { slug: "comedy", label: "Comedy" },
  { slug: "education", label: "Education" },
  { slug: "finance", label: "Finance" },
  { slug: "parenting", label: "Parenting" },
  { slug: "beauty", label: "Beauty" },
  { slug: "fitness", label: "Fitness" },
  { slug: "food", label: "Food" },
  { slug: "gaming", label: "Gaming" },
  { slug: "tech", label: "Tech" },
  { slug: "travel", label: "Travel" },
  { slug: "lifestyle", label: "Lifestyle" },
  { slug: "fashion", label: "Fashion" },
  { slug: "music", label: "Music" },
  { slug: "other", label: "Other" },
] as const;

export type CreatorCategory = (typeof creatorCategories)[number]["slug"];

export const campaignFits = [
  { slug: "collab", label: "Collab", field: "open_to_collab" },
  { slug: "ads", label: "Ads", field: "open_to_ads" },
  { slug: "giveaway", label: "Giveaway", field: "open_to_giveaway" },
  { slug: "affiliate", label: "Affiliate", field: "open_to_affiliate" },
] as const;

export function categoryLabel(slug: string | null) {
  return creatorCategories.find((item) => item.slug === slug)?.label ?? null;
}
