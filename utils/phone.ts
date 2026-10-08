/** `tel:` target in international format: "8 (812) 325-03-29" → "+78123250329". */
export function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("8") || digits.startsWith("7"))) return `tel:+7${digits.slice(1)}`;
  return `tel:${phone.trim().startsWith("+") ? "+" : ""}${digits}`;
}
