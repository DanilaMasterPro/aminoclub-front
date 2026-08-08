"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { usePromoCode } from "@/hooks/usePromoCode";
import CheckoutForm from "./CheckoutForm";
import CheckoutSummary from "./CheckoutSummary";

export default function CheckoutContent() {
  const { items, subtotal, isReady } = useCart();
  const promo = usePromoCode(subtotal);
  return (
    <section className="min-h-[920px] px-3 pb-[120px]">
      <h1 className="font-[family-name:var(--font-helvetica-neue)] text-[64px] font-normal tracking-[-0.045em] max-[600px]:text-[42px]">Оформление заказа</h1>
      {isReady && !items.length ? <div className="mt-20 rounded-[22px] bg-[#fcfbf8] p-16 text-center"><p className="text-xl">Добавьте товары перед оформлением.</p><Link href="/catalog" className="mt-6 inline-flex rounded-full bg-[#009d0a] px-7 py-4 text-white">В каталог</Link></div> : (
        <div className="mt-14 grid grid-cols-[620px_1fr] gap-[160px] max-[1250px]:gap-16 max-[950px]:grid-cols-1"><CheckoutForm promo={promo.promo} /><CheckoutSummary discount={promo.promo ? Number(promo.promo.discountAmount) : 0} /></div>
      )}
    </section>
  );
}
