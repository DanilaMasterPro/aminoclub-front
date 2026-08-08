import Link from "next/link";
import PublicPageShell from "@/components/PublicPageShell";

export default function ThankYouScreen({ orderNumber }: { orderNumber?: string }) {
  return (
    <PublicPageShell>
      <section className="flex min-h-[720px] items-center justify-center px-5 pb-24 text-center">
        <div>
          <h1 className="font-[family-name:var(--font-helvetica-neue)] text-[72px] font-normal tracking-[-0.045em] max-[700px]:text-[46px]">Спасибо за заказ</h1>
          {orderNumber && <p className="mt-4 text-sm text-[#747978]">Номер заказа: {orderNumber}</p>}
          <p className="mx-auto mt-4 max-w-[620px] text-[21px] leading-8 text-[#747978]">Мы отправили подробную информацию о заказе на указанный вами адрес электронной почты.</p>
          <Link href="/catalog" className="mt-10 inline-flex min-h-12 min-w-[260px] items-center justify-center rounded-xl bg-[#009d0a] px-7 font-semibold text-white">Продолжить покупки</Link>
        </div>
      </section>
    </PublicPageShell>
  );
}
