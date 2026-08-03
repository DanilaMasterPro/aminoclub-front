"use client";

import api from "@/api/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { slugify } from "@/utils/slugify";
import { resourceConfigs, type ResourceField } from "../resource-config";

export type AdminResourceValues = Record<string, unknown>;
export type AdminCategoryOption = { id: string; title: string };

function getErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  const message = error.response?.data?.message;
  return Array.isArray(message) ? message.join(". ") : message ?? fallback;
}

export function useAdminResourceForm(resource: string, id?: string) {
  const config = resourceConfigs[resource];
  const router = useRouter();
  const [values, setValues] = useState<AdminResourceValues>({ isActive: true, status: "DRAFT", type: "PERCENT" });
  const [categories, setCategories] = useState<AdminCategoryOption[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(id));
  const [isSaving, setIsSaving] = useState(false);
  const [uploadsInProgress, setUploadsInProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (resource !== "products") return;
    const requestController = new AbortController();
    api.get<AdminCategoryOption[]>("/admin/categories", { signal: requestController.signal })
      .then(({ data }) => setCategories(data))
      .catch((requestError: unknown) => {
        if (!requestController.signal.aborted) {
          console.error("Не удалось загрузить категории", requestError);
          setError("Не удалось загрузить категории");
        }
      });
    return () => requestController.abort();
  }, [resource]);

  useEffect(() => {
    if (!id || !config) return;
    const requestController = new AbortController();
    api.get<AdminResourceValues>(`${config.endpoint}/${id}`, { signal: requestController.signal })
      .then(({ data }) => setValues(data))
      .catch((requestError: unknown) => {
        if (!requestController.signal.aborted) setError(getErrorMessage(requestError, "Не удалось загрузить запись"));
      })
      .finally(() => {
        if (!requestController.signal.aborted) setIsLoading(false);
      });
    return () => requestController.abort();
  }, [config, id]);

  const fields = useMemo(
    () => (config?.fields ?? []).filter((field) => !(resource === "products" && id && field.name === "stockQuantity")),
    [config, id, resource],
  );

  const setValue = (name: string, value: unknown) => {
    setValues((current) => {
      const next = { ...current, [name]: value };

      for (const [target, source] of Object.entries(config?.autoFill ?? {})) {
        if (name !== source) continue;
        const previousSource = String(current[source] ?? "");
        const nextSource = String(value ?? "");
        const transform = target === "slug" ? slugify : (text: string) => text;
        const currentTarget = String(current[target] ?? "");
        if (!currentTarget || currentTarget === transform(previousSource)) {
          next[target] = transform(nextSource);
        }
      }

      return next;
    });
  };

  const upload = async (field: ResourceField, file: File) => {
    setUploadsInProgress((current) => current + 1);
    try {
      const body = new FormData();
      body.append("file", file);
      const { data } = await api.post<{ url: string }>("/admin/media", body);

      setValues((currentValues) => {
        if (field.type === "file-list") {
          const current = Array.isArray(currentValues[field.name]) ? currentValues[field.name] as Array<{ url: string }> : [];
          return { ...currentValues, [field.name]: [...current, { url: data.url, sortOrder: current.length }] };
        }
        if (field.type === "image-list") {
          const current = Array.isArray(currentValues[field.name]) ? currentValues[field.name] as string[] : [];
          return { ...currentValues, [field.name]: [...current, data.url] };
        }
        if (field.type === "certificate-list") {
          const current = Array.isArray(currentValues[field.name]) ? currentValues[field.name] as Array<{ title: string; fileUrl: string }> : [];
          return { ...currentValues, [field.name]: [...current, { title: file.name, fileUrl: data.url, sortOrder: current.length }] };
        }
        return { ...currentValues, [field.name]: data.url };
      });
    } catch (uploadError: unknown) {
      setError(getErrorMessage(uploadError, "Не удалось загрузить файл"));
    } finally {
      setUploadsInProgress((current) => Math.max(0, current - 1));
    }
  };

  const removeFile = (field: ResourceField, index: number) => {
    setValues((currentValues) => {
      if (field.type === "image") return { ...currentValues, [field.name]: "" };
      const current = Array.isArray(currentValues[field.name]) ? currentValues[field.name] as unknown[] : [];
      const remaining = current.filter((_item, itemIndex) => itemIndex !== index);
      if (field.type === "file-list" || field.type === "certificate-list") {
        return {
          ...currentValues,
          [field.name]: remaining.map((item, sortOrder) => ({ ...(item as object), sortOrder })),
        };
      }
      return { ...currentValues, [field.name]: remaining };
    });
  };

  const save = async () => {
    if (!config) return;
    setIsSaving(true);
    setError("");
    const payload: AdminResourceValues = {};

    for (const field of fields) {
      const value = values[field.name];
      if (value === "" || value === undefined) continue;
      if (field.type === "number") payload[field.name] = Number(value);
      else if (field.type === "tags" && typeof value === "string") {
        payload[field.name] = value.split(",").map((item) => item.trim()).filter(Boolean);
      } else if (field.type === "file-list" && Array.isArray(value)) {
        payload[field.name] = value.map((item, sortOrder) => {
          const image = item as { url: string; alt?: string };
          return { url: image.url, alt: image.alt, sortOrder };
        });
      } else if (field.type === "certificate-list" && Array.isArray(value)) {
        payload[field.name] = value.map((item, sortOrder) => {
          const certificate = item as { title: string; fileUrl: string };
          return { title: certificate.title, fileUrl: certificate.fileUrl, sortOrder };
        });
      } else payload[field.name] = value;
    }

    try {
      if (id) await api.patch(`${config.endpoint}/${id}`, payload);
      else await api.post(config.endpoint, payload);
      router.push(`/admin/${resource}`);
      router.refresh();
    } catch (saveError: unknown) {
      setError(getErrorMessage(saveError, "Не удалось сохранить запись"));
    } finally {
      setIsSaving(false);
    }
  };

  return {
    config,
    values,
    categories,
    fields,
    isLoading,
    isSaving,
    isUploading: uploadsInProgress > 0,
    error,
    setValue,
    upload,
    removeFile,
    save,
  };
}
