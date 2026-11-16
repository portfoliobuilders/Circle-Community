import type { Metadata } from "next";

import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { SocialLink } from "@/components/site/social-link";
import { pageMetadata } from "@/lib/seo";
import { social } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "Join",
  "CIRCLE membership is free. Create an account, join the WhatsApp Channel, or follow on Instagram.",
);

export default function JoinPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">
        Join
      </p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display">
        Membership is free
      </h1>
      <div className="mt-6 max-w-2xl space-y-4 text-silver">
        <p>
          Create a profile, list what you do, and take part in collabs, events,
          and free learning. There is no paywall.
        </p>
        <p>
          People who apply to collabs confirm they are 18 or older. Brand
          accounts are separate from creator and service-provider accounts. One
          person can be both a creator and a service provider.
        </p>
      </div>
      <div className="mt-8 flex flex-col items-start gap-3">
        <PillLink href="/signup">Create account</PillLink>
        <SocialLink
          href={social.whatsappChannel.href}
          className="justify-center rounded-full border border-border px-5 no-underline hover:bg-surface hover:no-underline"
        >
          Join WhatsApp Channel
        </SocialLink>
        <SocialLink
          href={social.instagram.href}
          className="justify-center rounded-full border border-border px-5 no-underline hover:bg-surface hover:no-underline"
        >
          Follow on Instagram
        </SocialLink>
      </div>
    </Container>
  );
}
