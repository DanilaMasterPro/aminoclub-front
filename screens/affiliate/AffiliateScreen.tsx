import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import AffiliateApplicationForm from "./components/AffiliateApplicationForm";

const benefits = [
  ["Персональный промокод", "Ваши клиенты получают скидку, а каждый заказ автоматически связывается с вашим профилем."],
  ["Прозрачная статистика", "Переходы, заказы и начисления доступны в личном кабинете тренера."],
  ["Регулярные выплаты", "После подтверждения заказов вознаграждение становится доступным для вывода."],
] as const;

export default function AffiliateScreen() {
  return (
    <main id="top" className="mx-auto my-7 w-[min(100%_-_56px,_1920px)] max-[600px]:my-3 max-[600px]:w-[min(100%_-_24px,_1920px)]">
      <div className="relative">
        <Header homeHref="/" catalogHref="/#catalog" />
        <section data-fade-up className="px-4 pt-[190px] pb-16 max-[1200px]:pt-40 max-[600px]:px-2 max-[600px]:pt-28 max-[600px]:pb-10">
          <nav className="flex items-center gap-2 text-xs text-[#747978]" aria-label="Хлебные крошки">
            <Link href="/" className="hover:text-[#15191a]">Главная</Link><span>/</span><span>Партнёрская программа</span>
          </nav>
          <h1 className="mt-12 max-w-[980px] font-[family-name:var(--font-helvetica-neue)] text-[64px] leading-[0.98] font-normal tracking-[-0.035em] max-[1000px]:text-[52px] max-[600px]:mt-8 max-[600px]:text-[38px]">
            Развивайте бизнес вместе с AMINOCLUB
          </h1>
          <p className="mt-7 max-w-[720px] text-base leading-7 text-[#606665] max-[600px]:text-sm">
            Партнёрская программа для тренеров, экспертов и создателей спортивного контента. Рекомендуйте продукты, которыми готовы пользоваться сами, и получайте вознаграждение за подтверждённые заказы.
          </p>
        </section>
      </div>

      <div data-fade-up className="relative aspect-[12/5] overflow-hidden rounded-[18px] max-[700px]:h-[360px] max-[700px]:aspect-auto">
        <Image
          src="/images/affiliate-hero-v1.png"
          alt="Тренеры обсуждают совместную работу в спортивном зале"
          fill
          priority
          sizes="(max-width: 700px) 100vw, 96vw"
          className="object-cover object-center"
        />
      </div>

      <article className="mx-auto max-w-[840px] py-[110px] max-[700px]:py-16">
        <section data-fade-up aria-labelledby="affiliate-about-title">
          <h2 id="affiliate-about-title" className="max-w-[700px] font-[family-name:var(--font-helvetica-neue)] text-[42px] leading-[1.05] font-normal tracking-[-0.025em] max-[600px]:text-[31px]">
            Партнёрство, которое работает на ваш результат
          </h2>
          <div className="mt-8 space-y-6 text-base leading-8 text-[#626766] max-[600px]:text-sm max-[600px]:leading-7">
            <p>Мы хотим выстраивать долгосрочные отношения с людьми, которым доверяет спортивное сообщество. После одобрения заявки вы получите персональную реферальную ссылку и промокод для своей аудитории.</p>
            <p>Все переходы, оформленные заказы и начисления фиксируются автоматически. В личном кабинете можно следить за статистикой и создавать заявки на выплату.</p>
          </div>
        </section>

        <section data-fade-up className="mt-16" aria-labelledby="affiliate-benefits-title">
          <h2 id="affiliate-benefits-title" className="text-2xl font-medium">Что вы получите</h2>
          <div className="mt-7 divide-y divide-[#d9dad5] border-y border-[#d9dad5]">
            {benefits.map(([title, description], index) => (
              <div key={title} className="grid grid-cols-[44px_1fr] gap-4 py-6">
                <span className="grid size-9 place-items-center rounded-full bg-[#009d0a] text-sm font-semibold text-white">{index + 1}</span>
                <div><h3 className="font-medium">{title}</h3><p className="mt-2 text-sm leading-6 text-[#626766]">{description}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section data-fade-up id="application" className="mt-20 scroll-mt-6" aria-labelledby="affiliate-form-title">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-[#009d0a]">Заявка на участие</p>
          <h2 id="affiliate-form-title" className="mt-3 font-[family-name:var(--font-helvetica-neue)] text-[42px] leading-[1.05] font-normal tracking-[-0.025em] max-[600px]:text-[31px]">Расскажите о себе</h2>
          <p className="mt-5 mb-8 text-sm leading-7 text-[#626766]">Заполните форму — администратор рассмотрит заявку и отправит решение на указанный email.</p>
          <AffiliateApplicationForm />
        </section>
      </article>

      <Footer />
    </main>
  );
}
