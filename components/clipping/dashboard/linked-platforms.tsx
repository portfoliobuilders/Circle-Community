"use client";

import { useState, useTransition } from "react";
import { linkCreatorPlatform } from "@/lib/actions/clipping";
import type { CreatorPlatform, PlatformType } from "@/lib/clipping/types";

export function LinkedPlatforms({ initialPlatforms }: { initialPlatforms: CreatorPlatform[] }) {
  const [platforms] = useState<CreatorPlatform[]>(initialPlatforms);
  const [isOpen, setIsOpen] = useState(false);
  const [platform, setPlatform] = useState<PlatformType>("youtube_shorts");
  const [handle, setHandle] = useState("");
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);
    startTransition(async () => {
      const res = await linkCreatorPlatform({
        platform,
        handle,
      });
      if (res.status === "success") {
        setStatusMsg({ type: "success", text: res.message });
        setHandle("");
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setStatusMsg({ type: "error", text: res.message });
      }
    });
  }

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lead font-medium uppercase tracking-tight text-text">
            Connected Social Accounts
          </h2>
          <p className="mt-1 text-small text-silver">
            Clips must be posted on an account verified via bio-code ownership.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-bg px-5 text-sm font-medium text-text transition hover:border-lime"
        >
          Connect Account
        </button>
      </div>

      {platforms.length === 0 ? (
        <div className="mt-6 rounded-xl border border-dashed border-border p-6 text-center text-small text-silver">
          No social accounts connected yet. Connect your YouTube channel or Instagram profile to start submitting clips.
        </div>
      ) : (
        <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-bg">
          {platforms.map((p) => (
            <div key={p.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text">@{p.handle}</span>
                  <span className="rounded bg-surface px-2 py-0.5 text-xs text-silver">
                    {p.platform === "youtube_shorts" ? "YouTube Shorts" : "Instagram Reels"}
                  </span>
                  {p.verified ? (
                    <span className="inline-flex items-center rounded-full bg-lime/10 px-2 py-0.5 text-xs font-medium text-lime">
                      ✓ Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-0.5 text-xs font-medium text-yellow-400">
                      Pending Bio Check
                    </span>
                  )}
                </div>

                {!p.verified && (
                  <p className="mt-2 text-xs text-silver">
                    Place code <span className="font-mono font-bold text-lime">{p.verification_code}</span> in your
                    profile bio. CIRCLE admins audit and verify codes daily.
                  </p>
                )}

                {p.admin_verified_followers !== null && p.admin_verified_followers !== undefined && (
                  <p className="mt-1 text-xs text-silver">
                    Admin verified followers:{" "}
                    <span className="text-text font-medium">
                      {p.admin_verified_followers.toLocaleString("en-IN")}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Connect Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lead font-medium uppercase tracking-tight text-text">
                Connect Social Account
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-silver hover:text-text"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-silver">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as PlatformType)}
                  className="mt-1 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text focus:border-lime focus:outline-none"
                >
                  <option value="youtube_shorts">YouTube Shorts</option>
                  <option value="instagram_reels">Instagram Reels</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-silver">Handle / Channel</label>
                <div className="mt-1 flex items-center rounded-xl border border-border bg-bg px-3 focus-within:border-lime">
                  <span className="text-silver">@</span>
                  <input
                    type="text"
                    placeholder="yourhandle"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    required
                    className="w-full bg-transparent px-2 py-3 text-text focus:outline-none"
                  />
                </div>
                <p className="mt-1 text-xs text-silver">
                  Enter your exact public social handle without spaces.
                </p>
              </div>

              {statusMsg && (
                <div
                  className={`rounded-xl p-3 text-small ${
                    statusMsg.type === "success"
                      ? "border border-lime/30 bg-lime/10 text-lime"
                      : "border border-red-500/30 bg-red-500/10 text-red-400"
                  }`}
                >
                  {statusMsg.text}
                </div>
              )}

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="min-h-11 rounded-full border border-border px-5 text-sm text-silver transition hover:text-text"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex min-h-11 items-center rounded-full bg-lime px-6 text-sm font-medium text-bg transition hover:bg-lime/90 disabled:opacity-50"
                >
                  {isPending ? "Connecting..." : "Generate Bio Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
