import type { Metadata } from "next";

import { PostList } from "@/components/journal/post-views";
import { postsByKind } from "@/lib/content/posts";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "News",
  "Product news from CIRCLE: the directory, giveaways, affiliate listings, points, and promoters.",
  "/news",
);

export default function NewsPage() {
  return (
    <PostList
      eyebrow="News"
      title="News from CIRCLE"
      intro="These are announcements about the product. They are not press clippings and they do not include member features until there is a real recipient."
      posts={postsByKind("news")}
    />
  );
}
