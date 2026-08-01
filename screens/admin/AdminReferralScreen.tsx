"use client";

import api from "@/api/client";
import { useEffect, useState } from "react";

type Stat = { id: string; name: string; surname: string; referralCode: string; orderAmount: string; _count: { referralClicks: number; orders: number }; promoCodes: Array<{ code: string }> };

export default function AdminReferralScreen() {
  const [items, setItems] = useState<Stat[]>([]);
  useEffect(() => { api.get<Stat[]>("/admin/referral/stats").then(({ data }) => setItems(data)); }, []);
  return <section><p className="text-sm text-slate-500">Аналитика</p><h1 className="mt-1 text-3xl font-semibold">Реферальная статистика</h1><div className="mt-7 overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{["Тренер", "Код", "Переходы", "Заказы", "Сумма"].map((item) => <th key={item} className="border-b border-slate-200 px-4 py-3">{item}</th>)}</tr></thead><tbody>{items.map((item) => <tr key={item.id} className="border-b border-slate-100"><td className="px-4 py-3">{item.name} {item.surname}</td><td className="px-4 py-3">{item.referralCode}<br/><span className="text-xs text-slate-500">{item.promoCodes.map((promo) => promo.code).join(", ")}</span></td><td className="px-4 py-3">{item._count.referralClicks}</td><td className="px-4 py-3">{item._count.orders}</td><td className="px-4 py-3">{Number(item.orderAmount).toLocaleString("ru-RU")} ₽</td></tr>)}</tbody></table>{!items.length && <p className="p-8 text-center text-sm text-slate-500">Данных пока нет.</p>}</div></section>;
}
