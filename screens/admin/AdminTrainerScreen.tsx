"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import AdminDetailItem from "./components/AdminDetailItem";
import AdminPageHeader from "./components/AdminPageHeader";
import { useAdminTrainer } from "./hooks/useAdminTrainer";

const subscribeToOrigin = () => () => undefined;
const getBrowserOrigin = () => window.location.origin;
const getServerOrigin = () => "";
const inputClassName = "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#009d0a]";

const statusLabels = {
  PENDING: "Ожидает решения",
  APPROVED: "Активен",
  REJECTED: "Отклонён",
  BLOCKED: "Заблокирован",
} as const;

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "long", timeStyle: "short" }).format(new Date(value));
}

function formatMoney(value: string | number | null | undefined) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}

export default function AdminTrainerScreen({ id }: { id: string }) {
  const {
    trainer,
    editValues,
    isLoading,
    isSubmitting,
    error,
    block,
    cancelEditing,
    setEditValue,
    save,
  } = useAdminTrainer(id);
  const origin = useSyncExternalStore(subscribeToOrigin, getBrowserOrigin, getServerOrigin);

  if (isLoading) return <p className="text-sm text-slate-500">Загрузка профиля…</p>;
  if (!trainer) return <p role="alert" className="text-sm text-red-600">{error || "Тренер не найден"}</p>;

  const commissionByStatus = Object.fromEntries(
    trainer.stats.commissions.map((item) => [item.status, Number(item._sum.amount ?? 0)]),
  );
  const paidPayouts = trainer.stats.payouts.find((item) => item.status === "PAID");
  const referralUrl = `${origin}/?ref=${trainer.referralCode}`;

  return (
    <section className="max-w-6xl" data-testid="admin-trainer-detail">
      <AdminPageHeader
        backHref="/admin/trainers"
        eyebrow={`Тренер с ${formatDate(trainer.createdAt)}`}
        title={`${trainer.name} ${trainer.surname}`}
        action={(
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full border px-3 py-1.5 text-sm font-medium ${trainer.status === "BLOCKED" ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>
              {statusLabels[trainer.status]}
            </span>
            {trainer.status !== "BLOCKED" && (
              <button type="button" disabled={isSubmitting} onClick={() => void block()} className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-50">
                Заблокировать
              </button>
            )}
          </div>
        )}
      />

      {error && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      {editValues && (
        <form
          data-testid="admin-trainer-edit-form"
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
          className="mb-5 grid gap-5 rounded-xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 sm:col-span-2">
            <h2 className="text-lg font-semibold">Редактирование профиля</h2>
            {trainer.application && (
              <Link className="text-sm font-medium text-[#008609] hover:underline" href={`/admin/trainer-applications/${trainer.application.id}`}>
                Открыть исходную заявку
              </Link>
            )}
          </div>
          <label className="text-sm font-medium">Имя
            <input required maxLength={100} value={editValues.name} onChange={(event) => setEditValue("name", event.target.value)} className={inputClassName} />
          </label>
          <label className="text-sm font-medium">Фамилия
            <input required maxLength={100} value={editValues.surname} onChange={(event) => setEditValue("surname", event.target.value)} className={inputClassName} />
          </label>
          <label className="text-sm font-medium">Email
            <input required type="email" value={editValues.email} onChange={(event) => setEditValue("email", event.target.value)} className={inputClassName} />
          </label>
          <label className="text-sm font-medium">Телефон
            <input required type="tel" maxLength={40} value={editValues.phone} onChange={(event) => setEditValue("phone", event.target.value)} className={inputClassName} />
          </label>
          <label className="text-sm font-medium">Город
            <input required value={editValues.city} onChange={(event) => setEditValue("city", event.target.value)} className={inputClassName} />
          </label>
          <label className="text-sm font-medium">Социальная сеть
            <input required type="url" value={editValues.socialLink} onChange={(event) => setEditValue("socialLink", event.target.value)} className={inputClassName} />
          </label>
          <label className="text-sm font-medium">Специализация
            <input required value={editValues.specialization} onChange={(event) => setEditValue("specialization", event.target.value)} className={inputClassName} />
          </label>
          <label className="text-sm font-medium">Размер аудитории
            <input required type="number" min={0} step={1} value={editValues.audienceSize} onChange={(event) => setEditValue("audienceSize", event.target.value)} className={inputClassName} />
          </label>
          <label className="text-sm font-medium">Вознаграждение, %
            <input required type="number" min={0} max={100} step="0.01" value={editValues.commissionRate} onChange={(event) => setEditValue("commissionRate", event.target.value)} className={inputClassName} />
          </label>
          <label className="text-sm font-medium">Реферальный код
            <input required minLength={6} maxLength={32} pattern="[A-Za-z0-9]+" value={editValues.referralCode} onChange={(event) => setEditValue("referralCode", event.target.value)} className={inputClassName} />
            <span className="mt-1 block text-xs font-normal text-slate-500">6–32 латинские буквы или цифры. Старые ссылки перестанут работать после изменения.</span>
          </label>
          <label className="text-sm font-medium sm:col-span-2">О себе
            <textarea rows={5} maxLength={3000} value={editValues.bio} onChange={(event) => setEditValue("bio", event.target.value)} className={inputClassName} />
          </label>
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button disabled={isSubmitting} className="rounded-lg bg-[#009d0a] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              {isSubmitting ? "Сохраняем…" : "Сохранить"}
            </button>
            <button type="button" disabled={isSubmitting} onClick={cancelEditing} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold disabled:opacity-50">
              Отмена
            </button>
          </div>
        </form>
      )}

      <section className="mt-8" aria-labelledby="trainer-statistics-title">
        <h2 id="trainer-statistics-title" className="text-xl font-semibold">Статистика</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Переходы по ссылке" value={trainer.stats.referralClicks} />
          <StatCard label="Заказы" value={trainer.stats.orders._count} />
          <StatCard label="Сумма заказов" value={formatMoney(trainer.stats.orders._sum.finalAmount)} />
          <StatCard label="Начисляется" value={formatMoney(commissionByStatus.PENDING)} />
          <StatCard label="Доступно к выплате" value={formatMoney(commissionByStatus.AVAILABLE)} />
          <StatCard label="Выплачено" value={formatMoney(commissionByStatus.PAID)} />
        </div>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6">
          <h2 className="text-lg font-semibold">Реферальные инструменты</h2>
          <dl className="mt-5 grid gap-5">
            <AdminDetailItem label="Ссылка">{referralUrl}</AdminDetailItem>
            <AdminDetailItem label="Реферальный код">{trainer.referralCode}</AdminDetailItem>
          </dl>
          <div className="mt-5 border-t border-slate-100 pt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Промокоды</p>
            {trainer.promoCodes.length ? (
              <ul className="mt-3 space-y-2 text-sm">
                {trainer.promoCodes.map((promo) => (
                  <li key={promo.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
                    <span className="font-semibold">{promo.code}</span>
                    <span className="text-slate-500">{promo.value}{promo.type === "PERCENT" ? "%" : " ₽"} · {promo.isActive ? "активен" : "отключён"} · использований: {promo.usageCount}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="mt-3 text-sm text-slate-500">Промокодов нет.</p>}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6">
          <h2 className="text-lg font-semibold">Реквизиты и выплаты</h2>
          {trainer.payoutAccount ? (
            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <AdminDetailItem label="Сохранённые реквизиты">{trainer.payoutAccount.displayHint}</AdminDetailItem>
              <AdminDetailItem label="Обновлены">{formatDate(trainer.payoutAccount.updatedAt)}</AdminDetailItem>
              <AdminDetailItem label="Полные реквизиты">
                <span className="whitespace-pre-wrap">{trainer.payoutAccount.details}</span>
              </AdminDetailItem>
              <AdminDetailItem label="Выплачено заявок">{paidPayouts?._count ?? 0}</AdminDetailItem>
              <AdminDetailItem label="Сумма выплат">{formatMoney(paidPayouts?._sum.amount)}</AdminDetailItem>
            </dl>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-500">Тренер пока не заполнил реквизиты для выплат.</p>
          )}
          <p className="mt-5 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-500">
            Реквизиты расшифровываются только для авторизованного администратора. В базе они остаются зашифрованными.
          </p>
        </section>
      </div>
    </section>
  );
}
