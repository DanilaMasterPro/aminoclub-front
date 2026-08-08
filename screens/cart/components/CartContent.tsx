"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";
import CartItems from "./CartItems";
import CartSummary from "./CartSummary";

export default function CartContent() {
  const { items, isReady } = useCart();
  return (
    <section className="min-h-[760px] px-3 pb-[120px] max-[600px]:pb-20">
      <h1 className="font-[family-name:var(--font-helvetica-neue)] text-[64px] font-normal tracking-[-0.045em] max-[600px]:text-[44px]">Корзина</h1>
      <Link href="/catalog" className="mt-5 inline-flex items-center gap-1.5 text-xs text-[#5f6564]">
        <Image src="/icons/chevron-left.svg" alt="" width={16} height={16} />
        Продолжить покупки
      </Link>
      {!isReady ? <div className="mt-20 h-60 animate-pulse rounded-[22px] bg-[#fcfbf8]" /> : items.length ? (
        <div className="mt-20 grid grid-cols-[1fr_520px] gap-[100px] max-[1300px]:grid-cols-[1fr_430px] max-[1050px]:grid-cols-1 max-[600px]:mt-12"><CartItems /><CartSummary /></div>
      ) : (
        <div className="mt-20 rounded-[22px] bg-[#fcfbf8] px-6 py-20 text-center"><h2 className="text-2xl">Корзина пока пуста</h2><Link href="/catalog" className="mt-6 inline-flex rounded-full bg-[#009d0a] px-7 py-4 text-white">Перейти в каталог</Link></div>
      )}
    </section>
  );
}
