import Link from "next/link";

const linkClassName = "text-[#009d0a] underline-offset-2 hover:underline";

/**
 * Standalone consent to personal data processing (152-FZ, separate document since 01.09.2025).
 * Unticked by default and required, so the form cannot be submitted without it; posts `consent=on`.
 */
export default function ConsentCheckbox({ className = "" }: { className?: string }) {
  return (
    <label className={`flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-[#4f555b] ${className}`}>
      <input type="checkbox" name="consent" required className="peer sr-only" />
      <span aria-hidden="true" className="mt-px grid size-5 shrink-0 place-items-center rounded-[5px] border-[1.5px] border-[#b9bcb9] bg-white text-transparent transition peer-checked:border-[#009d0a] peer-checked:bg-[#009d0a] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#009d0a]/40">
        <svg viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3"><path d="m1 5 3.5 3.5L11 1" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      <span>
        Я даю <Link href="/consent" target="_blank" className={linkClassName}>согласие на обработку персональных данных</Link> в соответствии с{" "}
        <Link href="/privacy" target="_blank" className={linkClassName}>Политикой обработки персональных данных</Link>
      </span>
    </label>
  );
}
