"use client";

import { FormEvent } from "react";
import { useAffiliateApplication } from "../hooks/useAffiliateApplication";

const inputClassName = "mt-2 w-full rounded-[12px] border border-[#cfd2cd] bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#009d0a]";

export default function AffiliateApplicationForm() {
  const { values, setValue, submit, isSubmitting, isSubmitted, error } = useAffiliateApplication();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void submit();
  };

  if (isSubmitted) {
    return (
      <div data-testid="affiliate-success" className="rounded-[20px] border border-[#9acb79] bg-[#f5faef] p-8 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-[#009d0a] text-2xl text-white">✓</span>
        <h3 className="mt-5 text-2xl font-medium">Заявка отправлена</h3>
        <p className="mx-auto mt-3 max-w-[520px] text-sm leading-6 text-[#5d6263]">Мы рассмотрим данные и свяжемся с вами по указанному email. После одобрения вы сможете войти в кабинет тренера через одноразовый код.</p>
      </div>
    );
  }

  return (
    <form data-testid="affiliate-form" onSubmit={handleSubmit} className="grid gap-x-5 gap-y-6 rounded-[20px] border border-[#dedfd9] bg-[#fcfbf8] p-7 sm:grid-cols-2 max-[600px]:p-5">
      <label className="text-sm font-medium">Имя
        <input required maxLength={100} autoComplete="given-name" value={values.name} onChange={(event) => setValue("name", event.target.value)} className={inputClassName} />
      </label>
      <label className="text-sm font-medium">Фамилия
        <input required maxLength={100} autoComplete="family-name" value={values.surname} onChange={(event) => setValue("surname", event.target.value)} className={inputClassName} />
      </label>
      <label className="text-sm font-medium">Телефон
        <input required maxLength={40} type="tel" autoComplete="tel" value={values.phone} onChange={(event) => setValue("phone", event.target.value)} placeholder="+7 999 000-00-00" className={inputClassName} />
      </label>
      <label className="text-sm font-medium">Email
        <input required type="email" autoComplete="email" value={values.email} onChange={(event) => setValue("email", event.target.value)} className={inputClassName} />
      </label>
      <label className="text-sm font-medium">Город
        <input required autoComplete="address-level2" value={values.city} onChange={(event) => setValue("city", event.target.value)} className={inputClassName} />
      </label>
      <label className="text-sm font-medium">Специализация
        <input required value={values.specialization} onChange={(event) => setValue("specialization", event.target.value)} placeholder="Фитнес, бодибилдинг, нутрициология" className={inputClassName} />
      </label>
      <label className="text-sm font-medium">Социальная сеть
        <input required type="url" value={values.socialLink} onChange={(event) => setValue("socialLink", event.target.value)} placeholder="https://" className={inputClassName} />
      </label>
      <label className="text-sm font-medium">Размер аудитории
        <input required type="number" min={0} step={1} value={values.audienceSize} onChange={(event) => setValue("audienceSize", event.target.value)} className={inputClassName} />
      </label>
      <label className="text-sm font-medium sm:col-span-2">Расскажите о себе
        <textarea required rows={5} value={values.comment} onChange={(event) => setValue("comment", event.target.value)} placeholder="Опыт работы, формат тренировок и почему вам интересна программа" className={inputClassName} />
      </label>
      <label className="flex items-start gap-3 text-sm leading-6 text-[#555b5b] sm:col-span-2">
        <input required type="checkbox" checked={values.termsAccepted} onChange={(event) => setValue("termsAccepted", event.target.checked)} className="mt-1 size-4 shrink-0 accent-[#009d0a]" />
        Я принимаю условия партнёрской программы и даю согласие на обработку персональных данных.
      </label>
      {error && <p role="alert" className="text-sm text-red-600 sm:col-span-2">{error}</p>}
      <div className="sm:col-span-2">
        <button disabled={isSubmitting} className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#009d0a] px-8 py-3 text-sm font-semibold text-white transition hover:-translate-y-px disabled:cursor-wait disabled:opacity-50">
          {isSubmitting ? "Отправляем…" : "Отправить заявку"}
        </button>
      </div>
    </form>
  );
}
