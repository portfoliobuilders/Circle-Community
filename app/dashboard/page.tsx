import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { signOutAccount } from "@/lib/actions/account";
import { ProfileForm } from "@/components/profile/profile-form";
import { Container } from "@/components/site/container";
import { getOwnProfile } from "@/lib/data/marketplace";
import { noIndex } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: noIndex,
};

export default function DashboardPage() {
  return (
    <Container className="py-16 sm:py-24">
      <h1 className="font-display text-display-sm font-medium tracking-tight uppercase">Your profile</h1>
      <Suspense fallback={<p className="mt-4 text-silver">Loading your profile.</p>}>
        <DashboardBody />
      </Suspense>
    </Container>
  );
}

async function DashboardBody() {
  const { userId, profile, error } = await getOwnProfile();
  return (
    <>
      {!userId ? (
        <p className="mt-4 text-silver">
          <Link className="text-text underline" href="/login">Sign in</Link> to edit your profile.
        </p>
      ) : null}
      {error ? <p className="mt-4 max-w-xl text-silver">{error}</p> : null}
      {userId && !profile && !error ? (
        <p className="mt-4 max-w-xl text-silver">
          Confirm your email, then sign in again. The profile is created when the account is confirmed.
        </p>
      ) : null}
      {profile ? (
        <div className="mt-10">
          <ProfileForm profile={profile} />
          <div className="mt-8 flex flex-wrap gap-4 text-small">
            <Link className="underline" href="/dashboard/settings">Newsletter settings</Link>
            {profile.role === "brand" ? <Link className="underline" href="/collabs/new">Post a collab</Link> : null}
            <form action={signOutAccount}>
              <button type="submit" className="inline-flex min-h-11 items-center underline">Sign out</button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
