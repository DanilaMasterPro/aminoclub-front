"use client";

import { useEffect, useState } from "react";
import { getOrderStatus, retryOrderPayment } from "@/api/checkout";
import type { PublicOrderStatus } from "@/api/types";

const POLL_INTERVAL = 3_000;
const POLL_LIMIT = 20;

export type OrderPaymentState = "loading" | "paid" | "pending" | "failed" | "cancelled" | "unknown" | "missing";

function paymentState(order: PublicOrderStatus | null, returnedFromFail: boolean): OrderPaymentState {
  if (!order) return "loading";
  if (order.status === "CANCELLED") return "cancelled";
  if (order.paymentStatus === "SUCCEEDED" || !["NEW", "AWAITING_PAYMENT"].includes(order.status)) return "paid";
  if (order.paymentStatus === "CANCELED" || returnedFromFail) return "failed";
  return "pending";
}

/** `returnedFromFail` — the customer came back via Robokassa FailURL (cancelled or declined payment). */
export function useOrderStatus(orderId?: string, returnedFromFail = false) {
  const [order, setOrder] = useState<PublicOrderStatus | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryError, setRetryError] = useState("");

  // Opened without an order id (e.g. typed by hand): nothing to poll.
  const state: OrderPaymentState = !orderId
    ? returnedFromFail ? "failed" : "missing"
    : loadError ? "unknown" : paymentState(order, returnedFromFail);
  const shouldPoll = Boolean(orderId) && (state === "loading" || state === "pending") && attempts < POLL_LIMIT;

  useEffect(() => {
    if (!orderId || !shouldPoll) return;
    let active = true;
    const timeout = window.setTimeout(() => {
      getOrderStatus(orderId)
        .then((value) => { if (active) setOrder(value); })
        .catch(() => { if (active) setLoadError(true); })
        .finally(() => { if (active) setAttempts((current) => current + 1); });
    }, attempts === 0 ? 0 : POLL_INTERVAL);
    return () => { active = false; window.clearTimeout(timeout); };
  }, [attempts, orderId, shouldPoll]);

  async function retryPayment() {
    if (!orderId) return;
    setIsRetrying(true);
    setRetryError("");
    try {
      const payment = await retryOrderPayment(orderId);
      if (payment.confirmationUrl) window.location.assign(payment.confirmationUrl);
      else setRetryError("Не удалось получить ссылку на оплату");
    } catch {
      setRetryError("Повторная оплата недоступна. Свяжитесь с нами, и мы поможем завершить заказ.");
    } finally {
      setIsRetrying(false);
    }
  }

  return { order, state, isPolling: shouldPoll, isRetrying, retryError, retryPayment };
}
