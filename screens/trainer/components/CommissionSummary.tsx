import type { CommissionTotals } from "../types";

export default function CommissionSummary({ commission }: { commission: CommissionTotals }) {
  const items = [
    ["Ожидает", commission.PENDING ?? 0],
    ["К выплате", commission.AVAILABLE ?? 0],
    ["Выплачено", commission.PAID ?? 0],
  ];

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <h2 className="font-semibold">Вознаграждение</h2>
      <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
        {items.map(([label, amount]) => (
          <div key={label}>
            <p className="text-slate-500">{label}</p>
            <p className="mt-1 font-semibold">{Number(amount).toLocaleString("ru-RU")} ₽</p>
          </div>
        ))}
      </div>
    </article>
  );
}
