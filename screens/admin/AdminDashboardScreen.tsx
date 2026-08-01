"use client";

import AdminPageHeader from "./components/AdminPageHeader";
import { useAdminDashboard } from "./hooks/useAdminDashboard";

export default function AdminDashboardScreen() {
  const { data, error } = useAdminDashboard();
  const totalOrders = data?.orders.reduce((sum, item) => sum + item._count, 0) ?? 0;
  const cards = [
    ["Заказов", totalOrders],
    ["Оборот", `${Number(data?.revenue._sum.finalAmount ?? 0).toLocaleString("ru-RU")} ₽`],
    ["Активных тренеров", data?.trainers ?? "—"],
    ["Заявок тренеров", data?.pendingApplications ?? "—"],
    ["Заявок на выплату", data?.pendingPayouts ?? "—"],
    ["Мало на складе", data?.lowStock ?? "—"],
  ];

  return (
    <section>
      <AdminPageHeader eyebrow="Сегодня" title="Обзор магазина" />
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value]) => (
          <article key={label} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{data ? value : "…"}</p>
          </article>
        ))}
      </div>
      <article className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Заказы по статусам</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {data?.orders.map((item) => <span key={item.status} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm">{item.status}: {item._count}</span>)}
        </div>
      </article>
    </section>
  );
}
