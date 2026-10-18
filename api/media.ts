export function resolveMediaUrl(url: string) {
  if (!url.startsWith("/uploads/")) return url;

  try {
    return new URL(url, new URL(process.env.NEXT_PUBLIC_API_URL!).origin).toString();
  } catch {
    return url;
  }
}

/** Product media lists hold both photos and videos; videos are recognised by the file extension. */
export function isVideoUrl(url: string) {
  return /\.(mp4|webm)(?:[?#]|$)/i.test(url);
}
