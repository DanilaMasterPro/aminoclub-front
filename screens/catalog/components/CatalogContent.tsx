"use client";

import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import CatalogFilters from "./CatalogFilters";
import CatalogGrid from "./CatalogGrid";
import { useCatalogFilters } from "../hooks/useCatalogFilters";

export default function CatalogContent() {
  const { products, isLoading, error, reload } = useCatalogProducts();
  const filters = useCatalogFilters(products);
  return (
    <section className="px-7 pb-[120px] max-[600px]:px-1">
      <div className="mb-10 ml-[300px] flex items-end justify-between border-b border-black/30 pb-5 max-[900px]:ml-0 max-[700px]:items-start max-[700px]:gap-5">
        <div className="flex gap-10 overflow-x-auto text-base max-[600px]:gap-5">
          <button type="button" onClick={() => filters.setCategory("all")} className={filters.category === "all" ? "text-[#15191a]" : "text-[#a9acaa]"}>Все</button>
          {filters.categories.map((category) => <button key={category.id} type="button" onClick={() => filters.setCategory(category.slug)} className={filters.category === category.slug ? "text-[#15191a]" : "text-[#a9acaa]"}>{category.title}</button>)}
        </div>
        <select aria-label="Сортировка" value={filters.sort} onChange={(event) => filters.setSort(event.target.value as typeof filters.sort)} className="rounded-lg border-0 bg-[#009d0a] px-5 py-3 text-xs text-white max-[700px]:w-[135px]">
          <option value="newest">Сначала новые</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option>
        </select>
      </div>
      <div className="flex gap-[80px] max-[1200px]:gap-8 max-[900px]:flex-col">
        <CatalogFilters {...filters} />
        <div className="min-w-0 flex-1">
          <h2 className="mb-12 font-[family-name:var(--font-helvetica-neue)] text-[46px] font-normal tracking-[-0.04em] max-[600px]:mb-6 max-[600px]:text-[36px]">{filters.category === "all" ? "Все" : filters.categories.find((item) => item.slug === filters.category)?.title}</h2>
          {error ? <div className="rounded-[20px] bg-[#fcfbf8] p-10 text-center"><p>Не удалось загрузить каталог.</p><button type="button" onClick={reload} className="mt-5 rounded-full bg-[#009d0a] px-6 py-3 text-white">Повторить</button></div> : <CatalogGrid products={filters.visibleProducts} isLoading={isLoading} />}
        </div>
      </div>
    </section>
  );
}
