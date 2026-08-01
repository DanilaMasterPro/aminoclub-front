"use client";

import { usePayoutRequest } from "../hooks/usePayoutRequest";
import { FormEvent, useState } from "react";

export default function PayoutRequestForm() {
  const [amount, setAmount] = useState("");
  const { requestPayout, isSubmitting, message } = usePayoutRequest();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const submitted = await requestPayout(Number(amount));
    if (submitted) setAmount("");
  };

  return (
    <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold">Вывод средств</h2>
      <p className="mt-2 text-xs leading-5 text-slate-500">Минимальная сумма — 20 000 ₽. Новая заявка доступна после закрытия предыдущей.</p>
      <input
        required
        type="number"
        min="20000"
        step="0.01"
        value={amount}
        onChange={(event) => setAmount(event.target.value)}
        placeholder="Сумма"
        className="mt-4 w-full rounded-lg border border-slate-300 p-3 text-sm"
      />
      <button disabled={isSubmitting} className="mt-3 rounded-lg bg-[#009d0a] px-4 py-2 text-sm font-semibold text-white disabled:cursor-wait disabled:opacity-50">
        {isSubmitting ? "Отправляем…" : "Отправить заявку"}
      </button>
      {message && <p className="mt-3 text-sm text-slate-600" aria-live="polite">{message}</p>}
    </form>
  );
}
