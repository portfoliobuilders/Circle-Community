import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

const paths = [
  "",
  "/about",
  "/brands",
  "/creators",
  "/learn",
  "/join",
  "/legal/terms",
  "/legal/privacy",
  "/legal/community-guidelines",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
