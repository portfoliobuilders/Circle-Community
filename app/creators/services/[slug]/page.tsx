import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ServiceDetail } from "@/components/agency/service-detail";
import { findService, servicesFor } from "@/lib/content/agency-services";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return servicesFor("creator").map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (!service || service.audience !== "creator") return {};
  return pageMetadata(service.title, service.summary, `/creators/services/${slug}`);
}

export default async function CreatorServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service || service.audience !== "creator") notFound();
  return <ServiceDetail service={service} />;
}
