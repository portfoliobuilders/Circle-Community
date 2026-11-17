import type { Metadata } from "next";

import { site } from "@/lib/site";

const indexable = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export const noIndex: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false, noimageindex: true },
};

function snippet(text: string) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 160) return clean;
  return `${clean.slice(0, 157).trimEnd()}…`;
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const canonical = path.startsWith("/") ? path : `/${path}`;
  const summary = snippet(description);
  return {
    title,
    description: summary,
    alternates: { canonical },
    robots: indexable,
    openGraph: {
      title: `${title} · ${site.name}`,
      description: summary,
      url: canonical,
      siteName: site.name,
      locale: "en_IN",
      type: "website",
    },
  };
}
