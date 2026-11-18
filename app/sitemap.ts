import type { MetadataRoute } from "next";

import { guides } from "@/lib/content/guides";
import { posts } from "@/lib/content/posts";
import { agencyServices, servicePath } from "@/lib/content/agency-services";
import { CLIPPING_GUIDES } from "@/lib/clipping/guides-data";
import { site } from "@/lib/site";

const paths = [
  "",
  "/about",
  "/brands",
  "/creators",
  "/learn",
  "/membership",
  "/directory",
  "/collabs",
  "/clipping",
  "/clipping/campaigns",
  "/clipping/social-pr",
  "/clipping/how-it-works",
  "/clipping/for-brands",
  "/clipping/calculator",
  "/clipping/rules",
  "/clipping/faq",
  "/clipping/guides",
  "/clipping/leaderboard",
  "/events",
  "/giveaways",
  "/affiliates",
  "/leaderboard",
  "/challenges",
  "/journal",
  "/blog",
  "/news",
  "/updates",
  "/guides",
  "/promoters",
  "/recognition",
  "/help",
  "/contact",
  "/partners",
  "/resources",
  "/guidelines",
  "/legal/cookies",
  "/legal/grievance",
  "/legal/terms",
  "/legal/privacy",
  ...agencyServices.map((service) => servicePath(service)),
  ...guides.map((guide) => `/guides/${guide.slug}`),
  ...CLIPPING_GUIDES.map((g) => `/clipping/guides/${g.slug}`),
  ...posts.map((post) => `/${post.kind === "update" ? "updates" : post.kind}/${post.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
