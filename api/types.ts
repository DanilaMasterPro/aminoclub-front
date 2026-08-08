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
  sku?: string;
  description: string;
  flavor: string | null;
  price: string;
  stockQuantity: number;
  category: CatalogCategory;
  images: CatalogProductImage[];
  certificates?: Array<{ id: string; title: string; fileUrl: string; sortOrder: number }>;
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

export interface CmsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string[];
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppliedPromo {
  code: string;
  type: "PERCENT" | "FIXED";
  value: string;
  discountAmount: string;
  finalAmount: string;
  trainerId: string | null;
}

export interface CheckoutPayload {
  name: string;
  phone: string;
  email: string;
  city?: string;
  address?: string;
  comment?: string;
  promoCode?: string;
  referralCode?: string;
  items: Array<{ productId: string; quantity: number }>;
}

export interface CheckoutResult {
  order: { id: string; number: string; finalAmount: string };
  payment: { id: string; confirmationUrl: string | null };
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
