"use client";

import AdminDetailItem from "./components/AdminDetailItem";
import AdminPageHeader from "./components/AdminPageHeader";
import {
  useAdminTrainerApplication,
  type TrainerApplicationStatus,
} from "./hooks/useAdminTrainerApplication";

const statusLabels: Record<TrainerApplicationStatus, string> = {
  PENDING: "Ожидает решения",
  APPROVED: "Одобрена",
  REJECTED: "Отклонена",
  BLOCKED: "Заблокирована",
};

const statusClassNames: Record<TrainerApplicationStatus, string> = {
  PENDING: "border-amber-200 bg-amber-50 text-amber-700",
  APPROVED: "border-green-200 bg-green-50 text-green-700",
  REJECTED: "border-red-200 bg-red-50 text-red-700",
  BLOCKED: "border-slate-300 bg-slate-100 text-slate-700",
};

const inputClassName = "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#009d0a]";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "long", timeStyle: "short" }).format(new Date(value));
}

export default function AdminTrainerApplicationScreen({ id }: { id: string }) {
  const {
    application,
    commissionRate,
    promoDiscount,
    promoCode,
    adminComment,
    isLoading,
    isSubmitting,
    error,
    setCommissionRate,
    setPromoDiscount,
    setPromoCode,
    setAdminComment,
    approve,
    reject,
  } = useAdminTrainerApplication(id);

  if (isLoading) return <p className="text-sm text-slate-500">Загрузка заявки…</p>;
  if (!application) return <p role="alert" className="text-sm text-red-600">{error || "Заявка не найдена"}</p>;

  const socialHref = application.socialLink && /^https?:\/\//i.test(application.socialLink)
    ? application.socialLink
    : null;

  return (
    <section className="max-w-5xl" data-testid="admin-trainer-application-detail">
      <AdminPageHeader
        backHref="/admin/trainer-applications"
        eyebrow={`Заявка от ${formatDate(application.createdAt)}`}
        title={`${application.name} ${application.surname}`}
        action={(
          <span className={`rounded-full border px-3 py-1.5 text-sm font-medium ${statusClassNames[application.status]}`}>
            {statusLabels[application.status]}
          </span>
        )}
      />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6">
          <h2 className="text-lg font-semibold">Контактные данные</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <AdminDetailItem label="Имя">{application.name}</AdminDetailItem>
            <AdminDetailItem label="Фамилия">{application.surname}</AdminDetailItem>
            <AdminDetailItem label="Телефон">
              <a className="text-[#008609] hover:underline" href={`tel:${application.phone}`}>{application.phone}</a>
            </AdminDetailItem>
            <AdminDetailItem label="Email">
              <a className="text-[#008609] hover:underline" href={`mailto:${application.email}`}>{application.email}</a>
            </AdminDetailItem>
            <AdminDetailItem label="Город">{application.city}</AdminDetailItem>
            <AdminDetailItem label="Согласие с условиями">Принято {formatDate(application.termsAcceptedAt)}</AdminDetailItem>
          </dl>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6">
          <h2 className="text-lg font-semibold">Профессиональные данные</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <AdminDetailItem label="Специализация">{application.specialization}</AdminDetailItem>
            <AdminDetailItem label="Размер аудитории">
              {application.audienceSize === null ? "—" : new Intl.NumberFormat("ru-RU").format(application.audienceSize)}
            </AdminDetailItem>
            <AdminDetailItem label="Социальная сеть">
              {socialHref ? (
                <a className="text-[#008609] hover:underline" href={socialHref} target="_blank" rel="noreferrer">
                  {application.socialLink}
                </a>
              ) : application.socialLink}
            </AdminDetailItem>
            <AdminDetailItem label="Статус">{statusLabels[application.status]}</AdminDetailItem>
          </dl>
        </section>
      </div>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 lg:p-6">
        <h2 className="text-lg font-semibold">О себе</h2>
        <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">{application.comment || "—"}</p>
      </section>

      {application.status === "PENDING" ? (
        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 lg:p-6">
          <h2 className="text-lg font-semibold">Решение по заявке</h2>
          <p className="mt-1 text-sm text-slate-500">Параметры будут применены при создании кабинета тренера.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-medium">Вознаграждение, %
              <input aria-label="Вознаграждение" required type="number" min={0} max={100} step="0.01" value={commissionRate} onChange={(event) => setCommissionRate(event.target.value)} className={inputClassName} />
            </label>
            <label className="text-sm font-medium">Скидка по промокоду, %
              <input aria-label="Скидка по промокоду" required type="number" min={0} max={100} step="0.01" value={promoDiscount} onChange={(event) => setPromoDiscount(event.target.value)} className={inputClassName} />
            </label>
            <label className="text-sm font-medium">Промокод
              <input aria-label="Промокод" value={promoCode} onChange={(event) => setPromoCode(event.target.value)} placeholder="Создать автоматически" className={inputClassName} />
            </label>
          </div>
          <label className="mt-5 block text-sm font-medium">Причина отказа
            <textarea aria-label="Причина отказа" rows={3} value={adminComment} onChange={(event) => setAdminComment(event.target.value)} placeholder="Можно оставить пустой" className={inputClassName} />
          </label>
          {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" disabled={isSubmitting} onClick={() => void approve()} className="rounded-lg bg-[#009d0a] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              Одобрить заявку
            </button>
            <button type="button" disabled={isSubmitting} onClick={() => void reject()} className="rounded-lg border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-700 disabled:opacity-50">
              Отклонить
            </button>
          </div>
        </section>
      ) : (
        <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 lg:p-6">
          <h2 className="text-lg font-semibold">Решение</h2>
          <dl className="mt-5 grid gap-5 sm:grid-cols-2">
            <AdminDetailItem label="Статус">{statusLabels[application.status]}</AdminDetailItem>
            <AdminDetailItem label="Дата решения">{formatDate(application.reviewedAt)}</AdminDetailItem>
            <AdminDetailItem label="Комментарий администратора">{application.adminComment}</AdminDetailItem>
            {application.profile && <AdminDetailItem label="Реферальный код">{application.profile.referralCode}</AdminDetailItem>}
          </dl>
        </section>
      )}
    </section>
  );
}
