import "server-only";

type Bucket = { hits: number[] };

const buckets = new Map<string, Bucket>();

// TODO: use Upstash Ratelimit when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set.
// This in-memory limiter resets on each server instance and does not span Vercel isolates.
export function rateLimit(key: string, limit = 5, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((hit) => now - hit < windowMs);
  if (bucket.hits.length >= limit) {
    buckets.set(key, bucket);
    return false;
  }
  bucket.hits.push(now);
  buckets.set(key, bucket);
  return true;
}
