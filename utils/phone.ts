/** `tel:` target in international format: "8 (812) 325-03-29" → "+78123250329". */
export function telHref(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("8") || digits.startsWith("7"))) return `tel:+7${digits.slice(1)}`;
  return `tel:${phone.trim().startsWith("+") ? "+" : ""}${digits}`;
}

/** Input mask for a Russian number: any typed digits → "+7 (999) 123-45-67" (a leading 8 or 7 is the country code). */
export function formatRuPhone(input: string) {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("7") || digits.startsWith("8")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (!digits) return "";
  let result = `+7 (${digits.slice(0, 3)}`;
  if (digits.length > 3) result += `) ${digits.slice(3, 6)}`;
  if (digits.length > 6) result += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) result += `-${digits.slice(8, 10)}`;
  return result;
}

export const isCompleteRuPhone = (phone: string) => phone.replace(/\D/g, "").length === 11;
