"use client";

import api from "@/api/client";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export interface AdminOrder {
  id: string;
  number: string;
  status: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerCity: string | null;
  customerAddress: string | null;
  customerComment: string | null;
  adminComment: string | null;
  subtotalAmount: string;
  discountAmount: string;
  deliveryAmount: string;
  finalAmount: string;
  referralSource: string;
  createdAt: string;
  items: Array<{ id: string; productName: string; sku: string; flavor: string | null; price: string; quantity: number; total: string }>;
  payments: Array<{ id: string; provider: string; isTest: boolean; externalId: string | null; status: string; amount: string; paidAt: string | null; createdAt: string }>;
  promoCode: { code: string } | null;
  trainer: { name: string; surname: string } | null;
  shipment: {
    method: "PICKUP_POINT" | "COURIER";
    city: string;
    address: string;
    addressDetails: Record<string, string> | null;
    pickupPointName: string | null;
    quotedAmount: string;
    deliveryDays: number | null;
    weightGrams: number;
    dimensions: { dx: number; dy: number; dz: number };
    status: string;
    externalId: string | null;
    externalStatus: string | null;
    externalStatusText: string | null;
    trackingNumber: string | null;
    trackingUrl: string | null;
    pickupCode: string | null;
    attempts: number;
    lastError: string | null;
    syncedAt: string | null;
  } | null;
  fiscalReceipts: Array<{
    id: string;
    type: string;
    documentNumber: string;
    status: string;
    amount: string;
    commandId: string | null;
    fiscalData: { fiscalDocumentNumber?: string | null; fnNumber?: string | null; receiptUrl?: string | null } | null;
    lastError: string | null;
    completedAt: string | null;
  }>;
}

export type AdminOrderAction = "shipment" | "shipment/sync" | "shipment/cancel" | "receipt" | "payment/refresh";

function getErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  const message = error.response?.data?.message;
  return Array.isArray(message) ? message.join(". ") : message ?? fallback;
}

export function useAdminOrder(id: string) {
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingAction, setPendingAction] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const applyOrder = useCallback((data: AdminOrder) => {
    setOrder(data);
    setComment(data.adminComment ?? "");
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    api.get<AdminOrder>(`/admin/orders/${id}`, { signal: controller.signal })
      .then(({ data }) => applyOrder(data))
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) setError(getErrorMessage(requestError, "Не удалось загрузить заказ"));
      })
      .finally(() => { if (!controller.signal.aborted) setIsLoading(false); });
    return () => controller.abort();
  }, [applyOrder, id]);

  const run = async (key: string, request: () => Promise<unknown>, success: string) => {
    setPendingAction(key);
    setError("");
    setNotice("");
    try {
      await request();
      const { data } = await api.get<AdminOrder>(`/admin/orders/${id}`);
      applyOrder(data);
      setNotice(success);
    } catch (actionError: unknown) {
      setError(getErrorMessage(actionError, "Не удалось выполнить действие"));
    } finally {
      setPendingAction("");
    }
  };

  const messages: Record<AdminOrderAction, string> = {
    shipment: "Запрос в Яндекс Доставку отправлен",
    "shipment/sync": "Статус доставки обновлён",
    "shipment/cancel": "Заявка в Яндекс Доставке отменена",
    receipt: "Чек отправлен в кассу",
    "payment/refresh": "Статус оплаты обновлён",
  };

  return {
    order,
    comment,
    isLoading,
    pendingAction,
    error,
    notice,
    setComment,
    changeStatus: (status: string) => run("status", () => api.patch(`/admin/orders/${id}/status`, { status }), "Статус заказа изменён"),
    saveComment: () => run("comment", () => api.patch(`/admin/orders/${id}`, { adminComment: comment }), "Комментарий сохранён"),
    perform: (action: AdminOrderAction) => run(action, () => api.post(`/admin/orders/${id}/${action}`), messages[action]),
  };
}
