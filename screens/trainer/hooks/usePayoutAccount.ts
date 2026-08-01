"use client";

import api from "@/api/client";
import { useState } from "react";

type PayoutAccountPayload = {
  bankDetails: string;
  displayHint: string;
};

export function usePayoutAccount() {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const saveAccount = async (payload: PayoutAccountPayload) => {
    setIsSaving(true);
    setMessage("");

    try {
      await api.patch("/trainer/payout-account", payload);
      setMessage("Реквизиты сохранены в зашифрованном виде");
      return true;
    } catch {
      setMessage("Не удалось сохранить реквизиты. Попробуйте ещё раз.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveAccount, isSaving, message };
}
