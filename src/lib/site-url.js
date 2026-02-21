export function getSiteUrl() {
  const fallback = "https://subnexit.com";
  const raw = (process.env.NEXT_PUBLIC_BASE_URL || "").trim();

  if (!raw) return fallback;

  const normalized = raw.replace(/\/+$/, "");

  // Avoid leaking localhost URLs into production sitemaps.
  if (
    process.env.NODE_ENV === "production" &&
    /localhost|127\.0\.0\.1/i.test(normalized)
  ) {
    return fallback;
  }

  return normalized;
}
