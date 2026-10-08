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
  characteristics?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string[];
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

export type SeoSystemPage = "catalog" | "contacts" | "news" | "affiliate";
export type PageSeo = { title: string; description: string; keywords: string[] };

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
    /** Meta tags of code-built pages, edited in admin → «SEO шаблон». */
    pages: Record<SeoSystemPage, PageSeo>;
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

export type DeliveryMethod = "PICKUP_POINT" | "COURIER";

export interface DeliveryAddress {
  street: string;
  house: string;
  apartment?: string;
  porch?: string;
  floor?: string;
  intercom?: string;
  postalCode?: string;
}

export interface DeliveryPayload {
  method: DeliveryMethod;
  city: string;
  geoId?: number;
  pickupPointId?: string;
  address?: DeliveryAddress;
}

export interface DeliveryLocation {
  geoId: number;
  address: string;
}

export interface PickupPoint {
  id: string;
  name: string;
  operator: string;
  type: string;
  address: string;
  instruction: string | null;
  schedule: string;
  latitude: number | null;
  longitude: number | null;
}

export interface DeliveryQuote {
  method: DeliveryMethod;
  amount: string;
  deliveryDays: number | null;
  address: string;
  pickupPointName: string | null;
  isEstimate: boolean;
}

export interface CheckoutPayload {
  name: string;
  phone: string;
  email: string;
  delivery: DeliveryPayload;
  comment?: string;
  promoCode?: string;
  referralCode?: string;
  items: Array<{ productId: string; quantity: number }>;
}

export interface CheckoutResult {
  order: { id: string; number: string; finalAmount: string };
  payment: { id: string; confirmationUrl: string | null };
}

export type PaymentStatus = "PENDING" | "WAITING_FOR_CAPTURE" | "SUCCEEDED" | "CANCELED";

export interface PublicOrderStatus {
  id: string;
  number: string;
  status: string;
  finalAmount: string;
  deliveryAmount: string;
  paymentStatus: PaymentStatus | null;
  delivery: {
    method: DeliveryMethod;
    address: string;
    pickupPointName: string | null;
    deliveryDays: number | null;
    trackingUrl: string | null;
  } | null;
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
