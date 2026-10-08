import PublicPageShell from "@/components/PublicPageShell";
import { getSiteSettings } from "@/api/site-settings";
import ContactForm from "./components/ContactForm";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function ContactsScreen() {
  const settings = await getSiteSettings();
  return (
    <PublicPageShell>
      <section className="page-gutter pb-[140px] max-[600px]:pb-20">
        <Breadcrumbs items={[{ label: "Контакты", href: "/contacts" }]} />
        <div className="mt-[180px] grid grid-cols-2 gap-24 max-[900px]:mt-24 max-[900px]:grid-cols-1 max-[900px]:gap-16">
          <div>
            <h1 className="font-[family-name:var(--font-helvetica-neue)] text-[62px] font-normal tracking-[-0.045em] max-[600px]:text-[44px]">Есть <span className="text-[#aeb0ae]">вопрос?</span></h1>
            <p className="mt-5 text-[#8b8f8e]">Напишите его нам и мы ответим</p>
            <ContactForm />
          </div>
          <div className="space-y-12 pt-12 font-[family-name:var(--font-helvetica-neue)] text-[42px] leading-[1.05] tracking-[-0.035em] max-[600px]:text-[30px]">
            <p><span className="block text-[#aeb0ae]">почта:</span><a href={`mailto:${settings.general.email}`} className="break-all">{settings.general.email}</a></p>
          </div>
        </div>
        <div className="mt-32 grid grid-cols-2 items-center border-y border-black/35 py-20 max-[700px]:grid-cols-1 max-[700px]:gap-8">
          <a href={`tel:${settings.general.phone.replace(/[^\d+]/g, "")}`} className="font-[family-name:var(--font-helvetica-neue)] text-[54px] tracking-[-0.04em] max-[600px]:text-[38px]">{settings.general.phone}</a>
          <address className="justify-self-end text-[22px] not-italic leading-8 text-[#a0a4a2] max-[700px]:justify-self-start">ООО «Ингредиенты. Развитие»<br />198184, Санкт-Петербург,<br />Канонерский остров, д. 3, корп. 1, лит. Б</address>
        </div>
      </section>
    </PublicPageShell>
  );
}
