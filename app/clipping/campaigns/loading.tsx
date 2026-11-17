import { Container } from "@/components/site/container";
import { CampaignGridSkeleton } from "@/components/clipping/campaign-skeletons";

export default function LoadingCampaigns() {
  return (
    <main className="py-12 md:py-16">
      <Container>
        <div className="flex flex-col gap-4">
          <div className="h-4 w-32 rounded bg-border animate-pulse" />
          <div className="h-10 w-64 rounded bg-border animate-pulse" />
          <div className="h-4 w-96 rounded bg-border/60 animate-pulse" />
        </div>
        <div className="mt-12 flex gap-8">
          <div className="hidden lg:block w-72 h-96 rounded-2xl bg-card border border-border animate-pulse" />
          <div className="flex-1">
            <CampaignGridSkeleton count={6} />
          </div>
        </div>
      </Container>
    </main>
  );
}
