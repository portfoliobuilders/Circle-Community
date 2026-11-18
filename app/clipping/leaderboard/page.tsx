import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { pageMetadata } from "@/lib/seo";
import { formatInr } from "@/lib/format";
import { Trophy, ShieldCheck } from "lucide-react";

export const metadata: Metadata = pageMetadata(
  "Clipping & PR Leaderboard",
  "Monthly performance rankings of top video clippers and verified social media PR pages in the CIRCLE community.",
  "/clipping/leaderboard"
);

export const instant = false;

interface ClipperRanking {
  rank: number;
  handle: string;
  name: string;
  platform: string;
  verifiedViews: number;
  approvedClips: number;
  netEarnedInr: number;
}

interface PrRanking {
  rank: number;
  handle: string;
  name: string;
  platform: string;
  followers: number;
  completedPosts: number;
  niche: string;
}

const sampleClipperRankings: ClipperRanking[] = [
  {
    rank: 1,
    handle: "@pixelclippers",
    name: "Arjun Verma",
    platform: "YouTube Shorts",
    verifiedViews: 684200,
    approvedClips: 14,
    netEarnedInr: 49260,
  },
  {
    rank: 2,
    handle: "@designsnaps",
    name: "Neha Nair",
    platform: "Instagram Reels",
    verifiedViews: 512000,
    approvedClips: 11,
    netEarnedInr: 36860,
  },
  {
    rank: 3,
    handle: "@roguecuts",
    name: "Vikram Malhotra",
    platform: "YouTube Shorts",
    verifiedViews: 428900,
    approvedClips: 9,
    netEarnedInr: 30880,
  },
  {
    rank: 4,
    handle: "@techpulse_edits",
    name: "Rohan Das",
    platform: "YouTube Shorts",
    verifiedViews: 315400,
    approvedClips: 8,
    netEarnedInr: 22700,
  },
  {
    rank: 5,
    handle: "@cutcraft_studio",
    name: "Pooja Sharma",
    platform: "Instagram Reels",
    verifiedViews: 245000,
    approvedClips: 6,
    netEarnedInr: 17640,
  },
];

const samplePrRankings: PrRanking[] = [
  {
    rank: 1,
    handle: "@fintech_insider_in",
    name: "FinTech Insider Daily",
    platform: "Instagram",
    followers: 142000,
    completedPosts: 6,
    niche: "Finance & Startups",
  },
  {
    rank: 2,
    handle: "@bangalore_techies",
    name: "Bangalore Tech Hub",
    platform: "Instagram",
    followers: 89500,
    completedPosts: 5,
    niche: "Technology & AI",
  },
  {
    rank: 3,
    handle: "@codewitharun",
    name: "Arun Dev",
    platform: "YouTube",
    followers: 64000,
    completedPosts: 4,
    niche: "Software Engineering",
  },
  {
    rank: 4,
    handle: "@growth_memes_daily",
    name: "Growth Memes India",
    platform: "Instagram",
    followers: 48000,
    completedPosts: 4,
    niche: "Business & Humor",
  },
];

export default function LeaderboardPage() {
  return (
    <main className="py-16 sm:py-24 space-y-16">
      <Container>
        {/* Header */}
        <div className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-widest text-lime font-semibold">
            Community Rankings · November 2026
          </span>
          <h1 className="font-display mt-4 text-display-sm sm:text-display font-medium uppercase tracking-tight text-white">
            Leaderboard & Verified Top Creators
          </h1>
          <p className="mt-4 text-lead text-silver leading-relaxed max-w-2xl">
            Celebrating the clippers with the highest verified retention views and established PR pages with perfect 7-day maturation delivery.
          </p>
        </div>

        {/* Top 3 Spotlight Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleClipperRankings.slice(0, 3).map((item) => (
            <div
              key={item.handle}
              className={`rounded-2xl border p-6 flex flex-col justify-between ${
                item.rank === 1
                  ? "border-lime bg-lime/10"
                  : "border-border bg-card"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-lime uppercase">
                    RANK #{item.rank}
                  </span>
                  <Trophy
                    className={`size-5 ${
                      item.rank === 1 ? "text-lime" : "text-silver"
                    }`}
                  />
                </div>
                <h3 className="font-display text-xl font-bold text-white uppercase">{item.name}</h3>
                <p className="font-mono text-xs text-lime">{item.handle}</p>
                <div className="text-xs text-silver space-y-1 pt-2 border-t border-border">
                  <div className="flex justify-between">
                    <span>Platform:</span>
                    <span className="text-white font-medium">{item.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verified Views:</span>
                    <span className="text-white font-mono font-semibold">
                      {item.verifiedViews.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Approved Clips:</span>
                    <span className="text-white">{item.approvedClips} clips</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-border flex justify-between items-baseline text-xs">
                <span className="text-silver">Net Earned:</span>
                <span className="font-display text-lg font-bold text-lime">
                  {formatInr(item.netEarnedInr)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Section 1: All Top Clippers Table */}
        <div className="mt-16 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-lime">Monthly Standings</span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase">
                Top Video Clippers
              </h2>
            </div>
            <Link href="/clipping/campaigns?campaign_type=clipping" className="text-xs text-lime hover:underline font-medium">
              Start clipping →
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/60 font-mono uppercase text-silver">
                  <th className="p-4 w-16">Rank</th>
                  <th className="p-4">Clipper</th>
                  <th className="p-4">Platform</th>
                  <th className="p-4 text-right">Verified Views</th>
                  <th className="p-4 text-right">Approved Clips</th>
                  <th className="p-4 text-right">Net Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sampleClipperRankings.map((c) => (
                  <tr key={c.handle} className="hover:bg-surface/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-lime">#{c.rank}</td>
                    <td className="p-4">
                      <div className="font-medium text-white">{c.name}</div>
                      <div className="font-mono text-xs text-silver">{c.handle}</div>
                    </td>
                    <td className="p-4 text-silver">{c.platform}</td>
                    <td className="p-4 text-right font-mono font-medium text-white">
                      {c.verifiedViews.toLocaleString("en-IN")}
                    </td>
                    <td className="p-4 text-right text-silver">{c.approvedClips}</td>
                    <td className="p-4 text-right font-mono font-semibold text-lime">
                      {formatInr(c.netEarnedInr)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Top Social PR Pages Table */}
        <div className="mt-16 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-lime">Established Reach</span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white uppercase">
                Top Verified PR Pages (10K+)
              </h2>
            </div>
            <Link href="/clipping/social-pr" className="text-xs text-lime hover:underline font-medium">
              Learn about PR verification →
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-surface/60 font-mono uppercase text-silver">
                  <th className="p-4 w-16">Rank</th>
                  <th className="p-4">Account / Page</th>
                  <th className="p-4">Niche</th>
                  <th className="p-4 text-right">Audited Followers</th>
                  <th className="p-4 text-right">Completed Posts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {samplePrRankings.map((p) => (
                  <tr key={p.handle} className="hover:bg-surface/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-lime">#{p.rank}</td>
                    <td className="p-4">
                      <div className="font-medium text-white flex items-center gap-1.5">
                        <span>{p.name}</span>
                        <ShieldCheck className="size-3.5 text-lime" />
                      </div>
                      <div className="font-mono text-xs text-silver">{p.handle} · {p.platform}</div>
                    </td>
                    <td className="p-4 text-silver">{p.niche}</td>
                    <td className="p-4 text-right font-mono font-medium text-white">
                      {p.followers.toLocaleString("en-IN")}+
                    </td>
                    <td className="p-4 text-right text-silver">{p.completedPosts} live holds</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leaderboard Rules & Anti-Gaming */}
        <div className="mt-16 rounded-2xl border border-border bg-surface/30 p-8 max-w-4xl space-y-2 text-xs text-silver">
          <p className="font-semibold text-white uppercase font-mono">Leaderboard Integrity & Points System</p>
          <p>
            Leaderboard standings are calculated strictly from verified views and completed 7-day live holds. Flagged clips, deleted deliverables, or bot-amplified accounts are automatically disqualified. First-time payable clippers receive +10 community points.
          </p>
        </div>
      </Container>
    </main>
  );
}
