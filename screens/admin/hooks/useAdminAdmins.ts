"use client";

import api from "@/api/client";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export type AdminAccount = {
  id: string;
  email: string;
  status: "ACTIVE" | "BLOCKED";
  createdAt: string;
  lastLoginAt: string | null;
  isCurrentUser: boolean;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  const message = error.response?.data?.message;
  return Array.isArray(message) ? message.join(". ") : message ?? fallback;
}

/** Administrators list for «Настройки → Администраторы»: add by email, disable or restore access. */
export function useAdminAdmins() {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    const { data } = await api.get<AdminAccount[]>("/admin/admins");
    setAdmins(data);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    api.get<AdminAccount[]>("/admin/admins", { signal: controller.signal })
      .then(({ data }) => setAdmins(data))
      .catch((loadError: unknown) => {
        if (!controller.signal.aborted) setError(getErrorMessage(loadError, "Не удалось загрузить администраторов"));
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, []);

  const add = async () => {
    setIsAdding(true);
    setError("");
    setNotice("");
    try {
      const { data } = await api.post<Pick<AdminAccount, "email">>("/admin/admins", { email: email.trim() });
      setEmail("");
      setNotice(`${data.email} добавлен. Мы отправили на этот адрес приглашение со ссылкой для входа.`);
      await load();
    } catch (addError: unknown) {
      setError(getErrorMessage(addError, "Не удалось добавить администратора"));
    } finally {
      setIsAdding(false);
    }
  };

  const setStatus = async (admin: AdminAccount, status: AdminAccount["status"]) => {
    setUpdatingId(admin.id);
    setError("");
    setNotice("");
    try {
      await api.patch(`/admin/admins/${admin.id}/status`, { status });
      setNotice(status === "BLOCKED" ? `Доступ для ${admin.email} отключён.` : `Доступ для ${admin.email} восстановлен.`);
      await load();
    } catch (statusError: unknown) {
      setError(getErrorMessage(statusError, "Не удалось изменить доступ"));
    } finally {
      setUpdatingId(null);
    }
  };

  return { admins, email, setEmail, isLoading, isAdding, updatingId, error, notice, add, setStatus };
}
