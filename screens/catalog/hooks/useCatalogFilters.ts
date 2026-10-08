"use client";

import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/api/types";

export type CatalogSort = "newest" | "price-asc" | "price-desc";

export function useCatalogFilters(products: CatalogProduct[]) {
  const [category, setCategoryValue] = useState("all");
  const [selectedFlavor, setFlavor] = useState("all");
  // null = no price limit yet: the slider starts at the most expensive product, whatever it costs.
  const [priceLimit, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<CatalogSort>("newest");

  const categories = useMemo(() => Array.from(new Map(products.map((product) => [product.category.slug, product.category])).values()).sort((a, b) => a.sortOrder - b.sortOrder), [products]);
  const categoryProducts = useMemo(() => products.filter((product) => category === "all" || product.category.slug === category), [category, products]);
  // Only flavors that exist in the selected category; a flavor from another category is dropped.
  const flavors = useMemo(() => Array.from(new Set(categoryProducts.map((product) => product.flavor).filter(Boolean))) as string[], [categoryProducts]);
  const flavor = selectedFlavor === "all" || flavors.includes(selectedFlavor) ? selectedFlavor : "all";
  const ceiling = useMemo(() => Math.max(1000, ...products.map((product) => Math.ceil(Number(product.price) / 500) * 500)), [products]);
  const maxPrice = priceLimit ?? ceiling;

  const setCategory = (value: string) => {
    setCategoryValue(value);
    setFlavor("all");
  };

  const visibleProducts = useMemo(() => categoryProducts
    .filter((product) => flavor === "all" || product.flavor === flavor)
    .filter((product) => Number(product.price) <= maxPrice)
    .sort((left, right) => sort === "price-asc"
      ? Number(left.price) - Number(right.price)
      : sort === "price-desc"
        ? Number(right.price) - Number(left.price)
        : right.id.localeCompare(left.id)), [categoryProducts, flavor, maxPrice, sort]);

  return { category, setCategory, flavor, setFlavor, maxPrice, setMaxPrice, sort, setSort, categories, flavors, ceiling, visibleProducts };
}
