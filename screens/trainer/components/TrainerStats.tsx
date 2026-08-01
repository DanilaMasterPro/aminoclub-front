import type { TrainerDashboard } from "@/api/types";
import type { CommissionTotals } from "../types";

type TrainerStatsProps = {
  data: TrainerDashboard | null;
  commission: CommissionTotals;
};

export default function TrainerStats({ data, commission }: TrainerStatsProps) {
  const cards = [
    ["Переходы", data?.referralClicks],
    ["Заказы", data?.orders._count],
    ["Сумма заказов", `${Number(data?.orders._sum.finalAmount ?? 0).toLocaleString("ru-RU")} ₽`],
    ["К выплате", `${(commission.AVAILABLE ?? 0).toLocaleString("ru-RU")} ₽`],
  ];

  return (
    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map(([label, value]) => (
        <article key={label} className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold">{data ? value : "…"}</p>
        </article>
      ))}
    </div>
  );
}
