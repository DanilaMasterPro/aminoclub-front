"use client";

import { useContactForm } from "../hooks/useContactForm";

export default function ContactForm() {
  const contact = useContactForm();
  return (
    <form onSubmit={(event) => { event.preventDefault(); void contact.submit(event.currentTarget); }} className="mt-16 max-w-[520px] space-y-4">
      <input name="email" type="email" placeholder="Email" required className="h-12 w-full rounded-lg bg-white px-5 text-sm outline-none" />
      <input name="name" placeholder="Имя" required className="h-12 w-full rounded-lg bg-white px-5 text-sm outline-none" />
      <textarea name="message" placeholder="Вопрос" required className="h-36 w-full resize-none rounded-lg bg-white px-5 py-4 text-sm outline-none" />
      <button type="submit" disabled={contact.status === "sending"} className="h-12 w-full rounded-lg bg-[#009d0a] text-sm font-semibold text-white disabled:opacity-60">{contact.status === "sending" ? "Отправляем…" : "Отправить"}</button>
      {contact.status === "sent" && <p className="text-sm text-[#009d0a]">Спасибо! Мы получили ваш вопрос.</p>}
      {contact.status === "error" && <p className="text-sm text-red-600">Не удалось отправить сообщение. Попробуйте ещё раз.</p>}
      <p className="text-center text-[10px] text-[#8a8e8d]">Нажимая на кнопку, вы соглашаетесь с Политикой конфиденциальности</p>
    </form>
  );
}
