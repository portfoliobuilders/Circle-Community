import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { AdminDenied } from "@/components/admin/admin-denied";
import { requireAdmin } from "@/lib/auth/admin";
import { noIndex } from "@/lib/seo";
import {
  Film,
  Trophy,
  Calendar,
  HelpCircle,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "CIRCLE Administration Hub",
  robots: noIndex,
};

export const instant = false;

const adminModules = [
  {
    title: "Clipping & PR Operations",
    description:
      "Moderate campaigns, audit 10K+ follower accounts, verify bio codes, inspect PR live posts, and approve bulk UPI payouts.",
    href: "/admin/clipping",
    icon: Film,
    badge: "Core Escrow Engine",
  },
  {
    title: "Challenges Moderation",
    description:
      "Review creator challenge submissions, score entries, declare winners, and disburse community points.",
    href: "/admin/challenges",
    icon: Trophy,
    badge: "Points & Badges",
  },
  {
    title: "Events Management",
    description:
      "Schedule community webinars, review RSVP rosters, and manage online event access links.",
    href: "/admin/events",
    icon: Calendar,
    badge: "Community",
  },
  {
    title: "FAQ Administration",
    description:
      "Edit community questions, manage answer visibility, and maintain platform search accuracy.",
    href: "/admin/faqs",
    icon: HelpCircle,
    badge: "Content",
  },
  {
    title: "Support & Inquiries",
    description:
      "Review inbound contact messages, brand requests, and community assistance tickets.",
    href: "/admin/messages",
    icon: MessageSquare,
    badge: "Inbound",
  },
];

export default async function AdminHubPage() {
  const gate = await requireAdmin();

  if (!gate.ok) {
    return (
      <Container className="py-16">
        <AdminDenied reason={gate.reason} />
      </Container>
    );
  }

  return (
    <main className="py-12 sm:py-16">
      <Container>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-widest text-silver">
                Internal Ops
              </span>
              <span className="text-xs text-border-strong">/</span>
              <span className="font-mono text-xs uppercase tracking-widest text-lime">
                Staff Administration
              </span>
            </div>
            <h1 className="font-display mt-2 text-display-sm sm:text-display font-medium uppercase tracking-tight text-white">
              Operations Control Center
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-silver">
              Signed in as administrative operator. All mutations are immutable and recorded in <code>admin_actions</code>.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-4 py-2 text-xs font-mono text-lime">
            <ShieldCheck className="size-4" />
            <span>Audit Logging Active</span>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="group rounded-2xl border border-border bg-card p-6 sm:p-7 flex flex-col justify-between hover:border-lime/40 transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="size-10 rounded-xl bg-surface border border-border flex items-center justify-center text-lime group-hover:bg-lime group-hover:text-bg transition-colors">
                      <Icon className="size-5" />
                    </div>
                    <span className="rounded-full bg-surface border border-border px-2.5 py-0.5 text-[11px] font-mono text-silver">
                      {mod.badge}
                    </span>
                  </div>

                  <div>
                    <h2 className="font-display text-xl font-bold text-white group-hover:text-lime transition-colors">
                      {mod.title}
                    </h2>
                    <p className="mt-2 text-xs text-silver leading-relaxed">
                      {mod.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-lime">
                  <span>Open workspace</span>
                  <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </main>
  );
}
