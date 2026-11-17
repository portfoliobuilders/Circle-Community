import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostArticle } from "@/components/journal/post-views";
import { findPost, postsByKind } from "@/lib/content/posts";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return postsByKind("update").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost("update", slug);
  if (!post) return pageMetadata("Update", "A CIRCLE product update.", "/updates");
  return pageMetadata(post.title, post.summary, `/updates/${post.slug}`);
}

export default async function UpdatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost("update", slug);
  if (!post) notFound();
  return <PostArticle post={post} />;
}
