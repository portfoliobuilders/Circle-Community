import type { Metadata } from "next";

import { PostList } from "@/components/journal/post-views";
import { postsByKind } from "@/lib/content/posts";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Updates",
  "A dated log of changes on CIRCLE. Each entry says what changed and what stayed the same.",
  "/updates",
);

export default function UpdatesPage() {
  return (
    <PostList
      eyebrow="Updates"
      title="What changed"
      intro="One entry per product change. Older entries stay here. Nothing is backdated."
      posts={postsByKind("update")}
    />
  );
}
