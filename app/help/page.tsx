import type { Metadata } from "next";
import { Suspense } from "react";

import { NewsletterForm } from "@/components/forms/newsletter-form";
import { FaqList } from "@/components/help/faq-list";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";
import { getPublishedFaqs } from "@/lib/content/load-faqs";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Help & FAQ",
  "Answers about joining CIRCLE, brand collabs, 10% platform fees, video clipping, verification, and account settings.",
  "/help",
);

export default function HelpPage() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">Help & FAQ</p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display">
        Frequently asked questions
      </h1>
      <Suspense fallback={<p className="mt-10 text-silver">Loading questions...</p>}>
        <HelpFaqContent />
      </Suspense>
      <section className="mt-16 rounded-2xl border border-border p-6 sm:p-10">
        <h2 className="font-display text-title-sm font-medium">Still need help?</h2>
        <p className="mt-3 max-w-xl text-silver">
          Write to our support team. If you are reporting a profile or collab brief, please select the appropriate topic in the form.
        </p>
        <div className="mt-6">
          <PillLink href="/contact">Contact support</PillLink>
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

async function HelpFaqContent() {
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mt-10">
        <FaqList faqs={faqs} />
      </div>
    </>
  );
}
