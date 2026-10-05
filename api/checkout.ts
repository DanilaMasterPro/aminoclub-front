import api from "./client";
import type { AppliedPromo, CheckoutPayload, CheckoutResult, PublicOrderStatus } from "./types";

export async function applyPromoCode(code: string, subtotal: number) {
  const { data } = await api.post<AppliedPromo>("/promo-codes/apply", { code, subtotal });
  return data;
}

export async function createCheckout(payload: CheckoutPayload) {
  const { data } = await api.post<CheckoutResult>("/checkout", payload);
  return data;
}

export async function getOrderStatus(orderId: string) {
  const { data } = await api.get<PublicOrderStatus>(`/checkout/orders/${encodeURIComponent(orderId)}`);
  return data;
}

export async function retryOrderPayment(orderId: string) {
  const { data } = await api.post<CheckoutResult["payment"]>(`/checkout/${encodeURIComponent(orderId)}/payment`);
  return data;
}
