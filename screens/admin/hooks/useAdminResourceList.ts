"use client";

import api from "@/api/client";
import type { Paginated } from "@/api/types";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import type { ResourceConfig } from "../resource-config";

export type AdminResourceRow = Record<string, unknown> & {
  id: string;
  status?: string;
};

function getErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) return fallback;
  const message = error.response?.data?.message;
  return Array.isArray(message) ? message.join(". ") : message ?? fallback;
}

export function useAdminResourceList(resource: string, config?: ResourceConfig) {
  const [items, setItems] = useState<AdminResourceRow[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchDraft, setSearchDraft] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatusValue] = useState(resource === "trainer-applications" ? "PENDING" : "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const requestItems = useCallback((signal?: AbortSignal) => {
    if (!config) return null;
    return api.get<Paginated<AdminResourceRow> | AdminResourceRow[]>(config.endpoint, {
        params: { page, limit: 20, search: search || undefined, status: status || undefined },
        signal,
      });
  }, [config, page, search, status]);

  const applyItems = useCallback((data: Paginated<AdminResourceRow> | AdminResourceRow[]) => {
      setItems(Array.isArray(data) ? data : data.items);
      setPages(Array.isArray(data) ? 1 : data.pages);
      setError("");
  }, []);

  const refresh = useCallback(async () => {
    const request = requestItems();
    if (!request) return;
    try {
      const { data } = await request;
      applyItems(data);
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError, "Не удалось загрузить данные"));
    } finally {
      setIsLoading(false);
    }
  }, [applyItems, requestItems]);

  useEffect(() => {
    const requestController = new AbortController();
    const request = requestItems(requestController.signal);
    request?.then(({ data }) => applyItems(data))
      .catch((requestError: unknown) => {
        if (!requestController.signal.aborted) setError(getErrorMessage(requestError, "Не удалось загрузить данные"));
      })
      .finally(() => {
        if (!requestController.signal.aborted) setIsLoading(false);
      });
    return () => requestController.abort();
  }, [applyItems, requestItems]);

  const applySearch = () => {
    setIsLoading(true);
    if (page === 1 && search === searchDraft) void refresh();
    else {
      setPage(1);
      setSearch(searchDraft);
    }
  };

  const setStatus = (value: string) => {
    setIsLoading(true);
    setStatusValue(value);
    setPage(1);
  };

  const goToPage = (value: number) => {
    setIsLoading(true);
    setPage(value);
  };

  const performAction = async (row: AdminResourceRow, value: string) => {
    if (!config || !value) return;
    setError("");

    try {
      if (resource === "trainers") {
        await api.patch(`${config.endpoint}/${row.id}/block`);
      } else if (resource === "orders" || resource === "payouts") {
        await api.patch(`${config.endpoint}/${row.id}/status`, { status: value });
      }
      await refresh();
    } catch (actionError: unknown) {
      setError(getErrorMessage(actionError, "Не удалось выполнить действие"));
    }
  };

  const remove = async (row: AdminResourceRow) => {
    if (!config) return;
    setError("");

    try {
      await api.delete(`${config.endpoint}/${row.id}`);
      await refresh();
    } catch (removeError: unknown) {
      setError(getErrorMessage(removeError, "Не удалось удалить запись"));
    }
  };

  return {
    items,
    page,
    pages,
    searchDraft,
    status,
    isLoading,
    error,
    setSearchDraft,
    applySearch,
    setStatus,
    goToPage,
    performAction,
    remove,
  };
}
