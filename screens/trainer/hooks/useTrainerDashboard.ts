"use client";

import api from "@/api/client";
import type { Paginated, TrainerDashboard } from "@/api/types";
import { useEffect, useMemo, useState } from "react";
import type { TrainerOrder } from "../types";

export function useTrainerDashboard() {
  const [data, setData] = useState<TrainerDashboard | null>(null);
  const [orders, setOrders] = useState<TrainerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const requestController = new AbortController();

    Promise.all([
      api.get<TrainerDashboard>("/trainer/dashboard", { signal: requestController.signal }),
      api.get<Paginated<TrainerOrder>>("/trainer/stats", { signal: requestController.signal }),
    ])
      .then(([dashboard, stats]) => {
        setData(dashboard.data);
        setOrders(stats.data.items);
      })
      .catch((requestError: unknown) => {
        if (!requestController.signal.aborted) {
          console.error("Не удалось загрузить кабинет тренера", requestError);
          setError("Не удалось загрузить данные кабинета");
        }
      })
      .finally(() => {
        if (!requestController.signal.aborted) setIsLoading(false);
      });

    return () => requestController.abort();
  }, [reloadKey]);

  const commission = useMemo(
    () => Object.fromEntries((data?.commissions ?? []).map((item) => [item.status, Number(item._sum.amount ?? 0)])),
    [data],
  );

  const reload = () => {
    setIsLoading(true);
    setError("");
    setReloadKey((value) => value + 1);
  };

  return { data, orders, commission, isLoading, error, reload };
}
