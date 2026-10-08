"use client";

import { useCatalogProducts } from "@/hooks/useCatalogProducts";
import CatalogFilters from "./CatalogFilters";
import CatalogGrid from "./CatalogGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import SelectMenu from "@/components/SelectMenu";
import { useCatalogFilters } from "../hooks/useCatalogFilters";

export default function CatalogContent({ initialCategory }: { initialCategory?: string }) {
  const { products, isLoading, error, reload } = useCatalogProducts();
  const filters = useCatalogFilters(products, initialCategory);
  const activeCategory = filters.categories.find((item) => item.slug === filters.category);
  return (
    <section className="page-gutter pb-[120px]">
      <Breadcrumbs className="mb-10" items={[{ label: "Каталог", href: "/catalog" }, ...(activeCategory ? [{ label: activeCategory.title, href: `/catalog?category=${activeCategory.slug}` }] : [])]} />
      {/* Two columns: filters | products. The category bar sits in the products column, so it starts where the tiles start. */}
      <div className="grid grid-cols-[270px_minmax(0,1fr)] gap-x-[80px] max-[1200px]:gap-x-8 max-[900px]:grid-cols-1">
        <div className="col-start-2 mb-10 flex items-center justify-between gap-6 border-b border-black/30 pb-5 max-[900px]:col-start-1 max-[700px]:flex-col max-[700px]:items-stretch max-[700px]:gap-4">
          <div className="flex gap-10 overflow-x-auto text-base max-[600px]:gap-5" role="tablist" aria-label="Категории">
            {[{ slug: "all", title: "Все" }, ...filters.categories].map((category) => {
              const isActive = filters.category === category.slug;
              return (
                <button key={category.slug} type="button" role="tab" aria-selected={isActive} onClick={() => filters.setCategory(category.slug)} className={`shrink-0 cursor-pointer whitespace-nowrap transition-colors ${isActive ? "text-[#15191a]" : "text-[#a9acaa] hover:text-[#15191a]"}`}>
                  {category.title}
                </button>
              );
            })}
          </div>
          <SelectMenu
            label="Сортировка"
            value={filters.sort}
            onChange={filters.setSort}
            options={[{ value: "newest", label: "Сначала новые" }, { value: "price-asc", label: "Сначала дешевле" }, { value: "price-desc", label: "Сначала дороже" }]}
            className="shrink-0 max-[700px]:self-start"
          />
        </div>
        <CatalogFilters {...filters} />
        <div className="min-w-0">
          <h2 className="mb-12 font-[family-name:var(--font-helvetica-neue)] text-[46px] font-normal tracking-[-0.04em] max-[600px]:mb-6 max-[600px]:text-[36px]">{filters.category === "all" ? "Все" : activeCategory?.title}</h2>
          {error ? <div className="rounded-[20px] bg-[#fcfbf8] p-10 text-center"><p>Не удалось загрузить каталог.</p><button type="button" onClick={reload} className="mt-5 rounded-full bg-[#009d0a] px-6 py-3 text-white">Повторить</button></div> : <CatalogGrid products={filters.visibleProducts} isLoading={isLoading} />}
        </div>
      </div>
    </section>
  );
}
