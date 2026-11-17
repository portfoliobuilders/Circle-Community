import Link from "next/link";

import { LeadForm } from "@/components/leads/lead-form";
import { Container } from "@/components/site/container";
import { type AgencyService } from "@/lib/content/agency-services";

export function ServiceDetail({ service }: { service: AgencyService }) {
  const parent = service.audience === "brand" ? "/brands" : "/creators";
  const parentLabel = service.audience === "brand" ? "For brands" : "For creators";

  return (
    <Container className="py-16 sm:py-24">
      <p className="text-small tracking-[0.18em] text-silver uppercase">
        <Link href={parent} className="hover:text-text">{parentLabel}</Link>
      </p>
      <h1 className="font-display mt-4 max-w-3xl text-display-sm font-medium tracking-tight uppercase sm:text-display">
        {service.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lead text-silver">{service.summary}</p>

      <h2 className="font-display mt-14 text-title-sm font-medium">Who it is for</h2>
      <p className="mt-3 max-w-2xl text-silver">{service.who}</p>

      <h2 className="font-display mt-14 text-title-sm font-medium">What is included</h2>
      <ul className="mt-4 grid max-w-2xl gap-3">
        {service.included.map((item) => (
          <li key={item} className="rounded-2xl border border-border bg-surface px-5 py-4 text-silver">
            {item}
          </li>
        ))}
      </ul>

      <h2 className="font-display mt-14 text-title-sm font-medium">How it works</h2>
      <ol className="mt-4 grid max-w-2xl gap-6">
        {service.steps.map((step, index) => (
          <li key={step.title}>
            <p className="font-display text-small tracking-[0.16em] text-silver">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="font-display mt-2 text-lead font-medium">{step.title}</h3>
            <p className="mt-2 text-silver">{step.body}</p>
          </li>
        ))}
      </ol>

      <h2 className="font-display mt-14 text-title-sm font-medium">Questions</h2>
      <dl className="mt-4 max-w-2xl divide-y divide-border border-y border-border">
        {service.faqs.map((faq) => (
          <div key={faq.question} className="py-5">
            <dt className="font-medium">{faq.question}</dt>
            <dd className="mt-2 text-silver">{faq.answer}</dd>
          </div>
        ))}
      </dl>

      <section id="lead-form" className="mt-16 scroll-mt-24 max-w-2xl rounded-2xl border border-border p-6 sm:p-10">
        <h2 className="font-display text-title-sm font-medium">Talk to our team</h2>
        <p className="mt-3 text-silver">
          Send a brief for {service.title}. The fee is quoted after we read it.
        </p>
        <div className="mt-6">
          <LeadForm audience={service.audience} serviceSlug={service.slug} />
        </div>
      </section>
    </Container>
  );
}
