"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import Button from "@/components/Button";
import ProductCardMedia from "@/components/ProductCardMedia";
import type { CatalogProduct } from "@/api/types";
import { useCart } from "@/hooks/useCart";
import { stripHtml } from "@/utils/stripHtml";
import { truncateText } from "@/utils/truncateText";

type ProductCardProps = { product: CatalogProduct; animationDelay?: number };

export default function ProductCard({ product, animationDelay = 0 }: ProductCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { items, addItem, removeItem, setQuantity } = useCart();
  const cartItem = items.find((item) => item.product.id === product.id);

  function playVideo() {
    const video = videoRef.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    void video.play().catch(() => undefined);
  }

  function stopVideo() {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0.001;
  }

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
    // @container: the action row adapts to the card width (catalog with filters, sliders), not to the viewport.
    <article data-testid="catalog-product" data-fade-up data-fade-up-delay={animationDelay} onMouseEnter={playVideo} onMouseLeave={stopVideo} className="@container flex h-full min-w-0 flex-col rounded-[22px] bg-[#fcfbf8] p-5">
      <Link href={`/catalog/${product.slug}`} className="relative block aspect-square overflow-hidden rounded-[15px] bg-white">
        <ProductCardMedia product={product} videoRef={videoRef} />
      </Link>
      <h2 className="mt-[25px] mb-[14px] text-[21px] font-medium"><Link href={`/catalog/${product.slug}`}>{product.title}{product.flavor ? ` ${product.flavor}` : ""}</Link></h2>
      <p className="min-h-[54px] text-sm leading-[1.4] text-[#5b6165] max-[600px]:min-h-0">{truncateText(stripHtml(product.description))}</p>
      <strong className="my-6 text-[23px]">{Number(product.price).toLocaleString("ru-RU")} ₽</strong>
      <div className="mt-auto flex items-center gap-3.5">
        {cartItem ? (
          <div data-testid="product-card-quantity" className="flex h-12 min-w-[130px] flex-1 items-center justify-between rounded-full bg-[#009d0a] px-5 text-white @min-[420px]:max-w-[235px]">
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
          <Button onClick={() => addItem(product)} className="min-w-[130px] flex-1 px-3.5 text-[15px] @min-[420px]:max-w-[235px]" label="В корзину" icon="cart" />
        )}
        <span className="flex shrink-0 items-center gap-[7px] text-xs leading-[1.15] whitespace-nowrap text-[#202425] @max-[379px]:hidden">
          <Image src="/icons/clock.svg" alt="" width={25} height={25} />
          Доставка от<br />2–3 дней
        </span>
      </div>
    </article>
  );
}
