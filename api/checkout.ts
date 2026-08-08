import api from "./client";
import type { AppliedPromo, CheckoutPayload, CheckoutResult } from "./types";

export async function applyPromoCode(code: string, subtotal: number) {
  const { data } = await api.post<AppliedPromo>("/promo-codes/apply", { code, subtotal });
  return data;
}

export async function createCheckout(payload: CheckoutPayload) {
  const { data } = await api.post<CheckoutResult>("/checkout", payload);
  return data;
}
