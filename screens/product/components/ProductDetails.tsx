"use client";

import { useState } from "react";
import Button from "@/components/Button";
import type { CatalogProduct } from "@/api/types";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";

export default function ProductDetails({ product }: { product: CatalogProduct }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  return (
    <div className="pt-7 max-[1000px]:pt-0">
      <h1 className="border-b border-black/35 pb-7 font-[family-name:var(--font-helvetica-neue)] text-[64px] leading-[0.95] font-normal tracking-[-0.045em] max-[1300px]:text-[52px] max-[600px]:text-[40px]">{product.title}{product.flavor ? ` ${product.flavor}` : ""}</h1>
      <p className="mt-6 text-[22px] text-[#aeb0ae]">{formatPrice(product.price)}</p>
      <div data-testid="product-purchase" className="mt-12 flex items-center gap-4 max-[600px]:mt-8">
        <div className="flex h-12 items-center rounded-full bg-white px-1"><button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="size-10">−</button><span className="w-8 text-center">{quantity}</span><button type="button" onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))} className="size-10">+</button></div>
        <Button onClick={() => addItem(product, quantity)} className="w-[340px] max-[600px]:flex-1" label="В корзину" icon="cart" />
      </div>
      <section className="mt-12">
        <h2 className="border-b border-black/35 pb-4 text-sm font-medium">Описание</h2>
        <p className="py-8 text-sm leading-7 text-[#6b706f]">{product.description}</p>
        <dl className="grid max-w-[520px] grid-cols-2 border border-black/30 text-sm [&>dd]:border-l [&>dd]:border-black/30 [&>dd]:p-5 [&>dt]:p-5 [&>*:nth-child(n+3)]:border-t [&>*:nth-child(n+3)]:border-black/30">
          <dt>Объём</dt><dd>1 кг</dd><dt>Вкус</dt><dd>{product.flavor || "Без вкуса"}</dd>
        </dl>
      </section>
      <div className="mt-12 rounded-xl bg-[#009d0a] px-5 py-4 text-xs text-white">ⓘ &nbsp; Доставка в течение 2–5 дней.</div>
    </div>
  );
}
