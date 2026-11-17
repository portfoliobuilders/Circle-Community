import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PostArticle } from "@/components/journal/post-views";
import { findPost, postsByKind } from "@/lib/content/posts";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return postsByKind("blog").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost("blog", slug);
  if (!post) return pageMetadata("Blog", "A CIRCLE blog post.", "/blog");
  return pageMetadata(post.title, post.summary, `/blog/${post.slug}`);
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = findPost("blog", slug);
  if (!post) notFound();
  return <PostArticle post={post} />;
}
