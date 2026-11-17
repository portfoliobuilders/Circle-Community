import { Suspense } from "react";
import { AdminDenied } from "@/components/admin/admin-denied";
import { FaqEditor } from "@/components/admin/faq-editor";
import { Container } from "@/components/site/container";
import { getAdminFaqs } from "@/lib/content/load-faqs";
import { noIndex } from "@/lib/seo";

export const metadata = {
  title: "FAQs",
  robots: noIndex,
};

export default function AdminFaqsPage() {
  return (
    <Suspense
      fallback={
        <Container className="py-16">
          <p className="text-silver">Loading FAQ administration...</p>
        </Container>
      }
    >
      <AdminFaqsBody />
    </Suspense>
  );
}

async function AdminFaqsBody() {
  const { gate, faqs } = await getAdminFaqs();
  if (!gate.ok) {
    return (
      <Container>
        <AdminDenied reason={gate.reason} />
      </Container>
    );
  }
  return (
    <Container className="py-16">
      <h1 className="font-display text-title font-medium uppercase">Manage FAQs</h1>
      <p className="mt-4 max-w-xl text-silver">
        The FAQ list on /help uses these rows when the database is connected. When empty, it falls back to seeded copy.
      </p>
      <FaqEditor faqs={faqs} />
    </Container>
  );
}
