export function resolveMediaUrl(url: string) {
  if (!url.startsWith("/uploads/")) return url;

  try {
    return new URL(url, new URL(process.env.NEXT_PUBLIC_API_URL!).origin).toString();
  } catch {
    return url;
  }
}
