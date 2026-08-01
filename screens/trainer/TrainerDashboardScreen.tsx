"use client";

import type { AuthUser } from "@/api/types";
import AuthGate from "@/components/AuthGate";
import CommissionSummary from "./components/CommissionSummary";
import PayoutAccountForm from "./components/PayoutAccountForm";
import PayoutRequestForm from "./components/PayoutRequestForm";
import ReferralTools from "./components/ReferralTools";
import TrainerHeader from "./components/TrainerHeader";
import TrainerOrders from "./components/TrainerOrders";
import TrainerStats from "./components/TrainerStats";
import { useTrainerDashboard } from "./hooks/useTrainerDashboard";

function TrainerDashboard({ user }: { user: AuthUser }) {
  const { data, orders, commission, isLoading, error, reload } = useTrainerDashboard();

  return (
    <main className="min-h-screen bg-[#f4f5f7] text-slate-900">
      <TrainerHeader user={user} />
      <div className="mx-auto max-w-7xl px-5 py-8">
        <p className="text-sm text-[#009d0a]">Кабинет тренера</p>
        <h1 className="mt-1 text-3xl font-semibold">{data ? `${data.trainer.name} ${data.trainer.surname}` : "Загрузка…"}</h1>
        <p className="mt-2 text-sm text-slate-500">
          Статус: {data?.trainer.status ?? "—"} · Вознаграждение: {data?.trainer.commissionRate ?? "—"}%
        </p>

        {error && (
          <div className="mt-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>
            <button type="button" disabled={isLoading} onClick={reload} className="shrink-0 font-semibold disabled:opacity-50">
              Повторить
            </button>
          </div>
        )}

        <TrainerStats data={data} commission={commission} />

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ReferralTools data={data} />
          <CommissionSummary commission={commission} />
        </div>

        <TrainerOrders orders={orders} />

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <PayoutAccountForm />
          <PayoutRequestForm />
        </div>
      </div>
    </main>
  );
}

export default function TrainerDashboardScreen() {
  return <AuthGate role="TRAINER">{(user) => <TrainerDashboard user={user} />}</AuthGate>;
}
