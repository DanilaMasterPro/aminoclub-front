"use client";

import type { ReactNode } from "react";
import AdminDetailItem from "./components/AdminDetailItem";
import AdminPageHeader from "./components/AdminPageHeader";
import { useAdminOrder, type AdminOrderAction } from "./hooks/useAdminOrder";
import { orderStatusLabels, paymentStatusLabels, receiptStatusLabels, shipmentStatusLabels } from "./order-labels";

const allowedTransitions: Record<string, string[]> = {
  NEW: ["AWAITING_PAYMENT", "PROCESSING", "CANCELLED"],
  AWAITING_PAYMENT: ["PAID", "CANCELLED"],
  PAID: ["PROCESSING", "PACKING", "SHIPPED", "CANCELLED"],
  PROCESSING: ["PACKING", "SHIPPED", "CANCELLED"],
  PACKING: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

function formatMoney(value: string | number | null | undefined) {
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 2 }).format(Number(value ?? 0));
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function Card({ title, action, children }: { title: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 lg:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function ActionButton({ label, action, pendingAction, onRun, tone = "default" }: {
  label: string;
  action: AdminOrderAction;
  pendingAction: string;
  onRun: (action: AdminOrderAction) => void;
  tone?: "default" | "danger" | "primary";
}) {
  const tones = {
    default: "border border-slate-300 text-slate-900",
    danger: "border border-red-300 text-red-700",
    primary: "bg-[#009d0a] text-white",
  };
  return (
    <button type="button" disabled={Boolean(pendingAction)} onClick={() => onRun(action)} className={`rounded-lg px-3.5 py-2 text-sm font-semibold disabled:opacity-50 ${tones[tone]}`}>
      {pendingAction === action ? "Выполняем…" : label}
    </button>
  );
}

export default function AdminOrderScreen({ id }: { id: string }) {
  const { order, comment, isLoading, pendingAction, error, notice, setComment, changeStatus, saveComment, perform } = useAdminOrder(id);

  if (isLoading) return <p className="text-sm text-slate-500">Загрузка заказа…</p>;
  if (!order) return <p role="alert" className="text-sm text-red-600">{error || "Заказ не найден"}</p>;

  const shipment = order.shipment;
  const receipt = order.fiscalReceipts.find((item) => item.type === "SALE");
  const isPaid = ["PAID", "PROCESSING", "PACKING", "SHIPPED", "COMPLETED"].includes(order.status);
  const canCreateShipment = shipment && !shipment.externalId && ["PAID", "PROCESSING", "PACKING"].includes(order.status);
  const canCancelShipment = shipment?.externalId && ["CREATED", "IN_TRANSIT", "READY_FOR_PICKUP"].includes(shipment.status);
  const details = shipment?.addressDetails ?? {};
  const courierDetails = [
    details.apartment && `кв. ${details.apartment}`,
    details.porch && `подъезд ${details.porch}`,
    details.floor && `этаж ${details.floor}`,
    details.intercom && `домофон ${details.intercom}`,
    details.postalCode && `индекс ${details.postalCode}`,
  ].filter(Boolean).join(", ");

  return (
    <section className="max-w-6xl" data-testid="admin-order-detail">
      <AdminPageHeader
        backHref="/admin/orders"
        eyebrow={`Заказ от ${formatDate(order.createdAt)}`}
        title={order.number}
        action={(
          <label className="flex items-center gap-3 text-sm">
            <span className="text-slate-500">Статус</span>
            <select
              value={order.status}
              disabled={Boolean(pendingAction)}
              onChange={(event) => { if (event.target.value !== order.status) void changeStatus(event.target.value); }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 font-medium"
            >
              <option value={order.status}>{orderStatusLabels[order.status] ?? order.status}</option>
              {(allowedTransitions[order.status] ?? []).map((status) => <option key={status} value={status}>{orderStatusLabels[status]}</option>)}
            </select>
          </label>
        )}
      />

      {error && <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {notice && <p className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{notice}</p>}

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Покупатель">
          <dl className="grid gap-4 sm:grid-cols-2">
            <AdminDetailItem label="Имя">{order.customerName}</AdminDetailItem>
            <AdminDetailItem label="Телефон"><a href={`tel:${order.customerPhone}`} className="text-[#008609]">{order.customerPhone}</a></AdminDetailItem>
            <AdminDetailItem label="Email"><a href={`mailto:${order.customerEmail}`} className="text-[#008609]">{order.customerEmail}</a></AdminDetailItem>
            <AdminDetailItem label="Промокод / тренер">
              {[order.promoCode?.code, order.trainer && `${order.trainer.name} ${order.trainer.surname}`].filter(Boolean).join(" · ")}
            </AdminDetailItem>
            <div className="sm:col-span-2"><AdminDetailItem label="Комментарий покупателя">{order.customerComment}</AdminDetailItem></div>
          </dl>
        </Card>

        <Card title="Состав заказа">
          <table className="w-full text-sm">
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-3">{item.productName}{item.flavor ? `, ${item.flavor}` : ""}<span className="block text-xs text-slate-500">{item.sku}</span></td>
                  <td className="whitespace-nowrap py-2 pr-3 text-slate-500">{item.quantity} × {formatMoney(item.price)}</td>
                  <td className="whitespace-nowrap py-2 text-right font-medium">{formatMoney(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <dl className="mt-4 space-y-1.5 border-t border-slate-200 pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Товары</dt><dd>{formatMoney(order.subtotalAmount)}</dd></div>
            {Number(order.discountAmount) > 0 && <div className="flex justify-between"><dt className="text-slate-500">Скидка</dt><dd>−{formatMoney(order.discountAmount)}</dd></div>}
            <div className="flex justify-between"><dt className="text-slate-500">Доставка</dt><dd>{formatMoney(order.deliveryAmount)}</dd></div>
            <div className="flex justify-between text-base font-semibold"><dt>Итого</dt><dd>{formatMoney(order.finalAmount)}</dd></div>
          </dl>
        </Card>

        <Card
          title="Доставка · Яндекс Доставка"
          action={shipment && (
            <div className="flex flex-wrap gap-2">
              {canCreateShipment && <ActionButton label="Создать заявку" action="shipment" pendingAction={pendingAction} onRun={(action) => void perform(action)} tone="primary" />}
              {shipment.externalId && <ActionButton label="Обновить статус" action="shipment/sync" pendingAction={pendingAction} onRun={(action) => void perform(action)} />}
              {canCancelShipment && <ActionButton label="Отменить заявку" action="shipment/cancel" pendingAction={pendingAction} onRun={(action) => { if (window.confirm("Отменить заявку в Яндекс Доставке?")) void perform(action); }} tone="danger" />}
            </div>
          )}
        >
          {shipment ? (
            <dl className="grid gap-4 sm:grid-cols-2">
              <AdminDetailItem label="Способ">{shipment.method === "PICKUP_POINT" ? "Пункт выдачи" : "Курьер до двери"}</AdminDetailItem>
              <AdminDetailItem label="Статус">
                {shipmentStatusLabels[shipment.status] ?? shipment.status}
                {shipment.externalStatusText && <span className="block text-xs text-slate-500">{shipment.externalStatusText}</span>}
              </AdminDetailItem>
              <div className="sm:col-span-2">
                <AdminDetailItem label="Адрес">
                  {shipment.pickupPointName ? `${shipment.pickupPointName}: ` : ""}{shipment.address}
                  {courierDetails && <span className="block text-slate-500">{courierDetails}</span>}
                </AdminDetailItem>
              </div>
              <AdminDetailItem label="Стоимость для покупателя">{`${formatMoney(shipment.quotedAmount)}${shipment.deliveryDays ? ` · ${shipment.deliveryDays} дн.` : ""}`}</AdminDetailItem>
              <AdminDetailItem label="Посылка">{`${(shipment.weightGrams / 1000).toLocaleString("ru-RU")} кг · ${shipment.dimensions.dx}×${shipment.dimensions.dy}×${shipment.dimensions.dz} см`}</AdminDetailItem>
              <AdminDetailItem label="ID заявки">{shipment.externalId}</AdminDetailItem>
              <AdminDetailItem label="Номер отправления">{shipment.trackingNumber}</AdminDetailItem>
              {shipment.pickupCode && <AdminDetailItem label="Код получения">{shipment.pickupCode}</AdminDetailItem>}
              <AdminDetailItem label="Трекинг">
                {shipment.trackingUrl ? <a href={shipment.trackingUrl} target="_blank" rel="noreferrer" className="text-[#008609]">Открыть страницу отслеживания</a> : null}
              </AdminDetailItem>
              {shipment.syncedAt && <AdminDetailItem label="Синхронизировано">{formatDate(shipment.syncedAt)}</AdminDetailItem>}
              {shipment.lastError && (
                <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 sm:col-span-2">
                  {shipment.lastError}{shipment.attempts ? ` (попыток: ${shipment.attempts})` : ""}
                </p>
              )}
            </dl>
          ) : <p className="text-sm text-slate-500">Заказ оформлен без доставки.</p>}
        </Card>

        <div className="grid gap-5">
          <Card
            title="Оплата · Robokassa"
            action={order.payments[0]?.externalId && order.status === "AWAITING_PAYMENT" && (
              <ActionButton label="Проверить оплату" action="payment/refresh" pendingAction={pendingAction} onRun={(action) => void perform(action)} />
            )}
          >
            {order.payments.length ? (
              <ul className="space-y-3 text-sm">
                {order.payments.map((payment) => (
                  <li key={payment.id} className="flex flex-wrap justify-between gap-2 border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <span>
                      <strong>{paymentStatusLabels[payment.status] ?? payment.status}</strong> · {formatMoney(payment.amount)}
                      <span className="block text-xs text-slate-500">{payment.provider}{payment.externalId ? ` · счёт ${payment.externalId}` : ""}{payment.isTest ? " · тестовый" : ""}</span>
                    </span>
                    <span className="text-slate-500">{formatDate(payment.paidAt ?? payment.createdAt)}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-slate-500">Платежей нет.</p>}
          </Card>

          <Card
            title="Чек · Бизнес.Ру Онлайн-чеки"
            action={isPaid && (!receipt || ["FAILED", "SKIPPED", "PENDING"].includes(receipt.status)) && (
              <ActionButton label={receipt ? "Отправить повторно" : "Отправить чек"} action="receipt" pendingAction={pendingAction} onRun={(action) => void perform(action)} />
            )}
          >
            {receipt ? (
              <dl className="grid gap-4 sm:grid-cols-2">
                <AdminDetailItem label="Статус">{receiptStatusLabels[receipt.status] ?? receipt.status}</AdminDetailItem>
                <AdminDetailItem label="Сумма">{formatMoney(receipt.amount)}</AdminDetailItem>
                <AdminDetailItem label="ФД / ФН">{[receipt.fiscalData?.fiscalDocumentNumber, receipt.fiscalData?.fnNumber].filter(Boolean).join(" / ")}</AdminDetailItem>
                <AdminDetailItem label="Электронный чек">
                  {receipt.fiscalData?.receiptUrl ? <a href={receipt.fiscalData.receiptUrl} target="_blank" rel="noreferrer" className="text-[#008609]">Открыть</a> : null}
                </AdminDetailItem>
                {receipt.lastError && <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 sm:col-span-2">{receipt.lastError}</p>}
              </dl>
            ) : <p className="text-sm text-slate-500">{isPaid ? "Чек ещё не формировался." : "Чек формируется после оплаты."}</p>}
          </Card>
        </div>

        <Card title="Внутренний комментарий">
          <textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={4} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#009d0a]" />
          <button type="button" disabled={Boolean(pendingAction)} onClick={() => void saveComment()} className="mt-3 rounded-lg bg-[#009d0a] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
            {pendingAction === "comment" ? "Сохраняем…" : "Сохранить"}
          </button>
        </Card>
      </div>
    </section>
  );
}
