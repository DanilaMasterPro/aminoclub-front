"use client";

import api from "@/api/client";
import type { CmsPage, SiteSettings } from "@/api/types";
import axios from "axios";
import { useEffect, useState } from "react";

type SettingSection = keyof SiteSettings;

function errorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  const message = error.response?.data?.message;
  return Array.isArray(message) ? message.join(". ") : message ?? fallback;
}

export function useAdminSettingSection<K extends SettingSection>(section: K, initialValue: SiteSettings[K]) {
  const [value, setValue] = useState<SiteSettings[K]>(() => structuredClone(initialValue));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadsInProgress, setUploadsInProgress] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const requestController = new AbortController();
    api.get<SiteSettings>("/admin/settings", { signal: requestController.signal })
      .then(({ data }) => setValue(data[section]))
      .catch((error: unknown) => {
        if (!requestController.signal.aborted) setMessage(errorMessage(error, "Не удалось загрузить настройки"));
      })
      .finally(() => {
        if (!requestController.signal.aborted) setIsLoading(false);
      });

    return () => requestController.abort();
  }, [section]);

  const save = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      await api.patch(`/admin/settings/${section}`, value);
      setMessage("Настройки сохранены");
    } catch (error: unknown) {
      setMessage(errorMessage(error, "Не удалось сохранить настройки"));
    } finally {
      setIsSaving(false);
    }
  };

  const uploadImage = async (file: File) => {
    setUploadsInProgress((current) => current + 1);
    setMessage("");
    try {
      const body = new FormData();
      body.append("file", file);
      const { data } = await api.post<{ url: string }>("/admin/media", body);
      return data.url;
    } catch (error: unknown) {
      setMessage(errorMessage(error, "Не удалось загрузить изображение"));
      throw error;
    } finally {
      setUploadsInProgress((current) => Math.max(0, current - 1));
    }
  };

  return {
    value,
    setValue,
    save,
    uploadImage,
    isLoading,
    isSaving,
    isUploading: uploadsInProgress > 0,
    message,
  };
}

export function useAdminMenuPages() {
  const [pages, setPages] = useState<CmsPage[]>([]);

  useEffect(() => {
    const requestController = new AbortController();
    api.get<CmsPage[]>("/admin/pages", { signal: requestController.signal })
      .then(({ data }) => setPages(data))
      .catch((error: unknown) => {
        if (!requestController.signal.aborted) console.error("Не удалось загрузить страницы для меню", error);
      });
    return () => requestController.abort();
  }, []);

  return pages;
}
