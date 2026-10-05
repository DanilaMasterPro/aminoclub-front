"use client";

import type { AppliedPromo } from "@/api/types";
import { useCheckout } from "../hooks/useCheckout";
import type { DeliveryFormState } from "../hooks/useDeliveryForm";
import DeliverySection from "./DeliverySection";

const inputClass = "h-12 rounded-lg border border-transparent bg-white px-5 text-sm outline-none transition focus:border-[#15191a]";

export default function CheckoutForm({ promo, delivery }: { promo: AppliedPromo | null; delivery: DeliveryFormState }) {
  const checkout = useCheckout(promo, delivery);
  return (
    <form onSubmit={(event) => { event.preventDefault(); void checkout.submit(event.currentTarget); }} className="max-w-[620px]">
      <div className="mb-14 flex gap-10 text-sm font-medium"><span>Доставка и оплата</span><span className="text-[#c8cac7]">Оплата</span></div>
      <fieldset>
        <legend className="mb-7 text-sm font-bold uppercase">Получатель</legend>
        <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
          <input className={inputClass} name="firstName" placeholder="Имя" autoComplete="given-name" required />
          <input className={inputClass} name="lastName" placeholder="Фамилия" autoComplete="family-name" required />
          <input className={inputClass} name="email" type="email" placeholder="Email" autoComplete="email" required />
          <input className={inputClass} name="phone" type="tel" placeholder="Телефон" autoComplete="tel" pattern="\+?[0-9\s\-\(\)]{10,20}" title="Номер телефона, например +7 999 123-45-67" required />
        </div>
      </fieldset>
      <DeliverySection delivery={delivery} />
      <fieldset className="mt-6">
        <textarea className={`${inputClass} h-24 w-full py-4`} name="comment" maxLength={500} placeholder="Комментарий к заказу" />
      </fieldset>
      <p className="mt-8 text-sm text-[#747978]">Оплата банковской картой или через СБП на защищённой странице Robokassa. Чек придёт на указанный email.</p>
      {checkout.error && <p role="alert" className="mt-5 text-sm text-red-600">{checkout.error}</p>}
      <button type="submit" disabled={checkout.isSubmitting || delivery.isQuoting} className="mt-8 min-h-12 w-[310px] rounded-xl bg-[#009d0a] px-8 font-semibold text-white disabled:opacity-60 max-[600px]:w-full">
        {checkout.isSubmitting ? "Переходим к оплате…" : "Оплатить"}
      </button>
    </form>
  );
}
