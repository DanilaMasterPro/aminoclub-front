import { cache } from "react";
import type { CmsPage, SiteSettings } from "./types";

export const defaultSiteSettings: SiteSettings = {
  general: {
    phone: "8 (800) 123-45-67",
    email: "info@aminoclub.ru",
    logoUrl: "/icons/logo.svg",
    socialLinks: [
      { id: "vk", label: "ВКонтакте", url: "#", iconUrl: "/icons/footer/vk.svg" },
      { id: "telegram", label: "Telegram", url: "#", iconUrl: "/icons/footer/telegram.svg" },
      { id: "instagram", label: "Instagram", url: "#", iconUrl: "/icons/footer/instagram.svg" },
    ],
  },
  seo: {
    title: "AMINOCLUB — спортивное питание",
    description: "Спортивное питание для ежедневного режима.",
    keywords: ["AMINOCLUB", "спортивное питание"],
    imageUrl: "/images/hero-v3.png",
  },
  menus: {
    header: [
      { id: "catalog", label: "Каталог", href: "/#catalog" },
      { id: "affiliate", label: "Партнёрская программа", href: "/affiliate" },
    ],
    footer: [
      { id: "creatine", label: "Креатин", href: "/#catalog", group: "Каталог" },
      { id: "bcaa", label: "BCAA", href: "/#catalog", group: "Каталог" },
      { id: "l-carnitine", label: "L-карнитин", href: "/#catalog", group: "Каталог" },
      { id: "beta-alanine", label: "Бета-аланин", href: "/#catalog", group: "Каталог" },
      { id: "delivery", label: "Доставка и оплата", href: "#", group: "Покупателям" },
      { id: "contacts", label: "Контакты", href: "#", group: "Покупателям" },
      { id: "privacy", label: "Политика", href: "#", group: "Документы" },
      { id: "offer", label: "Оферта", href: "#", group: "Документы" },
      { id: "terms", label: "Соглашение", href: "#", group: "Документы" },
      { id: "partner-program", label: "Партнёрская программа", href: "/affiliate", group: "Документы" },
    ],
  },
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  if (!apiUrl) return defaultSiteSettings;

  try {
    const response = await fetch(`${apiUrl}/settings`, { cache: "no-store" });
    if (!response.ok) return defaultSiteSettings;
    return await response.json() as SiteSettings;
  } catch {
    return defaultSiteSettings;
  }
});

export const getCmsPage = cache(async (slug: string): Promise<CmsPage | null> => {
  if (!apiUrl) return null;

  try {
    const response = await fetch(`${apiUrl}/pages/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!response.ok) return null;
    return await response.json() as CmsPage;
  } catch {
    return null;
  }
});
