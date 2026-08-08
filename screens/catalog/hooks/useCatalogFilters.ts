"use client";

import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/api/types";

export type CatalogSort = "newest" | "price-asc" | "price-desc";

export function useCatalogFilters(products: CatalogProduct[]) {
  const [category, setCategory] = useState("all");
  const [flavor, setFlavor] = useState("all");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [sort, setSort] = useState<CatalogSort>("newest");

  const categories = useMemo(() => Array.from(new Map(products.map((product) => [product.category.slug, product.category])).values()).sort((a, b) => a.sortOrder - b.sortOrder), [products]);
  const flavors = useMemo(() => Array.from(new Set(products.map((product) => product.flavor).filter(Boolean))) as string[], [products]);
  const ceiling = useMemo(() => Math.max(1000, ...products.map((product) => Math.ceil(Number(product.price) / 500) * 500)), [products]);

  const visibleProducts = useMemo(() => products
    .filter((product) => category === "all" || product.category.slug === category)
    .filter((product) => flavor === "all" || product.flavor === flavor)
    .filter((product) => Number(product.price) <= maxPrice)
    .sort((left, right) => sort === "price-asc"
      ? Number(left.price) - Number(right.price)
      : sort === "price-desc"
        ? Number(right.price) - Number(left.price)
        : right.id.localeCompare(left.id)), [category, flavor, maxPrice, products, sort]);

  return { category, setCategory, flavor, setFlavor, maxPrice, setMaxPrice, sort, setSort, categories, flavors, ceiling, visibleProducts };
}
