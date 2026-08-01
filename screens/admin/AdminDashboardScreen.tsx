"use client";

import api from "@/api/client";
import { useEffect, useState } from "react";

interface DashboardData {
  orders: Array<{ status: string; _count: number }>;
  revenue: { _sum: { finalAmount: string | null } };
  lowStock: number;
  trainers: number;
  pendingApplications: number;
  pendingPayouts: number;
}

export default function AdminDashboardScreen() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { api.get<DashboardData>("/admin/dashboard").then(({ data }) => setData(data)).catch(() => setError("Не удалось загрузить статистику")); }, []);
  const totalOrders = data?.orders.reduce((sum, item) => sum + item._count, 0) ?? 0;
  const cards = [
    ["Заказов", totalOrders], ["Оборот", `${Number(data?.revenue._sum.finalAmount ?? 0).toLocaleString("ru-RU")} ₽`],
    ["Активных тренеров", data?.trainers ?? "—"], ["Заявок тренеров", data?.pendingApplications ?? "—"],
    ["Заявок на выплату", data?.pendingPayouts ?? "—"], ["Мало на складе", data?.lowStock ?? "—"],
  ];
  return (
    <section>
      <div className="mb-7"><p className="text-sm text-slate-500">Сегодня</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Обзор магазина</h1></div>
      {error && <p className="mb-4 text-red-600">{error}</p>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(([label, value]) => <article key={label} className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-3 text-3xl font-semibold">{data ? value : "…"}</p></article>)}
      </div>
      <article className="mt-6 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold">Заказы по статусам</h2>
        <div className="mt-4 flex flex-wrap gap-2">{data?.orders.map((item) => <span key={item.status} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm">{item.status}: {item._count}</span>)}</div>
      </article>
    </section>
  );
}
