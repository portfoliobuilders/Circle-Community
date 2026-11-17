import type { Metadata } from "next";

import { PostList } from "@/components/journal/post-views";
import { postsByKind } from "@/lib/content/posts";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Blog",
  "Notes from CIRCLE on collab briefs, applications, follower labels, and paid posts.",
  "/blog",
);

export default function BlogPage() {
  return (
    <PostList
      eyebrow="Blog"
      title="Notes for brands and creators"
      intro="Practical notes written by CIRCLE. The short versions live in the guides."
      posts={postsByKind("blog")}
    />
  );
}
