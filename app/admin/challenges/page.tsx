import { AdminDenied } from "@/components/admin/admin-denied";
import { ChallengeForm } from "@/components/challenges/challenge-form";
import { Container } from "@/components/site/container";
import { requireAdmin } from "@/lib/auth/admin";
import { noIndex } from "@/lib/seo";

export const metadata = {
  title: "Challenges",
  robots: noIndex,
};

export default async function AdminChallengesPage() {
  const gate = await requireAdmin();
  if (!gate.ok) {
    return (
      <Container>
        <AdminDenied reason={gate.reason} />
      </Container>
    );
  }
  return (
    <Container className="py-16">
      <h1 className="font-display text-title font-medium uppercase">Publish a challenge</h1>
      <p className="mt-4 max-w-xl text-silver">
        Points are not added by this form. Confirm the work, then record a point event.
      </p>
      <ChallengeForm />
    </Container>
  );
}
