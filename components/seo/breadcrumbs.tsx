"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/site/container";
import { guides } from "@/lib/content/guides";
import { posts } from "@/lib/content/posts";
import { site } from "@/lib/site";

const labels: Record<string, string> = {
  about: "About",
  brands: "For brands",
  creators: "For creators",
  learn: "Learn",
  membership: "Membership",
  directory: "Directory",
  giveaways: "Giveaways",
  affiliates: "Affiliates",
  leaderboard: "Leaderboard",
  challenges: "Challenges",
  journal: "Journal",
  blog: "Blog",
  news: "News",
  updates: "Updates",
  guides: "Guides",
  promoters: "Promoters",
  collabs: "Collabs",
  events: "Events",
  recognition: "Points",
  help: "FAQ",
  contact: "Contact",
  partners: "Partners",
  resources: "Resources",
  guidelines: "Community guidelines",
  legal: "Legal",
  terms: "Terms",
  privacy: "Privacy",
  cookies: "Cookies",
  grievance: "Grievance officer",
  services: "Services",
  login: "Sign in",
  signup: "Create account",
  dashboard: "Dashboard",
  admin: "Admin",
  newsletter: "Newsletter",
  new: "New",
  settings: "Settings",
  confirm: "Confirm",
  unsubscribe: "Unsubscribe",
  messages: "Messages",
  faqs: "FAQs",
};

function crumbLabel(segment: string) {
  const titled = posts.find((post) => post.slug === segment)?.title ?? guides.find((guide) => guide.slug === segment)?.title;
  return titled ?? labels[segment] ?? segment.replace(/-/g, " ");
}

export function Breadcrumbs() {
  const pathname = usePathname();
  if (!pathname || pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    return { href, label: crumbLabel(segment) };
  });

  const itemListElement = [
    { "@type": "ListItem", position: 1, name: "Home", item: site.url },
    ...crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 2,
      name: crumb.label,
      item: `${site.url}${crumb.href}`,
    })),
  ];

  return (
    <Container className="pt-4">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement,
        }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small text-silver">
          <li>
            <Link href="/" className="underline-offset-4 hover:text-text hover:underline">
              Home
            </Link>
          </li>
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                {last ? (
                  <span className="text-text">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="underline-offset-4 hover:text-text hover:underline">
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </Container>
  );
}
