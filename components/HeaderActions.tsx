"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { MenuItemSetting, SocialLinkSetting } from "@/api/types";
import { resolveMediaUrl } from "@/api/media";
import { useCart } from "@/hooks/useCart";

type HeaderActionsProps = {
  cartHref: string;
  logoUrl: string;
  menuItems: MenuItemSetting[];
  socialLinks: SocialLinkSetting[];
};

const fallbackMenu: MenuItemSetting[] = [
  { id: "home", label: "Главная", href: "/" },
  { id: "catalog", label: "Каталог", href: "/catalog" },
  { id: "blog", label: "Блог", href: "/news" },
  { id: "contacts", label: "Контакты", href: "/contacts" },
];

export default function HeaderActions({ cartHref, logoUrl, menuItems, socialLinks }: HeaderActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const items = menuItems.length >= 4 ? menuItems : fallbackMenu;

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <>
      <nav className="flex gap-3" aria-label="Основная навигация">
        <Link className="relative grid size-14 place-items-center rounded-full bg-white/95 max-[600px]:size-[46px]" href={cartHref} aria-label={`Корзина, товаров: ${itemCount}`}>
          <svg aria-hidden="true" className="size-[25px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 8h12l1 12H5L6 8Z" strokeLinejoin="round" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
          </svg>
          {itemCount > 0 && <span className="absolute -top-1 -right-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#009d0a] px-1 text-[10px] font-bold text-white">{itemCount}</span>}
        </Link>
        <button onClick={() => setIsOpen(true)} className="grid size-14 content-center place-items-center gap-[5px] rounded-full border-0 bg-white/95 max-[600px]:size-[46px]" type="button" aria-label="Открыть меню" aria-expanded={isOpen}>
          <span className="block h-0.5 w-6 bg-[#161a1a]" />
          <span className="block h-0.5 w-6 bg-[#161a1a]" />
          <span className="block h-0.5 w-6 bg-[#161a1a]" />
        </button>
      </nav>

      <div className={`fixed inset-0 z-[100] bg-[#f5f3ed] transition duration-300 ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`} role="dialog" aria-modal="true" aria-label="Меню сайта">
        <div className="flex h-full min-h-[520px] flex-col px-[58px] py-[50px] max-[600px]:px-5 max-[600px]:py-5">
          <div className="flex items-center justify-between">
            <Link href="/" onClick={() => setIsOpen(false)} className="w-[200px] max-[600px]:w-[145px]">
              <Image src={logoUrl} alt="AMINOCLUB" width={192} height={39} />
            </Link>
            <button type="button" onClick={() => setIsOpen(false)} className="grid size-16 place-items-center rounded-full border-0 bg-white text-[46px] font-light leading-none max-[600px]:size-[50px] max-[600px]:text-[36px]" aria-label="Закрыть меню">×</button>
          </div>

          <nav className="my-auto flex flex-col items-center gap-7 py-12 text-center font-[family-name:var(--font-helvetica-neue)] text-[32px] leading-none max-[600px]:text-[28px]" aria-label="Меню сайта">
            {items.map((item) => (
              <Link key={item.id} href={item.href} onClick={() => setIsOpen(false)} className="transition hover:text-[#009d0a]">{item.label}</Link>
            ))}
          </nav>

          <div className="flex justify-center gap-4">
            {socialLinks.map((social) => (
              <a key={social.id} href={social.url} aria-label={social.label} target={social.url.startsWith("http") ? "_blank" : undefined} rel={social.url.startsWith("http") ? "noreferrer" : undefined} className="grid size-12 place-items-center">
                {social.iconUrl ? <Image src={resolveMediaUrl(social.iconUrl)} alt="" width={30} height={30} /> : <span className="font-bold">{social.label.slice(0, 1)}</span>}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
