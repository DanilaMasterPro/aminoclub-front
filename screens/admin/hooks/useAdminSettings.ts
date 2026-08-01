"use client";

import api from "@/api/client";
import { useEffect, useState } from "react";

const initialSettings: Record<string, string> = { shop: "", notifications: "", seo: "" };

export function useAdminSettings() {
  const [values, setValues] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const requestController = new AbortController();

    api.get<Array<{ key: string; value: object }>>("/admin/settings", { signal: requestController.signal })
      .then(({ data }) => {
        setValues((current) => ({
          ...current,
          ...Object.fromEntries(data.map((item) => [item.key, JSON.stringify(item.value, null, 2)])),
        }));
      })
      .catch((requestError: unknown) => {
        if (!requestController.signal.aborted) {
          console.error("Не удалось загрузить настройки", requestError);
          setMessage("Не удалось загрузить настройки");
        }
      });

    return () => requestController.abort();
  }, []);

  const setValue = (key: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setMessage("");

    try {
      await Promise.all(
        Object.entries(values).map(([key, raw]) =>
          api.patch(`/admin/settings/${key}`, { value: raw.trim() ? JSON.parse(raw) : {} }),
        ),
      );
      setMessage("Настройки сохранены");
    } catch {
      setMessage("Проверьте JSON в полях");
    } finally {
      setIsSaving(false);
    }
  };

  return { values, setValue, saveSettings, isSaving, message };
}
