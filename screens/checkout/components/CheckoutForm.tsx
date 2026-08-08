"use client";

import type { AppliedPromo } from "@/api/types";
import { useCheckout } from "../hooks/useCheckout";

const inputClass = "h-12 rounded-lg border border-transparent bg-white px-5 text-sm outline-none transition focus:border-[#15191a]";

export default function CheckoutForm({ promo }: { promo: AppliedPromo | null }) {
  const checkout = useCheckout(promo);
  return (
    <form onSubmit={(event) => { event.preventDefault(); void checkout.submit(event.currentTarget); }} className="max-w-[620px]">
      <div className="mb-14 flex gap-10 text-sm font-medium"><span>Доставка и оплата</span><span className="text-[#c8cac7]">Payment</span></div>
      <fieldset>
        <legend className="mb-7 text-sm font-bold uppercase">Контактная информация</legend>
        <div className="grid gap-4"><input className={inputClass} name="email" type="email" placeholder="Email" required /><input className={inputClass} name="phone" type="tel" placeholder="Телефон" required /></div>
      </fieldset>
      <fieldset className="mt-10">
        <legend className="mb-7 text-sm font-bold uppercase">Адрес доставки</legend>
        <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
          <input className={inputClass} name="firstName" placeholder="Имя" required /><input className={inputClass} name="lastName" placeholder="Фамилия" required />
          <input className={`${inputClass} col-span-2 max-[600px]:col-span-1`} name="region" placeholder="Регион" />
          <input className={`${inputClass} col-span-2 max-[600px]:col-span-1`} name="address" placeholder="Адрес" required />
          <input className={inputClass} name="city" placeholder="Город" required /><input className={inputClass} name="postalCode" placeholder="Почтовый индекс" />
          <textarea className={`${inputClass} col-span-2 h-24 py-4 max-[600px]:col-span-1`} name="comment" placeholder="Комментарий к заказу" />
        </div>
      </fieldset>
      <fieldset className="mt-10 space-y-5 text-sm">
        <legend className="mb-7 text-sm font-bold uppercase">Метод доставки</legend>
        <label className="flex items-center gap-4"><input className="accent-[#009d0a]" type="radio" name="delivery" value="cdek" defaultChecked />СДЭК <span className="ml-auto">по тарифу</span></label>
        <label className="flex items-center gap-4"><input className="accent-[#009d0a]" type="radio" name="delivery" value="pickup" />Самовывоз <span className="ml-auto">бесплатно</span></label>
      </fieldset>
      {checkout.error && <p className="mt-7 text-sm text-red-600">{checkout.error}</p>}
      <button type="submit" disabled={checkout.isSubmitting} className="mt-10 min-h-12 w-[310px] rounded-xl bg-[#009d0a] px-8 font-semibold text-white disabled:opacity-60 max-[600px]:w-full">{checkout.isSubmitting ? "Оформляем…" : "Оплатить"}</button>
    </form>
  );
}
