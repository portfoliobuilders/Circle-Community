import type { MetadataRoute } from "next";

import { guides } from "@/lib/content/guides";
import { posts } from "@/lib/content/posts";
import { agencyServices, servicePath } from "@/lib/content/agency-services";
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
  ...posts.map((post) => `/${post.kind === "update" ? "updates" : post.kind}/${post.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
