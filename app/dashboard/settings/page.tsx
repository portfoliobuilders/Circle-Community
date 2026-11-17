import { NewsletterToggle } from "@/components/dashboard/newsletter-toggle";
import { Container } from "@/components/site/container";
import { hasServiceRole, isSupabaseConfigured } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { createSessionClient } from "@/lib/supabase/server";
import { noIndex } from "@/lib/seo";

export const metadata = {
  title: "Settings",
  robots: noIndex,
};

export default async function SettingsPage() {
  if (!isSupabaseConfigured() || !hasServiceRole()) {
    return (
      <Container className="py-24">
        <h1 className="font-display text-title font-medium uppercase">Settings</h1>
        <p className="mt-4 text-silver">Sign-in is not connected yet, so the newsletter toggle is unavailable.</p>
      </Container>
    );
  }

  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  const email = data.user?.email?.toLowerCase();

  if (!email) {
    return (
      <Container className="py-24">
        <h1 className="font-display text-title font-medium uppercase">Settings</h1>
        <p className="mt-4 max-w-xl text-silver">
          <a className="text-text underline" href="/login">Sign in</a> to turn the newsletter on or off.
        </p>
      </Container>
    );
  }

  const admin = createAdminClient();
  const { data: row } = await admin
    .from("newsletter_subscribers")
    .select("status")
    .eq("email", email)
    .maybeSingle();

  return (
    <Container className="py-24">
      <h1 className="font-display text-title font-medium uppercase">Settings</h1>
      <div className="mt-8">
        <NewsletterToggle confirmed={row?.status === "confirmed"} />
      </div>
    </Container>
  );
}
