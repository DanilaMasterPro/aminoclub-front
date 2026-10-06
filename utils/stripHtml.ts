/** Plain-text version of a sanitized HTML description (for cards, meta tags and previews). */
export function stripHtml(html: string) {
  return html
    .replace(/<(br|\/p|\/li|\/h\d)\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

/** Parses "Название: значение" lines into specification rows. */
export function parseCharacteristics(text: string | null | undefined) {
  return (text ?? "")
    .split(/\r?\n/)
    .map((line) => {
      const separator = line.indexOf(":");
      if (separator <= 0) return null;
      const name = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim();
      return name && value ? { name, value } : null;
    })
    .filter((row): row is { name: string; value: string } => row !== null);
}
