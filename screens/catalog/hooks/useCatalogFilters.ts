"use client";

import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/api/types";

export type CatalogSort = "newest" | "price-asc" | "price-desc";

export function useCatalogFilters(products: CatalogProduct[], initialCategory = "all") {
  const [selectedCategory, setCategoryValue] = useState(initialCategory);
  const [selectedFlavor, setFlavor] = useState("all");
  // null = no price limit yet: the slider starts at the most expensive product, whatever it costs.
  const [priceLimit, setMaxPrice] = useState<number | null>(null);
  const [sort, setSort] = useState<CatalogSort>("newest");

  const categories = useMemo(() => Array.from(new Map(products.map((product) => [product.category.slug, product.category])).values()).sort((a, b) => a.sortOrder - b.sortOrder), [products]);
  // An unknown ?category= falls back to «Все» once products are loaded.
  const category = selectedCategory === "all" || !products.length || categories.some((item) => item.slug === selectedCategory) ? selectedCategory : "all";
  const categoryProducts = useMemo(() => products.filter((product) => category === "all" || product.category.slug === category), [category, products]);
  // Only flavors that exist in the selected category; a flavor from another category is dropped.
  const flavors = useMemo(() => Array.from(new Set(categoryProducts.map((product) => product.flavor).filter(Boolean))) as string[], [categoryProducts]);
  const flavor = selectedFlavor === "all" || flavors.includes(selectedFlavor) ? selectedFlavor : "all";
  const ceiling = useMemo(() => Math.max(1000, ...products.map((product) => Math.ceil(Number(product.price) / 500) * 500)), [products]);
  const maxPrice = priceLimit ?? ceiling;

  const setCategory = (value: string) => {
    setCategoryValue(value);
    setFlavor("all");
    // Shareable link to the category (also the target of the product breadcrumbs).
    window.history.replaceState(null, "", value === "all" ? "/catalog" : `/catalog?category=${encodeURIComponent(value)}`);
  };

  const visibleProducts = useMemo(() => categoryProducts
    .filter((product) => flavor === "all" || product.flavor === flavor)
    .filter((product) => Number(product.price) <= maxPrice)
    .sort((left, right) => sort === "price-asc"
      ? Number(left.price) - Number(right.price)
      : sort === "price-desc"
        ? Number(right.price) - Number(left.price)
        // «Сначала новые»: categories in their admin order (Протеин first), newest first inside a category.
        : left.category.sortOrder - right.category.sortOrder || right.id.localeCompare(left.id)), [categoryProducts, flavor, maxPrice, sort]);

  return { category, setCategory, flavor, setFlavor, maxPrice, setMaxPrice, sort, setSort, categories, flavors, ceiling, visibleProducts };
}
