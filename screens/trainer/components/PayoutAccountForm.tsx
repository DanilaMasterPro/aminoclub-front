"use client";

import { usePayoutAccount } from "../hooks/usePayoutAccount";
import { FormEvent, useState } from "react";

export default function PayoutAccountForm() {
  const [bankDetails, setBankDetails] = useState("");
  const [displayHint, setDisplayHint] = useState("");
  const { saveAccount, isSaving, message } = usePayoutAccount();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const saved = await saveAccount({ bankDetails, displayHint });
    if (saved) {
      setBankDetails("");
      setDisplayHint("");
    }
  };

  return (
    <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold">Банковские реквизиты</h2>
      <p className="mt-2 text-xs leading-5 text-slate-500">Реквизиты шифруются на сервере. CVV и коды подтверждения никогда не запрашиваются.</p>
      <textarea
        required
        value={bankDetails}
        onChange={(event) => setBankDetails(event.target.value)}
        placeholder="Расчётный счёт, БИК, получатель"
        rows={4}
        className="mt-4 w-full rounded-lg border border-slate-300 p-3 text-sm"
      />
      <input
        required
        value={displayHint}
        onChange={(event) => setDisplayHint(event.target.value)}
        placeholder="Подсказка, например •••• 1234"
        className="mt-3 w-full rounded-lg border border-slate-300 p-3 text-sm"
      />
      <button disabled={isSaving} className="mt-3 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:cursor-wait disabled:opacity-50">
        {isSaving ? "Сохраняем…" : "Сохранить реквизиты"}
      </button>
      {message && <p className="mt-3 text-sm text-slate-600" aria-live="polite">{message}</p>}
    </form>
  );
}
