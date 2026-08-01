"use client";

import api from "@/api/client";
import { useEffect, useState } from "react";

export interface AdminDashboardData {
  orders: Array<{ status: string; _count: number }>;
  revenue: { _sum: { finalAmount: string | null } };
  lowStock: number;
  trainers: number;
  pendingApplications: number;
  pendingPayouts: number;
}

export function useAdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const requestController = new AbortController();

    api.get<AdminDashboardData>("/admin/dashboard", { signal: requestController.signal })
      .then(({ data: dashboard }) => setData(dashboard))
      .catch((requestError: unknown) => {
        if (!requestController.signal.aborted) {
          console.error("Не удалось загрузить статистику админки", requestError);
          setError("Не удалось загрузить статистику");
        }
      });

    return () => requestController.abort();
  }, []);

  return { data, error, isLoading: !data && !error };
}
