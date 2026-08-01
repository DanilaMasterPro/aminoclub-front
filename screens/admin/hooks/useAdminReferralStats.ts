"use client";

import api from "@/api/client";
import { useEffect, useState } from "react";

export type AdminReferralStat = {
  id: string;
  name: string;
  surname: string;
  referralCode: string;
  orderAmount: string;
  _count: { referralClicks: number; orders: number };
  promoCodes: Array<{ code: string }>;
};

export function useAdminReferralStats() {
  const [items, setItems] = useState<AdminReferralStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const requestController = new AbortController();

    api.get<AdminReferralStat[]>("/admin/referral/stats", { signal: requestController.signal })
      .then(({ data }) => setItems(data))
      .catch((requestError: unknown) => {
        if (!requestController.signal.aborted) {
          console.error("Не удалось загрузить реферальную статистику", requestError);
          setError("Не удалось загрузить реферальную статистику");
        }
      })
      .finally(() => {
        if (!requestController.signal.aborted) setIsLoading(false);
      });

    return () => requestController.abort();
  }, []);

  return { items, isLoading, error };
}
