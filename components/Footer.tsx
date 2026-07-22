import Image from "next/image";

const footerLinks = [
  { title: "Каталог", links: ["Креатин", "BCAA", "L-карнитин", "Бета-аланин"] },
  { title: "Покупателям", links: ["Доставка и оплата", "Возврат", "Контакты"] },
  { title: "Документы", links: ["Политика", "Оферта", "Соглашение"] },
];

export default function Footer() {
  return (
    <footer className="overflow-hidden rounded-[28px] bg-[#f8f8f8] bg-[url('/images/footer.png')] bg-cover bg-center max-[680px]:rounded-[20px]">
      <div className="grid grid-cols-[1.95fr_2.45fr_.75fr] gap-12 px-[clamp(26px,4.8vw,92px)] pt-[clamp(36px,5vw,82px)] pb-[58px] max-[1050px]:grid-cols-[1fr_1.5fr] max-[680px]:grid-cols-1 max-[680px]:gap-9 max-[680px]:px-6 max-[680px]:py-9">
        <div>
          <Image src="/icons/logo.svg" alt="AMINOCLUB" width={400} height={81} />
          <p className="my-6 max-w-[330px] text-base leading-[1.55] text-[#4b5258]">AMINOCLUB — ваш надёжный партнёр в мире спортивного питания. Чистые составы, эффективные формулы и честный подход к вашему прогрессу.</p>
          <div className="flex max-w-[420px] items-center gap-3.5 rounded-[15px] border border-[#86be4f] p-3.5 text-xs leading-[1.35] text-[#50555b]">
            <Image src="/icons/footer/shield-check.svg" alt="" width={36} height={36} />
            <span><b className="mb-[3px] block text-sm text-[#24282b]">Качество и безопасность</b>Вся продукция сертифицирована и соответствует стандартам качества.</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-[30px] max-[680px]:grid-cols-1">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h2 className="mb-[18px] text-[17px] font-bold">{group.title}</h2>
              {group.links.map((link) => <a className="mb-[13px] block border-b border-black/8 pb-[13px] text-[15px] text-[#5d6267]" href="#" key={link}>{link}</a>)}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-start max-[1050px]:col-span-full">
          <h2 className="mb-[18px] text-[17px] font-bold">Свяжитесь с нами</h2>
          <a className="mb-[17px] flex items-center gap-[13px] text-[15px] text-[#4c5257]" href="tel:88001234567"><Image src="/icons/footer/phone.svg" alt="" width={25} height={25} />8 (800) 123-45-67</a>
          <a className="mb-[17px] flex items-center gap-[13px] text-[15px] text-[#4c5257]" href="mailto:info@aminoclub.ru"><Image src="/icons/footer/mail.svg" alt="" width={25} height={25} />info@aminoclub.ru</a>
          <div className="mt-2 flex gap-3">
            <a className="grid size-[52px] place-items-center rounded-full border border-[#e2e4e0]" href="#" aria-label="ВКонтакте"><Image src="/icons/footer/vk.svg" alt="" width={24} height={24} /></a>
            <a className="grid size-[52px] place-items-center rounded-full border border-[#e2e4e0]" href="#" aria-label="Telegram"><Image src="/icons/footer/telegram.svg" alt="" width={24} height={24} /></a>
            <a className="grid size-[52px] place-items-center rounded-full border border-[#e2e4e0]" href="#" aria-label="Instagram"><Image src="/icons/footer/instagram.svg" alt="" width={24} height={24} /></a>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_1.05fr] items-center border-t border-[#5b8d19]/35 px-[clamp(26px,4.8vw,92px)] py-[27px] text-[13px] text-[#4f555b] max-[1050px]:grid-cols-1 max-[680px]:px-6 max-[680px]:py-6">
        <div className="flex items-center gap-[30px] max-[680px]:flex-wrap">
          <p>© 2026 AMINOCLUB</p>
          <p className="border-l border-[#d4d8d0] pl-[30px] max-[680px]:border-l-0 max-[680px]:pl-0">Не является лекарственным средством</p>
        </div>
        <div className="grid grid-cols-3 gap-[18px] border-l border-[#d4d8d0] pl-[50px] max-[1050px]:mt-6 max-[1050px]:border-l-0 max-[1050px]:pl-0 max-[680px]:grid-cols-1">
          <span className="grid grid-cols-[32px_1fr] gap-x-2.5 text-[11px] leading-[1.25]"><Image className="row-span-2" src="/icons/footer/leaf.svg" alt="" width={28} height={28} /><b className="mb-[3px] block text-sm text-[#24282b]">Чистые составы</b>Без лишних добавок и сложных примесей</span>
          <span className="grid grid-cols-[32px_1fr] gap-x-2.5 text-[11px] leading-[1.25]"><Image className="row-span-2" src="/icons/footer/microscope.svg" alt="" width={28} height={28} /><b className="mb-[3px] block text-sm text-[#24282b]">Наука и качество</b>Эффективные формулы на основе исследований</span>
          <span className="grid grid-cols-[32px_1fr] gap-x-2.5 text-[11px] leading-[1.25]"><Image className="row-span-2" src="/icons/footer/shield-check.svg" alt="" width={28} height={28} /><b className="mb-[3px] block text-sm text-[#24282b]">Для результата</b>Поддержка на каждом этапе вашего прогресса</span>
        </div>
      </div>
    </footer>
  );
}
