import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/contact-form";
import { Container } from "@/components/site/container";
import { SocialLink } from "@/components/site/social-link";
import { pageMetadata } from "@/lib/seo";
import { isPlaceholder, site, social } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Contact",
  "Write to CIRCLE about membership, partnerships, brands, press, or a problem.",
  "/contact",
);

const channels = [
  social.instagram,
  social.whatsappChannel,
  social.whatsappCommunity,
  social.linkedin,
  social.youtube,
].filter((item) => !isPlaceholder(item.href));

export default function ContactPage() {
  return (
    <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="text-small tracking-[0.18em] text-silver uppercase">Contact</p>
        <h1 className="font-display mt-4 text-display-sm font-medium tracking-tight uppercase sm:text-display">
          Talk to the team
        </h1>
        <p className="mt-4 max-w-xl text-silver">
          We aim to reply within {site.responseTime}.
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
      <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-title-sm font-medium">Other ways</h2>
        <p className="mt-4 text-small text-silver">Email</p>
        <SocialLink href={social.email.href}>{social.email.href.replace(/^mailto:/, "")}</SocialLink>
        <p className="mt-4 text-small text-silver">WhatsApp Community</p>
        <SocialLink href={social.whatsappCommunity.href}>Join the community</SocialLink>
        <p className="mt-4 text-small text-silver">Office</p>
        <p className="text-text">{site.address}</p>
        <ul className="mt-6 space-y-1">
          {channels.map((item) => (
            <li key={item.label}>
              <SocialLink href={item.href}>{item.label}</SocialLink>
            </li>
          ))}
        </ul>
      </aside>
    </Container>
  );
}
