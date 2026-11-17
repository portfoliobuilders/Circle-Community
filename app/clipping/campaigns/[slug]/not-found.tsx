import Link from "next/link";
import { Container } from "@/components/site/container";
import { PillLink } from "@/components/site/pill-link";

export default function CampaignNotFound() {
  return (
    <main className="py-24 sm:py-32">
      <Container>
        <div className="max-w-md mx-auto text-center">
          <p className="font-mono text-xs font-semibold tracking-wider text-lime uppercase">
            404 Error
          </p>
          <h1 className="font-display mt-2 text-3xl font-bold tracking-tight text-white">
            Campaign Not Found
          </h1>
          <p className="mt-4 text-sm text-silver leading-relaxed">
            This campaign may have completed its budget allocation, been paused by the owner, or is not available in the current environment.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <PillLink href="/clipping/campaigns">Browse active campaigns</PillLink>
            <Link
              href="/clipping"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium text-white hover:bg-surface"
            >
              Back to Clipping Hub
            </Link>
          </div>
        </div>
      </Container>
    </main>
  );
}
