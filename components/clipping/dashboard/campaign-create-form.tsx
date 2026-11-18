"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCampaign } from "@/lib/actions/clipping";
import { createPrCampaign } from "@/lib/actions/pr";
import { CLIPPING_CONFIG } from "@/lib/config/clipping";
import { formatInr } from "@/lib/format";
import type { PlatformType } from "@/lib/clipping/types";

const CLIPPING_CATEGORIES = [
  "Technology & AI",
  "Finance & Crypto",
  "Business & Startups",
  "Fitness & Health",
  "Entertainment & Comedy",
  "Gaming",
  "Education & Careers",
  "Lifestyle & Travel",
];

const PR_CATEGORIES = [
  "Technology & AI",
  "Business & Startups",
  "Design & Creative",
  "Education & Careers",
  "Lifestyle & Travel",
  "Fashion & Culture",
  "Food & Hospitality",
];

interface SourceLink {
  title: string;
  url: string;
}

export function CampaignCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Campaign Model Mode
  const [campaignType, setCampaignType] = useState<"clipping" | "social_pr">("clipping");

  // Shared State
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [briefMd, setBriefMd] = useState("");
  const [rulesMd, setRulesMd] = useState("");
  const [category, setCategory] = useState(CLIPPING_CATEGORIES[0]);
  const [language, setLanguage] = useState("en");
  const [platforms, setPlatforms] = useState<PlatformType[]>(["youtube_shorts", "instagram_reels"]);
  const [requiredCaption, setRequiredCaption] = useState("");
  const [requiredHashtags, setRequiredHashtags] = useState("");
  const [requiredMention, setRequiredMention] = useState("");
  const [rightsConfirmed, setRightsConfirmed] = useState(false);

  // Clipping Specific State
  const [rateInrPer1k, setRateInrPer1k] = useState<number>(25);
  const [budgetInr, setBudgetInr] = useState<number>(10000);
  const [perClipCap, setPerClipCap] = useState<number>(100000);
  const [sourceLinks, setSourceLinks] = useState<SourceLink[]>([
    { title: "Main Episode Footage", url: "" },
  ]);
  const [assetFolderUrl, setAssetFolderUrl] = useState("");

  // Social PR Specific State
  const [deliverableType, setDeliverableType] = useState<"reel" | "post" | "carousel" | "story" | "short">("reel");
  const [pricingMode, setPricingMode] = useState<"fixed" | "quote">("fixed");
  const [feePerPostInr, setFeePerPostInr] = useState<number>(2500);
  const [slots, setSlots] = useState<number>(3);
  const [prBudgetInr, setPrBudgetInr] = useState<number>(7500);
  const [minFollowers, setMinFollowers] = useState<number>(10000);
  const [subjectType, setSubjectType] = useState<"brand" | "individual">("brand");
  const [subjectConsentConfirmed, setSubjectConsentConfirmed] = useState(false);
  const [contentApprovalRequired, setContentApprovalRequired] = useState(true);
  const [requiredLink, setRequiredLink] = useState("");

  // Financial calculations
  const effectiveBudget = campaignType === "clipping" ? budgetInr : pricingMode === "fixed" ? feePerPostInr * slots : prBudgetInr;
  const platformFeeInr = Math.floor((effectiveBudget * CLIPPING_CONFIG.ownerFeePct) / 100);
  const totalInvoiceInr = effectiveBudget + platformFeeInr;
  const estimatedTotalViews = rateInrPer1k > 0 ? Math.floor((budgetInr / rateInrPer1k) * 1000) : 0;
  const netClipperRate = rateInrPer1k - Math.floor((rateInrPer1k * CLIPPING_CONFIG.clipperFeePct) / 100);
  const netPrFee = feePerPostInr - Math.floor((feePerPostInr * CLIPPING_CONFIG.pr.creatorFeePct) / 100);

  function handleTypeChange(newType: "clipping" | "social_pr") {
    setCampaignType(newType);
    setCategory(newType === "social_pr" ? PR_CATEGORIES[0] : CLIPPING_CATEGORIES[0]);
  }

  function togglePlatform(plat: PlatformType) {
    if (platforms.includes(plat)) {
      if (platforms.length === 1) return;
      setPlatforms(platforms.filter((p) => p !== plat));
    } else {
      setPlatforms([...platforms, plat]);
    }
  }

  function addSourceLink() {
    setSourceLinks([...sourceLinks, { title: "", url: "" }]);
  }

  function removeSourceLink(index: number) {
    if (sourceLinks.length === 1) return;
    setSourceLinks(sourceLinks.filter((_, i) => i !== index));
  }

  function updateSourceLink(index: number, field: "title" | "url", value: string) {
    const updated = [...sourceLinks];
    updated[index][field] = value;
    setSourceLinks(updated);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);

    if (!rightsConfirmed) {
      setStatusMsg({
        type: "error",
        text: "You must confirm you have authorized rights and ASCI agreement.",
      });
      return;
    }

    if (campaignType === "social_pr" && subjectType === "individual" && !subjectConsentConfirmed) {
      setStatusMsg({
        type: "error",
        text: "You must confirm written authorization and consent to promote this individual.",
      });
      return;
    }

    if (campaignType === "clipping") {
      const validSourceLinks = sourceLinks.filter((s) => s.url.trim().length > 0);
      if (validSourceLinks.length === 0) {
        setStatusMsg({
          type: "error",
          text: "Please provide at least one valid source footage link.",
        });
        return;
      }

      startTransition(async () => {
        const payload = {
          title,
          summary,
          brief_md: briefMd,
          rules_md: rulesMd,
          category,
          language,
          platforms,
          rate_inr_per_1k: rateInrPer1k,
          budget_inr: budgetInr,
          per_clip_view_cap: perClipCap,
          source_links: validSourceLinks,
          assetFolderUrl: assetFolderUrl.trim() || undefined,
          required_caption: requiredCaption.trim() || undefined,
          required_hashtags: requiredHashtags,
          required_mention: requiredMention.trim() || undefined,
          rights_confirmed: true as const,
        };

        const res = await createCampaign(payload);
        if (res.status === "success") {
          setStatusMsg({
            type: "success",
            text: "Campaign submitted for review. An admin will verify the footage rights and send your invoice.",
          });
          setTimeout(() => {
            router.push("/dashboard/clipping/campaigns");
          }, 2000);
        } else {
          setStatusMsg({ type: "error", text: res.message });
        }
      });
    } else {
      // Social PR
      startTransition(async () => {
        const payload = {
          title,
          summary,
          brief_md: briefMd,
          rules_md: rulesMd,
          category,
          language,
          platforms,
          deliverable_type: deliverableType,
          pricing_mode: pricingMode,
          fee_per_post_inr: pricingMode === "fixed" ? feePerPostInr : undefined,
          slots,
          budget_inr: pricingMode === "fixed" ? feePerPostInr * slots : prBudgetInr,
          min_followers: minFollowers,
          subject_type: subjectType,
          subject_consent_confirmed: subjectType === "individual" ? true : undefined,
          content_approval_required: contentApprovalRequired,
          required_caption: requiredCaption.trim() || undefined,
          required_hashtags: requiredHashtags,
          required_mention: requiredMention.trim() || undefined,
          required_link: requiredLink.trim() || undefined,
          rights_confirmed: true as const,
        };

        const res = await createPrCampaign(payload);
        if (res.status === "success") {
          setStatusMsg({
            type: "success",
            text: "PR Campaign submitted for review. An admin will verify category guidelines and send your invoice.",
          });
          setTimeout(() => {
            router.push("/dashboard/clipping/campaigns");
          }, 2000);
        } else {
          setStatusMsg({ type: "error", text: res.message });
        }
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {statusMsg ? (
        <div
          className={`rounded-xl border p-4 text-small ${statusMsg.type === "success"
              ? "border-lime/30 bg-lime/10 text-lime"
              : "border-red-500/30 bg-red-500/10 text-red-400"
            }`}
        >
          {statusMsg.text}
        </div>
      ) : null}

      {/* Model Selection Header */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-silver">Step 1</span>
          <h2 className="font-display mt-1 text-lead font-medium uppercase tracking-tight text-text">
            Choose Campaign Model
          </h2>
          <p className="mt-1 text-xs text-silver">
            Select between viral video clipping or booking established influencers for social media PR.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          <button
            type="button"
            onClick={() => handleTypeChange("clipping")}
            className={`rounded-2xl border p-5 text-left transition ${campaignType === "clipping"
                ? "border-lime bg-lime/10"
                : "border-border bg-bg hover:border-border-strong"
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-semibold text-text uppercase">
                Video Clipping
              </span>
              <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-mono text-silver">
                Pay per View
              </span>
            </div>
            <p className="mt-2 text-xs text-silver leading-relaxed">
              Distribute source footage (podcasts, webinars, shows) to skilled clippers. Pay only for verified organic views with automated view-cap controls.
            </p>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange("social_pr")}
            className={`rounded-2xl border p-5 text-left transition ${campaignType === "social_pr"
                ? "border-lime bg-lime/10"
                : "border-border bg-bg hover:border-border-strong"
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-base font-semibold text-text uppercase">
                Social Media PR
              </span>
              <span className="rounded-full bg-surface px-2.5 py-0.5 text-xs font-mono text-lime">
                Pay per Post (10K+)
              </span>
            </div>
            <p className="mt-2 text-xs text-silver leading-relaxed">
              Book verified pages & creators with 10,000+ followers for sponsored stories, reels, or carousels. Guaranteed live post hold with ASCI compliance.
            </p>
          </button>
        </div>
      </div>

      {/* Core Campaign Details */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-lead font-medium uppercase tracking-tight text-text">
          2. Campaign Overview
        </h2>

        <div>
          <label htmlFor="camp-title" className="block text-small font-medium text-text">
            Campaign Title *
          </label>
          <input
            id="camp-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={
              campaignType === "clipping"
                ? "e.g. The AI Founder Show — Episode 42 Viral Clipping"
                : "e.g. PayFlow India — Q4 FinTech App Launch Campaign"
            }
            className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text placeholder-silver/50 focus:border-lime focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="camp-summary" className="block text-small font-medium text-text">
            Short Summary * (Max 200 chars)
          </label>
          <input
            id="camp-summary"
            type="text"
            required
            maxLength={200}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder={
              campaignType === "clipping"
                ? "Turn key debate moments and founder stories into punchy 30-60s vertical shorts."
                : "Looking for tech & business meme pages to post our launch carousel with verified ASCI disclosure."
            }
            className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text placeholder-silver/50 focus:border-lime focus:outline-none"
          />
          <p className="mt-1 text-xs text-silver">{summary.length} / 200 characters</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="camp-category" className="block text-small font-medium text-text">
              Category *
            </label>
            <select
              id="camp-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text focus:border-lime focus:outline-none"
            >
              {(campaignType === "clipping" ? CLIPPING_CATEGORIES : PR_CATEGORIES).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {campaignType === "social_pr" && (
              <p className="mt-1 text-xs text-silver">
                CIRCLE prohibits political, betting, crypto-investment, health claim, and adult campaigns.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="camp-lang" className="block text-small font-medium text-text">
              Language *
            </label>
            <select
              id="camp-lang"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text focus:border-lime focus:outline-none"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="hinglish">Hinglish</option>
              <option value="multi">Multilingual</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-small font-medium text-text">Deliverable Platforms *</label>
          <p className="text-xs text-silver mt-1">Select where creators will publish their posts.</p>
          <div className="mt-3 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => togglePlatform("youtube_shorts")}
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${platforms.includes("youtube_shorts")
                  ? "border-lime bg-lime/10 text-lime"
                  : "border-border bg-bg text-silver hover:text-text"
                }`}
            >
              <span>▶</span> YouTube Shorts
            </button>
            <button
              type="button"
              onClick={() => togglePlatform("instagram_reels")}
              className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${platforms.includes("instagram_reels")
                  ? "border-lime bg-lime/10 text-lime"
                  : "border-border bg-bg text-silver hover:text-text"
                }`}
            >
              <span>📷</span> Instagram
            </button>
          </div>
        </div>

        {/* PR Specific Deliverable Details */}
        {campaignType === "social_pr" && (
          <div className="grid gap-6 sm:grid-cols-2 pt-2 border-t border-border">
            <div>
              <label htmlFor="camp-deliv-type" className="block text-small font-medium text-text">
                Deliverable Format *
              </label>
              <select
                id="camp-deliv-type"
                value={deliverableType}
                onChange={(e) => setDeliverableType(e.target.value as "reel" | "post" | "carousel" | "story" | "short")}
                className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text focus:border-lime focus:outline-none capitalize"
              >
                <option value="reel">Reel (Video)</option>
                <option value="post">Single Image Post</option>
                <option value="carousel">Multi-slide Carousel</option>
                <option value="story">Story Post</option>
                <option value="short">YouTube Short</option>
              </select>
            </div>

            <div>
              <label htmlFor="camp-min-followers" className="block text-small font-medium text-text">
                Follower Floor (Admin-Verified) *
              </label>
              <input
                id="camp-min-followers"
                type="number"
                min={CLIPPING_CONFIG.pr.minFollowers}
                step={1000}
                value={minFollowers}
                onChange={(e) => setMinFollowers(Math.max(CLIPPING_CONFIG.pr.minFollowers, Number(e.target.value)))}
                className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text focus:border-lime focus:outline-none"
              />
              <p className="mt-1 text-xs text-silver">
                Minimum {CLIPPING_CONFIG.pr.minFollowers.toLocaleString("en-IN")} admin-verified followers required.
              </p>
            </div>

            <div>
              <label htmlFor="camp-subject-type" className="block text-small font-medium text-text">
                Subject Being Promoted *
              </label>
              <select
                id="camp-subject-type"
                value={subjectType}
                onChange={(e) => setSubjectType(e.target.value as "brand" | "individual")}
                className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text focus:border-lime focus:outline-none"
              >
                <option value="brand">Brand, Company or Product</option>
                <option value="individual">Individual Person (Personal PR)</option>
              </select>
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-3 cursor-pointer pt-4">
                <input
                  type="checkbox"
                  checked={contentApprovalRequired}
                  onChange={(e) => setContentApprovalRequired(e.target.checked)}
                  className="h-5 w-5 rounded border-border bg-surface text-lime focus:ring-lime"
                />
                <span className="text-small text-text">
                  Require draft preview approval before creator posts live
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Financials & Budget */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-lead font-medium uppercase tracking-tight text-text">
          3. Budget & Compensation Math
        </h2>

        {campaignType === "clipping" ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="camp-rate" className="block text-small font-medium text-text">
                Gross Rate per 1,000 Views (INR) *
              </label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-3 text-silver">₹</span>
                <input
                  id="camp-rate"
                  type="number"
                  required
                  min={CLIPPING_CONFIG.clipRateMinInrPer1k}
                  max={CLIPPING_CONFIG.clipRateMaxInrPer1k}
                  value={rateInrPer1k}
                  onChange={(e) => setRateInrPer1k(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-bg pl-8 pr-4 py-3 text-text focus:border-lime focus:outline-none"
                />
              </div>
              <p className="mt-1 text-xs text-silver">
                Creator receives net <strong className="text-lime">{formatInr(netClipperRate)}</strong> after CIRCLE 10% platform fee.
              </p>
            </div>

            <div>
              <label htmlFor="camp-budget" className="block text-small font-medium text-text">
                Campaign Escrow Budget (INR) *
              </label>
              <div className="relative mt-2">
                <span className="absolute left-4 top-3 text-silver">₹</span>
                <input
                  id="camp-budget"
                  type="number"
                  required
                  min={1000}
                  step={500}
                  value={budgetInr}
                  onChange={(e) => setBudgetInr(Number(e.target.value))}
                  className="w-full rounded-xl border border-border bg-bg pl-8 pr-4 py-3 text-text focus:border-lime focus:outline-none"
                />
              </div>
              <p className="mt-1 text-xs text-silver">
                Minimum ₹1,000. Funds pay clippers directly as verified views mature.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="camp-cap" className="block text-small font-medium text-text">
                Per-Clip View Cap
              </label>
              <input
                id="camp-cap"
                type="number"
                min={1000}
                step={1000}
                value={perClipCap}
                onChange={(e) => setPerClipCap(Number(e.target.value))}
                className="mt-2 w-full max-w-sm rounded-xl border border-border bg-bg px-4 py-3 text-text focus:border-lime focus:outline-none"
              />
              <p className="mt-1 text-xs text-silver">
                Protects budget if one clip blows up. Default is 100,000 views.
              </p>
            </div>
          </div>
        ) : (
          /* Social PR Financials */
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => setPricingMode("fixed")}
                className={`rounded-xl border px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition ${pricingMode === "fixed"
                    ? "border-lime bg-lime/10 text-lime"
                    : "border-border bg-bg text-silver hover:text-text"
                  }`}
              >
                Fixed Fee per Post
              </button>
              <button
                type="button"
                onClick={() => setPricingMode("quote")}
                className={`rounded-xl border px-4 py-2.5 text-xs font-medium uppercase tracking-wider transition ${pricingMode === "quote"
                    ? "border-lime bg-lime/10 text-lime"
                    : "border-border bg-bg text-silver hover:text-text"
                  }`}
              >
                Quote Mode (Creators Pitch Custom Quotes)
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {pricingMode === "fixed" ? (
                <div>
                  <label htmlFor="pr-fee-post" className="block text-small font-medium text-text">
                    Fixed Fee per Post (INR) *
                  </label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-3 text-silver">₹</span>
                    <input
                      id="pr-fee-post"
                      type="number"
                      required
                      min={500}
                      step={100}
                      value={feePerPostInr}
                      onChange={(e) => setFeePerPostInr(Number(e.target.value))}
                      className="w-full rounded-xl border border-border bg-bg pl-8 pr-4 py-3 text-text focus:border-lime focus:outline-none"
                    />
                  </div>
                  <p className="mt-1 text-xs text-silver">
                    Creator receives net <strong className="text-lime">{formatInr(netPrFee)}</strong> after CIRCLE 10% fee.
                  </p>
                </div>
              ) : (
                <div>
                  <label htmlFor="pr-budget-quote" className="block text-small font-medium text-text">
                    Total Campaign Escrow Budget (INR) *
                  </label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-3 text-silver">₹</span>
                    <input
                      id="pr-budget-quote"
                      type="number"
                      required
                      min={1000}
                      step={500}
                      value={prBudgetInr}
                      onChange={(e) => setPrBudgetInr(Number(e.target.value))}
                      className="w-full rounded-xl border border-border bg-bg pl-8 pr-4 py-3 text-text focus:border-lime focus:outline-none"
                    />
                  </div>
                  <p className="mt-1 text-xs text-silver">
                    Accepted creator quotes will reserve from this pool.
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="pr-slots" className="block text-small font-medium text-text">
                  Target Page Slots *
                </label>
                <input
                  id="pr-slots"
                  type="number"
                  required
                  min={1}
                  value={slots}
                  onChange={(e) => setSlots(Math.max(1, Number(e.target.value)))}
                  className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text focus:border-lime focus:outline-none"
                />
                <p className="mt-1 text-xs text-silver">
                  Number of verified creators you intend to accept.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Live Invoice Breakdown */}
        <div className="rounded-xl border border-border bg-bg p-5 space-y-3">
          <p className="text-xs uppercase tracking-wider text-silver">Transparent Invoice Breakdown</p>
          <div className="flex justify-between text-sm">
            <span className="text-silver">Creator Payout Escrow Pool:</span>
            <span className="font-mono font-medium text-text">{formatInr(effectiveBudget)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-silver">CIRCLE Platform Service Fee (10% on top):</span>
            <span className="font-mono font-medium text-text">{formatInr(platformFeeInr)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base">
            <span className="font-medium text-text">Total Upfront Invoice:</span>
            <span className="font-display font-semibold text-lime">{formatInr(totalInvoiceInr)}</span>
          </div>
          {campaignType === "clipping" && (
            <div className="rounded-lg bg-surface/50 p-3 text-xs text-silver">
              📈 At this rate, your budget covers up to{" "}
              <strong className="text-text">{estimatedTotalViews.toLocaleString("en-IN")} verified views</strong> across all accepted clips.
            </div>
          )}
        </div>
      </div>

      {/* Brief, Guidelines & Rules */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-lead font-medium uppercase tracking-tight text-text">
          4. Brief & Instructions
        </h2>

        <div>
          <label htmlFor="camp-brief" className="block text-small font-medium text-text">
            {campaignType === "clipping"
              ? "Editing Brief & Hook Instructions * (Markdown)"
              : "Campaign Brief & Angle * (Markdown)"}
          </label>
          <textarea
            id="camp-brief"
            required
            rows={5}
            value={briefMd}
            onChange={(e) => setBriefMd(e.target.value)}
            placeholder={
              campaignType === "clipping"
                ? "Tell clippers what makes a winning hook, which timestamps to focus on, and required styling."
                : "Explain the story angle, talking points, key value prop, and call-to-action for influencers to highlight."
            }
            className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text placeholder-silver/50 focus:border-lime focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="camp-rules" className="block text-small font-medium text-text">
            Rules & Editorial Guidelines (Markdown, Optional)
          </label>
          <textarea
            id="camp-rules"
            rows={3}
            value={rulesMd}
            onChange={(e) => setRulesMd(e.target.value)}
            placeholder="e.g. Do not alter quotes out of context; maintain professional tone; no sensationalist clickbait."
            className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text placeholder-silver/50 focus:border-lime focus:outline-none"
          />
        </div>

        {/* Source Footage Links (Clipping Only) */}
        {campaignType === "clipping" ? (
          <div>
            <label className="block text-small font-medium text-text">Source Footage Links *</label>
            <p className="text-xs text-silver mt-1">
              Links to your full YouTube episodes, raw footage, or podcast recordings.
            </p>

            <div className="mt-3 space-y-3">
              {sourceLinks.map((link, idx) => (
                <div key={idx} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <input
                    type="text"
                    required
                    placeholder="Link label (e.g. Ep 12 on YouTube)"
                    value={link.title}
                    onChange={(e) => updateSourceLink(idx, "title", e.target.value)}
                    className="sm:w-1/3 rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text focus:border-lime focus:outline-none"
                  />
                  <input
                    type="url"
                    required
                    placeholder="https://youtube.com/watch?v=..."
                    value={link.url}
                    onChange={(e) => updateSourceLink(idx, "url", e.target.value)}
                    className="flex-1 rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-text focus:border-lime focus:outline-none"
                  />
                  {sourceLinks.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeSourceLink(idx)}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-red-500/30 px-3 text-xs text-red-400 hover:bg-red-500/10"
                    >
                      Remove
                    </button>
                  ) : null}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addSourceLink}
              className="mt-3 inline-flex min-h-11 items-center rounded-lg border border-border bg-bg px-4 text-xs font-medium text-text hover:border-lime"
            >
              + Add Another Source Link
            </button>
          </div>
        ) : (
          /* PR Required Link */
          <div>
            <label htmlFor="pr-link" className="block text-small font-medium text-text">
              Target Destination Link (Optional)
            </label>
            <input
              id="pr-link"
              type="url"
              value={requiredLink}
              onChange={(e) => setRequiredLink(e.target.value)}
              placeholder="https://yourbrand.com/launch"
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text placeholder-silver/50 focus:border-lime focus:outline-none"
            />
          </div>
        )}

        {campaignType === "clipping" && (
          <div>
            <label htmlFor="camp-assets" className="block text-small font-medium text-text">
              Asset Folder URL (Optional)
            </label>
            <input
              id="camp-assets"
              type="url"
              value={assetFolderUrl}
              onChange={(e) => setAssetFolderUrl(e.target.value)}
              placeholder="Google Drive, Dropbox, or Figma link for logos, overlays, sound effects"
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text placeholder-silver/50 focus:border-lime focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* Disclosure & Compliance */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
        <h2 className="font-display text-lead font-medium uppercase tracking-tight text-text">
          5. ASCI Disclosure & Legal Ownership
        </h2>

        <div>
          <label htmlFor="camp-caption" className="block text-small font-medium text-text">
            Required Caption Text (Optional)
          </label>
          <input
            id="camp-caption"
            type="text"
            value={requiredCaption}
            onChange={(e) => setRequiredCaption(e.target.value)}
            placeholder="e.g. Check out the latest announcement via link in bio."
            className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text placeholder-silver/50 focus:border-lime focus:outline-none"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="camp-hashtags" className="block text-small font-medium text-text">
              Required Hashtags
            </label>
            <input
              id="camp-hashtags"
              type="text"
              value={requiredHashtags}
              onChange={(e) => setRequiredHashtags(e.target.value)}
              placeholder="e.g. circle, brand, launch"
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text placeholder-silver/50 focus:border-lime focus:outline-none"
            />
            <p className="mt-1 text-xs text-silver">
              #ad / #collab and platform paid-partnership tags are automatically required by ASCI guidelines.
            </p>
          </div>

          <div>
            <label htmlFor="camp-mention" className="block text-small font-medium text-text">
              Required Account Mention
            </label>
            <input
              id="camp-mention"
              type="text"
              value={requiredMention}
              onChange={(e) => setRequiredMention(e.target.value)}
              placeholder="e.g. yourhandle (without @)"
              className="mt-2 w-full rounded-xl border border-border bg-bg px-4 py-3 text-text placeholder-silver/50 focus:border-lime focus:outline-none"
            />
          </div>
        </div>

        {/* Individual Consent Affirmation */}
        {campaignType === "social_pr" && subjectType === "individual" && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={subjectConsentConfirmed}
                onChange={(e) => setSubjectConsentConfirmed(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-border bg-surface text-lime focus:ring-lime"
              />
              <span className="text-small text-amber-200">
                <strong>Individual Written Consent Affirmation:</strong> I certify under penalty of perjury that I hold express written authorization and consent from the individual named in this campaign to commission promotional posts about them. CIRCLE reserves the right to request proof prior to campaign launch.
              </span>
            </label>
          </div>
        )}

        <div className="rounded-xl border border-border bg-bg p-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={rightsConfirmed}
              onChange={(e) => setRightsConfirmed(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-border bg-surface text-lime focus:ring-lime"
            />
            <span className="text-small text-text">
              <strong>Copyright, Rights & ASCI Affirmation:</strong> I confirm that I hold lawful commercial distribution rights to commission this content. I agree that all posts must adhere to ASCI influencer guidelines (clear #ad/#collab disclosure) and CIRCLE safety policies.
            </span>
          </label>
        </div>
      </div>

      {/* Submit Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-medium text-silver transition hover:text-text"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-8 text-sm font-medium text-bg transition hover:bg-lime/90 disabled:opacity-50"
        >
          {isPending ? "Submitting Campaign..." : "Submit Campaign for Review"}
        </button>
      </div>
    </form>
  );
}
