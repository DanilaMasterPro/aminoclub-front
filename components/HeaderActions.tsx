"use client";

import type { MenuItemSetting } from "@/api/types";
import { useEffect, useState } from "react";

type HeaderActionsProps = {
  catalogHref: string;
  menuItems: MenuItemSetting[];
};

export default function HeaderActions({ catalogHref, menuItems }: HeaderActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <>
      <nav className="flex gap-3" aria-label="Основная навигация">
        <a className="grid size-14 place-items-center rounded-full bg-white/95 max-[600px]:size-[46px]" href={catalogHref} aria-label="Корзина">
          <svg aria-hidden="true" className="size-[25px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M6 8h12l1 12H5L6 8Z" strokeLinejoin="round" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
          </svg>
        </a>
        <button onClick={() => setIsOpen(true)} className="grid size-14 content-center place-items-center gap-[5px] rounded-full border-0 bg-white/95 max-[600px]:size-[46px]" type="button" aria-label="Открыть меню" aria-expanded={isOpen}>
          <span className="block h-0.5 w-6 bg-[#161a1a]" />
          <span className="block h-0.5 w-6 bg-[#161a1a]" />
          <span className="block h-0.5 w-6 bg-[#161a1a]" />
        </button>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/35" role="dialog" aria-modal="true" aria-label="Меню сайта" onMouseDown={() => setIsOpen(false)}>
          <div className="flex h-full w-full max-w-md flex-col bg-[#f8f8f8] p-7 shadow-2xl" onMouseDown={(event) => event.stopPropagation()}>
            <div className="mb-10 flex items-center justify-between">
              <strong className="text-xl">Меню</strong>
              <button type="button" onClick={() => setIsOpen(false)} className="grid size-11 place-items-center rounded-full border border-slate-200 bg-white text-2xl" aria-label="Закрыть меню">×</button>
            </div>
            <div className="flex flex-col">
              {menuItems.map((item) => (
                <a key={item.id} href={item.href} onClick={() => setIsOpen(false)} className="border-b border-black/10 py-4 text-lg font-medium text-[#202425] transition hover:text-[#009d0a]">
                  {item.label}
                </a>
              ))}
              {menuItems.length === 0 && <p className="text-sm text-slate-500">Пункты меню пока не добавлены.</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
