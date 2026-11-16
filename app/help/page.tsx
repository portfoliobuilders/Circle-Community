import type { Metadata } from "next";

import { NewsletterForm } from "@/components/forms/newsletter-form";
import { FaqList } from "@/components/help/faq-list";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { getPublishedFaqs } from "@/lib/content/load-faqs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Help",
  "Answers about joining CIRCLE, collabs, payments, points, verification, and account deletion.",
);

export default async function HelpPage() {
  const faqs = await getPublishedFaqs();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer_md },
    })),
  };

  return (
    <Container className="py-16 sm:py-24">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p className="text-small tracking-[0.18em] text-silver uppercase">Help</p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display">
        Questions, answered
      </h1>
      <div className="mt-10">
        <FaqList faqs={faqs} />
      </div>
      <section className="mt-16 rounded-2xl border border-border p-6 sm:p-10">
        <h2 className="font-display text-title-sm font-medium">Still need help?</h2>
        <p className="mt-3 max-w-xl text-silver">
          Write to the team. If you are reporting a person or a collab, say so in the topic.
        </p>
        <div className="mt-6">
          <PillLink href="/contact">Contact the team</PillLink>
        </div>
      </section>
      <section className="mt-16">
        <h2 className="font-display text-title-sm font-medium">Newsletter</h2>
        <p className="mt-3 max-w-xl text-silver">
          Occasional notes from CIRCLE. Confirm the email before anything is sent.
        </p>
        <div className="mt-6">
          <NewsletterForm source="help" tone="secondary" />
        </div>
      </section>
    </Container>
  );
}
