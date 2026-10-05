"use client";

import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";
import { useOrderStatus } from "../hooks/useOrderStatus";

const titles = {
  loading: "Проверяем оплату…",
  pending: "Ожидаем подтверждение оплаты",
  paid: "Спасибо за заказ",
  failed: "Оплата не прошла",
  cancelled: "Заказ отменён",
  unknown: "Спасибо за заказ",
  missing: "Статус заказа",
} as const;

type OrderResultProps = { orderId?: string; orderNumber?: string; isDemo?: boolean; isFailed?: boolean };

export default function OrderResult({ orderId, orderNumber, isDemo, isFailed }: OrderResultProps) {
  const { order, state, isPolling, isRetrying, retryError, retryPayment } = useOrderStatus(orderId, isFailed);
  const number = order?.number ?? orderNumber;
  const pendingTimedOut = state === "pending" && !isPolling;

  return (
    <div className="max-w-[720px]" data-testid="order-result" data-state={state}>
      <h1 className="font-[family-name:var(--font-helvetica-neue)] text-[56px] font-normal leading-[1.05] tracking-[-0.045em] max-[700px]:text-[40px]">{titles[state]}</h1>
      {number && <p className="mt-4 text-sm text-[#747978]">Номер заказа: <strong className="text-[#15191a]">{number}</strong></p>}
      {order && <p className="mt-1 text-sm text-[#747978]">Сумма: {formatPrice(order.finalAmount)}{Number(order.deliveryAmount) > 0 ? `, включая доставку ${formatPrice(order.deliveryAmount)}` : ""}</p>}

      <div className="mx-auto mt-6 max-w-[620px] space-y-3 text-[19px] leading-8 text-[#747978]">
        {(state === "paid" || state === "unknown") && (
          <>
            <p>Заказ принят. Подробности и чек мы отправили на вашу электронную почту.</p>
            <p>Менеджер свяжется с вами, если потребуется уточнить детали. Ссылку для отслеживания посылки пришлём, как только передадим заказ в Яндекс Доставку.</p>
          </>
        )}
        {state === "pending" && !pendingTimedOut && <p>Банк ещё подтверждает платёж. Страница обновится автоматически.</p>}
        {pendingTimedOut && <p>Подтверждение оплаты задерживается. Если деньги списаны, заказ обновится сам — мы пришлём письмо. Если вы не завершили оплату, можно попробовать ещё раз.</p>}
        {state === "failed" && <p>Платёж был отклонён или отменён. Деньги не списаны — попробуйте оплатить заказ ещё раз.</p>}
        {state === "missing" && <p>В ссылке нет номера заказа. Подтверждение оплаты и детали заказа приходят на электронную почту, указанную при оформлении.</p>}
        {state === "cancelled" && <p>Время на оплату истекло, и заказ был отменён. Оформите его заново — товары ждут в каталоге.</p>}
        {isDemo && state !== "paid" && <p className="text-sm">Демо-режим: платёжный шлюз не подключён, оплата не проводилась.</p>}
      </div>

      {order?.delivery && (
        <div className="mx-auto mt-8 max-w-[520px] rounded-[22px] bg-[#fcfbf8] p-6 text-left text-sm">
          <p className="font-semibold">{order.delivery.method === "PICKUP_POINT" ? "Пункт выдачи" : "Доставка курьером"}</p>
          <p className="mt-1">{order.delivery.pickupPointName ? `${order.delivery.pickupPointName}, ` : ""}{order.delivery.address}</p>
          {order.delivery.deliveryDays && <p className="mt-1 text-[#747978]">Срок доставки — около {order.delivery.deliveryDays} дн. после отправки</p>}
          {order.delivery.trackingUrl && <a href={order.delivery.trackingUrl} target="_blank" rel="noreferrer" className="mt-3 inline-block font-semibold text-[#009d0a]">Отследить посылку</a>}
        </div>
      )}

      {retryError && <p role="alert" className="mt-6 text-sm text-red-600">{retryError}</p>}
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {orderId && (state === "failed" || pendingTimedOut) && (
          <button type="button" onClick={() => void retryPayment()} disabled={isRetrying} className="inline-flex min-h-12 min-w-[260px] items-center justify-center rounded-xl bg-[#009d0a] px-7 font-semibold text-white disabled:opacity-60">
            {isRetrying ? "Переходим к оплате…" : "Оплатить ещё раз"}
          </button>
        )}
        <Link href="/" className={`inline-flex min-h-12 min-w-[260px] items-center justify-center rounded-xl px-7 font-semibold ${state === "failed" || pendingTimedOut ? "border border-[#15191a]" : "bg-[#009d0a] text-white"}`}>
          На главную
        </Link>
      </div>
    </div>
  );
}
