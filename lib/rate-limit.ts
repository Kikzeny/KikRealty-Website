// Initial, single-instance preview protection. Production needs distributed limits.
const buckets = new Map<string, { count: number; expires: number }>();
export function rateLimit(
  req: Request,
  scope: string,
  max: number,
  windowMs: number,
) {
  const now = Date.now();
  for (const [k, v] of buckets) if (v.expires < now) buckets.delete(k);
  const key =
    scope +
    ":" +
    (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local");
  const v = buckets.get(key) || { count: 0, expires: now + windowMs };
  if (v.count >= max) return false;
  v.count++;
  buckets.set(key, v);
  return true;
}
