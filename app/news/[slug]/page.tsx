import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostArticle } from "@/components/journal/post-views";
import { findPost, postsByKind } from "@/lib/content/posts";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return postsByKind("news").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost("news", slug);
  if (!post) return pageMetadata("News", "A CIRCLE news post.", "/news");
  return pageMetadata(post.title, post.summary, `/news/${post.slug}`);
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost("news", slug);
  if (!post) notFound();
  return <PostArticle post={post} />;
}
