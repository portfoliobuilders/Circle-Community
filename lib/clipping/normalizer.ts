import type { PlatformType } from "@/lib/clipping/types";

export interface NormalizedUrlResult {
  success: boolean;
  platform?: PlatformType;
  normalisedId?: string;
  canonicalUrl?: string;
  error?: string;
}

/**
 * Normalizes video URLs for YouTube Shorts and Instagram Reels.
 * Enforces canonical URL representation and extracts unique post identifiers
 * to ensure database uniqueness and prevent duplicate submissions.
 */
export function normalizeClipUrl(url: string, targetPlatform?: PlatformType): NormalizedUrlResult {
  if (!url || typeof url !== "string") {
    return { success: false, error: "Please enter a valid video URL." };
  }

  const trimmed = url.trim();

  let parsed: URL;
  try {
    parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
  } catch {
    return { success: false, error: "Invalid URL structure." };
  }

  const hostname = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const pathname = parsed.pathname;

  // 1. YouTube Shorts Detection
  if (hostname === "youtube.com" || hostname === "youtu.be" || hostname === "m.youtube.com") {
    if (targetPlatform && targetPlatform !== "youtube_shorts") {
      return { success: false, error: "This URL is for YouTube, but the campaign deliverable is Instagram Reels." };
    }

    let videoId: string | null = null;

    if (pathname.startsWith("/shorts/")) {
      const parts = pathname.split("/shorts/")[1]?.split(/[/&?]/);
      videoId = parts?.[0] || null;
    } else if (hostname === "youtu.be") {
      const parts = pathname.slice(1).split(/[/&?]/);
      videoId = parts?.[0] || null;
    } else if (pathname === "/watch") {
      videoId = parsed.searchParams.get("v");
    }

    if (!videoId || !/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return {
        success: false,
        error: "Could not extract a valid 11-character YouTube video ID. Ensure this is a public YouTube Shorts URL.",
      };
    }

    return {
      success: true,
      platform: "youtube_shorts",
      normalisedId: videoId,
      canonicalUrl: `https://youtube.com/shorts/${videoId}`,
    };
  }

  // 2. Instagram Reels Detection
  if (hostname === "instagram.com" || hostname === "instagr.am") {
    if (targetPlatform && targetPlatform !== "instagram_reels") {
      return { success: false, error: "This URL is for Instagram, but the campaign deliverable is YouTube Shorts." };
    }

    let reelCode: string | null = null;
    const match = pathname.match(/\/(reel|p|reels)\/([a-zA-Z0-9_-]+)/);
    if (match && match[2]) {
      reelCode = match[2];
    }

    if (!reelCode || reelCode.length < 3) {
      return {
        success: false,
        error: "Could not extract a valid Instagram Reel shortcode. Ensure the URL links to a public Instagram Reel.",
      };
    }

    return {
      success: true,
      platform: "instagram_reels",
      normalisedId: reelCode,
      canonicalUrl: `https://www.instagram.com/reel/${reelCode}/`,
    };
  }

  return {
    success: false,
    error: "Unsupported platform. Only YouTube Shorts and Instagram Reels URLs are permitted.",
  };
}
