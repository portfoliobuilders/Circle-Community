import { AdminDenied } from "@/components/admin/admin-denied";
import { FaqEditor } from "@/components/admin/faq-editor";
import { Container } from "@/components/site/container";
import { getAdminFaqs } from "@/lib/content/load-faqs";
import { noIndex } from "@/lib/seo";

export const metadata = {
  title: "FAQs",
  robots: noIndex,
};

export default async function AdminFaqsPage() {
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
      <h1 className="font-display text-title font-medium uppercase">FAQs</h1>
      <div className="mt-8">
        <FaqEditor faqs={faqs} />
      </div>
    </Container>
  );
}
