import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/site/container";
import { SocialLink } from "@/components/site/social-link";
import { legalNav, site, social } from "@/lib/site";

const socialItems = [
  social.instagram,
  social.whatsappChannel,
  social.whatsappCommunity,
  social.linkedin,
  social.youtube,
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Image
            src="/brand/logo-white.png"
            alt="CIRCLE"
            width={300}
            height={300}
            className="size-[120px]"
          />
          <p className="mt-3 max-w-xs text-small text-silver">
            {site.tagline}. A Portfolix initiative.
          </p>
          <p className="mt-3 text-small text-silver">{site.operatorDetail}</p>
        </div>
        <div>
          <h2 className="text-small font-medium text-text">Social</h2>
          <ul className="mt-3 space-y-1">
            {socialItems.map((item) => (
              <li key={item.label} className="flex flex-col">
                <SocialLink href={item.href}>{item.label}</SocialLink>
                {item.href.startsWith("[") ? (
                  <span className="text-small text-silver">{item.href}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-small font-medium text-text">Contact</h2>
          <p className="mt-3">
            <SocialLink href={social.email.href}>
              {social.email.href.replace(/^mailto:/, "")}
            </SocialLink>
          </p>
        </div>
        <div>
          <h2 className="text-small font-medium text-text">Legal</h2>
          <ul className="mt-3 space-y-1">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center text-small text-silver underline-offset-4 hover:text-text hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
