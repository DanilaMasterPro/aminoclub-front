"use client";

import type { TrainerDashboard } from "@/api/types";
import { useSyncExternalStore } from "react";

const subscribeToOrigin = () => () => undefined;
const getBrowserOrigin = () => window.location.origin;
const getServerOrigin = () => "";

export default function ReferralTools({ data }: { data: TrainerDashboard | null }) {
  const origin = useSyncExternalStore(subscribeToOrigin, getBrowserOrigin, getServerOrigin);
  const referralUrl = data ? `${origin}/?ref=${data.trainer.referralCode}` : "";
  const promoCode = data?.promoCodes[0]?.code ?? "";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold">Реферальные инструменты</h2>
      <label className="mt-4 block text-sm text-slate-500">
        Ссылка
        <div className="mt-1 flex gap-2">
          <input readOnly value={referralUrl} className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900" />
          <button type="button" disabled={!referralUrl} onClick={() => navigator.clipboard.writeText(referralUrl)} className="rounded-lg border border-slate-300 px-3 disabled:opacity-50">
            Копировать
          </button>
        </div>
      </label>
      <label className="mt-4 block text-sm text-slate-500">
        Промокод
        <div className="mt-1 flex gap-2">
          <input readOnly value={promoCode} className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900" />
          <button type="button" disabled={!promoCode} onClick={() => navigator.clipboard.writeText(promoCode)} className="rounded-lg border border-slate-300 px-3 disabled:opacity-50">
            Копировать
          </button>
        </div>
      </label>
    </article>
  );
}
