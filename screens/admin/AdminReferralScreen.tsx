"use client";

import AdminPageHeader from "./components/AdminPageHeader";
import AdminTable from "./components/AdminTable";
import { useAdminReferralStats } from "./hooks/useAdminReferralStats";

export default function AdminReferralScreen() {
  const { items, isLoading, error } = useAdminReferralStats();

  return (
    <section>
      <AdminPageHeader eyebrow="Аналитика" title="Реферальная статистика" />
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <AdminTable headers={["Тренер", "Код", "Переходы", "Заказы", "Сумма"]} isLoading={isLoading} isEmpty={!items.length} emptyMessage="Данных пока нет." minWidthClassName="min-w-[720px]">
        {!isLoading && items.map((item) => (
          <tr key={item.id} className="border-b border-slate-100 last:border-0">
            <td className="px-4 py-3">{item.name} {item.surname}</td>
            <td className="px-4 py-3">
              {item.referralCode}<br />
              <span className="text-xs text-slate-500">{item.promoCodes.map((promo) => promo.code).join(", ")}</span>
            </td>
            <td className="px-4 py-3">{item._count.referralClicks}</td>
            <td className="px-4 py-3">{item._count.orders}</td>
            <td className="px-4 py-3">{Number(item.orderAmount).toLocaleString("ru-RU")} ₽</td>
          </tr>
        ))}
      </AdminTable>
    </section>
  );
}
