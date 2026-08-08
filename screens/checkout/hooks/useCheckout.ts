"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCheckout } from "@/api/checkout";
import type { AppliedPromo } from "@/api/types";
import { useCart } from "@/hooks/useCart";
import { getStoredReferralCode } from "@/hooks/useReferralAttribution";

export function useCheckout(promo: AppliedPromo | null) {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function submit(form: HTMLFormElement) {
    setIsSubmitting(true);
    setError("");
    const data = new FormData(form);
    try {
      const result = await createCheckout({
        name: `${data.get("firstName") || ""} ${data.get("lastName") || ""}`.trim(),
        phone: String(data.get("phone") || ""),
        email: String(data.get("email") || ""),
        city: String(data.get("city") || ""),
        address: [data.get("region"), data.get("address"), data.get("postalCode")].filter(Boolean).join(", "),
        comment: String(data.get("comment") || "") || undefined,
        promoCode: promo?.code,
        referralCode: getStoredReferralCode(),
        items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      });
      clearCart();
      window.localStorage.removeItem("aminoclub_promo_v1");
      if (result.payment.confirmationUrl) {
        window.location.assign(result.payment.confirmationUrl);
      } else {
        router.push(`/thank-you?order=${encodeURIComponent(result.order.number)}`);
      }
    } catch {
      setError("Не удалось оформить заказ. Проверьте данные и попробуйте ещё раз.");
      setIsSubmitting(false);
    }
  }

  return { submit, isSubmitting, error };
}
