import type { CatalogCategory } from "@/api/types";

type Props = {
  flavors: string[];
  flavor: string;
  setFlavor: (value: string) => void;
  maxPrice: number;
  ceiling: number;
  setMaxPrice: (value: number) => void;
  categories: CatalogCategory[];
};

export default function CatalogFilters({ flavors, flavor, setFlavor, maxPrice, ceiling, setMaxPrice }: Props) {
  return (
    <aside className="w-[270px] shrink-0 max-[900px]:w-full">
      <h1 className="mb-12 font-[family-name:var(--font-helvetica-neue)] text-[42px] font-normal tracking-[-0.04em] max-[600px]:mb-6 max-[600px]:text-[34px]">Фильтры</h1>
      <div className="rounded-[20px] bg-[#fcfbf8] p-6">
        <div className="border-b border-black/20 pb-5 text-sm font-medium">Вкус</div>
        <div className="space-y-3 py-5">
          {["all", ...flavors].map((item) => (
            <label key={item} className="flex items-center gap-3 text-sm text-[#505657]">
              <input className="accent-[#009d0a]" type="radio" name="flavor" checked={flavor === item} onChange={() => setFlavor(item)} />
              {item === "all" ? "Все вкусы" : item}
            </label>
          ))}
        </div>
        <div className="border-t border-black/20 pt-5 text-sm font-medium">Цена до {maxPrice.toLocaleString("ru-RU")} ₽</div>
        <input className="mt-5 w-full accent-[#009d0a]" type="range" min={0} max={ceiling} step={100} value={Math.min(maxPrice, ceiling)} onChange={(event) => setMaxPrice(Number(event.target.value))} />
      </div>
    </aside>
  );
}
