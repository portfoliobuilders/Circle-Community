import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createAdminClient } from "@/lib/supabase/admin";
import { executeClipEarningsLock } from "@/lib/actions/clipping-admin";

/**
 * YouTube Data API v3 verification helper.
 * Queries video status and view counts in batches of up to 50 video IDs.
 */
export async function queryYouTubeShortsBatch(
  videoIds: string[],
  apiKey = process.env.YOUTUBE_API_KEY
): Promise<Map<string, { views: number; likes: number; comments: number; isLive: boolean }>> {
  const results = new Map<string, { views: number; likes: number; comments: number; isLive: boolean }>();

  if (!apiKey || videoIds.length === 0) {
    return results;
  }

  // Deduplicate and batch up to 50
  const uniqueIds = Array.from(new Set(videoIds)).slice(0, 50);
  const url = `https://www.googleapis.com/youtube/v3/videos?part=statistics,status&id=${uniqueIds.join(",")}&key=${apiKey}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return results;
    }

    const data = await res.json();
    if (!data.items || !Array.isArray(data.items)) {
      return results;
    }

    for (const item of data.items) {
      const id = item.id;
      const stats = item.statistics || {};
      const status = item.status || {};

      const views = parseInt(stats.viewCount || "0", 10);
      const likes = parseInt(stats.likeCount || "0", 10);
      const comments = parseInt(stats.commentCount || "0", 10);
      const isPublic = status.privacyStatus === "public";
      const isEmbeddable = status.embeddable !== false;

      results.set(id, {
        views,
        likes,
        comments,
        isLive: isPublic && isEmbeddable,
      });
    }
  } catch (err) {
    console.error("YouTube API batch query error:", err);
  }

  return results;
}

/**
 * Day-7 Maturation Runner.
 * Finds all approved submissions where `created_at` was at least 7 days ago
 * and single-count earnings have not yet been locked.
 */
export async function runMaturedClippingBatch(): Promise<{ processed: number; locked: number; failed: number }> {
  if (!isSupabaseConfigured()) {
    return { processed: 0, locked: 0, failed: 0 };
  }

  const supabase = createAdminClient();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Find matured submissions without locked earnings
  const { data: maturedSubs, error } = await supabase
    .from("clip_submissions")
    .select(`
      id, platform, post_id_normalised, created_at, status
    `)
    .eq("status", "approved")
    .lte("created_at", sevenDaysAgo)
    .limit(100);

  if (error || !maturedSubs || maturedSubs.length === 0) {
    return { processed: 0, locked: 0, failed: 0 };
  }

  // Filter for YouTube Shorts to poll latest views automatically
  const ytSubs = maturedSubs.filter((s) => s.platform === "youtube_shorts");
  if (ytSubs.length > 0 && process.env.YOUTUBE_API_KEY) {
    const ytMap = await queryYouTubeShortsBatch(ytSubs.map((s) => s.post_id_normalised));
    for (const sub of ytSubs) {
      const data = ytMap.get(sub.post_id_normalised);
      if (data) {
        await supabase.from("clip_view_snapshots").insert({
          submission_id: sub.id,
          views: data.views,
          likes: data.likes,
          comments: data.comments,
          source: "youtube_api",
          is_live: data.isLive,
        });
      }
    }
  }

  let lockedCount = 0;
  let failedCount = 0;

  for (const sub of maturedSubs) {
    const res = await executeClipEarningsLock(sub.id);
    if (res.status === "success") {
      lockedCount++;
    } else {
      failedCount++;
    }
  }

  return {
    processed: maturedSubs.length,
    locked: lockedCount,
    failed: failedCount,
  };
}
