"use client";

import api from "@/api/client";
import { useState } from "react";

export function usePayoutRequest() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const requestPayout = async (amount: number) => {
    setIsSubmitting(true);
    setMessage("");

    try {
      await api.post("/trainer/payouts", { amount });
      setMessage("Заявка на выплату отправлена");
      return true;
    } catch {
      setMessage("Не удалось создать заявку. Проверьте доступную сумму и реквизиты.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { requestPayout, isSubmitting, message };
}
