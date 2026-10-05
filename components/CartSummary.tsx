"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import type { PromoCodeState } from "@/hooks/usePromoCode";
import { formatPrice } from "@/utils/formatPrice";

type CartSummaryProps = {
  promo: PromoCodeState;
  variant?: "cart" | "checkout";
  delivery?: { amount: number | null; isLoading: boolean };
};

export default function CartSummary({ promo, variant = "cart", delivery }: CartSummaryProps) {
  const { items, subtotal } = useCart();
  const goodsTotal = promo.promo ? Number(promo.promo.finalAmount) : subtotal;
  const total = goodsTotal + (delivery?.amount ?? 0);
  const isCheckout = variant === "checkout";

  return (
    <aside className={`sticky top-6 self-start rounded-[22px] bg-[#fcfbf8] p-8 ${isCheckout ? "w-full max-w-[500px] justify-self-end max-[950px]:max-w-none" : ""} max-[1050px]:static`}>
      <h2 className="mb-8 text-[22px] font-medium">Заказ</h2>
      <div className="space-y-4 text-sm">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="flex justify-between gap-6">
            <span>{product.title}{quantity > 1 ? ` × ${quantity}` : ""}</span>
            <strong className="whitespace-nowrap">{formatPrice(Number(product.price) * quantity)}</strong>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t border-black/30 pt-6">
        <label className="text-xs font-semibold uppercase" htmlFor={`promo-${variant}`}>Промокод</label>
        <div className="mt-3 flex gap-2">
          <input id={`promo-${variant}`} value={promo.code} onChange={(event) => promo.setCode(event.target.value.toUpperCase())} disabled={Boolean(promo.promo)} placeholder="AMINO10" className="min-w-0 flex-1 rounded-xl bg-white px-4 py-3 text-sm outline-none" />
          <button type="button" onClick={promo.promo ? promo.clearPromo : promo.apply} disabled={promo.isApplying} className="rounded-xl bg-[#15191a] px-4 text-xs text-white disabled:opacity-60">{promo.promo ? "Убрать" : "Применить"}</button>
        </div>
        {promo.error && <p className="mt-2 text-xs text-red-600">{promo.error}</p>}
        {promo.promo && <p className="mt-2 text-xs text-[#009d0a]">Скидка {formatPrice(promo.promo.discountAmount)}</p>}
      </div>
      {delivery && (
        <div className="mt-8 flex justify-between border-t border-black/30 pt-6 text-sm">
          <span>Доставка</span>
          <strong>{delivery.amount !== null ? formatPrice(delivery.amount) : delivery.isLoading ? "…" : "—"}</strong>
        </div>
      )}
      <div className={`${delivery ? "mt-4" : "mt-8 border-t border-black/30 pt-6"} flex justify-between text-sm`}><span>Итого</span><strong>{formatPrice(total)}</strong></div>
      {!isCheckout && (
        <Link href="/checkout" className="mt-10 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#009d0a] px-6 text-sm font-semibold text-white">
          Оформить
          <Image className="brightness-0 invert" src="/icons/chevron-right.svg" alt="" width={17} height={17} />
        </Link>
      )}
    </aside>
  );
}
