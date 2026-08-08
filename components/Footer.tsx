import Image from "next/image";
import { resolveMediaUrl } from "@/api/media";
import { getSiteSettings } from "@/api/site-settings";
import type { MenuItemSetting } from "@/api/types";

function groupFooterLinks(items: MenuItemSetting[]) {
  const groups = new Map<string, MenuItemSetting[]>();
  for (const item of items) {
    const title = item.group?.trim() || "Навигация";
    groups.set(title, [...(groups.get(title) ?? []), item]);
  }
  return [...groups].map(([title, links]) => ({ title, links }));
}

export default async function Footer() {
  const settings = await getSiteSettings();
  const footerLinks = groupFooterLinks(settings.menus.footer);
  const logoUrl = resolveMediaUrl(settings.general.logoUrl || "/icons/logo.svg");
  const phoneHref = settings.general.phone.replace(/[^\d+]/g, "");

  return (
    <footer className="overflow-hidden rounded-[28px] bg-[#f8f8f8] bg-[url('/images/footer.png')] bg-cover bg-center max-[680px]:rounded-[20px]">
      <div data-fade-up className="grid grid-cols-[1.95fr_2.45fr_.75fr] gap-12 px-[92px] pt-[82px] pb-[58px] max-[1200px]:px-12 max-[1200px]:pt-14 max-[1050px]:grid-cols-[1fr_1.5fr] max-[680px]:grid-cols-1 max-[680px]:gap-9 max-[680px]:px-6 max-[680px]:py-9">
        <div>
          <Image src={logoUrl} alt="AMINOCLUB" width={400} height={81} />
          <p className="my-6 max-w-[330px] text-base leading-[1.55] text-[#4b5258]">
            AMINOCLUB — ваш надёжный партнёр в мире спортивного питания. Чистые составы, эффективные формулы и честный подход к вашему прогрессу.
          </p>
          <div className="flex max-w-[420px] items-center gap-3.5 rounded-[15px] border border-[#86be4f] p-3.5 text-xs leading-[1.35] text-[#50555b]">
            <Image className="shrink-0" src="/icons/footer/shield-check.webp" alt="" width={67} height={67} />
            <span>
              <b className="mb-[3px] block text-sm text-[#24282b]">Качество и безопасность</b>Вся продукция сертифицирована и соответствует стандартам качества.
            </span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-[30px] max-[680px]:grid-cols-1">
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h2 className="mb-[18px] text-[17px] font-bold">{group.title}</h2>
              {group.links.map((link, linkIndex) => {
                const isLastLink = linkIndex === group.links.length - 1;
                return (
                  <a className={`mb-[13px] block border-b border-black/8 pb-[13px] text-[15px] text-[#5d6267] ${isLastLink ? "border-b-0" : ""}`} href={link.href} key={link.label}>
                    {link.label}
                  </a>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-start max-[1050px]:col-span-full">
          <h2 className="mb-[18px] text-[17px] font-bold">Свяжитесь с нами</h2>
          <a className="mb-[17px] flex items-center gap-[13px] text-[15px] text-[#4c5257]" href={`tel:${phoneHref}`}>
            <Image src="/icons/footer/phone.svg" alt="" width={25} height={25} />{settings.general.phone}
          </a>
          <a className="mb-[17px] flex items-center gap-[13px] text-[15px] text-[#4c5257]" href={`mailto:${settings.general.email}`}>
            <Image src="/icons/footer/mail.svg" alt="" width={25} height={25} />
            {settings.general.email}
          </a>
          <div className="mt-2 flex gap-3">
            {settings.general.socialLinks.map((social) => (
              <a
                key={social.id}
                className="grid size-[52px] place-items-center rounded-full border border-[#e2e4e0] bg-[#fff1dd]"
                href={social.url}
                aria-label={social.label}
                target={social.url.startsWith("http") ? "_blank" : undefined}
                rel={social.url.startsWith("http") ? "noreferrer" : undefined}
              >
                {social.iconUrl ? <Image src={resolveMediaUrl(social.iconUrl)} alt="" width={24} height={24} /> : <span className="text-sm font-bold">{social.label.slice(0, 1)}</span>}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div data-fade-up className="grid grid-cols-[1fr_1.05fr] items-center border-t border-[#5b8d19]/35 px-[92px] py-[27px] text-[13px] text-[#4f555b] max-[1200px]:px-12 max-[1050px]:grid-cols-1 max-[680px]:px-6 max-[680px]:py-6">
        <div className="flex items-center gap-[30px] max-[680px]:flex-wrap">
          <p>© 2026 AMINOCLUB</p>
          <p className="border-l border-[#d4d8d0] pl-[30px] max-[680px]:border-l-0 max-[680px]:pl-0">Не является лекарственным средством</p>
        </div>
        <div className="grid grid-cols-3 gap-[18px] border-l border-[#d4d8d0] pl-[50px] max-[1050px]:mt-6 max-[1050px]:border-l-0 max-[1050px]:pl-0 max-[680px]:grid-cols-1">
          <span className="grid grid-cols-[67px_1fr] gap-x-2.5 text-[11px] leading-[1.25]">
            <Image className="row-span-2 max-w-none" src="/icons/footer/leaf.webp" alt="" width={67} height={67} />
            <b className="mb-[3px] block text-sm text-[#24282b]">Чистые составы</b>Без лишних добавок и сложных примесей
          </span>
          <span className="grid grid-cols-[67px_1fr] gap-x-2.5 text-[11px] leading-[1.25]">
            <Image className="row-span-2 max-w-none" src="/icons/footer/microscope.webp" alt="" width={67} height={67} />
            <b className="mb-[3px] block text-sm text-[#24282b]">Наука и качество</b>Эффективные формулы на основе исследований
          </span>
          <span className="grid grid-cols-[67px_1fr] gap-x-2.5 text-[11px] leading-[1.25]">
            <Image className="row-span-2 max-w-none" src="/icons/footer/shield-check.webp" alt="" width={67} height={67} />
            <b className="mb-[3px] block text-sm text-[#24282b]">Для результата</b>Поддержка на каждом этапе вашего прогресса
          </span>
        </div>
      </div>
    </footer>
  );
}
