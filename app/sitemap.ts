import type { MetadataRoute } from "next";

import { agencyServices, servicePath } from "@/lib/content/agency-services";
import { site } from "@/lib/site";

const paths = [
  "",
  "/about",
  "/brands",
  "/creators",
  "/learn",
  "/join",
  "/help",
  "/contact",
  "/partners",
  "/resources",
  "/legal/terms",
  "/legal/privacy",
  "/legal/community-guidelines",
  ...agencyServices.map((service) => servicePath(service)),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
