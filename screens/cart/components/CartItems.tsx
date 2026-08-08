"use client";

import Image from "next/image";
import Link from "next/link";
import { resolveProductImageUrl } from "@/api/catalog";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";

export default function CartItems() {
  const { items, removeItem, setQuantity } = useCart();
  return (
    <div className="space-y-12">
      {items.map(({ product, quantity }) => {
        const image = product.images[0];
        return (
          <article data-testid="cart-item" key={product.id} className="grid grid-cols-[180px_1fr_auto] items-center gap-8 border-b border-black/10 pb-12 max-[800px]:grid-cols-[110px_1fr] max-[800px]:gap-4">
            <Link href={`/catalog/${product.slug}`} className="relative aspect-square overflow-hidden rounded-xl bg-[#fcfbf8]">
              {image && <Image src={resolveProductImageUrl(image.url)} alt={image.alt || product.title} fill className="object-cover" sizes="180px" />}
            </Link>
            <div>
              <Link href={`/catalog/${product.slug}`} className="text-[22px] font-medium">{product.title}</Link>
              <p className="mt-4 max-w-[390px] text-sm leading-6 text-[#747978]">{product.description}</p>
              <p className="mt-4 text-sm">{product.flavor || "Без вкуса"}</p>
            </div>
            <div className="flex min-w-[190px] flex-col items-end gap-6 max-[800px]:col-span-2 max-[800px]:min-w-0 max-[800px]:flex-row max-[800px]:items-center max-[800px]:justify-end">
              <button type="button" onClick={() => removeItem(product.id)} className="text-2xl" aria-label={`Удалить ${product.title}`}>×</button>
              <div className="flex h-12 items-center rounded-xl bg-white"><button type="button" onClick={() => setQuantity(product.id, quantity - 1)} className="size-11">−</button><span className="w-9 text-center">{quantity}</span><button type="button" onClick={() => setQuantity(product.id, quantity + 1)} className="size-11 rounded-xl bg-[#009d0a] text-white">+</button></div>
              <strong className="text-lg">{formatPrice(Number(product.price) * quantity)}</strong>
            </div>
          </article>
        );
      })}
    </div>
  );
}
