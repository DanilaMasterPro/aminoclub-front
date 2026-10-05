"use client";

import axios from "axios";
import { useState } from "react";
import { createCheckout } from "@/api/checkout";
import type { AppliedPromo } from "@/api/types";
import { useCart } from "@/hooks/useCart";
import { getStoredReferralCode } from "@/hooks/useReferralAttribution";
import type { DeliveryFormState } from "./useDeliveryForm";

function errorMessage(error: unknown) {
  const fallback = "Не удалось оформить заказ. Проверьте данные и попробуйте ещё раз.";
  if (!axios.isAxiosError(error)) return fallback;
  const message = error.response?.data?.message;
  return (Array.isArray(message) ? message[0] : message) ?? fallback;
}

export function useCheckout(promo: AppliedPromo | null, delivery: DeliveryFormState) {
  const { items, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(form: HTMLFormElement) {
    setError("");
    if (!delivery.payload) {
      setError(delivery.location ? "Выберите пункт выдачи или укажите адрес доставки." : "Укажите город доставки.");
      return;
    }
    if (!delivery.quote) {
      setError(delivery.quoteError || "Дождитесь расчёта стоимости доставки.");
      return;
    }
    setIsSubmitting(true);
    const data = new FormData(form);
    try {
      const result = await createCheckout({
        name: `${data.get("firstName") || ""} ${data.get("lastName") || ""}`.trim(),
        phone: String(data.get("phone") || ""),
        email: String(data.get("email") || ""),
        delivery: delivery.payload,
        comment: String(data.get("comment") || "") || undefined,
        promoCode: promo?.code,
        referralCode: getStoredReferralCode(),
        items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      });
      clearCart();
      window.localStorage.removeItem("aminoclub_promo_v1");
      window.location.assign(
        result.payment.confirmationUrl
          ?? `/order/success?order=${encodeURIComponent(result.order.number)}&id=${result.order.id}`,
      );
    } catch (checkoutError: unknown) {
      setError(errorMessage(checkoutError));
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting, error };
}
