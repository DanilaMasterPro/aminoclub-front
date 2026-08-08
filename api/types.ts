export type UserRole = "ADMIN" | "TRAINER";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  status: "ACTIVE" | "BLOCKED";
}

export interface Paginated<T = Record<string, unknown>> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CatalogCategory {
  id: string;
  title: string;
  slug: string;
  sortOrder: number;
}

export interface CatalogProductImage {
  id: string;
  url: string;
  alt: string | null;
  sortOrder: number;
}

export interface CatalogProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  flavor: string | null;
  price: string;
  stockQuantity: number;
  category: CatalogCategory;
  images: CatalogProductImage[];
}

export interface SocialLinkSetting {
  id: string;
  label: string;
  url: string;
  iconUrl: string;
}

export interface MenuItemSetting {
  id: string;
  label: string;
  href: string;
  pageId?: string;
  group?: string;
}

export interface SiteSettings {
  general: {
    phone: string;
    email: string;
    logoUrl: string;
    socialLinks: SocialLinkSetting[];
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    imageUrl: string;
  };
  menus: {
    header: MenuItemSetting[];
    footer: MenuItemSetting[];
  };
}

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  heading: string;
  content: string;
  imageUrls: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

export interface TrainerDashboard {
  trainer: {
    id: string;
    name: string;
    surname: string;
    status: string;
    referralCode: string;
    commissionRate: string;
  };
  referralClicks: number;
  orders: { _count: number; _sum: { finalAmount: string | null } };
  commissions: Array<{ status: string; _sum: { amount: string | null } }>;
  promoCodes: Array<{ id: string; code: string; value: string }>;
}
