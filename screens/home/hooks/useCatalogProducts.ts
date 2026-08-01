"use client";

import { useEffect, useState } from "react";
import { getCatalogProducts } from "@/api/catalog";
import type { CatalogProduct } from "@/api/types";

export function useCatalogProducts() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const requestController = new AbortController();

    getCatalogProducts(requestController.signal)
      .then(setProducts)
      .catch((requestError: unknown) => {
        if (!requestController.signal.aborted) {
          console.error("Не удалось загрузить каталог", requestError);
          setError(true);
        }
      })
      .finally(() => {
        if (!requestController.signal.aborted) setIsLoading(false);
      });

    return () => requestController.abort();
  }, [reloadKey]);

  const reload = () => {
    setIsLoading(true);
    setError(false);
    setReloadKey((value) => value + 1);
  };

  return { products, isLoading, error, reload };
}
