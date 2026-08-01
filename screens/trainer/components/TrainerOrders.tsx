import type { TrainerOrder } from "../types";

export default function TrainerOrders({ orders }: { orders: TrainerOrder[] }) {
  return (
    <article className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-5">
        <h2 className="font-semibold">Заказы</h2>
      </div>
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            {["Дата", "Номер", "Клиент", "Сумма", "Источник", "Статус"].map((item) => (
              <th key={item} className="px-4 py-3">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString("ru-RU")}</td>
              <td className="px-4 py-3">{order.number}</td>
              <td className="px-4 py-3">{order.customerName}</td>
              <td className="px-4 py-3">{Number(order.finalAmount).toLocaleString("ru-RU")} ₽</td>
              <td className="px-4 py-3">{order.referralSource}</td>
              <td className="px-4 py-3">{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!orders.length && <p className="p-6 text-sm text-slate-500">Заказов пока нет.</p>}
    </article>
  );
}
