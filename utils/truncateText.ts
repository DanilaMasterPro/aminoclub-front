export function truncateText(text: string, maxLength = 120) {
  const normalizedText = text.replace(/\s+/g, " ").trim();

  if (normalizedText.length <= maxLength) return normalizedText;

  const truncatedText = normalizedText.slice(0, maxLength - 1).trimEnd();
  const lastSpaceIndex = truncatedText.lastIndexOf(" ");
  const preview = lastSpaceIndex > maxLength * 0.6 ? truncatedText.slice(0, lastSpaceIndex) : truncatedText;

  return `${preview}…`;
}
