"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Button from "@/components/Button";
import { type CallbackMessenger, useCallbackForm } from "@/hooks/useCallbackForm";
import { setScrollLocked } from "@/utils/scrollLock";

const messengers: Array<{ value: CallbackMessenger; label: string }> = [
  { value: "telegram", label: "Telegram" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "max", label: "MAX" },
  { value: "nickname", label: "Или укажите свой никнейм" },
];

const fieldClassName = "h-14 w-full rounded-xl bg-white px-5 text-[15px] outline-none ring-[#009d0a]/40 placeholder:text-[#9a9e9d] focus:ring-2";

function RussianFlag() {
  return (
    <svg aria-hidden="true" viewBox="0 0 21 14" className="h-3.5 w-[21px] shrink-0 rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,.08)]">
      <path fill="#fff" d="M0 0h21v4.67H0z" />
      <path fill="#0039a6" d="M0 4.67h21v4.66H0z" />
      <path fill="#d52b1e" d="M0 9.33h21V14H0z" />
    </svg>
  );
}

/** «Мы всегда на связи!» request form (footer «Обратная связь»). Esc, the cross or a click on the backdrop closes it. */
export default function CallbackModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const form = useCallbackForm();
  const { reset } = form;
  const phoneRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    setScrollLocked(true);
    phoneRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", closeOnEscape);
      previousFocus?.focus();
      reset();
    };
  }, [isOpen, onClose, reset]);

  if (!isOpen) return null;

  return createPortal(
    <div
      data-lenis-prevent
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      className="fixed inset-0 z-[1000] overflow-y-auto overscroll-contain bg-[#15191a]/60 px-4 py-10 backdrop-blur-sm max-[600px]:px-3 max-[600px]:py-3"
    >
      <div role="dialog" aria-modal="true" aria-labelledby="callback-title" className="relative mx-auto w-full max-w-[680px] rounded-[28px] bg-[#f5f3ed] px-16 pt-16 pb-14 max-[700px]:rounded-[20px] max-[700px]:px-5 max-[700px]:pt-14 max-[700px]:pb-8">
        <button type="button" onClick={onClose} aria-label="Закрыть" className="absolute top-5 right-5 grid size-11 place-items-center rounded-full bg-white transition hover:bg-[#009d0a] hover:text-white max-[700px]:top-3 max-[700px]:right-3">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-5"><path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" /></svg>
        </button>

        <h2 id="callback-title" className="font-[family-name:var(--font-helvetica-neue)] text-[48px] leading-none font-normal tracking-[-0.045em] max-[700px]:text-[34px]">
          Мы всегда <span className="text-[#aeb0ae]">на связи!</span>
        </h2>

        {form.status === "sent" ? (
          <div className="mt-8" aria-live="polite">
            <p className="text-lg leading-snug">Спасибо! Заявка отправлена — менеджер свяжется с вами в ближайшее время.</p>
            <Button className="mt-8" label="Закрыть" onClick={onClose} />
          </div>
        ) : (
          <>
            <p className="mt-5 max-w-[460px] text-[17px] leading-snug text-[#6d7271]">Оставьте заявку, и наш менеджер свяжется с вами в ближайшее время</p>
            <form onSubmit={(event) => { event.preventDefault(); void form.submit(event.currentTarget); }} className="mt-10 space-y-4 max-[700px]:mt-8">
              <label className="flex h-14 w-full items-center gap-3 rounded-xl bg-white px-5 text-[15px] ring-[#009d0a]/40 focus-within:ring-2">
                <RussianFlag />
                <span className="sr-only">Телефон</span>
                <input
                  ref={phoneRef}
                  required
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(event) => form.setPhone(event.target.value)}
                  placeholder="+7 (000) 000-00-00"
                  className="h-full min-w-0 flex-1 bg-transparent outline-none placeholder:text-[#9a9e9d]"
                />
              </label>
              <input name="name" required maxLength={120} autoComplete="name" placeholder="Ваше имя" aria-label="Ваше имя" className={fieldClassName} />
              <textarea name="comment" maxLength={2000} placeholder="Введите комментарий" aria-label="Комментарий" className={`${fieldClassName} h-32 resize-none py-4`} />

              <fieldset className="pt-2">
                <legend className="mb-3 text-[15px]">В каком мессенджере с вами связаться</legend>
                <div className="space-y-2.5">
                  {messengers.map((option) => (
                    <label key={option.value} className="flex w-fit cursor-pointer items-center gap-3 text-[15px]">
                      <input
                        type="radio"
                        name="messenger"
                        value={option.value}
                        checked={form.messenger === option.value}
                        onChange={() => form.setMessenger(option.value)}
                        className="peer sr-only"
                      />
                      <span aria-hidden="true" className="grid size-[22px] place-items-center rounded-full border-[1.5px] border-[#b9bcb9] bg-white transition peer-checked:border-[#009d0a] peer-focus-visible:ring-2 peer-focus-visible:ring-[#009d0a]/40 peer-checked:[&>span]:scale-100">
                        <span className="size-3 scale-0 rounded-full bg-[#009d0a] transition" />
                      </span>
                      {option.label}
                    </label>
                  ))}
                </div>
                {form.messenger === "nickname" && (
                  <input name="nickname" required maxLength={120} placeholder="Мессенджер и никнейм, например Telegram @username" aria-label="Никнейм" className={`${fieldClassName} mt-3`} />
                )}
              </fieldset>

              <label className="flex cursor-pointer items-start gap-3 pt-2 text-[13px] leading-snug text-[#4f555b]">
                <input type="checkbox" name="consent" required defaultChecked className="peer sr-only" />
                <span aria-hidden="true" className="mt-px grid size-5 shrink-0 place-items-center rounded-[5px] border-[1.5px] border-[#b9bcb9] bg-white text-transparent transition peer-checked:border-[#009d0a] peer-checked:bg-[#009d0a] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#009d0a]/40">
                  <svg viewBox="0 0 12 10" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3"><path d="m1 5 3.5 3.5L11 1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span>
                  Подтверждаю согласие на обработку персональных данных и принимаю{" "}
                  <Link href="/privacy" target="_blank" className="text-[#009d0a] underline-offset-2 hover:underline">Политику конфиденциальности</Link>
                </span>
              </label>

              {form.error && <p className="text-sm text-red-600" aria-live="polite">{form.error}</p>}
              <Button type="submit" label={form.status === "sending" ? "Отправляем…" : "Отправить"} disabled={form.status === "sending"} className="mt-2 h-14 w-full uppercase disabled:opacity-60" />
            </form>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
