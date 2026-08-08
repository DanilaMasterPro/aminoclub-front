"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import { resolveProductImageUrl } from "@/api/catalog";
import type { CatalogProduct } from "@/api/types";
import { useCart } from "@/hooks/useCart";
import { truncateText } from "@/utils/truncateText";

type ProductCardProps = { product: CatalogProduct; animationDelay?: number };

export default function ProductCard({ product, animationDelay = 0 }: ProductCardProps) {
  const image = product.images[0];
  const { items, addItem, removeItem, setQuantity } = useCart();
  const cartItem = items.find((item) => item.product.id === product.id);

  function decreaseQuantity() {
    if (!cartItem) return;
    if (cartItem.quantity === 1) removeItem(product.id);
    else setQuantity(product.id, cartItem.quantity - 1);
  }

  function changeQuantity(value: string) {
    const quantity = Number.parseInt(value, 10);
    if (!Number.isFinite(quantity)) return;
    if (quantity <= 0) removeItem(product.id);
    else setQuantity(product.id, quantity);
  }

  return (
    <article data-testid="catalog-product" data-fade-up data-fade-up-delay={animationDelay} className="flex h-full min-w-0 flex-col rounded-[22px] bg-[#fcfbf8] p-5">
      <Link href={`/catalog/${product.slug}`} className="relative block aspect-[390/274] overflow-hidden rounded-[15px] bg-[#f2f4ef]">
        {image ? (
          <Image className="object-cover transition duration-500 hover:scale-[1.025]" src={resolveProductImageUrl(image.url)} alt={image.alt || product.title} fill sizes="(max-width: 700px) 90vw, (max-width: 1100px) 45vw, 25vw" />
        ) : (
          <span className="flex h-full items-center justify-center px-5 text-center text-sm text-[#7a7f81]">Изображение скоро появится</span>
        )}
      </Link>
      <h2 className="mt-[25px] mb-[14px] text-[21px] font-medium"><Link href={`/catalog/${product.slug}`}>{product.title}</Link></h2>
      <p className="min-h-[54px] text-sm leading-[1.4] text-[#5b6165] max-[600px]:min-h-0">{truncateText(product.description)}</p>
      <strong className="my-6 text-[23px]">{Number(product.price).toLocaleString("ru-RU")} ₽</strong>
      <div className="mt-auto flex items-center gap-3.5">
        {cartItem ? (
          <div data-testid="product-card-quantity" className="flex h-12 w-[235px] shrink-0 items-center justify-between rounded-full bg-[#009d0a] px-5 text-white max-[1280px]:min-w-[130px] max-[1280px]:flex-1 max-[1280px]:w-auto">
            <button type="button" onClick={decreaseQuantity} className="grid size-8 place-items-center text-xl leading-none" aria-label={`Уменьшить количество ${product.title}`}>−</button>
            <input
              aria-label={`Количество ${product.title}`}
              className="h-10 w-11 rounded-xl bg-white text-center text-base font-medium text-[#15191a] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              type="number"
              min={1}
              max={product.stockQuantity}
              value={cartItem.quantity}
              onChange={(event) => changeQuantity(event.target.value)}
            />
            <button type="button" onClick={() => setQuantity(product.id, cartItem.quantity + 1)} disabled={cartItem.quantity >= product.stockQuantity} className="grid size-8 place-items-center text-xl leading-none disabled:opacity-40" aria-label={`Увеличить количество ${product.title}`}>+</button>
          </div>
        ) : (
          <Button onClick={() => addItem(product)} className="w-[235px] shrink-0 px-3.5 text-[15px] max-[1280px]:min-w-[130px] max-[1280px]:flex-1 max-[1280px]:w-auto" label="В корзину" icon="cart" />
        )}
        <span className="flex items-center gap-[7px] text-xs leading-[1.15] text-[#202425] max-[1400px]:hidden">
          <Image src="/icons/clock.svg" alt="" width={25} height={25} />
          Доставка от<br />2–3 дней
        </span>
      </div>
    </article>
  );
}
