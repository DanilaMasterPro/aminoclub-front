"use client";

import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";

export default function CheckoutSummary({ discount = 0 }: { discount?: number }) {
  const { items, subtotal } = useCart();
  return (
    <aside className="sticky top-6 rounded-[22px] bg-[#fcfbf8] p-8 max-[950px]:static">
      <h2 className="mb-8 text-[22px] font-medium">Заказ</h2>
      <div className="space-y-5 text-sm">{items.map(({ product, quantity }) => <div key={product.id} className="flex justify-between gap-8"><span>{product.title}{quantity > 1 ? ` × ${quantity}` : ""}</span><strong>{formatPrice(Number(product.price) * quantity)}</strong></div>)}</div>
      {discount > 0 && <div className="mt-7 flex justify-between text-sm text-[#009d0a]"><span>Скидка</span><strong>− {formatPrice(discount)}</strong></div>}
      <div className="mt-10 flex justify-between border-t border-black/35 pt-6 text-sm"><span>Итого</span><strong>{formatPrice(Math.max(0, subtotal - discount))}</strong></div>
    </aside>
  );
}
